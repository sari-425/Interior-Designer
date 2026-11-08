import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Impressum", robots: { index: false } };

export default function ImprintPage() {
  return (
    <LegalPage title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        [Vollständiger Name bzw. Firma und Rechtsform]
        <br />
        [Straße und Hausnummer]
        <br />
        [PLZ und Ort]
      </p>
      <h2>Kontakt</h2>
      <p>
        E-Mail: [E-Mail-Adresse]
        <br />
        Telefon: [Telefonnummer]
      </p>
      <h2>Umsatzsteuer-ID</h2>
      <p>[Umsatzsteuer-Identifikationsnummer, falls vorhanden]</p>
      <h2>Verantwortlich für den Inhalt</h2>
      <p>[Name und Anschrift, falls journalistisch-redaktionelle Inhalte angeboten werden]</p>
      <h2>Verbraucherstreitbeilegung</h2>
      <p>[Angabe zur Teilnahme an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle]</p>
    </LegalPage>
  );
}
