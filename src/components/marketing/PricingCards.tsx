import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DESIGN_PACKAGES, formatEuro, PLANNED_LATER, type PackageFeature } from "@/modules/pricing/packages";

function FeatureIcon({ status }: { status: PackageFeature["status"] }) {
  if (status === "available") {
    return (
      <svg className="mt-1 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5c6152" strokeWidth="2.2" aria-hidden="true">
        <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Uhr: Leistung in Vorbereitung
  return (
    <svg className="mt-1 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a7457" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PricingCards() {
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {DESIGN_PACKAGES.map((pkg) => {
          const free = pkg.priceCents === 0;
          const ready = pkg.status === "available";
          return (
            <article
              key={pkg.id}
              aria-labelledby={`paket-${pkg.id}`}
              className={`flex flex-col rounded-[var(--radius-card)] border p-7 ${
                pkg.highlighted ? "border-charcoal bg-paper" : "border-line bg-paper/60"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 id={`paket-${pkg.id}`} className="text-2xl">
                  {pkg.name}
                </h3>
                <Badge tone={ready ? "demo" : "info"}>{ready ? "Jetzt verfügbar" : "In Vorbereitung"}</Badge>
              </div>
              <p className="mt-1 text-muted">{pkg.tagline}</p>
              <p className="mt-6 font-display text-4xl">{free ? "Kostenlos" : formatEuro(pkg.priceCents)}</p>
              <p className="mt-1 text-sm text-muted">{free ? "ohne Zahlung" : "einmalig, vorläufiger Preis"}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map((f) => (
                  <li key={f.text} className="flex gap-3">
                    <FeatureIcon status={f.status} />
                    <span>
                      {f.text}
                      {f.status === "in_preparation" && <span className="sr-only"> (in Vorbereitung)</span>}
                    </span>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/gestalten" variant={ready ? "primary" : "secondary"} className="mt-8">
                {ready ? "Jetzt kostenlos ausprobieren" : "Planung kostenlos ausprobieren"}
              </ButtonLink>
              <p className="mt-3 text-center text-sm text-muted">
                {ready ? "Ohne Konto, ohne Kosten" : "Paket noch nicht buchbar"}
              </p>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-sm leading-relaxed text-muted">
        Vorläufige Preise inkl. 19 % USt. Basis und Plus starten zusammen mit der KI-Gestaltung und sind derzeit noch
        nicht buchbar. Leistungen mit Uhr-Symbol sind in Vorbereitung. Leistungsumfang und Preise können sich bis zum
        Start noch ändern.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Für später geplant und noch in keinem Paket enthalten: {PLANNED_LATER.join(" und ")}.
      </p>
    </div>
  );
}
