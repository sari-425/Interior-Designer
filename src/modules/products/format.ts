import type { Product, ProductMatch, ShoppingListEntry } from "./types";

const dateFormat = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" });
const euroFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

/** "199,00 € (Preisstand 08.11.2026)" – Preis immer mit Datum der Abfrage */
export function formatPriceWithDate(product: Pick<Product, "price">): string {
  return `${euroFormat.format(product.price.amountCents / 100)} (Preisstand ${dateFormat.format(new Date(product.price.asOf))})`;
}

/** Sichtbare Kennzeichnungen eines Produkts in der Oberfläche */
export function productLabels(match: ProductMatch): string[] {
  const labels = [match.kind === "exact" ? "Geprüft: genau dieses Produkt" : "Ähnliche Alternative"];
  if (match.product.affiliate.isAffiliate) labels.push("Partnerlink");
  return labels;
}

/** rel-Attribut für Produktlinks: Partnerlinks als "sponsored" (Google-Richtlinie) */
export function productLinkRel(product: Product): string {
  return product.affiliate.isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer";
}

/** Summe der Hauptprodukte in Cent; Alternativen zählen nicht mit */
export function shoppingListTotalCents(entries: ShoppingListEntry[]): number {
  return entries.reduce((sum, e) => sum + (e.primary?.product.price.amountCents ?? 0), 0);
}

/** Ältester Preisstand der Liste, damit die Gesamtsumme ehrlich datiert werden kann */
export function oldestPriceDate(entries: ShoppingListEntry[]): string | null {
  const dates = entries.flatMap((e) => (e.primary ? [e.primary.product.price.asOf] : [])).sort();
  return dates[0] ?? null;
}

/** Preise älter als `maxAgeHours` gelten als veraltet und müssen neu abgefragt werden */
export function isPriceStale(product: Pick<Product, "price">, now: Date, maxAgeHours = 24): boolean {
  return now.getTime() - new Date(product.price.asOf).getTime() > maxAgeHours * 60 * 60 * 1000;
}
