import type { Metadata } from "next";
import { DesignWizard } from "@/components/design-flow/DesignWizard";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Raum gestalten",
  description: "Foto hochladen, Stil und Budget wählen: So gestaltest du deinen Raum mit ROOMORA.",
};

export default function DesignPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">Raum gestalten</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Lass uns deinen Raum neu denken</h1>
        <div className="mt-10">
          <DesignWizard />
        </div>
      </Container>
    </section>
  );
}
