import type { Metadata } from "next";
import { DesignWizard } from "@/components/design-flow/DesignWizard";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Wohnzimmer gestalten",
  description: "Foto hochladen, Stil und Budget wählen: So planst du dein Wohnzimmer mit DesignBySari.",
};

export default function DesignPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">Neues Wohnzimmer-Projekt</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Lass uns dein Wohnzimmer neu denken</h1>
        <div className="mt-10">
          <DesignWizard />
        </div>
      </Container>
    </section>
  );
}
