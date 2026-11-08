import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DESIGN_PACKAGES, formatEuro } from "@/modules/pricing/packages";

export function PricingCards() {
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {DESIGN_PACKAGES.map((pkg) => (
          <article
            key={pkg.id}
            className={`flex flex-col rounded-[var(--radius-card)] border p-7 ${
              pkg.highlighted ? "border-charcoal bg-paper" : "border-line bg-paper/60"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl">{pkg.name}</h3>
              <Badge tone={pkg.highlighted ? "info" : "neutral"}>Geplant</Badge>
            </div>
            <p className="mt-1 text-muted">{pkg.tagline}</p>
            <p className="mt-6 font-display text-4xl">
              {formatEuro(pkg.priceCents)}
              <span className="ml-1 align-middle font-sans text-sm text-muted">einmalig, geplant</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {pkg.features.map((f) => (
                <li key={f} className="flex gap-3">
                  <svg className="mt-1 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5c6152" strokeWidth="2.2" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <ButtonLink href="/gestalten" variant={pkg.highlighted ? "primary" : "secondary"} className="mt-8">
              Planung kostenlos ausprobieren
            </ButtonLink>
            <p className="mt-3 text-center text-sm text-muted">Paket noch nicht buchbar</p>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm leading-relaxed text-muted">
        Vorläufige Preise inkl. 19 % USt. Die Designpakete starten zusammen mit der KI-Gestaltung und sind derzeit
        noch nicht buchbar. Leistungsumfang und Preise können sich bis zum Start noch ändern.
      </p>
    </div>
  );
}
