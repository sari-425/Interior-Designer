import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { Angabe, Angaben } from "@/components/legal/Angabe";
import { BETREIBER, LEGAL_STAND } from "@/content/legal/angaben";

export const metadata: Metadata = { title: "Impressum", robots: { index: false } };

export default function ImprintPage() {
  return (
    <LegalPage title="Impressum">
      <h2>Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)</h2>
      <p>
        <Angaben lines={[BETREIBER.name, BETREIBER.strasse, BETREIBER.plzOrt, BETREIBER.land]} />
      </p>
      {BETREIBER.vertretenDurch.trim() !== "" && (
        <p>
          Vertreten durch: <Angabe value={BETREIBER.vertretenDurch} />
        </p>
      )}

      <h2>Kontakt</h2>
      <p>
        E-Mail: <Angabe value={BETREIBER.email} />
        <br />
        Telefon: <Angabe value={BETREIBER.telefon} />
      </p>

      {BETREIBER.register.trim() !== "" && (
        <>
          <h2>Registereintrag</h2>
          <p>
            <Angabe value={BETREIBER.register} />
          </p>
        </>
      )}

      {BETREIBER.ustId.trim() !== "" && (
        <>
          <h2>Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz bzw. Wirtschafts-Identifikationsnummer
            gemäß § 139c Abgabenordnung: <Angabe value={BETREIBER.ustId} />
          </p>
        </>
      )}

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 Medienstaatsvertrag (MStV)</h2>
      <p>
        <Angabe value={BETREIBER.inhaltlichVerantwortlich} />
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen. Wenn du ein Anliegen hast, schreib uns gern direkt an die oben
        genannte E-Mail-Adresse.
      </p>

      <h2>Hinweis zu KI-generierten Inhalten</h2>
      <p>
        Gestaltungsvorschläge auf DesignBySari werden mit Künstlicher Intelligenz erzeugt und als solche
        gekennzeichnet. Mehr dazu auf der Seite <Link href="/transparenz">KI und Partnerlinks</Link>.
      </p>

      <p className="text-sm text-charcoal/70">
        Stand: <Angabe value={LEGAL_STAND} />
      </p>
    </LegalPage>
  );
}
