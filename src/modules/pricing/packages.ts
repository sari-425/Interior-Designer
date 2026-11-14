/**
 * Vorläufige Paketstruktur (Stand 08.11.2026, festgelegt von Osman Sari):
 * Vorschau (kostenlos) · Basis (9,90 €) · Plus (19,90 €), je ein Wohnzimmer pro Projekt.
 *
 * Regeln für diese Liste:
 * - Eine Leistung ist nur „available“, wenn sie heute funktioniert und getestet ist.
 * - Alles andere ist „in_preparation“ und wird in der Oberfläche so gekennzeichnet.
 * - Einkaufsliste und Budgetplaner sind noch nicht umgesetzt und deshalb
 *   kein Bestandteil eines Pakets (siehe PLANNED_LATER).
 * - Preise sind vorläufig. Bezahlte Pakete sind noch nicht buchbar.
 *
 * Preise und Leistungsumfang werden später im Admin-Bereich gepflegt.
 * Bis dahin ist dies die einzige Quelle für Paketdaten in der Oberfläche und im Bezahlvorgang.
 */
export type FeatureStatus = "available" | "in_preparation";

export interface PackageFeature {
  text: string;
  status: FeatureStatus;
}

export type PackageId = "vorschau" | "basis" | "plus";
export type PaidPackageId = Exclude<PackageId, "vorschau">;

export interface DesignPackage {
  id: PackageId;
  name: string;
  /** Bruttopreis in Cent, inkl. 19 % USt.; 0 = kostenlos */
  priceCents: number;
  /** Kann man das Paket heute nutzen bzw. buchen? */
  status: FeatureStatus;
  tagline: string;
  /** Wohnzimmer pro Projekt */
  roomsPerProject: 1;
  /** KI-Designvarianten; 0 = keine */
  designVariants: number;
  features: readonly PackageFeature[];
  highlighted?: boolean;
}

export const PACKAGES_ARE_PROVISIONAL = true;

const available = (text: string): PackageFeature => ({ text, status: "available" });
const preparing = (text: string): PackageFeature => ({ text, status: "in_preparation" });

export const DESIGN_PACKAGES: readonly DesignPackage[] = [
  {
    id: "vorschau",
    name: "Vorschau",
    priceCents: 0,
    status: "available",
    tagline: "Planung ausprobieren, ohne Konto",
    roomsPerProject: 1,
    designVariants: 0,
    features: [
      available("1 Wohnzimmer pro Projekt"),
      available("Foto, Stil, Farben, Budget und Möbel festlegen"),
      available("Zusammenfassung deiner Angaben"),
      available("Foto bleibt auf deinem Gerät"),
    ],
  },
  {
    id: "basis",
    name: "Basis",
    priceCents: 990,
    status: "in_preparation",
    tagline: "Zwei Ideen für dein Wohnzimmer",
    roomsPerProject: 1,
    designVariants: 2,
    features: [
      preparing("1 Wohnzimmer pro Projekt"),
      preparing("2 KI-Designvarianten"),
      preparing("Einmalig bezahlen, kein Abo"),
    ],
  },
  {
    id: "plus",
    name: "Plus",
    priceCents: 1990,
    status: "in_preparation",
    tagline: "Mehr Auswahl für deine Entscheidung",
    roomsPerProject: 1,
    designVariants: 4,
    features: [
      preparing("1 Wohnzimmer pro Projekt"),
      preparing("4 KI-Designvarianten"),
      preparing("Einmalig bezahlen, kein Abo"),
    ],
    highlighted: true,
  },
] as const;

/** Geplante Funktionen, die noch nicht umgesetzt sind und in keinem Paket enthalten sind */
export const PLANNED_LATER: readonly string[] = ["Einkaufsliste mit echten Produkten", "Budgetplaner"];

export function getPackage(id: PackageId): DesignPackage {
  const pkg = DESIGN_PACKAGES.find((p) => p.id === id);
  if (!pkg) throw new RangeError(`Unbekanntes Paket „${id}“.`);
  return pkg;
}

export function isPaidPackage(pkg: DesignPackage): pkg is DesignPackage & { id: PaidPackageId } {
  return pkg.priceCents > 0;
}

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}
