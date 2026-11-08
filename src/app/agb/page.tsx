import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "AGB", robots: { index: false } };

export default function TermsPage() {
  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <p>
        Die Allgemeinen Geschäftsbedingungen, Verbraucherinformationen, Zahlungsbedingungen und die
        Widerrufsbelehrung für digitale Inhalte werden vor dem Start des Verkaufs ergänzt.
      </p>
      <h2>Geplante Inhalte</h2>
      <ul>
        <li>[Vertragspartner und Vertragsschluss]</li>
        <li>[Leistungsbeschreibung der Designpakete]</li>
        <li>[Preise, Zahlung und Rechnungsstellung]</li>
        <li>[Widerrufsrecht und vorzeitiges Erlöschen bei digitalen Inhalten]</li>
        <li>[Nutzungsrechte an KI-generierten Bildern]</li>
        <li>[Haftung und Gewährleistung]</li>
      </ul>
    </LegalPage>
  );
}
