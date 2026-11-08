import { describe, expect, it } from "vitest";
import {
  formatAvailability,
  formatDeliveryTime,
  formatPriceWithDate,
  formatShipping,
  formatShoppingListTotal,
  shoppingListCostSummary,
  isPriceStale,
  oldestPriceDate,
  productLabels,
  productLinkRel,
  shoppingListTotalCents,
} from "@/modules/products/format";
import { getProductProviders } from "@/modules/products/registry";
import { searchProducts } from "@/modules/products/search";
import { isValidGtin, productMatchSchema, productSchema, type Product, type ProductCatalogProvider } from "@/modules/products/types";

/** Testdatensatz mit erkennbar fiktiven Werten (example.test), kein echtes Produkt */
const testProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "test-1",
  name: "Testsofa (Testdaten)",
  retailer: { id: "testhaendler", name: "Testhändler" },
  price: { amountCents: 49900, currency: "EUR", asOf: "2026-11-08T08:00:00+01:00" },
  dimensionsCm: { width: 200, depth: 90, height: 80 },
  materials: ["Stoff"],
  colors: ["Beige"],
  imageUrl: "https://example.test/sofa.jpg",
  productUrl: "https://example.test/sofa",
  source: { type: "retailer-feed", name: "Test-Feed", fetchedAt: "2026-11-08T08:00:00+01:00" },
  affiliate: { isAffiliate: false },
  category: "Sofa",
  ...overrides,
});

describe("Produktdaten", () => {
  it("akzeptiert vollständige Produkte", () => {
    expect(productSchema.safeParse(testProduct()).success).toBe(true);
  });

  it("verlangt Preisstand, https-Links, Euro und Affiliate-Angabe", () => {
    expect(productSchema.safeParse({ ...testProduct(), price: { amountCents: 100, currency: "EUR" } }).success).toBe(false);
    expect(productSchema.safeParse(testProduct({ productUrl: "http://example.test/x" })).success).toBe(false);
    expect(productSchema.safeParse({ ...testProduct(), price: { amountCents: 100, currency: "USD", asOf: "2026-11-08T08:00:00Z" } }).success).toBe(false);
    expect(productSchema.safeParse({ ...testProduct(), affiliate: { isAffiliate: true } }).success).toBe(false);
    expect(productSchema.safeParse({ ...testProduct(), erfundenesFeld: 1 }).success).toBe(false);
  });

  it("erlaubt „genau dieses Produkt“ nur mit Prüfnachweis", () => {
    expect(productMatchSchema.safeParse({ kind: "exact", product: testProduct() }).success).toBe(false);
    expect(productMatchSchema.safeParse({ kind: "exact", product: testProduct(), verifiedBy: "artikelnummer" }).success).toBe(true);
  });

  it("kennzeichnet Alternativen und Partnerlinks", () => {
    const affiliate = testProduct({ affiliate: { isAffiliate: true, network: "Testnetzwerk" } });
    expect(productLabels({ kind: "similar", product: affiliate, similarity: 0.8 })).toEqual(["Ähnliche Alternative", "Partnerlink"]);
    expect(productLabels({ kind: "exact", product: testProduct(), verifiedBy: "manuell" })).toEqual(["Geprüft: genau dieses Produkt"]);
    expect(productLinkRel(affiliate)).toContain("sponsored");
    expect(productLinkRel(testProduct())).not.toContain("sponsored");
  });

  it("zeigt Preise immer mit Preisstand und erkennt veraltete Preise", () => {
    expect(formatPriceWithDate(testProduct()).replace(/\s/g, " ")).toBe("499,00 € (Preisstand 08.11.2026)");
    expect(isPriceStale(testProduct(), new Date("2026-11-08T20:00:00+01:00"))).toBe(false);
    expect(isPriceStale(testProduct(), new Date("2026-11-10T08:00:00+01:00"))).toBe(true);
  });

  it("summiert nur Hauptprodukte und nennt den ältesten Preisstand", () => {
    const entries = [
      { designItem: "Sofa", primary: { kind: "similar" as const, product: testProduct(), similarity: null }, alternatives: [{ kind: "similar" as const, product: testProduct({ id: "t2" }), similarity: null }] },
      { designItem: "Teppich", primary: { kind: "similar" as const, product: testProduct({ id: "t3", price: { amountCents: 10000, currency: "EUR", asOf: "2026-11-07T08:00:00Z" } }), similarity: null }, alternatives: [] },
      { designItem: "Lampe", primary: null, alternatives: [] },
    ];
    expect(shoppingListTotalCents(entries)).toBe(59900);
    expect(oldestPriceDate(entries)).toBe("2026-11-07T08:00:00Z");
  });
});

describe("Versand, Lieferzeit, Verfügbarkeit und EAN/GTIN", () => {
  const asOf = "2026-11-08T08:00:00+01:00";

  it("sind optional: Produkte ohne diese Angaben bleiben gültig", () => {
    const parsed = productSchema.parse(testProduct());
    expect(parsed.shipping).toBeUndefined();
    expect(parsed.gtin).toBeUndefined();
  });

  it("prüft die Angaben, wenn sie vorhanden sind", () => {
    const full = testProduct({
      gtin: "4006381333931",
      shipping: { costCents: 0, currency: "EUR", asOf },
      deliveryTime: { minDays: 3, maxDays: 5, asOf },
      availability: { status: "in_stock", asOf },
      source: { type: "retailer-feed", name: "Test-Feed", fetchedAt: asOf, updatedAt: "2026-11-08T06:00:00+01:00" },
    });
    expect(productSchema.safeParse(full).success).toBe(true);
    expect(productSchema.safeParse({ ...full, gtin: "4006381333932" }).success).toBe(false);
    expect(productSchema.safeParse({ ...full, shipping: { costCents: -1, currency: "EUR", asOf } }).success).toBe(false);
    expect(productSchema.safeParse({ ...full, shipping: { costCents: 490, currency: "EUR" } }).success).toBe(false);
    expect(productSchema.safeParse({ ...full, deliveryTime: { minDays: 7, maxDays: 2, asOf } }).success).toBe(false);
    expect(productSchema.safeParse({ ...full, availability: { status: "vielleicht", asOf } }).success).toBe(false);
  });

  it("erkennt gültige EAN/GTIN anhand der Prüfziffer", () => {
    expect(isValidGtin("4006381333931")).toBe(true); // EAN-13
    expect(isValidGtin("96385074")).toBe(true); // EAN-8
    expect(isValidGtin("036000291452")).toBe(true); // UPC-A
    expect(isValidGtin("4006381333930")).toBe(false);
    expect(isValidGtin("40063813339")).toBe(false);
    expect(isValidGtin("40063813339AB")).toBe(false);
  });

  it("zeigt fehlende Angaben ausdrücklich als unbekannt an, statt sie zu erfinden", () => {
    expect(formatShipping(testProduct())).toBe("Versandkosten unbekannt");
    expect(formatDeliveryTime(testProduct())).toBe("Lieferzeit unbekannt");
    expect(formatAvailability(testProduct())).toBe("Verfügbarkeit unbekannt");
    expect(formatShipping(testProduct({ shipping: { costCents: 0, currency: "EUR", asOf } }))).toBe("Versandkostenfrei laut Händler");
    expect(formatShipping(testProduct({ shipping: { costCents: 4990, currency: "EUR", asOf } })).replace(/\s/g, " ")).toBe("zzgl. 49,90 € Versand laut Händler");
    expect(formatDeliveryTime(testProduct({ deliveryTime: { minDays: 3, maxDays: 5, asOf } }))).toBe("Lieferzeit laut Händler 3–5 Werktage");
    expect(formatAvailability(testProduct({ availability: { status: "out_of_stock", asOf } }))).toBe("Laut Händler derzeit nicht lieferbar (Stand 08.11.2026)");
  });

  it("rechnet Gesamtkosten nur mit bekannten Werten und nennt fehlende Versandkosten", () => {
    const entry = (designItem: string, product: Product) => ({ designItem, primary: { kind: "similar" as const, product, similarity: null }, alternatives: [] });
    const entries = [
      entry("Sofa", testProduct({ shipping: { costCents: 4990, currency: "EUR", asOf } })),
      entry("Teppich", testProduct({ id: "t2", price: { amountCents: 10000, currency: "EUR", asOf } })),
      { designItem: "Lampe", primary: null, alternatives: [] },
    ];
    const summary = shoppingListCostSummary(entries);
    expect(summary).toEqual({ productsCents: 59900, knownShippingCents: 4990, totalKnownCents: 64890, shippingUnknownFor: ["Teppich"], complete: false });
    expect(formatShoppingListTotal(summary).replace(/\s/g, " ")).toBe("648,90 € zzgl. Versand für 1 Artikel (Versandkosten unbekannt)");

    const complete = shoppingListCostSummary([entry("Sofa", testProduct({ shipping: { costCents: 0, currency: "EUR", asOf } }))]);
    expect(complete.complete).toBe(true);
    expect(formatShoppingListTotal(complete).replace(/\s/g, " ")).toBe("499,00 € inkl. Versand");
  });
});

describe("Produktsuche", () => {
  const query = { category: "Sofa", styleId: "modern", colors: [], maxPriceCents: 60000, limit: 10 };
  const provider = (id: string, result: () => Promise<unknown[]>): ProductCatalogProvider => ({
    id,
    displayName: id,
    search: result as ProductCatalogProvider["search"],
  });

  it("verwirft unvollständige Datensätze, Dubletten und zu teure Produkte", async () => {
    const r = await searchProducts(
      [
        provider("a", async () => [testProduct(), testProduct(), { ...testProduct({ id: "kaputt" }), price: undefined }, testProduct({ id: "teuer", price: { amountCents: 99900, currency: "EUR", asOf: "2026-11-08T08:00:00Z" } })]),
        provider("b", async () => { throw new Error("Quelle down"); }),
      ],
      query,
      new AbortController().signal,
    );
    expect(r.products.map((p) => p.id)).toEqual(["test-1"]);
    expect(r.rejected).toBe(1);
    expect(r.failedSources).toEqual(["b"]);
  });

  it("hat ohne Vertrag keine aktive Produktquelle", () => {
    expect(getProductProviders({})).toEqual([]);
    expect(getProductProviders({ PRODUCT_SOURCES: "irgendein-haendler" })).toEqual([]);
  });
});
