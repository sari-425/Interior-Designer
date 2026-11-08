import { describe, expect, it } from "vitest";
import {
  itemsWith,
  parseBudget,
  parseRoomSize,
  toLivingRoomRequest,
  validateStep,
} from "@/components/design-flow/draft";
import { INITIAL_DRAFT, type WizardDraft } from "@/components/design-flow/types";
import { LIVING_ROOM_ITEMS } from "@/modules/design-request/options";
import { livingRoomRequestSchema } from "@/modules/design-request/schema";
import { DESIGN_PACKAGES, formatEuro } from "@/modules/pricing/packages";
import { DESIGN_STYLES } from "@/modules/styles/styles";

const complete: WizardDraft = {
  ...INITIAL_DRAFT,
  photo: { url: "blob:test", name: "wohnzimmer.jpg", size: 1000, width: 1600, height: 1200 },
  style: "landhaus",
  roomSizeInput: "24,5",
  colorWorld: "warm-erdig",
  atmosphere: "gemuetlich",
  budgetInput: "1.500 €",
  items: { Sofa: "keep", Couchtisch: "keep", Fernseher: "keep", "TV-Möbel": "replace", Teppich: "replace", Sessel: "none" },
  notes: "  Mehr Stauraum  ",
};

const validRequest = {
  roomType: "wohnzimmer",
  roomSizeSqm: null,
  style: "modern",
  colorWorld: "kuehl-hell",
  atmosphere: "ruhig",
  budgetEur: 800,
  keep: [],
  replace: [],
  notes: "",
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

describe("parseRoomSize", () => {
  it("erlaubt leere Eingaben (optional)", () => {
    expect(parseRoomSize("")).toBeNull();
    expect(parseRoomSize("   ")).toBeNull();
  });

  it("liest ganze Zahlen und Komma-Zahlen", () => {
    expect(parseRoomSize("24")).toBe(24);
    expect(parseRoomSize("24,5")).toBe(24.5);
    expect(parseRoomSize("24.5 m²")).toBe(24.5);
    expect(parseRoomSize("30 qm")).toBe(30);
  });

  it("markiert ungültige Eingaben", () => {
    expect(parseRoomSize("zwanzig")).toBeNaN();
    expect(parseRoomSize("-5")).toBeNaN();
    expect(parseRoomSize("1.000,50")).toBeNaN();
  });
});

describe("toLivingRoomRequest", () => {
  it("erzeugt aus einem vollständigen Entwurf eine gültige Anfrage", () => {
    const r = toLivingRoomRequest(complete);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data).toEqual({
        roomType: "wohnzimmer",
        roomSizeSqm: 24.5,
        style: "landhaus",
        colorWorld: "warm-erdig",
        atmosphere: "gemuetlich",
        budgetEur: 1500,
        keep: ["Sofa", "Couchtisch", "Fernseher"],
        replace: ["TV-Möbel", "Teppich"],
        notes: "Mehr Stauraum",
      });
    }
  });

  it("akzeptiert ein Projekt ohne Raumgröße", () => {
    expect(toLivingRoomRequest({ ...complete, roomSizeInput: "" }).success).toBe(true);
  });

  it("lehnt ungültige Raumgrößen ab", () => {
    expect(toLivingRoomRequest({ ...complete, roomSizeInput: "3" }).success).toBe(false);
    expect(toLivingRoomRequest({ ...complete, roomSizeInput: "500" }).success).toBe(false);
    expect(toLivingRoomRequest({ ...complete, roomSizeInput: "abc" }).success).toBe(false);
  });

  it("lehnt Budgets außerhalb des Rahmens ab", () => {
    expect(toLivingRoomRequest({ ...complete, budgetInput: "50" }).success).toBe(false);
    expect(toLivingRoomRequest({ ...complete, budgetInput: "60000" }).success).toBe(false);
    expect(toLivingRoomRequest({ ...complete, budgetInput: "" }).success).toBe(false);
  });

  it("lehnt zu lange Wünsche ab", () => {
    expect(toLivingRoomRequest({ ...complete, notes: "x".repeat(501) }).success).toBe(false);
  });
});

describe("livingRoomRequestSchema", () => {
  it("akzeptiert eine minimale gültige Anfrage", () => {
    expect(livingRoomRequestSchema.safeParse(validRequest).success).toBe(true);
  });

  it("erlaubt nur Wohnzimmer", () => {
    expect(livingRoomRequestSchema.safeParse({ ...validRequest, roomType: "bad" }).success).toBe(false);
  });

  it("verhindert, dass ein Möbelstück gleichzeitig bleibt und ersetzt wird", () => {
    const r = livingRoomRequestSchema.safeParse({ ...validRequest, keep: ["Sofa"], replace: ["Sofa"] });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].message).toContain("Sofa");
  });

  it("lehnt doppelte und unbekannte Möbelstücke ab", () => {
    expect(livingRoomRequestSchema.safeParse({ ...validRequest, keep: ["Sofa", "Sofa"] }).success).toBe(false);
    expect(livingRoomRequestSchema.safeParse({ ...validRequest, keep: ["Bett"] }).success).toBe(false);
  });

  it("lehnt unbekannte Stile, Farben und Atmosphären ab", () => {
    expect(livingRoomRequestSchema.safeParse({ ...validRequest, style: "boho" }).success).toBe(false);
    expect(livingRoomRequestSchema.safeParse({ ...validRequest, colorWorld: "neon" }).success).toBe(false);
    expect(livingRoomRequestSchema.safeParse({ ...validRequest, atmosphere: "laut" }).success).toBe(false);
  });
});

describe("validateStep", () => {
  it("meldet fehlende Angaben je Schritt", () => {
    expect(validateStep("foto", INITIAL_DRAFT)).toMatch(/Foto/);
    expect(validateStep("stil", INITIAL_DRAFT)).toMatch(/Einrichtungsstil/);
    expect(validateStep("raum", { ...complete, colorWorld: null })).toMatch(/Farben/);
    expect(validateStep("raum", { ...complete, atmosphere: null })).toMatch(/Atmosphäre/);
  });

  it("lässt einen vollständigen Entwurf passieren", () => {
    for (const step of ["foto", "stil", "raum", "moebel", "uebersicht"] as const) {
      expect(validateStep(step, complete)).toBeNull();
    }
  });

  it("meldet Fehler nur im passenden Schritt", () => {
    const badBudget = { ...complete, budgetInput: "10" };
    expect(validateStep("raum", badBudget)).toMatch(/mindestens 100/);
    expect(validateStep("moebel", badBudget)).toBeNull();
    expect(validateStep("raum", { ...complete, roomSizeInput: "3" })).toMatch(/Raumgröße/);
  });

  it("Möbel ohne Auswahl sind erlaubt", () => {
    expect(validateStep("moebel", { ...complete, items: {} })).toBeNull();
  });
});

describe("itemsWith", () => {
  it("liefert Möbel in fester Reihenfolge", () => {
    expect(itemsWith(complete, "keep")).toEqual(["Sofa", "Couchtisch", "Fernseher"]);
    expect(itemsWith(complete, "replace")).toEqual(["TV-Möbel", "Teppich"]);
  });
});

describe("Konfiguration", () => {
  it("enthält genau die acht vereinbarten Einrichtungsstile", () => {
    expect(DESIGN_STYLES.map((s) => s.name)).toEqual([
      "Modern",
      "Skandinavisch",
      "Minimalistisch",
      "Industrial",
      "Japandi",
      "Klassisch",
      "Landhaus",
      "Luxuriös",
    ]);
  });

  it("enthält die genannten Wohnzimmer-Möbel", () => {
    for (const item of ["Sofa", "Couchtisch", "Fernseher", "TV-Möbel", "Teppich", "Vorhänge", "Beleuchtung"]) {
      expect(LIVING_ROOM_ITEMS).toContain(item);
    }
  });

  it("enthält die drei vorläufigen Pakete mit den festgelegten Preisen", () => {
    expect(DESIGN_PACKAGES.map((p) => formatEuro(p.priceCents).replace(/\s/g, " "))).toEqual([
      "9,90 €",
      "19,90 €",
      "49,90 €",
    ]);
  });
});
