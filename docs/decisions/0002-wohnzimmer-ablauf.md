# 0002 – Wohnzimmer-Ablauf, Marke DesignBySari, Vorbereitung KI und Supabase

Datum: 2026-11-08 · Status: angenommen

## Entscheidungen

- **Marke:** DesignBySari ersetzt ROOMORA. Claim „Dein Zuhause. Dein Budget. Dein Design.“ Die bisherigen Markenfarben bleiben, bis neue festgelegt werden.
- **Nur Wohnzimmer:** Der Schritt „Raumtyp“ entfällt. `roomType` ist im Schema fest `"wohnzimmer"`, damit weitere Räume später ohne Umbau ergänzt werden können.
- **Stile:** Boho entfällt, Landhaus kommt hinzu, „Luxus“ heißt jetzt „Luxuriös“ (`luxurioes`).
- **Möbel:** Statt getrennter Listen „Möbelwünsche“ und „Raumelemente“ gibt es eine Liste mit drei Zuständen je Möbelstück (Nicht vorhanden, Behalten, Ersetzen). So kann ein Möbelstück nie gleichzeitig behalten und ersetzt werden. Das Schema prüft es trotzdem zusätzlich.
- **Raum und Oberflächen** aus Phase 1 bleiben erhalten (Bodenbelag, Wandfarbe, Decke, Einbauten, Heizkörper), jetzt mit drei Zuständen: Egal, Behalten, Darf sich ändern.
- **Anzahl Designvarianten** (1 bis 4) aus Phase 1 bleibt erhalten und steht im Schritt „Raum“. Keine bestehende Funktion wurde entfernt; einzige bewusste Ausnahme ist die Raumtyp-Auswahl, weil der Start ausschließlich Wohnzimmer umfasst.
- **Icon:** `src/app/icon.svg` zeigt die Marke im Browser-Tab. Die alte Standard-Datei `favicon.ico` von Next.js bleibt vorerst liegen, weil Dateien nur nach Freigabe gelöscht werden.
- **Kein Absenden:** Ohne Datenbank und KI gibt es nichts, wohin das Projekt geschickt werden könnte. Die Zusammenfassung sagt das offen, statt eine Verarbeitung vorzutäuschen.

## Vorbereitet, nicht aktiv

- `src/modules/ai/`: Schnittstelle `ImageGenerationProvider`, Auswahl über `AI_PROVIDER`. Kein Anbieter eingetragen, kein Schein-Anbieter.
- `src/modules/projects/types.ts`: Datenmodell `LivingRoomProject` und Schnittstelle `ProjectRepository`.
- `supabase/migrations/20261108000000_living_room_projects.sql`: Tabelle mit Row Level Security (nur eigene Projekte), privater Bucket `room-photos` (10 MB, JPG/PNG/WebP), Ablage pro Nutzer-ID. Nicht ausgeführt.

## Nächster Schritt

Supabase-Projekt (Region Frankfurt) anlegen, `@supabase/supabase-js` und `@supabase/ssr` installieren (Freigabe nötig), Migration anwenden, Gastzugang per anonymer Anmeldung, Foto-Upload serverseitig prüfen und privat speichern.
