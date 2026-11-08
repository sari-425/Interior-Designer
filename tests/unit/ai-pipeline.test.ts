import { describe, expect, it } from "vitest";
import { buildDesignBrief, sanitizeUserText } from "@/modules/ai/brief";
import { DEFAULT_AI_LIMITS, type AiLimits } from "@/modules/ai/config";
import { AiBudgetExceededError, AiProviderError, AiRateLimitError, AiTimeoutError } from "@/modules/ai/errors";
import { createLivingRoomDesign, estimateCostUsdCents } from "@/modules/ai/pipeline";
import type { SourcePhoto } from "@/modules/ai/types";
import { InMemoryUsageStore, UsageLimiter } from "@/modules/ai/usage-limiter";
import type { LivingRoomRequest } from "@/modules/design-request/schema";
import { fakeAnalysis, fakeGeneration, fakePlanning } from "./ai-fakes";

const request: LivingRoomRequest = {
  roomType: "wohnzimmer",
  roomSizeSqm: 24.5,
  roomFeatures: ["Dachschräge"],
  style: "japandi",
  colorWorld: "warm-erdig",
  atmosphere: "ruhig",
  budgetEur: 2500,
  keep: ["Sofa"],
  replace: ["Teppich"],
  keepSurfaces: ["Bodenbelag"],
  changeSurfaces: [],
  requirements: ["Haustiere im Haushalt"],
  notes: "Mehr Stauraum",
  variants: 2,
};

const photo: SourcePhoto = { kind: "inline", bytes: new Uint8Array([1]), mimeType: "image/png", width: 800, height: 600 };

function deps(limits: Partial<AiLimits> = {}, overrides: Partial<Parameters<typeof createLivingRoomDesign>[1]> = {}) {
  const full = { ...DEFAULT_AI_LIMITS, ...limits };
  return {
    analysis: fakeAnalysis(),
    planning: fakePlanning(),
    generation: fakeGeneration(),
    limiter: new UsageLimiter(full, new InMemoryUsageStore(), () => Date.UTC(2026, 10, 8, 12)),
    limits: full,
    ...overrides,
  };
}

describe("Gestaltungsvorgabe (Brief)", () => {
  it("enthält alle Angaben und feste Regeln", () => {
    const brief = buildDesignBrief(request);
    for (const text of ["Japandi", "Warm und erdig", "Ruhig und entspannt", "24,5 m²", "2.500 €", "Sofa", "Teppich", "Bodenbelag", "Dachschräge", "Haustiere", "Fenster, Türen"]) {
      expect(brief).toContain(text);
    }
    expect(brief).toContain("„Mehr Stauraum“");
  });

  it("entschärft Freitext", () => {
    expect(sanitizeUserText("a\u0000b\n\n  c")).toBe("ab c");
    expect(sanitizeUserText("x".repeat(600))).toHaveLength(500);
  });
});

describe("Gestaltungs-Ablauf", () => {
  it("führt Analyse, Planung und Bildgenerierung aus und kennzeichnet KI-Bilder", async () => {
    const result = await createLivingRoomDesign({ request, photo, clientKey: "a" }, deps());
    expect(result.variants).toHaveLength(2);
    expect(result.variants.every((v) => v.image.aiGenerated)).toBe(true);
    expect(result.costUsdCents).toBe(1 + 2 + 4 * 2);
    expect(result.providers).toEqual({ analysis: "test-analysis", planning: "test-planning", generation: "test-generation" });
  });

  it("schätzt Kosten vor dem Aufruf", () => {
    expect(estimateCostUsdCents(deps(), 3)).toBe(1 + 2 + 4 * 3);
  });

  it("meldet unbekannte Kosten als null", async () => {
    const d = deps({}, { analysis: fakeAnalysis({ analyze: async () => ({ detectedItems: [], lighting: "unbekannt", description: "", warnings: [], costUsdCents: null }) }) });
    expect((await createLivingRoomDesign({ request, photo, clientKey: "a" }, d)).costUsdCents).toBeNull();
  });

  it("begrenzt Anfragen pro Person und Stunde", async () => {
    const d = deps({ maxRequestsPerHourPerClient: 1 });
    await createLivingRoomDesign({ request, photo, clientKey: "a" }, d);
    await expect(createLivingRoomDesign({ request, photo, clientKey: "a" }, d)).rejects.toBeInstanceOf(AiRateLimitError);
    // andere Person ist nicht betroffen
    await expect(createLivingRoomDesign({ request, photo, clientKey: "b" }, d)).resolves.toBeTruthy();
  });

  it("stoppt bei zu teuren Anfragen, bevor ein Anbieter aufgerufen wird", async () => {
    let called = false;
    const d = deps({ maxCostUsdCentsPerRequest: 5 }, { analysis: fakeAnalysis({ analyze: async () => { called = true; throw new Error("darf nicht passieren"); } }) });
    await expect(createLivingRoomDesign({ request, photo, clientKey: "a" }, d)).rejects.toBeInstanceOf(AiBudgetExceededError);
    expect(called).toBe(false);
  });

  it("hält das Tagesbudget und das Tageslimit ein", async () => {
    const budget = deps({ maxCostUsdCentsPerDay: 15 });
    await createLivingRoomDesign({ request, photo, clientKey: "a" }, budget); // 11 ct
    await expect(createLivingRoomDesign({ request, photo, clientKey: "b" }, budget)).rejects.toBeInstanceOf(AiBudgetExceededError);

    const count = deps({ maxDesignsPerDay: 1 });
    await createLivingRoomDesign({ request, photo, clientKey: "a" }, count);
    await expect(createLivingRoomDesign({ request, photo, clientKey: "b" }, count)).rejects.toThrow(/Tageslimit/);
  });

  it("bricht nach dem Zeitlimit ab", async () => {
    const slow = fakeAnalysis({ analyze: ({ signal }) => new Promise((_, reject) => signal.addEventListener("abort", () => reject(new Error("abgebrochen")))) });
    await expect(createLivingRoomDesign({ request, photo, clientKey: "a" }, deps({ timeoutMs: 20 }, { analysis: slow }))).rejects.toBeInstanceOf(AiTimeoutError);
  });

  it("wandelt Anbieterfehler in verständliche Fehler um", async () => {
    const broken = fakeGeneration({ generate: async () => { throw new Error("HTTP 500 vom Anbieter"); } });
    const error = await createLivingRoomDesign({ request, photo, clientKey: "a" }, deps({}, { generation: broken })).catch((e) => e);
    expect(error).toBeInstanceOf(AiProviderError);
    expect(error.userMessage).not.toContain("HTTP 500");
    expect(error.message).toContain("HTTP 500");
  });

  it("verlangt mindestens eine geplante Variante", async () => {
    const empty = fakePlanning({ plan: async () => ({ variants: [], costUsdCents: 0 }) });
    await expect(createLivingRoomDesign({ request, photo, clientKey: "a" }, deps({}, { planning: empty }))).rejects.toBeInstanceOf(AiProviderError);
  });
});
