import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { Container } from "@/components/ui/Container";
import { LEGAL_NAV, MAIN_NAV } from "./navigation";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-paper">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-sm text-muted">Dein Zuhause. Dein Budget. Dein Design.</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            DesignBySari ist eine unabhängige Plattform und gehört zu keinem Möbelhändler. Bilder, die mit KI erstellt
            werden, kennzeichnen wir als solche. Partnerlinks markieren wir sichtbar.
          </p>
        </div>
        <nav aria-label="Entdecken">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">Entdecken</p>
          <ul className="mt-4 space-y-3">
            <li>
              <Link href="/gestalten" className="text-charcoal/80 hover:text-charcoal">
                Wohnzimmer planen
              </Link>
            </li>
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-charcoal/80 hover:text-charcoal">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Rechtliches">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">Rechtliches</p>
          <ul className="mt-4 space-y-3">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-charcoal/80 hover:text-charcoal">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:justify-between">
          <p>© DesignBySari</p>
          <p>Vorschauversion: Es werden noch keine Bestellungen angenommen.</p>
        </Container>
      </div>
    </footer>
  );
}
