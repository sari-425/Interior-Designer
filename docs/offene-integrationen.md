# Offene Integrationen und bekannte Einschränkungen

Stand: 2026-11-08

## Offene Integrationen (brauchen Freigabe, Zugang oder Vertrag)

| Integration | Was fehlt | Kosten (geprüft 2026-11-08, Angaben der Anbieter) |
| --- | --- | --- |
| KI-Bildgenerierung | Auswahl des Anbieters, API-Schlüssel, Freigabe der Kosten; Anbieter-Datei in `src/modules/ai/providers/` | z. B. FLUX.1 Kontext pro bei fal.ai 0,04 $ pro Bild |
| KI-Bildanalyse und Designplanung | Auswahl eines Vision-/Sprachmodells, Schlüssel, Freigabe | je nach Anbieter pro Aufruf |
| Supabase (Konten, Projekte, Fotos) | Projekt in Region Frankfurt, Pakete `@supabase/supabase-js` und `@supabase/ssr` (Freigabe nötig), Migrationen anwenden, Auftragsverarbeitungsvertrag | Free-Plan möglich, Pro ab 25 $/Monat |
| Produktquellen | Vertrag mit Händlern oder Affiliate-Netzwerk, zugelassene Schnittstelle | meist provisionsbasiert |
| Stripe | Konto, Testschlüssel, Paket `stripe` oder REST-Anbindung, Webhook speichern | 1,5 % + 0,25 € je EU-Kartenzahlung |
| Hosting | z. B. Vercel Pro (Hobby ist nicht kommerziell) | 20 $/Monat |
| Gemeinsamer Zähler für Limits | Datenbank-Tabelle oder Redis, sobald mehrere Server laufen | abhängig vom Dienst |

## Bekannte Einschränkungen

- Keine KI, keine Datenbank, keine Zahlungen aktiv. Die Website sagt das überall offen.
- `isAiEnabled()` wird beim Build ausgewertet: Nach Änderung der KI-Konfiguration muss neu gebaut werden.
- Die Limits der KI-Schicht zählen im Arbeitsspeicher eines Server-Prozesses. Für mehrere Instanzen ist ein gemeinsamer Speicher nötig (`UsageStore`).
- Ohne Konten ist die Begrenzung pro Person an die IP-Adresse gebunden.
- Fotos verlassen den Browser nicht; nach einem Neuladen der Seite ist der Entwurf weg.
- Rechtstexte (Impressum, Datenschutz, AGB) sind Entwürfe und müssen juristisch geprüft werden. Sie sind nicht in der Sitemap und nicht indexierbar.
- `npm audit` meldet eine mittlere Schwachstelle in `minimatch` (nur ESLint, nicht in der Website), siehe [0001-stack.md](decisions/0001-stack.md).
- Auf GitHub laufen keine automatischen Prüfungen (CI); getestet wird lokal.

## Was für einen öffentlichen Start fehlt

1. KI-Anbieter auswählen, freigeben und anbinden.
2. Supabase einrichten, Konten, Projektspeicher und Foto-Upload umsetzen.
3. Produktquelle vertraglich sichern und anbinden.
4. Stripe im Testmodus anbinden, danach Livebetrieb freigeben.
5. Rechtstexte prüfen lassen (Impressum, Datenschutz inkl. KI-Verarbeitung, AGB, Widerruf).
6. Hosting mit eigener Domain, `NEXT_PUBLIC_SITE_URL` und `SITE_INDEXABLE=true`.
7. CI auf GitHub einrichten, Monitoring und Fehlerprotokolle.
