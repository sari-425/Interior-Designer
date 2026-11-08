import type { ReactNode } from "react";

type Tone = "neutral" | "demo" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-paper text-charcoal border-line",
  demo: "bg-charcoal text-cream border-charcoal",
  info: "bg-sand/50 text-charcoal border-sand",
};

export function Badge({ children, tone = "neutral", className = "" }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.72rem] font-semibold tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/** Einheitliche Kennzeichnung für Beispiel- und Testinhalte */
export function DemoBadge({ label = "Beispiel · Illustration", className = "" }: { label?: string; className?: string }) {
  return (
    <Badge tone="demo" className={className}>
      {label}
    </Badge>
  );
}
