# Funktionsübersicht

Stand: 2026-11-08. „Fertig“ heißt: umgesetzt und mit Tests geprüft. „Vorbereitet“ heißt: Architektur und Regeln stehen, die Funktion ist aber ohne externen Dienst nicht nutzbar.

| Funktion | Stand |
| --- | --- |
| Startseite, Stile, Preise, Navigation, Footer, 404 | fertig |
| Kennzeichnung als Vorschauversion | fertig |
| Foto hochladen mit Prüfung (Typ, Inhalt, Größe, Maße) und Vorschau | fertig |
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
| Server-Schnittstelle `POST /api/designs` mit Prüfung, Limits, Kostenkontrolle | fertig, antwortet ohne Anbieter mit 503 |
| KI-Bildanalyse, Designplanung, Bildgenerierung | vorbereitet, kein Anbieter |
| Echte Produkte und Einkaufsliste | vorbereitet, keine Produktquelle |
| Registrierung, Anmeldung, Profile | vorbereitet (Prüfregeln, Schnittstellen, Datenbank-Entwurf) |
| Projekte speichern, verwalten, löschen | vorbereitet (Schnittstelle, Referenz-Umsetzung, Datenbank-Entwurf) |
| Bezahlung (Stripe) | vorbereitet, aus |
| SEO (Titel, Beschreibungen, Sitemap, robots, Vorschaubild) | fertig; Indexierung bis zum Start gesperrt |
| Sicherheits-Header | fertig |
