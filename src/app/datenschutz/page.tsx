import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { Angabe, Angaben } from "@/components/legal/Angabe";
import { AUFSICHTSBEHOERDE, BETREIBER, DIENSTE, LEGAL_STAND, SPEICHERFRISTEN } from "@/content/legal/angaben";

export const metadata: Metadata = { title: "Datenschutz", robots: { index: false } };

export default function PrivacyPage() {
  const { hosting, ki, datenbank, zahlung } = DIENSTE;
  return (
    <LegalPage title="Datenschutzerklärung">
      <p>
        Hier erklären wir dir in verständlicher Sprache, welche personenbezogenen Daten DesignBySari verarbeitet, wozu
        und auf welcher Rechtsgrundlage. Rechtsgrundlagen nennen wir nach der Datenschutz-Grundverordnung (DSGVO).
      </p>

      <h2>1. Verantwortlicher</h2>
      <p>
        <Angaben lines={[BETREIBER.name, BETREIBER.strasse, BETREIBER.plzOrt, BETREIBER.land]} />
        <br />
        E-Mail: <Angabe value={BETREIBER.email} />
        <br />
        Telefon: <Angabe value={BETREIBER.telefon} />
      </p>
      <p>
        Wir sind nicht verpflichtet, einen Datenschutzbeauftragten zu benennen. Für alle Fragen zum Datenschutz
        erreichst du uns unter der oben genannten E-Mail-Adresse.
      </p>

      <h2>2. Was heute passiert: die Vorschauversion</h2>
      <p>
        DesignBySari befindet sich in einer Vorschauversion. Solange das so ist, gilt Folgendes:
      </p>
      <ul>
        <li>
          Hochgeladene Fotos werden <strong>ausschließlich lokal in deinem Browser</strong> angezeigt und dort
          verkleinert. Sie werden nicht an uns oder Dritte übertragen und nicht gespeichert. Nach dem Neuladen der Seite
          sind sie weg.
        </li>
        <li>Es gibt noch keine Kundenkonten, keine KI-Verarbeitung und keine Zahlungen.</li>
        <li>Wir setzen keine Cookies und verwenden keine Analyse- oder Werbedienste.</li>
        <li>Schriftarten werden von unserem eigenen Server geladen, nicht von Google oder anderen Anbietern.</li>
      </ul>
      <p>
        Die Abschnitte 5 bis 8 beschreiben Funktionen, die erst mit dem offiziellen Start aktiviert werden. Wir
        aktualisieren diese Erklärung, bevor sich etwas ändert.
      </p>

      <h2>3. Hosting und Server-Logdateien</h2>
      <p>
        Unsere Website wird bei <Angabe value={hosting.name} />, <Angabe value={hosting.anschrift} /> („Vercel“)
        gehostet. Beim Aufruf jeder Seite verarbeitet Vercel automatisch technische Daten, die dein Browser übermittelt:
      </p>
      <ul>
        <li>IP-Adresse</li>
        <li>Datum und Uhrzeit des Aufrufs</li>
        <li>aufgerufene Seite und übertragene Datenmenge</li>
        <li>Browsertyp, Betriebssystem und die zuvor besuchte Seite (Referrer), soweit übermittelt</li>
      </ul>
      <p>
        Das ist nötig, um die Website auszuliefern, sie stabil und sicher zu betreiben und Angriffe abzuwehren.
        Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und funktionierenden Angebot (Art. 6 Abs. 1
        lit. f DSGVO). Die Logdateien werden nach <Angabe value={SPEICHERFRISTEN.logdateien} /> gelöscht.
      </p>
      <p>
        Vercel kann Daten auch in den USA verarbeiten. Grundlage dafür ist:{" "}
        <Angabe value={hosting.drittlandGrundlage} />. Wir haben mit Vercel einen Vertrag zur Auftragsverarbeitung
        (Art. 28 DSGVO) geschlossen. Mehr unter{" "}
        <a href={hosting.datenschutz} rel="noopener noreferrer" target="_blank">
          vercel.com/legal/privacy-policy
        </a>
        .
      </p>

      <h2>4. Kontakt per E-Mail</h2>
      <p>
        Wenn du uns schreibst, verarbeiten wir deine E-Mail-Adresse, deinen Namen (falls angegeben) und den Inhalt
        deiner Nachricht, um dein Anliegen zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, wenn es um
        einen Vertrag mit dir geht, sonst unser berechtigtes Interesse an der Beantwortung (Art. 6 Abs. 1 lit. f
        DSGVO). Wir löschen die Nachrichten, wenn das Anliegen erledigt ist, sofern keine gesetzlichen
        Aufbewahrungspflichten bestehen.
      </p>

      <h2>5. Raumfotos und KI-Gestaltung (ab dem Start)</h2>
      <p>
        Für einen Gestaltungsvorschlag lädst du ein Foto deines Wohnzimmers hoch und machst Angaben zu Stil, Farben,
        Budget und gewünschten Möbeln. Wir verarbeiten diese Daten, um daraus KI-Designvarianten und passende
        Möbelvorschläge zu erstellen. Rechtsgrundlage ist die Durchführung des Vertrags mit dir (Art. 6 Abs. 1 lit. b
        DSGVO); bei der kostenlosen Vorschau ist es die von dir gewünschte Nutzung unseres Angebots (ebenfalls Art. 6
        Abs. 1 lit. b DSGVO).
      </p>
      <h3>Was wir zum Schutz deiner Fotos tun</h3>
      <ul>
        <li>
          Das Foto wird schon in deinem Browser verkleinert. Dabei werden Metadaten wie Kameramodell und GPS-Standort
          entfernt.
        </li>
        <li>Fotos werden nur für deinen Gestaltungsauftrag verwendet und nicht verkauft oder veröffentlicht.</li>
        <li>
          Wir nutzen deine Fotos nicht, um eigene KI-Modelle zu trainieren, und haben vertraglich vereinbart, dass
          auch der KI-Anbieter das nicht tut. <Angabe value="[Vor dem Start im Vertrag mit dem KI-Anbieter prüfen]" />
        </li>
        <li>Nur du kannst deine Projekte sehen. Du kannst sie jederzeit selbst löschen.</li>
      </ul>
      <p>
        <strong>Bitte achte darauf, dass auf dem Foto keine Personen, Ausweise, Briefe oder andere persönliche
        Unterlagen zu sehen sind.</strong> Für die Gestaltung brauchen wir nur den Raum.
      </p>
      <h3>Eingesetzter KI-Anbieter</h3>
      <p>
        Zur Erzeugung der Designvarianten übermitteln wir das verkleinerte Foto und deine Gestaltungswünsche an{" "}
        <Angabe value={ki.name} />, <Angabe value={ki.anschrift} />. Die Verarbeitung erfolgt in:{" "}
        <Angabe value={ki.serverstandort} />. Der Anbieter verarbeitet die Daten in unserem Auftrag auf Grundlage
        eines Vertrags zur Auftragsverarbeitung (Art. 28 DSGVO).
        {ki.drittlandGrundlage.trim() !== "" && (
          <>
            {" "}
            Für die Übermittlung in ein Land außerhalb der EU stützen wir uns auf:{" "}
            <Angabe value={ki.drittlandGrundlage} />.
          </>
        )}{" "}
        Datenschutzhinweise des Anbieters: <Angabe value={ki.datenschutz} />
      </p>
      <h3>Wie lange wir Fotos speichern</h3>
      <ul>
        <li>
          Ohne Kundenkonto: Foto und Ergebnisse werden nach <Angabe value={SPEICHERFRISTEN.fotosOhneKonto} />{" "}
          automatisch gelöscht.
        </li>
        <li>
          Mit Kundenkonto: so lange, wie das Projekt in deinem Konto besteht, längstens{" "}
          <Angabe value={SPEICHERFRISTEN.projekteMitKonto} />. Löschst du ein Projekt oder dein Konto, werden Fotos
          und Ergebnisse endgültig entfernt.
        </li>
      </ul>
      <h3>Keine automatisierten Entscheidungen</h3>
      <p>
        Die KI erstellt Gestaltungsvorschläge. Sie trifft keine Entscheidungen, die dir gegenüber rechtliche Wirkung
        entfalten oder dich ähnlich erheblich beeinträchtigen (Art. 22 DSGVO).
      </p>

      <h2>6. Kundenkonto (ab dem Start)</h2>
      <p>
        Für bezahlte Pakete kannst du ein Kundenkonto anlegen. Dafür verarbeiten wir deine E-Mail-Adresse, ein
        Passwort (nur verschlüsselt gespeichert), deine Projekte und deine Bestellungen. Rechtsgrundlage ist Art. 6
        Abs. 1 lit. b DSGVO. Konten und Projekte speichern wir bei <Angabe value={datenbank.name} />, Serverstandort{" "}
        <Angabe value={datenbank.serverstandort} />, auf Grundlage eines Vertrags zur Auftragsverarbeitung. Du kannst
        dein Konto jederzeit löschen.
      </p>
      <p>
        Werbe-E-Mails senden wir nur, wenn du ausdrücklich eingewilligt hast (Art. 6 Abs. 1 lit. a DSGVO). Du kannst die
        Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, z. B. über den Abmeldelink in jeder E-Mail.
      </p>

      <h2>7. Bezahlung (ab dem Start)</h2>
      <p>
        Bezahlte Pakete wickeln wir über <Angabe value={zahlung.name} />, <Angabe value={zahlung.anschrift} /> ab.
        Deine Zahlungsdaten (z. B. Kartennummer) gibst du direkt beim Zahlungsdienst ein; wir erhalten sie nicht. Wir
        erhalten nur die Information, ob und wann die Zahlung erfolgreich war, sowie Name, E-Mail-Adresse und
        Rechnungsangaben. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO; für Rechnungen und Buchungsbelege gelten
        gesetzliche Aufbewahrungspflichten (Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit § 147 Abgabenordnung und §
        257 Handelsgesetzbuch, in der Regel acht bis zehn Jahre). Datenschutzhinweise des Zahlungsdienstes:{" "}
        <Angabe value={zahlung.datenschutz} />
      </p>

      <h2>8. Produktvorschläge und Partnerlinks (ab dem Start)</h2>
      <p>
        Zu jedem Design zeigen wir ähnliche Produkte von Händlern. Einige Links sind gekennzeichnete Partnerlinks.
        Klickst du darauf, wirst du zur Website des Händlers weitergeleitet; ab dann gilt dessen Datenschutzerklärung.
        Der Händler oder das Partnernetzwerk kann dabei erfassen, dass du von DesignBySari kommst, um eine Provision
        abzurechnen. <Angabe value="[Beteiligte Partnernetzwerke und ob dafür Cookies gesetzt werden, vor dem Start ergänzen]" />{" "}
        Mehr dazu auf der Seite <Link href="/transparenz">KI und Partnerlinks</Link>.
      </p>

      <h2>9. Speicherung im Browser</h2>
      <p>
        Wir speichern nur Informationen in deinem Browser, die für die von dir gewünschte Funktion unbedingt nötig sind
        (z. B. deine Anmeldung, sobald es Kundenkonten gibt). Dafür brauchen wir nach § 25 Abs. 2 Telekommunikation-
        Digitale-Dienste-Datenschutz-Gesetz (TDDDG) keine Einwilligung. Sollten wir später andere Cookies oder
        Analysewerkzeuge einsetzen, fragen wir vorher nach deiner Einwilligung.
      </p>

      <h2>10. Empfänger deiner Daten</h2>
      <p>
        Wir geben deine Daten nur an die oben genannten Dienstleister weiter, soweit das für den jeweiligen Zweck nötig
        ist, oder wenn wir gesetzlich dazu verpflichtet sind. Wir verkaufen keine personenbezogenen Daten.
      </p>

      <h2>11. Deine Rechte</h2>
      <p>Du hast gegenüber uns jederzeit das Recht auf:</p>
      <ul>
        <li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
        <li>Löschung (Art. 17 DSGVO)</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
      </ul>
      <p>
        <strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Verarbeiten wir deine Daten auf Grundlage unseres
        berechtigten Interesses, kannst du aus Gründen, die sich aus deiner besonderen Situation ergeben, jederzeit
        widersprechen. Gegen Werbung kannst du jederzeit ohne Angabe von Gründen widersprechen.
      </p>
      <p>
        Schreib uns dafür einfach an <Angabe value={BETREIBER.email} />.
      </p>
      <p>
        Du hast außerdem das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO), z. B.
        bei der für uns zuständigen Behörde: <Angabe value={AUFSICHTSBEHOERDE} />
      </p>

      <h2>12. Pflicht zur Bereitstellung</h2>
      <p>
        Du bist nicht verpflichtet, uns Daten zu geben. Ohne Foto und Gestaltungswünsche können wir jedoch keinen
        Designvorschlag erstellen, und ohne Zahlungs- und Rechnungsangaben kein bezahltes Paket liefern.
      </p>

      <h2>13. Änderungen</h2>
      <p>
        Wir passen diese Datenschutzerklärung an, wenn sich unser Angebot oder die Rechtslage ändert. Es gilt die hier
        veröffentlichte Fassung.
      </p>

      <p className="text-sm text-charcoal/70">
        Stand: <Angabe value={LEGAL_STAND} />
      </p>
    </LegalPage>
  );
}
