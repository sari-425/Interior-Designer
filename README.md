# ROOMORA

**Dein Raum. Dein Stil. Dein Zuhause.**

ROOMORA ist eine KI-Interior-Design-Plattform für den deutschen Markt. Kundinnen und Kunden laden ein Foto ihres Raums hoch, wählen Stil, Farbwelt und Budget und erhalten eine KI-gestützte Neugestaltung mit passenden, tatsächlich erhältlichen Produktvorschlägen.

## Projektstand

| Phase | Inhalt | Status |
| --- | --- | --- |
| 0 | Analyse und Umsetzungsplan | abgeschlossen |
| 1 | Frontend: Landingpage, Navigation, Stile, Preise, Gestaltungs-Ablauf | **in Arbeit** |
| 2 | KI-Prototyp mit austauschbarem Anbieter | offen |
| 3 | Produktsystem, Händler-Adapter, Budget-Planer | offen |
| 4 | Supabase: Konten, Projekte, Bildspeicher, Datenschutz | offen |
| 5 | Stripe-Testmodus, Designpakete | offen |
| 6 | Administration | offen |
| 7 | Qualität und Veröffentlichung | offen |

**Wichtig:** In der aktuellen Version gibt es keine KI-Generierung, keine Datenbank und keine Zahlungen. Hochgeladene Fotos bleiben im Browser. Alle Bilder sind gezeichnete Illustrationen und als solche gekennzeichnet.

## Technik

- [Next.js 16](https://nextjs.org/docs) (App Router, Cache Components) mit React 19
- TypeScript 6 (strikt). TypeScript 7 wurde getestet: Der Build läuft, aber ESLint (`typescript-eslint`) ist noch nicht kompatibel. Siehe [docs/decisions/0001-stack.md](docs/decisions/0001-stack.md).
- Tailwind CSS 4 mit ROOMORA-Design-Tokens in `src/app/globals.css`
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
├─ app/                  Seiten (Next.js App Router)
│  ├─ page.tsx           Landingpage
│  ├─ gestalten/         Gestaltungs-Ablauf
│  ├─ stile/, preise/    Stil- und Preisseite
│  └─ impressum/, datenschutz/, agb/, transparenz/   Rechtstexte (Entwürfe)
├─ components/
│  ├─ brand/             Wortmarke
│  ├─ ui/                Grundbausteine (Button, Container, Badge …)
│  ├─ layout/            Kopf- und Fußbereich
│  ├─ marketing/         Abschnitte der Landingpage
│  ├─ illustrations/     Gezeichnete Raum-Illustration (Platzhalter)
│  └─ design-flow/       Schritte des Gestaltungs-Ablaufs
├─ modules/              Geschäftslogik ohne Oberfläche
│  ├─ styles/            Designstile (modular erweiterbar)
│  ├─ rooms/             Raumtypen
│  ├─ design-request/    Optionen und Zod-Schema der Design-Anfrage
│  └─ pricing/           Vorläufige Designpakete
└─ lib/validation/       Bildprüfung (Typ, Inhalt, Größe, Maße)
tests/
├─ unit/                 Vitest
└─ e2e/                  Playwright
```

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

ROOMORA ist eine eigenständige Marke und darf nicht den Eindruck erwecken, zu einem Möbelhändler zu gehören.

## Recht

Impressum, Datenschutzerklärung und AGB sind **Entwürfe** und müssen vor dem Start juristisch geprüft werden.
