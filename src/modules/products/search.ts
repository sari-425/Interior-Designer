import { productSchema, type Product, type ProductCatalogProvider, type ProductQuery } from "./types";

/**
 * Fragt alle Produktquellen ab und gibt nur Produkte zurück, die vollständig
 * und gültig sind (Preis mit Preisstand, https-Link, Quelle, Affiliate-Angabe)
 * und ins Budget passen. Fehlerhafte Datensätze werden verworfen statt ergänzt.
 * Fällt eine Quelle aus, liefern die anderen trotzdem Ergebnisse.
 */
export async function searchProducts(
  providers: ProductCatalogProvider[],
  query: ProductQuery,
  signal: AbortSignal,
): Promise<{ products: Product[]; rejected: number; failedSources: string[] }> {
  const settled = await Promise.allSettled(providers.map((p) => p.search(query, signal)));
  const products: Product[] = [];
  const seen = new Set<string>();
  const failedSources: string[] = [];
  let rejected = 0;

  settled.forEach((result, i) => {
    if (result.status === "rejected") {
      failedSources.push(providers[i].id);
      return;
    }
    for (const raw of result.value) {
      const parsed = productSchema.safeParse(raw);
      if (!parsed.success) {
        rejected++;
        continue;
      }
      const product = parsed.data;
      const key = `${product.retailer.id}:${product.id}`;
      if (seen.has(key) || product.price.amountCents > query.maxPriceCents) continue;
      seen.add(key);
      products.push(product);
    }
  });

  products.sort((a, b) => a.price.amountCents - b.price.amountCents);
  return { products: products.slice(0, query.limit), rejected, failedSources };
}
