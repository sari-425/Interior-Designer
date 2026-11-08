# DesignBySari

**Dein Zuhause. Dein Budget. Dein Design.**

DesignBySari ist eine deutschsprachige KI-Interior-Design-Plattform für Privatpersonen und Familien in Deutschland. Wir starten ausschließlich mit **Wohnzimmern** als responsive Webanwendung (keine native App). Nutzerinnen und Nutzer laden ein Foto ihres Wohnzimmers hoch, wählen Stil, Farben, Atmosphäre und Budget, markieren, welche Möbel bleiben oder ersetzt werden, und erhalten später eine KI-gestützte Neugestaltung mit echten, erhältlichen Produkten.

## Projektstand

| Bereich | Stand |
| --- | --- |
| Website (Startseite, Stile, Preise, Rechtstexte als Entwurf) | fertig, als Vorschauversion gekennzeichnet |
| Wohnzimmer-Designer (Foto bis Zusammenfassung, Ergebnisansicht) | fertig und getestet |
| KI (Bildanalyse, Designplanung, Bildgenerierung) | Architektur, Limits und Schnittstelle fertig, **kein Anbieter angebunden** |
| Echte Produkte | Datenmodell, Prüfung und Suche fertig, **keine Produktquelle angebunden** |
| Konten und Projekte | Schnittstellen, Prüfregeln und Datenbank-Entwurf fertig, **Supabase nicht eingerichtet** |
| Zahlungen | Stripe vorbereitet und standardmäßig aus, **keine Zahlungen möglich** |

**Wichtig:** Es gibt derzeit keine KI-Generierung, keine Datenbank und keine Zahlungen. Hochgeladene Fotos bleiben im Browser. Alle Bilder sind gezeichnete Illustrationen und als solche gekennzeichnet.

Weitere Dokumentation:

- [Technische Architektur](docs/architektur.md)
- [Funktionsübersicht](docs/funktionen.md)
- [Offene Integrationen und bekannte Einschränkungen](docs/offene-integrationen.md)
- [Tests](docs/tests.md)
- [Sicherheit und Datenschutz](docs/sicherheit-datenschutz.md)
- Entscheidungen: [docs/decisions](docs/decisions)

## Technik

- [Next.js 16](https://nextjs.org/docs) (App Router, Cache Components) mit React 19
- TypeScript 6 (strikt). TypeScript 7 wurde getestet: Der Build läuft, aber ESLint (`typescript-eslint`) ist noch nicht kompatibel. Siehe [docs/decisions/0001-stack.md](docs/decisions/0001-stack.md).
- Tailwind CSS 4 mit DesignBySari-Design-Tokens in `src/app/globals.css`
- Zod 4 für die Prüfung aller Eingaben
- Vitest (Unit-Tests) und Playwright (Browser-Tests, Desktop und Mobil)

## Voraussetzungen

- Node.js 24 LTS oder neuer (`node -v`)
- npm 10 oder neuer

## Schnellstart

```bash
npm install
npm run dev
```

Dann <http://localhost:3000> öffnen.

## Befehle

| Befehl | Zweck |
| --- | --- |
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Produktions-Build |
| `npm run start` | Produktions-Build starten |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript-Prüfung |
| `npm run test` | Unit-Tests (Vitest) |
| `npm run test:e2e` | Browser-Tests (Playwright, baut die App vorher) |
| `npm run check` | Lint, Typprüfung und Unit-Tests zusammen |

Vor dem ersten Browser-Test einmalig den Testbrowser installieren:

```bash
npx playwright install chromium
```

## Projektstruktur

```text
src/
├─ app/                  Seiten und Server-Routen (Next.js App Router)
│  ├─ page.tsx           Startseite
│  ├─ gestalten/         Wohnzimmer-Designer
│  ├─ stile/, preise/    Stil- und Preisseite
│  ├─ api/designs/       POST: Design anfordern (antwortet 503, solange keine KI eingerichtet ist)
│  ├─ api/payments/webhook/  Stripe-Webhook (deaktiviert)
│  ├─ robots.ts, sitemap.ts, opengraph-image.tsx   SEO
│  └─ impressum/, datenschutz/, agb/, transparenz/  Rechtstexte (Entwürfe)
├─ components/           Oberfläche (brand, ui, layout, marketing, illustrations, design-flow)
├─ modules/              Geschäftslogik ohne Oberfläche
│  ├─ design-request/    Optionen und Zod-Schema der Wohnzimmer-Anfrage
│  ├─ ai/                KI-Schicht: Typen, Anbieter-Verzeichnis, Limits, Ablauf, Server-Verarbeitung
│  ├─ products/          Produktdaten, Prüfung, Kennzeichnung, Suche
│  ├─ accounts/          Prüfregeln und Schnittstellen für Konten und Profile
│  ├─ projects/          Projektmodell, Speicher-Schnittstelle, Referenz-Umsetzung
│  ├─ payments/          Zahlungen (Stripe vorbereitet)
│  ├─ pricing/, styles/, rooms/
└─ lib/                  Bildprüfung, Website-Angaben
supabase/migrations/     Datenbankschema mit Zugriffsschutz (Entwurf, nicht ausgeführt)
tests/unit, tests/e2e    Vitest und Playwright
```

## Der Wohnzimmer-Ablauf

1. **Foto:** JPG, JPEG, PNG oder WebP, höchstens 10 MB, mindestens 640 × 480 Pixel, mit Vorschau.
2. **Stil:** Modern, Skandinavisch, Minimalistisch, Industrial, Japandi, Klassisch, Landhaus, Luxuriös.
3. **Raum:** Raumgröße, Raummerkmale, Farben, Atmosphäre, Budget in Euro, besondere Anforderungen, Wünsche, Anzahl Designvarianten.
4. **Möbel:** Möbel behalten oder ersetzen; Boden, Wände, Decke, Einbauten, Heizkörper behalten oder ändern.
5. **Zusammenfassung:** Alle Angaben mit „Ändern“ und die Ergebnisansicht. Ohne KI wird nichts übertragen.

## Designstile ergänzen

Einen neuen Stil in `src/modules/styles/styles.ts` zur Liste `DESIGN_STYLES` hinzufügen. Oberfläche, Validierung und Tests lesen automatisch aus dieser Liste.

## Marke

| Token | Farbe |
| --- | --- |
| `cream` | #F2EDE5 |
| `sand` | #D8C8B5 |
| `taupe` | #A58D71 |
| `sage` | #777C6B |
| `charcoal` | #35352F |

DesignBySari ist eine eigenständige Marke und darf nicht den Eindruck erwecken, zu einem Möbelhändler zu gehören.

## Recht

Impressum, Datenschutzerklärung und AGB sind **Entwürfe** und müssen vor dem Start juristisch geprüft werden.
