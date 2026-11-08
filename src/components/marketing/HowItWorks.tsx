import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    title: "Foto hochladen",
    text: "Fotografiere deinen Raum bei Tageslicht und lade das Bild hoch. JPG, PNG oder WebP genügen.",
  },
  {
    title: "Stil und Budget wählen",
    text: "Entscheide dich für einen Stil, eine Farbwelt und dein Budget. Sag uns, was bleiben soll.",
  },
  {
    title: "Neues Design entdecken",
    text: "Die KI gestaltet deinen Raum neu und lässt Fenster, Türen und Grundriss möglichst unverändert.",
  },
  {
    title: "Passend einrichten",
    text: "Du erhältst ähnliche, tatsächlich erhältliche Produkte, passend zu deinem Budget.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="so-funktionierts" className="scroll-mt-20 border-y border-line bg-paper py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="So funktioniert’s"
          title="Vom Foto zum neuen Zuhause in vier Schritten"
          intro="Kein Fachwissen nötig. Du entscheidest, ROOMORA macht deine Ideen sichtbar."
        />
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border-t border-charcoal/20 pt-6">
              <span className="font-display text-3xl text-taupe-deep">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
