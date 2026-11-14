import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { Angabe, Angaben } from "@/components/legal/Angabe";
import { BETREIBER, DIENSTE, LEGAL_STAND } from "@/content/legal/angaben";
import { CONSENT_IMMEDIATE_START } from "@/content/legal/zustimmung";
import { DESIGN_PACKAGES, formatEuro, isPaidPackage } from "@/modules/pricing/packages";

export const metadata: Metadata = { title: "AGB", robots: { index: false } };

export default function TermsPage() {
  const paid = DESIGN_PACKAGES.filter(isPaidPackage);
  const preisHinweis = BETREIBER.kleinunternehmer
    ? "Gemäß § 19 Umsatzsteuergesetz wird keine Umsatzsteuer berechnet."
    : "Alle Preise sind Endpreise und enthalten die gesetzliche Umsatzsteuer.";

  return (
    <LegalPage title="Allgemeine Geschäftsbedingungen">
      <h2>§ 1 Geltungsbereich und Anbieter</h2>
      <p>
        (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge, die über die Website DesignBySari
        zwischen dir und uns geschlossen werden:
      </p>
      <p>
        <Angaben lines={[BETREIBER.name, BETREIBER.strasse, BETREIBER.plzOrt]} />
        <br />
        E-Mail: <Angabe value={BETREIBER.email} />
      </p>
      <p>
        (2) Unser Angebot richtet sich an Verbraucherinnen und Verbraucher, also Personen, die DesignBySari
        überwiegend für private Zwecke nutzen. Abweichende Bedingungen gelten nur, wenn wir ihnen ausdrücklich
        zugestimmt haben.
      </p>

      <h2>§ 2 Leistungen</h2>
      <p>
        (1) DesignBySari erstellt auf Grundlage eines von dir hochgeladenen Fotos deines Wohnzimmers und deiner Angaben
        (Stil, Farben, Budget, Möbelwünsche) mit Hilfe Künstlicher Intelligenz digitale Gestaltungsvorschläge
        („Designvarianten“). Je Projekt wird ein Wohnzimmer gestaltet.
      </p>
      <p>(2) Es gibt folgende Pakete:</p>
      <ul>
        <li>
          <strong>Vorschau</strong> (kostenlos): Planung deiner Wünsche und eine Zusammenfassung, ohne
          KI-Designvarianten. Die Vorschau begründet keinen kostenpflichtigen Vertrag.
        </li>
        {paid.map((p) => (
          <li key={p.id}>
            <strong>{p.name}</strong> ({formatEuro(p.priceCents)} einmalig): {p.designVariants} KI-Designvarianten
            für ein Wohnzimmer.
          </li>
        ))}
      </ul>
      <p>
        Maßgeblich ist die Leistungsbeschreibung auf der <Link href="/preise">Preisseite</Link> zum Zeitpunkt deiner
        Bestellung. Es handelt sich um Einmalkäufe, nicht um ein Abonnement.
      </p>
      <p>
        (3) <strong>Was die Designvarianten sind und was nicht:</strong> Sie sind KI-generierte Bilder, die eine
        Gestaltungsidee für deinen Raum zeigen. Sie sind keine Fachplanung durch eine Innenarchitektin oder einen
        Innenarchitekten. Maße, Proportionen, Farben, Lichtverhältnisse und bauliche Gegebenheiten (z. B. Statik,
        Elektrik, Brandschutz) können vom Bild abweichen und werden nicht geprüft. Bitte miss vor jedem Kauf selbst nach.
      </p>
      <p>
        (4) Abgebildete Möbel sind in der Regel keine konkreten, kaufbaren Produkte. Zu den Designs schlagen wir
        ähnliche Produkte von Händlern vor. Kaufverträge über diese Produkte schließt du direkt mit dem jeweiligen
        Händler; wir sind daran nicht beteiligt. Preise und Verfügbarkeit stammen vom Händler und können sich ändern.
        Einige Links sind Partnerlinks (siehe <Link href="/transparenz">KI und Partnerlinks</Link>).
      </p>
      <p>
        (5) KI-Ergebnisse fallen bei jeder Erstellung unterschiedlich aus. Ein bestimmtes Aussehen können wir nicht
        zusagen. Wir bemühen uns um eine hohe Verfügbarkeit der Website, können eine ununterbrochene Erreichbarkeit
        aber nicht garantieren.
      </p>

      <h2>§ 3 Vertragsschluss</h2>
      <p>
        (1) Die Darstellung der Pakete auf der Website ist noch kein verbindliches Angebot. Du wählst ein Paket, prüfst
        deine Angaben in einer Übersicht und kannst Eingabefehler dort korrigieren. Mit dem Klick auf die Schaltfläche
        „<Angabe value="[genauer Text der Kaufschaltfläche, z. B. Jetzt kaufen]" />“ gibst du ein verbindliches
        Angebot zum Kauf ab.
      </p>
      <p>
        (2) Der Vertrag kommt zustande, wenn die Zahlung erfolgreich abgeschlossen ist und wir dir die Bestellung per
        E-Mail bestätigen. Diese Bestätigung enthält auch den Vertragstext mit diesen AGB und die Widerrufsbelehrung.
      </p>
      <p>
        (3) Vertragssprache ist Deutsch. Wir speichern den Vertragstext; in deinem Kundenkonto und in der
        Bestätigungs-E-Mail kannst du ihn jederzeit abrufen.
      </p>

      <h2>§ 4 Preise und Zahlung</h2>
      <p>
        (1) Es gelten die Preise zum Zeitpunkt der Bestellung. {preisHinweis} Versandkosten fallen nicht an.
      </p>
      <p>
        (2) Die Zahlung ist sofort fällig und erfolgt über <Angabe value={DIENSTE.zahlung.name} />. Verfügbare
        Zahlungsarten: <Angabe value={DIENSTE.zahlung.zahlungsarten} />.
      </p>
      <p>(3) Du erhältst eine Rechnung per E-Mail.</p>

      <h2>§ 5 Bereitstellung</h2>
      <p>
        Die Erstellung beginnt unmittelbar nach Vertragsschluss, sofern du dem sofortigen Beginn zugestimmt hast
        (siehe § 7). Die Designvarianten stehen in der Regel innerhalb weniger Minuten in deinem Projekt zum Ansehen und
        Herunterladen bereit. Wir informieren dich, falls es länger dauert.
      </p>

      <h2>§ 6 Deine Pflichten beim Hochladen</h2>
      <p>(1) Du darfst nur Fotos hochladen, an denen du die nötigen Rechte hast, z. B. weil du sie selbst gemacht hast.</p>
      <p>
        (2) Bitte lade keine Fotos hoch, auf denen Personen erkennbar sind oder persönliche Unterlagen zu sehen sind.
        Rechtswidrige, beleidigende oder anstößige Inhalte sind verboten.
      </p>
      <p>
        (3) Wenn ein Foto gegen diese Regeln verstößt, dürfen wir die Bearbeitung ablehnen. Bereits gezahlte Beträge
        erstatten wir dann, sofern noch keine Designvarianten erstellt wurden.
      </p>

      <h2>§ 7 Widerrufsrecht</h2>
      <p>
        (1) Als Verbraucherin oder Verbraucher hast du ein gesetzliches Widerrufsrecht. Einzelheiten stehen in der{" "}
        <Link href="/widerruf">Widerrufsbelehrung</Link>.
      </p>
      <p>
        (2) Damit wir deine Designs sofort erstellen können, bitten wir dich vor dem Kauf um folgende Bestätigung:
      </p>
      <p className="rounded-2xl border border-taupe/40 p-5 italic">„{CONSENT_IMMEDIATE_START}“</p>
      <p>
        Gibst du diese Bestätigung ab und beginnen wir mit der Erstellung, erlischt dein Widerrufsrecht vorzeitig. Ohne
        diese Bestätigung beginnen wir erst nach Ablauf der Widerrufsfrist von 14 Tagen.
        <Angabe value="[Anwaltlich prüfen: ob der Kauf ohne diese Bestätigung möglich sein muss und wie der Ablauf dann aussieht]" />
      </p>

      <h2>§ 8 Nutzungsrechte</h2>
      <p>
        (1) Du darfst die Designvarianten zeitlich unbegrenzt für private Zwecke nutzen, z. B. speichern, ausdrucken
        und mit Familie, Freunden oder Handwerkern teilen, auch in sozialen Netzwerken.
      </p>
      <p>
        (2) Eine gewerbliche Nutzung (z. B. Weiterverkauf, Werbung für Dritte) ist nur nach vorheriger Zustimmung
        erlaubt.
      </p>
      <p>
        (3) Rechtlicher Hinweis: An rein KI-generierten Bildern entsteht nach heutigem Verständnis in der Regel kein
        Urheberrecht. Wir können dir deshalb kein ausschließliches Recht an den Bildern verschaffen. Ähnliche Bilder
        können auch für andere entstehen.
      </p>
      <p>
        (4) Die Rechte an deinem hochgeladenen Foto bleiben bei dir. Du erlaubst uns, es ausschließlich zur Erstellung
        deiner Designvarianten zu verarbeiten. Wie wir mit deinen Daten umgehen, steht in der{" "}
        <Link href="/datenschutz">Datenschutzerklärung</Link>.
      </p>

      <h2>§ 9 Gewährleistung</h2>
      <p>
        Es gelten die gesetzlichen Rechte bei Mängeln digitaler Produkte (§§ 327 ff. Bürgerliches Gesetzbuch). Ein
        Mangel liegt insbesondere vor, wenn die Designvarianten nicht bereitgestellt werden, sich nicht öffnen lassen
        oder offensichtlich nicht dein Wohnzimmer bzw. deine Angaben betreffen. Dass das Ergebnis nicht deinem
        persönlichen Geschmack entspricht, ist für sich allein kein Mangel. Bei Problemen schreib uns bitte an{" "}
        <Angabe value={BETREIBER.email} />.
      </p>

      <h2>§ 10 Haftung</h2>
      <p>
        (1) Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben, Körper oder
        Gesundheit, nach dem Produkthaftungsgesetz sowie im Umfang einer übernommenen Garantie.
      </p>
      <p>
        (2) Bei leichter Fahrlässigkeit haften wir nur bei Verletzung einer wesentlichen Vertragspflicht, deren Erfüllung
        die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung du regelmäßig
        vertrauen darfst. Die Haftung ist dann auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
      </p>
      <p>
        (3) Für Entscheidungen, die du auf Grundlage der Designvarianten triffst (z. B. Möbelkäufe oder Umbauten), und
        für Produkte von Händlern übernehmen wir keine Haftung, soweit nicht Absatz 1 eingreift.
      </p>

      <h2>§ 11 Kundenkonto und Laufzeit</h2>
      <p>
        Du kannst dein Kundenkonto und einzelne Projekte jederzeit selbst löschen. Mit der Löschung werden Fotos und
        Designvarianten endgültig entfernt; lade Ergebnisse, die du behalten möchtest, vorher herunter.
      </p>

      <h2>§ 12 Streitbeilegung und Schlussbestimmungen</h2>
      <p>
        (1) Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>
      <p>
        (2) Es gilt das Recht der Bundesrepublik Deutschland. Wenn du deinen gewöhnlichen Aufenthalt in einem anderen
        Staat der EU hast, bleiben die zwingenden Verbraucherschutzvorschriften dieses Staates unberührt.
      </p>
      <p>(3) Sollte eine Bestimmung dieser AGB unwirksam sein, bleiben die übrigen Bestimmungen wirksam.</p>

      <p className="text-sm text-charcoal/70">
        Stand: <Angabe value={LEGAL_STAND} />
      </p>
    </LegalPage>
  );
}
