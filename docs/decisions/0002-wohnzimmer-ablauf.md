# 0002 – Wohnzimmer-Ablauf, Marke DesignBySari, Vorbereitung KI und Supabase

Datum: 2026-11-08 · Status: angenommen

## Entscheidungen

- **Marke:** DesignBySari ersetzt ROOMORA. Claim „Dein Zuhause. Dein Budget. Dein Design.“ Die bisherigen Markenfarben bleiben, bis neue festgelegt werden.
- **Nur Wohnzimmer:** Der Schritt „Raumtyp“ entfällt. `roomType` ist im Schema fest `"wohnzimmer"`, damit weitere Räume später ohne Umbau ergänzt werden können.
- **Stile:** Boho entfällt, Landhaus kommt hinzu, „Luxus“ heißt jetzt „Luxuriös“ (`luxurioes`).
- **Möbel:** Statt getrennter Listen „Möbelwünsche“ und „Raumelemente“ gibt es eine Liste mit drei Zuständen je Möbelstück (Nicht vorhanden, Behalten, Ersetzen). So kann ein Möbelstück nie gleichzeitig behalten und ersetzt werden. Das Schema prüft es trotzdem zusätzlich.
- **Raum und Oberflächen** aus Phase 1 bleiben erhalten (Bodenbelag, Wandfarbe, Decke, Einbauten, Heizkörper), jetzt mit drei Zuständen: Egal, Behalten, Darf sich ändern.
- **Anzahl Designvarianten** (1 bis 4) aus Phase 1 bleibt erhalten und steht im Schritt „Raum“. Keine bestehende Funktion wurde entfernt; einzige bewusste Ausnahme ist die Raumtyp-Auswahl, weil der Start ausschließlich Wohnzimmer umfasst.
- **Icon:** `src/app/icon.svg` zeigt die Marke im Browser-Tab. Die alte Standard-Datei `src/app/favicon.ico` (Next.js-Logo) bleibt auf Wunsch liegen. Next.js liefert beide Icons aus; Browser ohne SVG-Unterstützung für Icons (z. B. Safari) und Lesezeichen/Suchmaschinen über `/favicon.ico` zeigen weiterhin das alte Logo. Am 2026-11-08 wurde mit Freigabe der Inhalt von `favicon.ico` durch eine DesignBySari-Version (16, 32, 48 px) ersetzt; Dateiname und Ort sind gleich geblieben.
- **Vorschau ehrlich kennzeichnen:** Solange die KI nicht eingerichtet ist, sprechen Texte und Buttons von „planen“ statt „gestalten“, KI-Schritte und Designpakete sind als „In Vorbereitung“ bzw. „Geplant“ markiert.
- **Kein Absenden:** Ohne Datenbank und KI gibt es nichts, wohin das Projekt geschickt werden könnte. Die Zusammenfassung sagt das offen, statt eine Verarbeitung vorzutäuschen.

## Ergänzt am 2026-11-08 (Ausbau)

- Raummerkmale und besondere Anforderungen im Schritt „Raum“ (optional, Mehrfachauswahl, Widersprüche wie „Niedrige“ und „Hohe Decke“ werden erklärt).
- Ergebnisansicht in der Zusammenfassung statt eines sechsten Schritts, damit der Ablauf kurz bleibt.
- Die KI ist in drei getrennte Schritte geteilt (Analyse, Planung, Bilder), damit Bild-KI und Sprachmodell unabhängig gewählt werden können. Details: [architektur.md](../architektur.md).

## Vorbereitet, nicht aktiv

- `src/modules/ai/`: Schnittstelle `ImageGenerationProvider`, Auswahl über `AI_PROVIDER`. Kein Anbieter eingetragen, kein Schein-Anbieter.
- `src/modules/projects/types.ts`: Datenmodell `LivingRoomProject` und Schnittstelle `ProjectRepository`.
- `supabase/migrations/20261108000000_living_room_projects.sql`: Tabelle mit Row Level Security (nur eigene Projekte), privater Bucket `room-photos` (10 MB, JPG/PNG/WebP), Ablage pro Nutzer-ID. Nicht ausgeführt.

## Nächster Schritt

Supabase-Projekt (Region Frankfurt) anlegen, `@supabase/supabase-js` und `@supabase/ssr` installieren (Freigabe nötig), Migration anwenden, Gastzugang per anonymer Anmeldung, Foto-Upload serverseitig prüfen und privat speichern.
