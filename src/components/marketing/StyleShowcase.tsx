import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DESIGN_STYLES } from "@/modules/styles/styles";
import { StyleCard } from "./StyleCard";

export function StyleShowcase() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Designstile"
            title="Finde den Stil, der zu dir passt"
            intro="Acht Stilrichtungen zum Start, von hell und skandinavisch bis warm und boho. Die Bilder sind Illustrationen."
          />
          <ButtonLink href="/stile" variant="secondary" className="shrink-0 self-start md:self-auto">
            Alle Stile ansehen
          </ButtonLink>
        </div>
        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {DESIGN_STYLES.map((style) => (
            <StyleCard key={style.id} style={style} />
          ))}
        </div>
      </Container>
    </section>
  );
}
