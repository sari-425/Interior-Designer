import type { AvailabilityStatus, Product, ProductMatch, ShoppingListEntry } from "./types";

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

/** Summe der Produktpreise der Hauptprodukte in Cent (ohne Versand); Alternativen zählen nicht mit */
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

const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  in_stock: "Laut Händler lieferbar",
  limited: "Laut Händler nur noch wenige verfügbar",
  preorder: "Laut Händler vorbestellbar",
  out_of_stock: "Laut Händler derzeit nicht lieferbar",
};

/** Verfügbarkeit mit Datum; ohne Angabe der Quelle ausdrücklich „unbekannt“ */
export function formatAvailability(product: Pick<Product, "availability">): string {
  if (!product.availability) return "Verfügbarkeit unbekannt";
  return `${AVAILABILITY_LABELS[product.availability.status]} (Stand ${dateFormat.format(new Date(product.availability.asOf))})`;
}

/** Lieferzeit laut Händler; ohne Angabe „Lieferzeit unbekannt“ */
export function formatDeliveryTime(product: Pick<Product, "deliveryTime">): string {
  const d = product.deliveryTime;
  if (!d) return "Lieferzeit unbekannt";
  const range = d.minDays === d.maxDays ? `${d.minDays}` : `${d.minDays}–${d.maxDays}`;
  return `Lieferzeit laut Händler ${range} ${d.maxDays === 1 ? "Werktag" : "Werktage"}`;
}

/** Versandkosten laut Händler; ohne Angabe ausdrücklich „Versandkosten unbekannt“ */
export function formatShipping(product: Pick<Product, "shipping">): string {
  if (!product.shipping) return "Versandkosten unbekannt";
  return product.shipping.costCents === 0
    ? "Versandkostenfrei laut Händler"
    : `zzgl. ${euroFormat.format(product.shipping.costCents / 100)} Versand laut Händler`;
}

export interface ShoppingListCostSummary {
  /** Summe der Produktpreise der Hauptprodukte in Cent */
  productsCents: number;
  /** Summe nur der bekannten Versandkosten in Cent */
  knownShippingCents: number;
  /** productsCents + knownShippingCents */
  totalKnownCents: number;
  /** Einträge, deren Versandkosten unbekannt sind (designItem) */
  shippingUnknownFor: string[];
  /** true, wenn alle Versandkosten bekannt sind und die Summe vollständig ist */
  complete: boolean;
}

/**
 * Gesamtkosten der Einkaufsliste nur aus tatsächlich bekannten Werten.
 * Unbekannte Versandkosten werden nicht geschätzt, sondern aufgelistet,
 * damit die Oberfläche „zzgl. Versand“ anzeigen kann. Versandkosten werden
 * je Artikel laut Händlerangabe addiert; bei mehreren Artikeln desselben
 * Händlers kann der tatsächliche Versand niedriger ausfallen.
 */
export function shoppingListCostSummary(entries: ShoppingListEntry[]): ShoppingListCostSummary {
  let productsCents = 0;
  let knownShippingCents = 0;
  const shippingUnknownFor: string[] = [];
  for (const entry of entries) {
    if (!entry.primary) continue;
    const product = entry.primary.product;
    productsCents += product.price.amountCents;
    if (product.shipping) knownShippingCents += product.shipping.costCents;
    else shippingUnknownFor.push(entry.designItem);
  }
  return {
    productsCents,
    knownShippingCents,
    totalKnownCents: productsCents + knownShippingCents,
    shippingUnknownFor,
    complete: shippingUnknownFor.length === 0,
  };
}

/** "1.234,00 €" bzw. "1.234,00 € zzgl. Versand für 2 Artikel" */
export function formatShoppingListTotal(summary: ShoppingListCostSummary): string {
  const total = euroFormat.format(summary.totalKnownCents / 100);
  if (summary.complete) return `${total} inkl. Versand`;
  const n = summary.shippingUnknownFor.length;
  return `${total} zzgl. Versand für ${n} Artikel (Versandkosten unbekannt)`;
}
