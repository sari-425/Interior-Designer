import { describe, expect, it } from "vitest";
import { isPlaceholder, offenePlatzhalter } from "@/content/legal/angaben";
import { CONSENT_IMMEDIATE_START } from "@/content/legal/zustimmung";

describe("Rechtstexte: Angaben", () => {
  it("erkennt Platzhalter in eckigen Klammern", () => {
    expect(isPlaceholder("[Vor- und Nachname]")).toBe(true);
    expect(isPlaceholder("  [PLZ und Ort]")).toBe(true);
    expect(isPlaceholder("Musterstraße 1")).toBe(false);
    expect(isPlaceholder("")).toBe(false);
  });

  it("listet offene Angaben mit ihrem Namen auf", () => {
    const offen = offenePlatzhalter();
    // Solange die Entwürfe nicht ausgefüllt sind, müssen Name und Anschrift als offen erscheinen.
    expect(offen).toContain("BETREIBER.name");
    expect(offen).not.toContain("BETREIBER.land");
    expect(offen).not.toContain("DIENSTE.hosting.name");
  });

  it("Zustimmungstext enthält Zustimmung und Hinweis auf Verlust des Widerrufsrechts", () => {
    expect(CONSENT_IMMEDIATE_START).toMatch(/stimme ausdrücklich zu/);
    expect(CONSENT_IMMEDIATE_START).toMatch(/Widerrufsrecht verliere/);
  });
});
