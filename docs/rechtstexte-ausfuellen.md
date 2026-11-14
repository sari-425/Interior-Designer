# Rechtstexte ausfüllen

Stand: 2026-11-14. Keine Rechtsberatung. Alle Texte sind Entwürfe und müssen vor dem Start anwaltlich
oder von einem spezialisierten Rechtstext-Dienst geprüft werden.

## Welche Seiten es gibt

| Seite | Datei | Inhalt |
| --- | --- | --- |
| `/impressum` | `src/app/impressum/page.tsx` | Anbieterangaben nach § 5 DDG, Verantwortlicher nach § 18 MStV, Verbraucherstreitbeilegung |
| `/datenschutz` | `src/app/datenschutz/page.tsx` | DSGVO: Vorschau-Stand, Hosting (Vercel), Foto-Upload und KI, Konto, Zahlung, Partnerlinks, Rechte |
| `/agb` | `src/app/agb/page.tsx` | Leistungen der Pakete, Vertragsschluss, Preise, Nutzungsrechte, Gewährleistung, Haftung |
| `/widerruf` | `src/app/widerruf/page.tsx` | Widerrufsbelehrung für digitale Inhalte mit vorzeitigem Erlöschen, Muster-Widerrufsformular |

Die Paketnamen und Preise in den AGB kommen automatisch aus `src/modules/pricing/packages.ts`.

## Was du ausfüllen musst

Alle persönlichen Angaben stehen in **einer** Datei: `src/content/legal/angaben.ts`.

1. Datei auf GitHub öffnen und auf den Stift (Bearbeiten) klicken.
2. Jeden Text in eckigen Klammern durch deine echte Angabe ersetzen, **ohne** die Klammern.
   Beispiel: `name: "[Vor- und Nachname bzw. Firma mit Rechtsform]",` wird zu `name: "Osman Sari",`
3. Gibt es eine Angabe bei dir nicht (z. B. Registereintrag oder „Vertreten durch“), schreibst du `""`.
   Die Zeile verschwindet dann von der Website.
4. Nutzt du die Kleinunternehmerregelung, setzt du `kleinunternehmer: true`. Dann steht in den AGB,
   dass keine Umsatzsteuer berechnet wird.

Noch offene Angaben sind auf der Website **farbig markiert**. Die Funktion `offenePlatzhalter()` in
derselben Datei listet sie auf; vor dem Start muss die Liste leer sein.

### Checkliste der Angaben

- [ ] Name bzw. Firma, Anschrift (keine Postfachadresse), E-Mail, Telefon
- [ ] Handelsregister (nur bei GmbH/UG o. Ä.), Vertretungsberechtigte
- [ ] USt-IdNr. oder Wirtschafts-IdNr. (falls vorhanden), Kleinunternehmer ja/nein
- [ ] Verantwortliche Person für redaktionelle Inhalte (§ 18 MStV)
- [ ] Datenschutz-Aufsichtsbehörde deines Bundeslandes
- [ ] Vercel: Rechtsgrundlage für die USA-Übermittlung prüfen (Eintrag auf dataprivacyframework.gov) und Auftragsverarbeitungsvertrag (DPA) abschließen
- [ ] KI-Anbieter: Name, Anschrift, Serverstandort, Drittland-Grundlage, Link, Vertrag ohne Training mit Kundenfotos
- [ ] Anbieter für Konten/Fotospeicher (geplant Supabase, Region Frankfurt)
- [ ] Zahlungsdienst: Name, Anschrift, Zahlungsarten, Link
- [ ] Speicherfristen für Fotos (ohne Konto / mit Konto) und Logdateien
- [ ] Text der Kaufschaltfläche (AGB § 3) – muss eindeutig sein, z. B. „Jetzt kaufen“
- [ ] Partnernetzwerke und ob sie Cookies setzen (Datenschutz Abschnitt 8)
- [ ] Datum „Stand“

## Was vor dem Start technisch noch fehlt

- **Widerrufsfunktion (Pflicht seit 19. Juni 2026):** Online geschlossene Verträge brauchen eine gut sichtbare
  Schaltfläche, mit der man den Vertrag widerrufen kann. Sie ist noch nicht umgesetzt; die Widerrufsbelehrung
  enthält dafür einen markierten Platzhalter.
- **Zustimmung zum sofortigen Beginn:** Der Text steht in `src/content/legal/zustimmung.ts` und muss im
  Bezahlvorgang als eigene, nicht vorausgefüllte Checkbox erscheinen. Die Zustimmung muss in der
  Bestätigungs-E-Mail wiederholt werden, sonst erlischt das Widerrufsrecht nicht.
- **Bestätigungs-E-Mail** mit AGB und Widerrufsbelehrung (dauerhafter Datenträger).
- **Hosting:** Der Vercel-Hobby-Tarif ist nur für nicht kommerzielle Nutzung; für den Verkauf ist ein
  passender Tarif nötig.
- Rechtstexte erst nach Prüfung in die Sitemap aufnehmen und indexierbar machen.

## Fragen für die anwaltliche Prüfung

1. Sind die KI-Designvarianten „digitale Inhalte“ (§ 356 Abs. 5 BGB) oder eine Dienstleistung? Die Belehrung
   geht von digitalen Inhalten aus.
2. Muss ein Kauf auch ohne Zustimmung zum sofortigen Beginn möglich sein (dann Erstellung erst nach 14 Tagen)?
3. Wortlaut des Hinweises auf die neue Widerrufsfunktion und ggf. aktualisiertes Muster der Widerrufsbelehrung.
4. Nutzungsrechte an KI-Bildern (AGB § 8) und Haftungsbeschränkung (AGB § 10).
5. Pflicht zur Teilnahme an Verbraucherschlichtung (§ 36 VSBG) je nach Unternehmensgröße.
6. Kennzeichnungspflichten für KI-Inhalte nach der EU-KI-Verordnung (Art. 50).
