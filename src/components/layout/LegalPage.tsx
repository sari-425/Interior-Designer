import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/** Rahmen für Rechtstexte. Alle Inhalte sind Entwürfe und müssen juristisch geprüft werden. */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        <div role="note" className="mt-8 rounded-2xl border border-taupe/50 bg-sand/40 p-5 text-[0.95rem] leading-relaxed">
          <strong className="font-semibold">Entwurf, nicht rechtsverbindlich.</strong> Dieser Text ist eine Vorlage
          und muss vor dem Start von einer Rechtsanwältin, einem Rechtsanwalt oder einem spezialisierten
          Rechtstext-Dienst geprüft und vervollständigt werden. Platzhalter stehen in eckigen Klammern und sind farbig markiert.
        </div>
        <div className="legal mt-10 space-y-6 leading-relaxed text-charcoal/90 [&_h2]:mt-10 [&_h2]:text-2xl [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </Container>
    </section>
  );
}
