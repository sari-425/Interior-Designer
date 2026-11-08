import { describe, expect, it } from "vitest";
import { parseBudget, toDesignRequest, validateStep } from "@/components/design-flow/draft";
import { INITIAL_DRAFT, type WizardDraft } from "@/components/design-flow/types";
import { designRequestSchema } from "@/modules/design-request/schema";
import { DESIGN_STYLES } from "@/modules/styles/styles";
import { DESIGN_PACKAGES, formatEuro } from "@/modules/pricing/packages";

const complete: WizardDraft = {
  ...INITIAL_DRAFT,
  photo: { url: "blob:test", name: "raum.jpg", size: 1000, width: 1600, height: 1200 },
  roomType: "wohnzimmer",
  style: "japandi",
  colorWorld: "warm-erdig",
  budgetInput: "1.500 €",
  furniture: ["Sofa", "Teppich"],
  elements: { Bodenbelag: "keep", Wandfarbe: "change" },
  notes: "  Mehr Stauraum  ",
  variants: 3,
};

describe("parseBudget", () => {
  it("liest deutsche Schreibweisen", () => {
    expect(parseBudget("1500")).toBe(1500);
    expect(parseBudget("1.500 €")).toBe(1500);
    expect(parseBudget(" 20 000 ")).toBe(20000);
    expect(parseBudget("")).toBeNull();
    expect(parseBudget("abc")).toBeNull();
  });
});

describe("toDesignRequest", () => {
  it("erzeugt aus einem vollständigen Entwurf eine gültige Anfrage", () => {
    const r = toDesignRequest(complete);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data).toMatchObject({
        roomType: "wohnzimmer",
        style: "japandi",
        budget: 1500,
        keep: ["Bodenbelag"],
        change: ["Wandfarbe"],
        notes: "Mehr Stauraum",
        variants: 3,
      });
    }
  });

  it("lehnt Budgets außerhalb des Rahmens ab", () => {
    expect(toDesignRequest({ ...complete, budgetInput: "50" }).success).toBe(false);
    expect(toDesignRequest({ ...complete, budgetInput: "60000" }).success).toBe(false);
  });

  it("lehnt zu lange Wünsche ab", () => {
    expect(toDesignRequest({ ...complete, notes: "x".repeat(501) }).success).toBe(false);
  });
});

describe("designRequestSchema", () => {
  it("verhindert, dass ein Element gleichzeitig bleibt und sich ändert", () => {
    const r = designRequestSchema.safeParse({
      roomType: "bad",
      style: "modern",
      colorWorld: "kuehl-hell",
      budget: 800,
      furniture: [],
      keep: ["Bodenbelag"],
      change: ["Bodenbelag"],
      notes: "",
      variants: 1,
    });
    expect(r.success).toBe(false);
  });

  it("lehnt unbekannte Stile und Variantenanzahlen ab", () => {
    const base = { roomType: "bad", colorWorld: "kuehl-hell", budget: 800, furniture: [], keep: [], change: [], notes: "" };
    expect(designRequestSchema.safeParse({ ...base, style: "barock", variants: 1 }).success).toBe(false);
    expect(designRequestSchema.safeParse({ ...base, style: "modern", variants: 5 }).success).toBe(false);
  });
});

describe("validateStep", () => {
  it("meldet fehlende Angaben je Schritt", () => {
    expect(validateStep("foto", INITIAL_DRAFT)).toMatch(/Foto/);
    expect(validateStep("raum", INITIAL_DRAFT)).toMatch(/Raum/);
    expect(validateStep("stil", INITIAL_DRAFT)).toMatch(/Designstil/);
    expect(validateStep("wuensche", INITIAL_DRAFT)).toMatch(/Farbwelt/);
  });

  it("lässt einen vollständigen Entwurf passieren", () => {
    for (const step of ["foto", "raum", "stil", "wuensche", "uebersicht"] as const) {
      expect(validateStep(step, complete)).toBeNull();
    }
  });

  it("meldet ein ungültiges Budget im Wünsche-Schritt", () => {
    expect(validateStep("wuensche", { ...complete, budgetInput: "10" })).toMatch(/mindestens 100/);
  });
});

describe("Konfiguration", () => {
  it("enthält alle acht Startstile mit eindeutigen IDs", () => {
    const ids = DESIGN_STYLES.map((s) => s.id);
    expect(ids).toHaveLength(8);
    expect(new Set(ids).size).toBe(8);
  });

  it("enthält die drei vorläufigen Pakete mit den festgelegten Preisen", () => {
    expect(DESIGN_PACKAGES.map((p) => formatEuro(p.priceCents).replace(/\s/g, " "))).toEqual([
      "9,90 €",
      "19,90 €",
      "49,90 €",
    ]);
  });
});
