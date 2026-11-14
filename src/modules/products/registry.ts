import type { ProductCatalogProvider } from "./types";

type Env = Readonly<Record<string, string | undefined>>;

/**
 * Verzeichnis der Produktquellen. Absichtlich leer: Es gibt noch keinen
 * Vertrag mit einem Händler oder Affiliate-Netzwerk. Es werden keine
 * Beispielprodukte erfunden. Eine Quelle wird als eigene Datei umgesetzt
 * und hier eingetragen; Zugangsdaten liest sie serverseitig aus `env`.
 */
export const PRODUCT_PROVIDERS: Readonly<Record<string, (env: Env) => ProductCatalogProvider>> = {};

/** Aktive Quellen laut PRODUCT_SOURCES (kommagetrennt). Unbekannte werden ignoriert. */
export function getProductProviders(
  env: Env = process.env,
  providers: Readonly<Record<string, (env: Env) => ProductCatalogProvider>> = PRODUCT_PROVIDERS,
): ProductCatalogProvider[] {
  const ids = (env.PRODUCT_SOURCES ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return ids.flatMap((id) => (providers[id] ? [providers[id](env)] : []));
}
