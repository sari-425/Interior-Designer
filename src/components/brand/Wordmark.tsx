import Link from "next/link";

interface WordmarkProps {
  className?: string;
  /** Als Link zur Startseite darstellen */
  asLink?: boolean;
}

/** DesignBySari-Wortmarke. Bewusst ohne Symbol: Die Marke wirkt über Typografie. */
export function Wordmark({ className = "", asLink = true }: WordmarkProps) {
  const mark = (
    <span className={`font-display text-[1.45rem] leading-none tracking-[-0.01em] text-charcoal ${className}`}>
      <span aria-hidden="true">
        Design<span className="italic text-taupe-deep">By</span>Sari
      </span>
      <span className="sr-only">DesignBySari</span>
    </span>
  );
  if (!asLink) return mark;
  return (
    <Link href="/" className="inline-flex items-center rounded-md py-1" aria-label="DesignBySari, zur Startseite">
      {mark}
    </Link>
  );
}
