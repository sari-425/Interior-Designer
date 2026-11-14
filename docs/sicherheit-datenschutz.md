# Sicherheit und Datenschutz

Stand: 2026-11-08. Keine Rechtsberatung; die Rechtstexte müssen juristisch geprüft werden.

## Umgesetzt

- **Fotos bleiben im Browser**, solange keine KI eingerichtet ist. Die Ergebnisansicht sendet in diesem Zustand nichts (per Browser-Test geprüft).
- **Bildprüfung im Browser und auf dem Server:** erlaubter Typ, echter Dateiinhalt (Signatur), Größe bis 10 MB, Maße aus den Bilddaten gelesen (640 × 480 bis 12.000 Pixel).
- **Eingabeprüfung:** Ein Zod-Schema für Browser und Server; unbekannte Werte, Dubletten und Widersprüche werden abgelehnt.
- **Schlüssel nur serverseitig:** keine Schlüssel im Code oder Repository; KI-, Supabase-Service- und Stripe-Secrets haben kein `NEXT_PUBLIC_`; Server-Routen importieren `server-only`.
- **Freitext an Sprachmodelle** wird von Steuerzeichen bereinigt, gekürzt und als Zitat markiert (Schutz vor Prompt-Injection, nicht vollständig).
- **Kostenkontrolle:** Kosten werden vor jedem Aufruf geschätzt; Höchstbetrag pro Anfrage, Tagesbudget, Tageslimit und Anfragen pro Stunde; ungültige Einstellungen fallen auf sichere Werte zurück.
- **Fehler:** Browser erhält nur verständliche Meldungen, technische Details nur das Server-Log.
- **Zahlungen:** standardmäßig aus, Live-Schlüssel nur mit zusätzlicher Freigabe, Preise nur vom Server, Webhook-Signaturprüfung mit Zeittoleranz.
- **Daten anderer:** Projekte und Profile per Row Level Security (Entwurf); in der Referenz-Umsetzung wirken fremde Projekte wie nicht vorhanden. Löschen von Projekt und Konto ist Teil der Schnittstellen (DSGVO Art. 17).
- **HTTP-Header:** Einbetten in fremde Seiten verboten, `nosniff`, `Referrer-Policy`, `Permissions-Policy` (Kamera, Mikrofon, Standort aus), HSTS, kein `X-Powered-By`.
- **Keine Drittanbieter-Anfragen beim Seitenaufruf:** Schriften lokal, keine Tracker, keine Cookies.
- **Suchmaschinen:** Vorschau ist bis zum Start nicht indexierbar.

## Vor dem Start nötig

- Auftragsverarbeitungsverträge mit KI-Anbieter, Supabase, Hosting, Stripe; Prüfung von Datenübermittlungen außerhalb der EU.
- Datenschutzerklärung um KI-Verarbeitung, Speicherdauer der Fotos und Löschwege ergänzen.
- Speicherfristen für Fotos und Ergebnisse festlegen und automatisch löschen.
- Vollständige Content-Security-Policy mit Nonces, sobald externe Dienste feststehen.
- Gemeinsamer Zähler für Limits und Schutz vor automatisierten Anfragen (z. B. Captcha) vor Freischaltung der KI.
