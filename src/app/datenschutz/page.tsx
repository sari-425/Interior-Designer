import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Datenschutz", robots: { index: false } };

export default function PrivacyPage() {
  return (
    <LegalPage title="Datenschutzerklärung">
      <h2>1. Verantwortlicher</h2>
      <p>[Name, Anschrift und Kontaktdaten des Verantwortlichen]</p>

      <h2>2. Aktueller Stand dieser Vorschauversion</h2>
      <p>
        In der aktuellen Vorschauversion werden hochgeladene Fotos ausschließlich lokal in deinem Browser angezeigt.
        Sie werden nicht an DesignBySari oder Dritte übertragen und nicht gespeichert. Es werden keine Cookies zu
        Analyse- oder Werbezwecken gesetzt. Schriftarten werden von unserem eigenen Server geladen.
      </p>

      <h2>3. Hosting und Server-Logfiles</h2>
      <p>[Hosting-Anbieter, Serverstandort, Art der Logdaten, Speicherdauer, Rechtsgrundlage]</p>

      <h2>4. Verarbeitung von Raumfotos und KI-Dienste (ab Livebetrieb)</h2>
      <p>
        [Zweck der Verarbeitung, eingesetzte KI-Anbieter, Serverstandort, Auftragsverarbeitung, Übermittlung in
        Drittländer, Speicherdauer und automatische Löschfristen]
      </p>

      <h2>5. Kundenkonto und Zahlungen (ab Livebetrieb)</h2>
      <p>[Registrierung, Zahlungsdienstleister, Rechtsgrundlagen, Aufbewahrungspflichten]</p>

      <h2>6. Partnerlinks</h2>
      <p>[Art der Partnerprogramme, Klickerfassung, beteiligte Netzwerke]</p>

      <h2>7. Deine Rechte</h2>
      <ul>
        <li>Auskunft, Berichtigung und Löschung deiner Daten</li>
        <li>Einschränkung der Verarbeitung und Datenübertragbarkeit</li>
        <li>Widerspruch gegen die Verarbeitung und Widerruf erteilter Einwilligungen</li>
        <li>Beschwerde bei einer Datenschutz-Aufsichtsbehörde</li>
      </ul>
    </LegalPage>
  );
}
