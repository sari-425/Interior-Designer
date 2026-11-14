import { isPlaceholder } from "@/content/legal/angaben";

/**
 * Zeigt eine Angabe aus src/content/legal/angaben.ts an.
 * Noch nicht ausgefüllte Platzhalter (beginnen mit „[“) werden farbig markiert.
 */
export function Angabe({ value }: { value: string }) {
  if (isPlaceholder(value)) {
    return (
      <mark data-platzhalter="" className="rounded bg-sand px-1 text-charcoal">
        {value}
      </mark>
    );
  }
  return <>{value}</>;
}

/** Mehrere Angaben untereinander; leere Werte werden ausgelassen. */
export function Angaben({ lines }: { lines: readonly string[] }) {
  const shown = lines.filter((line) => line.trim() !== "");
  return (
    <>
      {shown.map((line, i) => (
        <span key={i}>
          <Angabe value={line} />
          {i < shown.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
