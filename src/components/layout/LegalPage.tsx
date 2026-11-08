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
          Rechtstext-Dienst geprüft und vervollständigt werden. Platzhalter stehen in eckigen Klammern.
        </div>
        <div className="legal mt-10 space-y-6 leading-relaxed text-charcoal/90 [&_h2]:mt-10 [&_h2]:text-2xl [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </Container>
    </section>
  );
}
