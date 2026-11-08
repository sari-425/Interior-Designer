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
          intro="So ist es geplant: Du startest kostenlos und wählst erst ein Designpaket, wenn dir gefällt, was du siehst. Kein Abo. Die Pakete sind noch nicht buchbar."
        />
        <div className="mt-12">
          <PricingCards />
        </div>
      </Container>
    </section>
  );
}
