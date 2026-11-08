# Tests

Alle Prüfungen lokal:

```bash
npm run check          # ESLint, TypeScript, Unit-Tests
npm run build          # Produktions-Build
npm run test:e2e       # Browser-Tests (Desktop Chrome und Pixel 7), baut vorher
```

In dieser Cloud-Umgebung mit vorinstalliertem Chromium:
`PLAYWRIGHT_CHROMIUM_PATH=/opt/pw-browsers/chromium npx playwright test --trace off`

## Unit-Tests (`tests/unit/`, Vitest)

| Datei | Prüft |
| --- | --- |
| `design-request.test.ts` | Budget- und Größeneingaben, Schema inkl. Raummerkmale, Anforderungen, Oberflächen, Varianten, Pakete, Stile |
| `image-upload.test.ts` | Formaterkennung, Größen, Maße, Maße aus PNG/JPEG/WebP-Daten |
| `ai-registry.test.ts` | Anbieter-Verzeichnis je Schritt, Pflicht-Schlüssel, Limits aus Umgebungsvariablen |
| `ai-pipeline.test.ts` | Gestaltungsvorgabe, Ablauf, Kostenschätzung, Stunden-/Tageslimits, Budget, Zeitlimit, Fehlerumwandlung |
| `handle-design-request.test.ts` | Server-Verarbeitung: 503 ohne KI, Eingaben- und Fotoprüfung, 413, 429, keine technischen Details |
| `products.test.ts` | Produktdaten, „genau“ vs. „ähnlich“, Partnerlinks, Preisstand, Suche und Verwerfen fehlerhafter Daten |
| `accounts-projects.test.ts` | Registrierung, Anmeldung, Profil, Besitzschutz, Statuswechsel, Löschen von Projekten |
| `payments-site.test.ts` | Zahlungs-Freigaben, Checkout-Preis vom Server, Webhook-Signaturen, Website-URL und Indexierung |

KI-Anbieter in Tests sind Test-Doubles (`tests/unit/ai-fakes.ts`). Sie sind nur in Tests vorhanden und in der App nicht eingetragen.

## Browser-Tests (`tests/e2e/`, Playwright)

| Datei | Prüft |
| --- | --- |
| `design-flow.spec.ts` | kompletter Ablauf, Fehlermeldungen bei falschen Dateien, Raumangaben-Prüfung, widersprüchliche Merkmale, Zurück-Navigation, Korrektur aus der Zusammenfassung, Ergebnisansicht ohne Übertragung |
| `landing.spec.ts` | Startseite, Seiten erreichbar, Navigation, keine horizontale Scrollleiste, Vorschau-Kennzeichnung |
| `platform.spec.ts` | Sicherheits-Header, `/api/designs` antwortet 503, Webhook aus, robots, Sitemap, Vorschaubild |
