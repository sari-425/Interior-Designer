# Funktionsübersicht

Stand: 2026-11-08. „Fertig“ heißt: umgesetzt und mit Tests geprüft. „Vorbereitet“ heißt: Architektur und Regeln stehen, die Funktion ist aber ohne externen Dienst nicht nutzbar.

| Funktion | Stand |
| --- | --- |
| Startseite, Stile, Preise, Navigation, Footer, 404 | fertig |
| Kennzeichnung als Vorschauversion | fertig |
| Foto hochladen mit Prüfung (Typ, Inhalt, Größe, Maße) und Vorschau | fertig |
| Foto im Browser verkleinern (max. 2048 px, max. 4 MB) und Metadaten (EXIF, Standort) entfernen | fertig |
| Raumgröße und Raummerkmale | fertig |
| Einrichtungsstil (8 Stile) | fertig |
| Farben und Atmosphäre | fertig |
| Budget in Euro (Vorschläge oder eigener Betrag) | fertig |
| Besondere Anforderungen und freie Wünsche | fertig |
| Möbel behalten oder ersetzen | fertig |
| Boden, Wände, Decke, Einbauten, Heizkörper | fertig |
| Anzahl Designvarianten (1–4) | fertig |
| Zusammenfassung mit „Ändern“ für jeden Schritt, Eingaben bleiben erhalten | fertig |
| Ergebnisansicht | fertig für beide Zustände: ohne KI ehrliche Erklärung, mit KI Anzeige der gekennzeichneten Ergebnisse |
| Server-Schnittstelle `POST /api/designs` mit Prüfung, Limits, Kostenkontrolle | fertig, antwortet ohne Anbieter oder ohne verlässlichen Zähler mit 503 |
| Prüfung aller KI-Antworten (Schema, Anzahl Varianten, Budgetaufteilung innerhalb des Budgets) | fertig, mit Test-Doubles geprüft |
| Gemeinsamer, dauerhafter Nutzungszähler | Schnittstelle und Datenbank-Entwurf fertig, kein Zähler eingetragen; KI bleibt bis dahin aus |
| KI-Bildanalyse, Designplanung, Bildgenerierung | vorbereitet, kein Anbieter |
| Echte Produkte und Einkaufsliste | vorbereitet (inkl. Versand, Lieferzeit, Verfügbarkeit, EAN/GTIN), keine Produktquelle; in keinem Paket enthalten |
| Budgetplaner | geplant, nicht umgesetzt; in keinem Paket enthalten |
| Pakete Vorschau (kostenlos), Basis (9,90 €), Plus (19,90 €) | Vorschau nutzbar; Basis und Plus vorläufig, in Vorbereitung, nicht buchbar |
| Registrierung, Anmeldung, Profile | vorbereitet (Prüfregeln, Schnittstellen, Datenbank-Entwurf) |
| Projekte speichern, verwalten, löschen | vorbereitet (Schnittstelle, Referenz-Umsetzung, Datenbank-Entwurf) |
| Bezahlung (Stripe) | vorbereitet, aus |
| SEO (Titel, Beschreibungen, Sitemap, robots, Vorschaubild) | fertig; Indexierung bis zum Start gesperrt |
| Sicherheits-Header | fertig |
