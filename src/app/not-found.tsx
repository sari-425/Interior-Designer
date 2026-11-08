import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">Seite nicht gefunden</p>
        <h1 className="mt-4 text-4xl">Dieser Raum existiert (noch) nicht.</h1>
        <p className="mt-4 text-lg text-muted">Die gesuchte Seite gibt es nicht. Vielleicht findest du hier weiter:</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Zur Startseite</ButtonLink>
          <ButtonLink href="/gestalten" variant="secondary">
            Raum gestalten
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
