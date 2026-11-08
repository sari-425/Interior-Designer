import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PricingCards } from "./PricingCards";

export function PricingTeaser() {
  return (
    <section className="border-t border-line bg-paper py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Preise"
          title="Erst ausprobieren, dann entscheiden"
          intro="Du startest kostenlos. Wenn dir gefällt, was du siehst, wählst du ein Designpaket. Kein Abo."
        />
        <div className="mt-12">
          <PricingCards />
        </div>
      </Container>
    </section>
  );
}
