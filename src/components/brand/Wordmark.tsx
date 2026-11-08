import Link from "next/link";

interface WordmarkProps {
  className?: string;
  /** Als Link zur Startseite darstellen */
  asLink?: boolean;
}

/** ROOMORA-Wortmarke. Bewusst ohne Symbol: Die Marke wirkt über Typografie. */
export function Wordmark({ className = "", asLink = true }: WordmarkProps) {
  const mark = (
    <span
      className={`font-display text-[1.35rem] leading-none tracking-[0.22em] text-charcoal ${className}`}
      aria-label="ROOMORA"
    >
      ROOMORA
    </span>
  );
  if (!asLink) return mark;
  return (
    <Link href="/" className="inline-flex items-center rounded-md py-1" aria-label="ROOMORA, zur Startseite">
      {mark}
    </Link>
  );
}
