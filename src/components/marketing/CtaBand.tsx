import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CtaBand() {
  return (
    <section className="pb-20 lg:pb-28">
      <Container>
        <div className="rounded-[calc(var(--radius-card)*1.4)] bg-charcoal px-6 py-14 text-center text-cream sm:px-12 sm:py-20">
          <h2 className="text-3xl sm:text-5xl">Wie könnte dein Wohnzimmer aussehen?</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-cream/80">
            Stell deine Wünsche schon jetzt kostenlos zusammen. Die KI-Gestaltung folgt, sobald sie bereit ist.
          </p>
          <ButtonLink href="/gestalten" size="lg" variant="inverse" className="mt-9">
            Jetzt Wohnzimmer planen
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
