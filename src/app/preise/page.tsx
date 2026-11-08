import type { Metadata } from "next";
import { CtaBand } from "@/components/marketing/CtaBand";
import { PricingCards } from "@/components/marketing/PricingCards";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Preise",
  description: "Kostenlos ausprobieren, dann das passende Designpaket wählen. Einmalige Preise, kein Abo.",
};

const FAQ = [
  {
    q: "Muss ich mich registrieren?",
    a: "Nein. Du kannst DesignBySari zunächst ohne Konto ausprobieren. Ein Konto brauchst du erst, wenn du Projekte speichern möchtest.",
  },
  {
    q: "Ist das ein Abo?",
    a: "Nein. Jedes Designpaket wird einmalig bezahlt. Es gibt keine automatische Verlängerung.",
  },
  {
    q: "Sind die vorgeschlagenen Möbel genau die aus dem Bild?",
    a: "In der Regel nicht. Die KI entwirft eine Gestaltungsidee. Wir schlagen dir dazu ähnliche, tatsächlich erhältliche Produkte vor und kennzeichnen deutlich, wenn ein Produkt nur ähnlich ist.",
  },
  {
    q: "Verdient DesignBySari an Produktlinks?",
    a: "Teilweise ja. Wenn du über einen markierten Partnerlink kaufst, kann DesignBySari eine Provision erhalten. Für dich ändert sich der Preis dadurch nicht.",
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
            intro="Starte kostenlos. Wenn du mehr Varianten, einen Budget-Planer oder mehrere Räume brauchst, wählst du ein Paket."
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
