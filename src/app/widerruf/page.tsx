import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { Angabe, Angaben } from "@/components/legal/Angabe";
import { BETREIBER, LEGAL_STAND } from "@/content/legal/angaben";

export const metadata: Metadata = { title: "Widerrufsbelehrung", robots: { index: false } };

export default function WithdrawalPage() {
  return (
    <LegalPage title="Widerrufsbelehrung">
      <p>
        Diese Belehrung gilt für Verbraucherinnen und Verbraucher, die ein bezahltes Paket (Basis oder Plus) bei
        DesignBySari kaufen. Die kostenlose Vorschau ist kein kostenpflichtiger Vertrag.
      </p>

      <h2>Widerrufsrecht</h2>
      <p>
        Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die
        Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
      </p>
      <p>Um dein Widerrufsrecht auszuüben, musst du uns</p>
      <p>
        <Angaben lines={[BETREIBER.name, BETREIBER.strasse, BETREIBER.plzOrt]} />
        <br />
        E-Mail: <Angabe value={BETREIBER.email} />
        <br />
        Telefon: <Angabe value={BETREIBER.telefon} />
      </p>
      <p>
        mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über deinen
        Entschluss, diesen Vertrag zu widerrufen, informieren. Du kannst dafür das unten stehende
        Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.{" "}
        <Angabe value="[Vor dem Start ergänzen: Hinweis auf die Widerrufsfunktion („Vertrag widerrufen“-Schaltfläche) auf der Website, die seit 19. Juni 2026 Pflicht ist – Wortlaut anwaltlich prüfen lassen]" />
      </p>
      <p>
        Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die Ausübung des Widerrufsrechts vor
        Ablauf der Widerrufsfrist absendest.
      </p>

      <h2>Folgen des Widerrufs</h2>
      <p>
        Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich
        und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf
        dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du
        bei der ursprünglichen Transaktion eingesetzt hast, es sei denn, mit dir wurde ausdrücklich etwas anderes
        vereinbart; in keinem Fall werden dir wegen dieser Rückzahlung Entgelte berechnet.
      </p>

      <h2>Vorzeitiges Erlöschen des Widerrufsrechts</h2>
      <p>
        Dein Widerrufsrecht erlischt bei einem Vertrag über die Bereitstellung von nicht auf einem körperlichen
        Datenträger befindlichen digitalen Inhalten (hier: die KI-Designvarianten), wenn wir mit der Ausführung des
        Vertrags begonnen haben, nachdem du
      </p>
      <ol>
        <li>ausdrücklich zugestimmt hast, dass wir vor Ablauf der Widerrufsfrist mit der Ausführung beginnen,</li>
        <li>deine Kenntnis davon bestätigt hast, dass du durch deine Zustimmung mit Beginn der Ausführung dein
          Widerrufsrecht verlierst, und</li>
        <li>wir dir eine Bestätigung des Vertrags (mit dieser Zustimmung und Kenntnisnahme) auf einem dauerhaften
          Datenträger, z. B. per E-Mail, zur Verfügung gestellt haben.</li>
      </ol>
      <p>
        Praktisch bedeutet das: Wenn du beim Kauf bestätigst, dass die Designs sofort erstellt werden sollen, und die
        Erstellung beginnt, kannst du den Kauf nicht mehr widerrufen. Deine gesetzlichen Rechte bei Mängeln bleiben
        davon unberührt.
      </p>

      <h2>Muster-Widerrufsformular</h2>
      <p>
        (Wenn du den Vertrag widerrufen willst, dann fülle bitte dieses Formular aus und sende es zurück.)
      </p>
      <div className="rounded-2xl border border-taupe/40 p-5">
        <p>
          An: <Angaben lines={[BETREIBER.name, BETREIBER.strasse, BETREIBER.plzOrt]} />, E-Mail:{" "}
          <Angabe value={BETREIBER.email} />
        </p>
        <p className="mt-4">
          Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden
          Waren (*)/die Erbringung der folgenden Dienstleistung (*)/die Bereitstellung der folgenden digitalen Inhalte
          (*)
        </p>
        <ul className="mt-4">
          <li>Bestellt am (*)/erhalten am (*)</li>
          <li>Name des/der Verbraucher(s)</li>
          <li>Anschrift des/der Verbraucher(s)</li>
          <li>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</li>
          <li>Datum</li>
        </ul>
        <p className="mt-4">(*) Unzutreffendes streichen.</p>
      </div>

      <p className="text-sm text-charcoal/70">
        Stand: <Angabe value={LEGAL_STAND} />
      </p>
    </LegalPage>
  );
}
