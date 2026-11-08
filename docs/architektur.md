# Technische Architektur

Stand: 2026-11-08

## Überblick

DesignBySari ist eine Next.js-16-Anwendung (App Router, React 19, TypeScript 6, Tailwind CSS 4). Oberfläche und Geschäftslogik sind getrennt:

- `src/components/` enthält nur Darstellung und Bedienung.
- `src/modules/` enthält Regeln, Datenmodelle und Schnittstellen ohne Oberfläche. Diese Teile sind mit Unit-Tests abgedeckt.
- `src/app/api/` enthält dünne Server-Routen, die nur an Module weiterreichen.

Externe Dienste (KI, Produktquellen, Supabase, Stripe) sind jeweils hinter einer Schnittstelle versteckt. Solange kein Dienst eingetragen ist, ist die jeweilige Funktion aus und sagt das offen.

## Wohnzimmer-Designer

`src/components/design-flow/` – fünf Schritte (Foto, Stil, Raum, Möbel, Übersicht) in `DesignWizard.tsx`. Der Zwischenstand liegt in einem einzigen `WizardDraft`-Objekt, daher bleiben Eingaben beim Wechsel zwischen Schritten erhalten. `draft.ts` wandelt den Entwurf in eine geprüfte `LivingRoomRequest` um (Zod-Schema in `src/modules/design-request/schema.ts`). Dasselbe Schema prüft auf dem Server.

Die Ergebnisansicht (`ResultPanel.tsx`) erhält vom Server, ob die KI eingerichtet ist (`isAiEnabled()`, beim Build ausgewertet). Ist sie aus, wird nichts übertragen.

## KI-Schicht (`src/modules/ai/`)

| Datei | Aufgabe |
| --- | --- |
| `types.ts` | Schnittstellen für die drei Schritte: `RoomAnalysisProvider` (Bildanalyse), `DesignPlanningProvider` (Designplanung, Sprachmodell), `ImageGenerationProvider` (Bildgenerierung) |
| `registry.ts` | Verzeichnis der Anbieter je Schritt, Auswahl per Umgebungsvariable. **Derzeit leer.** |
| `config.ts` | Liest Anbieter und Limits aus Umgebungsvariablen; ungültige Werte fallen auf sichere Standards zurück |
| `usage-limiter.ts` | Anfragen pro Person und Stunde, Designs pro Tag, Höchstkosten je Anfrage und Tagesbudget |
| `brief.ts` | Baut aus der Anfrage eine sachliche Gestaltungsvorgabe; Freitext wird bereinigt und als Zitat markiert |
| `pipeline.ts` | Ablauf: Kosten schätzen → Limits prüfen → Analyse → Planung → Bilder je Variante, jeweils mit Zeitlimit |
| `errors.ts` | Fehlerarten mit stabilen Codes und deutschen Meldungen, ohne technische Details für den Browser |
| `handle-design-request.ts` | Server-Verarbeitung von `POST /api/designs`: Verfügbarkeit, Eingaben, Foto (Typ, Inhalt, Maße), Limits, Ablauf |

API-Schlüssel liest jeder Anbieter selbst serverseitig aus `env` (`requireEnv`). Die Route `src/app/api/designs/route.ts` importiert `server-only` und kann nicht in Browser-Code gelangen.

**Einen Anbieter anbinden:** eigene Datei je Anbieter (z. B. `src/modules/ai/providers/<name>.ts`), die eine der Schnittstellen umsetzt und `estimatedCostUsdCents` ehrlich angibt; in `PROVIDERS` eintragen; Variable setzen; neu bauen. Erst nach Freigabe von Anbieter und Kosten.

## Produkte (`src/modules/products/`)

`productSchema` beschreibt ein echtes Produkt: Name, Händler, Preis in Euro mit Preisstand, Maße, Material, Farbe, Bild, Link (nur https), Datenquelle, Affiliate-Angabe, Kategorie. `productMatchSchema` unterscheidet „genau dieses Produkt“ (nur mit Prüfnachweis) und „ähnliche Alternative“. `searchProducts` fragt alle Quellen ab und verwirft unvollständige Datensätze, statt sie zu ergänzen. `format.ts` erzeugt Kennzeichnungen („Ähnliche Alternative“, „Partnerlink“), `rel="sponsored"` und Preise mit Datum. Verzeichnis der Quellen (`registry.ts`) ist leer.

## Konten und Projekte

- `src/modules/accounts/`: Prüfregeln für Registrierung, Anmeldung und Profil; Schnittstellen `AuthService` (inkl. Passwort-Reset und Konto löschen) und `ProfileRepository`.
- `src/modules/projects/`: `ProjectRepository` (anlegen, Foto zuordnen, lesen, auflisten, umbenennen, ändern, Status, löschen) und erlaubte Statuswechsel. `InMemoryProjectRepository` ist die ausführbare Referenz für die spätere Supabase-Umsetzung (Besitzprüfung, fremde Projekte wirken wie nicht vorhanden).
- `supabase/migrations/`: Tabellen `living_room_projects` und `profiles` mit Row Level Security, privater Foto-Bucket, Profil-Anlage per Trigger. **Entwurf, nicht ausgeführt.**

## Zahlungen (`src/modules/payments/`)

Standardmäßig aus. `getPaymentsStatus` verlangt `PAYMENTS_ENABLED=true`, Secret-Key und Webhook-Secret; Live-Schlüssel nur mit `PAYMENTS_ALLOW_LIVE=true`. `startCheckout` nimmt Preis und Beschreibung nur aus `DESIGN_PACKAGES` auf dem Server und erlaubt nur eigene Rücksprung-Adressen. `verifyStripeSignature` prüft Webhooks nach Stripe-Verfahren (HMAC-SHA256, Zeittoleranz, zeitkonstanter Vergleich) ohne zusätzliches Paket. Es ist kein Zahlungsanbieter eingetragen.

## Qualität, SEO, Sicherheit

- Sicherheits-Header in `next.config.ts` (u. a. `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, HSTS, CSP mit `frame-ancestors 'none'`).
- `robots.ts` sperrt die Vorschau für Suchmaschinen, bis `SITE_INDEXABLE=true`; `sitemap.ts` und `opengraph-image.tsx` für Teilen und Suche.
- Schriften werden beim Build lokal eingebunden (keine Anfragen an Google).
