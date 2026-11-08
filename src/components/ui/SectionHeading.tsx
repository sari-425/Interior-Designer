import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}

export function SectionHeading({ eyebrow, title, intro, align = "left", as = "h2" }: SectionHeadingProps) {
  const Heading = as;
  const alignment = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-sage-deep">{eyebrow}</p>
      )}
      <Heading className={as === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}>{title}</Heading>
      {intro && <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}
