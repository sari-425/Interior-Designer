import { describe, expect, it } from "vitest";
import { DEFAULT_AI_LIMITS } from "@/modules/ai/config";
import { handleDesignRequest } from "@/modules/ai/handle-design-request";
import type { ProviderRegistry } from "@/modules/ai/registry";
import { InMemoryUsageStore, UsageLimiter } from "@/modules/ai/usage-limiter";
import { createPng } from "../e2e/helpers";
import { fakeAnalysis, fakeGeneration, fakePlanning } from "./ai-fakes";

const registry: ProviderRegistry = {
  analysis: { test: () => fakeAnalysis() },
  planning: { test: () => fakePlanning() },
  generation: { test: () => fakeGeneration() },
};

const request = {
  roomType: "wohnzimmer",
  roomSizeSqm: null,
  roomFeatures: [],
  style: "modern",
  colorWorld: "kuehl-hell",
  atmosphere: "ruhig",
  budgetEur: 800,
  keep: [],
  replace: [],
  keepSurfaces: [],
  changeSurfaces: [],
  requirements: [],
  notes: "",
  variants: 1,
};

const png = (w = 800, h = 600) => {
  const bytes = new Uint8Array(createPng(w, h));
  return { type: "image/png", size: bytes.length, bytes };
};

/** Lokaler Testbetrieb: Anbieter-Doubles und ausdrücklich freigegebener In-Memory-Zähler */
const ENV = { AI_PROVIDER: "test", NODE_ENV: "test", AI_USAGE_STORE: "memory", AI_ALLOW_IN_MEMORY_LIMITS: "true" };

function context(overrides: Partial<Parameters<typeof handleDesignRequest>[1]> = {}) {
  const limiter = new UsageLimiter(DEFAULT_AI_LIMITS, new InMemoryUsageStore());
  return {
    clientKey: "1.2.3.4",
    env: ENV,
    getLimiter: () => limiter,
    limits: DEFAULT_AI_LIMITS,
    registry,
    ...overrides,
  };
}

describe("POST /api/designs (Verarbeitung)", () => {
  it("antwortet ohne eingerichtete KI mit 503 und liest nichts", async () => {
    const r = await handleDesignRequest({ requestJson: "{kaputt", photo: null }, context({ env: {}, registry: undefined }));
    expect(r.status).toBe(503);
    expect(r.body).toMatchObject({ ok: false, error: "ai_not_configured" });
  });

  it("antwortet ohne verlässlichen Nutzungszähler mit 503, auch wenn Anbieter eingerichtet sind", async () => {
    let created = false;
    const ctx = context({ env: { AI_PROVIDER: "test", NODE_ENV: "production", AI_USAGE_STORE: "memory", AI_ALLOW_IN_MEMORY_LIMITS: "true" } });
    const r = await handleDesignRequest(
      { requestJson: request, photo: png() },
      { ...ctx, getLimiter: () => { created = true; return ctx.getLimiter(); } },
    );
    expect(r.status).toBe(503);
    expect(created).toBe(false);
  });

  it("liefert mit eingerichteten Anbietern ein gekennzeichnetes Ergebnis", async () => {
    const r = await handleDesignRequest({ requestJson: JSON.stringify(request), photo: png() }, context());
    expect(r.status).toBe(200);
    if (r.body.ok) expect(r.body.result.variants[0].image.aiGenerated).toBe(true);
  });

  it("prüft die Angaben auf dem Server", async () => {
    expect((await handleDesignRequest({ requestJson: "{kaputt", photo: png() }, context())).status).toBe(400);
    const bad = await handleDesignRequest({ requestJson: { ...request, budgetEur: 5 }, photo: png() }, context());
    expect(bad.status).toBe(400);
    if (!bad.body.ok) expect(bad.body.message).toContain("Budget");
  });

  it("prüft das Foto auf dem Server (Inhalt, Typ, Maße)", async () => {
    const cases = [
      { photo: null, text: "Foto" },
      { photo: { type: "image/png", size: 9, bytes: new TextEncoder().encode("kein Bild") }, text: "kein gültiges Bild" },
      { photo: { ...png(), type: "image/jpeg" }, text: "passen nicht zusammen" },
      { photo: png(300, 200), text: "zu klein" },
      { photo: { type: "image/gif", size: 6, bytes: new TextEncoder().encode("GIF89a") }, text: "JPG, PNG oder WebP" },
    ];
    for (const c of cases) {
      const r = await handleDesignRequest({ requestJson: request, photo: c.photo }, context());
      expect(r.status).toBe(400);
      if (!r.body.ok) expect(r.body.message).toContain(c.text);
    }
    const huge = await handleDesignRequest({ requestJson: request, photo: { ...png(), size: 11 * 1024 * 1024 } }, context());
    expect(huge.status).toBe(413);
  });

  it("begrenzt Anfragen mit 429 und Retry-After", async () => {
    const limits = { ...DEFAULT_AI_LIMITS, maxRequestsPerHourPerClient: 1 };
    const limiter = new UsageLimiter(limits, new InMemoryUsageStore());
    const ctx = context({ limits, getLimiter: () => limiter });
    await handleDesignRequest({ requestJson: request, photo: png() }, ctx);
    const r = await handleDesignRequest({ requestJson: request, photo: png() }, ctx);
    expect(r.status).toBe(429);
    expect("headers" in r && r.headers?.["Retry-After"]).toBe("3600");
  });

  it("gibt keine technischen Anbieterdetails an den Browser", async () => {
    const broken: ProviderRegistry = { ...registry, generation: { test: () => fakeGeneration({ generate: async () => { throw new Error("geheimer Stacktrace"); } }) } };
    const original = console.error;
    console.error = () => {};
    const r = await handleDesignRequest({ requestJson: request, photo: png() }, context({ registry: broken }));
    console.error = original;
    expect(r.status).toBe(502);
    expect(JSON.stringify(r.body)).not.toContain("geheim");
  });

  it("verwirft Planungen über Budget mit 502, ohne Details preiszugeben", async () => {
    const tooExpensive: ProviderRegistry = {
      ...registry,
      planning: {
        test: () =>
          fakePlanning({
            plan: async () => ({
              variants: [{ title: "Teuer", description: "x", imagePrompt: "p", shoppingList: [{ category: "Sofa", budgetEur: 5000 }] }],
              costUsdCents: 2,
            }),
          }),
      },
    };
    const original = console.error;
    console.error = () => {};
    const r = await handleDesignRequest({ requestJson: request, photo: png() }, context({ registry: tooExpensive }));
    console.error = original;
    expect(r.status).toBe(502);
    expect(r.body).toMatchObject({ ok: false, error: "invalid_output" });
    expect(JSON.stringify(r.body)).not.toContain("5000");
  });
});
