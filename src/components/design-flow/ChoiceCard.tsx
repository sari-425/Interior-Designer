import type { ReactNode } from "react";

interface ChoiceCardProps {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
  name: string;
  value: string;
  className?: string;
}

/** Auswahlkarte als echtes Radio-Element (Tastatur und Screenreader funktionieren). */
export function ChoiceCard({ selected, onSelect, children, name, value, className = "" }: ChoiceCardProps) {
  return (
    <label
      className={`relative flex cursor-pointer flex-col rounded-2xl border bg-paper transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-charcoal ${
        selected ? "border-charcoal ring-1 ring-charcoal" : "border-line hover:border-taupe"
      } ${className}`}
    >
      <input type="radio" name={name} value={value} checked={selected} onChange={onSelect} className="sr-only" />
      {children}
      {selected && (
        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-charcoal text-cream" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </label>
  );
}

interface ToggleChipProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  /** "radio" für Einfachauswahl (dann ist `name` Pflicht), sonst Mehrfachauswahl */
  type?: "checkbox" | "radio";
  name?: string;
}

/** Kleiner Umschalter (Chip) für Mehrfach- oder Einfachauswahl. */
export function ToggleChip({ checked, onChange, children, type = "checkbox", name }: ToggleChipProps) {
  return (
    <label
      className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-[0.95rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-charcoal ${
        checked ? "border-charcoal bg-charcoal text-cream" : "border-line bg-paper hover:border-taupe"
      }`}
    >
      <input type={type} name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      {children}
    </label>
  );
}
