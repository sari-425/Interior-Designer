import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BeforeAfter } from "./BeforeAfter";

export function Hero() {
  return (
    <section className="pb-16 pt-12 sm:pt-16 lg:pb-24 lg:pt-20">
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
            Raumgestaltung mit KI
          </p>
          <h1 className="text-[2.6rem] leading-[1.08] sm:text-6xl">
            Dein Raum.
            <br />
            Dein Stil.
            <br />
            <span className="text-taupe-deep">Dein Zuhause.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Lade ein Foto deines Zimmers hoch, wähle deinen Lieblingsstil und dein Budget. ROOMORA zeigt dir, wie
            dein Raum neu aussehen kann, und schlägt passende Einrichtung vor.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/gestalten" size="lg">
              Jetzt Raum gestalten
            </ButtonLink>
            <ButtonLink href="/stile" variant="secondary" size="lg">
              Stile entdecken
            </ButtonLink>
          </div>
          <p className="mt-5 text-sm text-muted">Kostenlos ausprobieren, ohne Registrierung.</p>
        </div>
        <BeforeAfter styleId="skandinavisch" />
      </Container>
    </section>
  );
}
