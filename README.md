# DesignBySari

**Dein Zuhause. Dein Budget. Dein Design.**

DesignBySari ist eine deutschsprachige KI-Interior-Design-Plattform für Privatpersonen und Familien in Deutschland. Wir starten ausschließlich mit **Wohnzimmern** als responsive Webanwendung (keine native App). Nutzerinnen und Nutzer laden ein Foto ihres Wohnzimmers hoch, wählen Stil, Farben, Atmosphäre und Budget, markieren, welche Möbel bleiben oder ersetzt werden, und erhalten später eine KI-gestützte Neugestaltung mit echten, erhältlichen Produkten.

## Projektstand

| Phase | Inhalt | Status |
| --- | --- | --- |
| 0 | Analyse und Umsetzungsplan | abgeschlossen |
| 1 | Frontend: Landingpage, Navigation, Stile, Preise, Gestaltungs-Ablauf | fertig (PR #1) |
| 1b | Wohnzimmer-Projektablauf, Marke DesignBySari, Vorbereitung KI-Anbieter und Supabase | **in Arbeit** |
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
├─ app/                  Seiten (Next.js App Router)
│  ├─ page.tsx           Landingpage
│  ├─ gestalten/         Wohnzimmer-Projekt in 5 Schritten
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
│  ├─ rooms/             Raumtypen (derzeit nur Wohnzimmer)
│  ├─ design-request/    Optionen und Zod-Schema der Wohnzimmer-Anfrage
│  ├─ pricing/           Vorläufige Designpakete
│  ├─ ai/                Schnittstelle für austauschbare KI-Bildanbieter (noch kein Anbieter aktiv)
│  └─ projects/          Datenmodell und Speicher-Schnittstelle für Projekte
└─ lib/validation/       Bildprüfung (Typ, Inhalt, Größe, Maße)
supabase/migrations/     Datenbankschema mit Zugriffsschutz (Entwurf, noch nicht ausgeführt)
tests/
├─ unit/                 Vitest
└─ e2e/                  Playwright
```

## Der Wohnzimmer-Ablauf

1. **Foto:** JPG, JPEG, PNG oder WebP, höchstens 10 MB, mindestens 640 × 480 Pixel. Geprüft werden Dateityp, echter Dateiinhalt und Bildmaße. Das Foto bleibt derzeit im Browser.
2. **Stil:** Modern, Skandinavisch, Minimalistisch, Industrial, Japandi, Klassisch, Landhaus, Luxuriös.
3. **Raum:** Raumgröße (optional), Farben, Atmosphäre, maximales Budget, sonstige Wünsche.
4. **Möbel:** Für jedes Möbelstück „Nicht vorhanden“, „Behalten“ oder „Ersetzen“.
5. **Zusammenfassung:** Alle Angaben mit „Ändern“-Sprüngen. Es wird noch nichts abgeschickt.

## KI-Anbieter und Supabase (vorbereitet, nicht aktiv)

- `src/modules/ai/image-provider.ts` beschreibt, was jeder KI-Anbieter können muss. `registry.ts` wählt den Anbieter über `AI_PROVIDER`. Derzeit ist bewusst **kein** Anbieter eingetragen und es gibt keinen Schein-Anbieter.
- `supabase/migrations/…_living_room_projects.sql` enthält Tabelle, Row Level Security und einen privaten Foto-Speicher. Jede Person sieht nur ihre eigenen Projekte. Die Datei wird erst ausgeführt, wenn ein Supabase-Projekt eingerichtet und freigegeben ist.

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
