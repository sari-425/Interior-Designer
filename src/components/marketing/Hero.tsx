import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BeforeAfter } from "./BeforeAfter";

export function Hero() {
  return (
    <section className="pb-16 pt-12 sm:pt-16 lg:pb-24 lg:pt-20">
      <Container className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">
            Wohnzimmer-Planung mit KI · Vorschauversion
          </p>
          <h1 className="text-[2.6rem] leading-[1.08] sm:text-6xl">
            Dein Zuhause.
            <br />
            Dein Budget.
            <br />
            <span className="text-taupe-deep">Dein Design.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            Lade ein Foto deines Wohnzimmers hoch, wähle Stil, Farben und dein Budget und lege fest, welche Möbel
            bleiben. Bald zeigt dir DesignBySari mit KI, wie dein Wohnzimmer neu aussehen kann.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/gestalten" size="lg">
              Jetzt Wohnzimmer planen
            </ButtonLink>
            <ButtonLink href="/stile" variant="secondary" size="lg">
              Stile entdecken
            </ButtonLink>
          </div>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">
            <span className="font-semibold text-charcoal">Vorschauversion:</span> Den Planungsablauf kannst du schon
            kostenlos und ohne Registrierung ausprobieren. Die KI-Gestaltung ist noch in Vorbereitung.
          </p>
        </div>
        <BeforeAfter styleId="skandinavisch" />
      </Container>
    </section>
  );
}
