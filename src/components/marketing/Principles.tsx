import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PRINCIPLES = [
  {
    title: "Ehrlich gekennzeichnet",
    text: "KI-Bilder zeigen Ideen, keine fertigen Produkte. Wir kennzeichnen sie klar und versprechen keine exakte Übereinstimmung, die wir nicht geprüft haben.",
  },
  {
    title: "Unabhängig",
    text: "DesignBySari gehört zu keinem Möbelhändler. Produktvorschläge stammen aus echten Händlerdaten, Partnerlinks markieren wir sichtbar.",
  },
  {
    title: "Deine Fotos gehören dir",
    text: "Wir nutzen dein Foto nur für deine Gestaltung. Du kannst deine Bilder und Projekte jederzeit löschen.",
  },
] as const;

export function Principles() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="Unser Versprechen" title="Transparent von Anfang an" />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="rounded-[var(--radius-card)] bg-sand/40 p-7">
              <h3 className="text-xl">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-muted">{p.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
