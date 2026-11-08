/**
 * Vorläufige Designpakete.
 * Preise und Leistungsumfang werden ab Phase 6 im Admin-Bereich gepflegt.
 * Bis dahin ist dies die einzige Quelle für Paketdaten in der Oberfläche.
 */
export interface DesignPackage {
  id: "basic" | "plus" | "premium";
  name: string;
  /** Bruttopreis in Cent, inkl. 19 % USt. */
  priceCents: number;
  tagline: string;
  features: readonly string[];
  highlighted?: boolean;
}

export const PACKAGES_ARE_PROVISIONAL = true;

export const DESIGN_PACKAGES: readonly DesignPackage[] = [
  {
    id: "basic",
    name: "Basic",
    priceCents: 990,
    tagline: "Für den ersten Eindruck",
    features: ["1 Wohnzimmer", "2 Designvarianten", "Passende Produktideen"],
  },
  {
    id: "plus",
    name: "Plus",
    priceCents: 1990,
    tagline: "Für die konkrete Umsetzung",
    features: ["1 Wohnzimmer", "4 Designvarianten", "Budget-Planer", "Einkaufsliste mit Gesamtkosten"],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    priceCents: 4990,
    tagline: "Für mehrere Projekte",
    features: ["Bis zu 3 Wohnzimmer-Projekte", "6 Designvarianten je Projekt", "Budget-Planer", "Einkaufslisten mit Gesamtkosten"],
  },
] as const;

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}
