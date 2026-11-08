import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    title: "Foto hochladen",
    text: "Fotografiere dein Wohnzimmer bei Tageslicht und lade das Bild hoch. JPG, PNG oder WebP genügen.",
    available: true,
  },
  {
    title: "Wünsche festlegen",
    text: "Wähle Stil, Farben, Atmosphäre und dein Budget. Markiere, welche Möbel bleiben und welche ersetzt werden.",
    available: true,
  },
  {
    title: "Neues Design entdecken",
    text: "Die KI wird dein Wohnzimmer neu gestalten und Fenster, Türen und Grundriss möglichst unverändert lassen.",
    available: false,
  },
  {
    title: "Passend einrichten",
    text: "Du wirst ähnliche, tatsächlich erhältliche Produkte passend zu deinem Budget erhalten.",
    available: false,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="so-funktionierts" className="scroll-mt-20 border-y border-line bg-paper py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="So funktioniert’s"
          title="Vom Foto zum neuen Wohnzimmer in vier Schritten"
          intro="Kein Fachwissen nötig. Die ersten beiden Schritte kannst du in der Vorschau schon ausprobieren. Die KI-Gestaltung und die Produktvorschläge sind in Vorbereitung."
        />
        <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border-t border-charcoal/20 pt-6">
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-3xl text-taupe-deep">{String(i + 1).padStart(2, "0")}</span>
                <Badge tone={step.available ? "info" : "neutral"}>
                  {step.available ? "In der Vorschau nutzbar" : "In Vorbereitung"}
                </Badge>
              </div>
              <h3 className="mt-4 text-xl">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
