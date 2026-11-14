import type { Metadata } from "next";
import { DesignWizard } from "@/components/design-flow/DesignWizard";
import { Container } from "@/components/ui/Container";
import { isAiEnabled } from "@/modules/ai/registry";

export const metadata: Metadata = {
  title: "Wohnzimmer planen (Vorschau)",
  description: "Foto hochladen, Stil und Budget wählen: So planst du dein Wohnzimmer mit DesignBySari. Die KI-Gestaltung ist in Vorbereitung.",
};

export default function DesignPage() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">Neues Wohnzimmer-Projekt · Vorschau</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Lass uns dein Wohnzimmer neu denken</h1>
        <p className="mt-4 max-w-2xl text-muted">
          In dieser Vorschau stellst du alle Angaben für dein Wohnzimmer zusammen. Die KI-Gestaltung ist noch in
          Vorbereitung, deshalb wird noch kein Design erzeugt. Es entstehen keine Kosten.
        </p>
        <div className="mt-10">
          {/* Wird beim Build ausgewertet; nach Änderung der KI-Konfiguration neu bauen */}
          <DesignWizard aiEnabled={isAiEnabled()} />
        </div>
      </Container>
    </section>
  );
}
