import { z } from "zod";

/**
 * Produktdaten echter, erhältlicher Möbel und Einrichtungsgegenstände.
 *
 * Grundsätze:
 * - Produkte stammen nur aus rechtmäßigen Quellen (Händler-Feed, Affiliate-Netzwerk
 *   oder offizielle Händler-Schnittstelle). Nichts wird erfunden oder geschätzt.
 * - Jeder Preis hat einen Preisstand (Zeitpunkt der Abfrage).
 * - KI-generierte Möbel sind nie Produkte. Ein Produkt ist nur dann „genau dieses“,
 *   wenn die Übereinstimmung technisch geprüft wurde, sonst „ähnliche Alternative“.
 */

export const PRODUCT_SOURCE_TYPES = ["retailer-feed", "affiliate-network", "retailer-api"] as const;

const httpsUrl = z
  .string()
  .url("Ungültiger Link.")
  .refine((u) => u.startsWith("https://"), "Links müssen mit https:// beginnen.");

const isoDateTime = z.iso.datetime({ offset: true, error: "Preisstand muss ein Zeitpunkt (ISO 8601) sein." });

export const productSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().trim().min(2).max(200),
    retailer: z.object({ id: z.string().min(1), name: z.string().trim().min(1).max(100) }),
    price: z.object({
      /** Bruttopreis in Cent inkl. USt. */
      amountCents: z.number().int().positive(),
      currency: z.literal("EUR"),
      /** Zeitpunkt, zu dem der Preis von der Quelle abgefragt wurde */
      asOf: isoDateTime,
    }),
    dimensionsCm: z
      .object({
        width: z.number().positive().max(2000),
        depth: z.number().positive().max(2000),
        height: z.number().positive().max(2000),
      })
      .partial()
      .nullable(),
    materials: z.array(z.string().trim().min(1)).max(10),
    colors: z.array(z.string().trim().min(1)).max(10),
    imageUrl: httpsUrl.nullable(),
    productUrl: httpsUrl,
    source: z.object({
      type: z.enum(PRODUCT_SOURCE_TYPES),
      name: z.string().trim().min(1),
      fetchedAt: isoDateTime,
    }),
    affiliate: z.discriminatedUnion("isAffiliate", [
      z.object({ isAffiliate: z.literal(false) }),
      z.object({ isAffiliate: z.literal(true), network: z.string().trim().min(1) }),
    ]),
    category: z.string().trim().min(1),
  })
  .strict();

export type Product = z.infer<typeof productSchema>;

/**
 * Zuordnung eines Produkts zu einem Möbelstück im KI-Entwurf.
 * `exact` ist nur erlaubt, wenn die Übereinstimmung geprüft wurde (`verifiedBy`).
 */
export const productMatchSchema = z
  .discriminatedUnion("kind", [
    z.object({
      kind: z.literal("exact"),
      product: productSchema,
      /** Wie die Übereinstimmung geprüft wurde, z. B. "artikelnummer" oder "manuell" */
      verifiedBy: z.string().trim().min(1),
    }),
    z.object({
      kind: z.literal("similar"),
      product: productSchema,
      /** Ähnlichkeit 0–1 laut Suche, nur zur Sortierung */
      similarity: z.number().min(0).max(1).nullable(),
    }),
  ])
  .readonly();

export type ProductMatch = z.infer<typeof productMatchSchema>;

/** Ein Eintrag der Einkaufsliste zu einem Möbelstück im Entwurf mit Alternativen */
export interface ShoppingListEntry {
  /** z. B. "Sofa" aus dem KI-Entwurf (kein Produkt!) */
  designItem: string;
  primary: ProductMatch | null;
  alternatives: ProductMatch[];
}

/** Suchanfrage an eine Produktquelle */
export interface ProductQuery {
  category: string;
  styleId: string;
  colors: string[];
  maxPriceCents: number;
  limit: number;
}

/** Schnittstelle für eine Produktquelle (Händler-Feed, Affiliate-Netzwerk …) */
export interface ProductCatalogProvider {
  readonly id: string;
  readonly displayName: string;
  search(query: ProductQuery, signal: AbortSignal): Promise<Product[]>;
}
