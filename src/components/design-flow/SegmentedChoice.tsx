interface Option<T extends string> {
  id: T;
  label: string;
}

interface SegmentedChoiceProps<T extends string> {
  name: string;
  /** ID des Elements, das die Gruppe beschriftet */
  labelledBy: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Kompakte Einfachauswahl als Radiogruppe (Tastatur und Screenreader funktionieren). */
export function SegmentedChoice<T extends string>({ name, labelledBy, options, value, onChange }: SegmentedChoiceProps<T>) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="inline-flex rounded-full border border-line bg-cream p-1">
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <label
            key={option.id}
            className={`inline-flex min-h-10 cursor-pointer items-center rounded-full px-3.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-1 has-[:focus-visible]:outline-charcoal sm:px-4 ${
              selected ? "bg-charcoal text-cream" : "text-charcoal hover:bg-sand/50"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={selected}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
