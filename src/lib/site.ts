/**
 * Öffentliche Angaben zur Website. NEXT_PUBLIC_SITE_URL wird beim Build
 * eingesetzt; ohne Angabe gilt die lokale Entwicklungsadresse.
 */
export const SITE_NAME = "DesignBySari";
export const SITE_CLAIM = "Dein Zuhause. Dein Budget. Dein Design.";

export function siteUrl(env: Readonly<Record<string, string | undefined>> = process.env): URL {
  const raw = env.NEXT_PUBLIC_SITE_URL?.trim();
  try {
    if (raw) return new URL(raw.replace(/\/+$/, ""));
  } catch {
    // ungültige Angabe: auf Standard zurückfallen
  }
  return new URL("http://localhost:3000");
}

/**
 * Suchmaschinen dürfen die Seite erst indexieren, wenn SITE_INDEXABLE=true
 * gesetzt ist (z. B. zum offiziellen Start). Die Vorschauversion bleibt
 * standardmäßig aus den Suchergebnissen.
 */
export function isSiteIndexable(env: Readonly<Record<string, string | undefined>> = process.env): boolean {
  return env.SITE_INDEXABLE?.trim().toLowerCase() === "true";
}

/** Öffentliche Seiten für die Sitemap (Rechtstexte sind noch Entwürfe und daher ausgenommen) */
export const PUBLIC_ROUTES = ["/", "/gestalten", "/stile", "/preise", "/transparenz"] as const;
