import type { Metadata } from "next";
import { CtaBand } from "@/components/marketing/CtaBand";
import { PricingCards } from "@/components/marketing/PricingCards";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Preise",
  description: "Geplante Designpakete von DesignBySari: einmalige Preise, kein Abo. Noch nicht buchbar, der Planungsablauf ist kostenlos testbar.",
};

const FAQ = [
  {
    q: "Kann ich DesignBySari schon nutzen?",
    a: "Teilweise. In der Vorschauversion kannst du den Planungsablauf kostenlos ausprobieren: Foto hochladen, Stil, Farben, Budget und Möbel festlegen. Die KI-Gestaltung und die Designpakete sind noch in Vorbereitung. Es entstehen dir keine Kosten, und dein Foto verlässt deinen Browser nicht.",
  },
  {
    q: "Muss ich mich registrieren?",
    a: "Nein. Die Vorschau funktioniert ohne Konto. Später brauchst du ein Konto nur, wenn du Projekte speichern möchtest.",
  },
  {
    q: "Ist das ein Abo?",
    a: "Nein. Geplant ist, dass jedes Designpaket einmalig bezahlt wird, ohne automatische Verlängerung. Buchbar sind die Pakete noch nicht.",
  },
  {
    q: "Sind die vorgeschlagenen Möbel genau die aus dem Bild?",
    a: "In der Regel nicht. Die KI wird eine Gestaltungsidee entwerfen. Dazu werden wir dir ähnliche, tatsächlich erhältliche Produkte vorschlagen und deutlich kennzeichnen, wenn ein Produkt nur ähnlich ist.",
  },
  {
    q: "Verdient DesignBySari an Produktlinks?",
    a: "Später teilweise ja. Wenn du über einen markierten Partnerlink kaufst, kann DesignBySari eine Provision erhalten. Für dich ändert sich der Preis dadurch nicht. Derzeit gibt es noch keine Produkt- oder Partnerlinks.",
  },
] as const;

export default function PricingPage() {
  return (
    <>
      <section className="pb-20 pt-12 sm:pt-16">
        <Container>
          <SectionHeading
            as="h1"
            eyebrow="Preise"
            title="Einfache Pakete, faire Preise"
            intro="Die Designpakete starten zusammen mit der KI-Gestaltung und sind noch nicht buchbar. Hier siehst du vorab, was geplant ist. Den Planungsablauf kannst du schon heute kostenlos ausprobieren."
          />
          <div className="mt-12">
            <PricingCards />
          </div>
        </Container>
      </section>
      <section className="border-t border-line bg-paper py-20">
        <Container className="max-w-3xl">
          <h2 className="text-3xl">Häufige Fragen</h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                  {item.q}
                  <span className="text-2xl leading-none text-taupe-deep transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>
      <div className="pt-20">
        <CtaBand />
      </div>
    </>
  );
}
