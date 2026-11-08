import type { Metadata } from "next";
import { BeforeAfter } from "@/components/marketing/BeforeAfter";
import { CtaBand } from "@/components/marketing/CtaBand";
import { StyleCard } from "@/components/marketing/StyleCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DESIGN_STYLES } from "@/modules/styles/styles";

export const metadata: Metadata = {
  title: "Designstile",
  description: "Modern, Skandinavisch, Japandi und mehr: Entdecke die Einrichtungsstile von DesignBySari.",
};

export default function StylesPage() {
  return (
    <>
      <section className="pb-16 pt-12 sm:pt-16">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            as="h1"
            eyebrow="Designstile"
            title="Acht Stile, unendlich viele Möglichkeiten"
            intro="Jeder Stil hat seinen eigenen Charakter. Vergleiche die Richtungen und wähle, was sich nach dir anfühlt. Weitere Stile folgen."
          />
          <BeforeAfter styleId="japandi" />
        </Container>
      </section>
      <section className="pb-20">
        <Container>
          <p className="mb-8 text-sm text-muted">
            Alle Bilder auf dieser Seite sind gezeichnete Illustrationen und keine KI-Ergebnisse oder Produktfotos.
          </p>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {DESIGN_STYLES.map((style) => (
              <StyleCard key={style.id} style={style} showTraits />
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
