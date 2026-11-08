import { useId } from "react";
import {
  BUDGET_PRESETS,
  COLOR_WORLDS,
  FURNITURE_OPTIONS,
  ROOM_ELEMENTS,
  VARIANT_COUNTS,
  type RoomElement,
} from "@/modules/design-request/options";
import { ChoiceCard, ToggleChip } from "./ChoiceCard";
import { parseBudget } from "./draft";
import type { ElementChoice, WizardDraft } from "./types";

interface PreferencesStepProps {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
}

const euro = (n: number) => `${n.toLocaleString("de-DE")} €`;

const ELEMENT_CHOICES: { id: ElementChoice; label: string }[] = [
  { id: "keep", label: "Behalten" },
  { id: "change", label: "Darf sich ändern" },
  { id: "open", label: "Egal" },
];

export function PreferencesStep({ draft, update }: PreferencesStepProps) {
  const budgetId = useId();
  const notesId = useId();
  const budget = parseBudget(draft.budgetInput);

  const setElement = (element: RoomElement, choice: ElementChoice) =>
    update({ elements: { ...draft.elements, [element]: choice } });

  return (
    <div className="space-y-14">
      <div>
        <h2 className="text-3xl">Deine Wünsche</h2>
        <p className="mt-3 text-muted">Je genauer du beschreibst, was du dir vorstellst, desto besser passt das Ergebnis.</p>
      </div>

      <fieldset>
        <legend className="text-xl font-semibold">Farbwelt</legend>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {COLOR_WORLDS.map((cw) => (
            <ChoiceCard
              key={cw.id}
              name="colorWorld"
              value={cw.id}
              selected={draft.colorWorld === cw.id}
              onSelect={() => update({ colorWorld: cw.id })}
              className="p-4"
            >
              <span className="flex gap-1.5" aria-hidden="true">
                {cw.swatches.map((s) => (
                  <span key={s} className="h-7 w-7 rounded-full border border-black/10" style={{ backgroundColor: s }} />
                ))}
              </span>
              <span className="mt-3 pr-6">{cw.name}</span>
            </ChoiceCard>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xl font-semibold">Budget für die Einrichtung</legend>
        <p className="mt-1 text-sm text-muted">Gesamtbetrag für neue Möbel und Deko in diesem Raum.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {BUDGET_PRESETS.map((preset) => (
            <ToggleChip
              key={preset}
              checked={budget === preset}
              onChange={() => update({ budgetInput: String(preset) })}
            >
              {euro(preset)}
            </ToggleChip>
          ))}
        </div>
        <div className="mt-4 max-w-xs">
          <label htmlFor={budgetId} className="text-sm font-medium">
            Oder eigener Betrag
          </label>
          <div className="mt-1.5 flex items-center rounded-xl border border-line bg-paper focus-within:border-charcoal">
            <input
              id={budgetId}
              inputMode="numeric"
              autoComplete="off"
              value={draft.budgetInput}
              onChange={(e) => update({ budgetInput: e.target.value })}
              className="min-h-12 w-full rounded-xl bg-transparent px-4 text-lg outline-none"
            />
            <span className="pr-4 text-muted">€</span>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xl font-semibold">Was brauchst du?</legend>
        <p className="mt-1 text-sm text-muted">Optional. Wähle alles, was neu dazukommen soll.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {FURNITURE_OPTIONS.map((item) => (
            <ToggleChip
              key={item}
              checked={draft.furniture.includes(item)}
              onChange={(on) =>
                update({ furniture: on ? [...draft.furniture, item] : draft.furniture.filter((f) => f !== item) })
              }
            >
              {item}
            </ToggleChip>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xl font-semibold">Was soll bleiben, was darf sich ändern?</legend>
        <p className="mt-1 text-sm text-muted">
          Fenster, Türen und die Raumaufteilung versucht die KI immer unverändert zu lassen.
        </p>
        <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-paper">
          {ROOM_ELEMENTS.map((element) => {
            const current = draft.elements[element] ?? "open";
            return (
              <div key={element} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span id={`el-${element}`}>{element}</span>
                <div role="radiogroup" aria-labelledby={`el-${element}`} className="flex flex-wrap gap-1.5">
                  {ELEMENT_CHOICES.map((choice) => (
                    <label
                      key={choice.id}
                      className={`inline-flex min-h-10 cursor-pointer items-center rounded-full border px-3.5 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-charcoal ${
                        current === choice.id ? "border-charcoal bg-charcoal text-cream" : "border-line hover:border-taupe"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`element-${element}`}
                        value={choice.id}
                        checked={current === choice.id}
                        onChange={() => setElement(element, choice.id)}
                        className="sr-only"
                      />
                      {choice.label}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor={notesId} className="text-xl font-semibold">
          Sonstige Wünsche
        </label>
        <p className="mt-1 text-sm text-muted">Optional, z. B. „Das Sofa soll bleiben“ oder „mehr Stauraum“.</p>
        <textarea
          id={notesId}
          rows={3}
          maxLength={500}
          value={draft.notes}
          onChange={(e) => update({ notes: e.target.value })}
          className="mt-3 w-full rounded-xl border border-line bg-paper p-4 outline-none focus:border-charcoal"
        />
        <p className="mt-1 text-right text-xs text-muted">{draft.notes.length} / 500</p>
      </div>

      <fieldset>
        <legend className="text-xl font-semibold">Wie viele Designvarianten?</legend>
        <div className="mt-4 flex gap-2">
          {VARIANT_COUNTS.map((n) => (
            <ToggleChip key={n} checked={draft.variants === n} onChange={() => update({ variants: n })}>
              <span className="min-w-6 text-center">{n}</span>
            </ToggleChip>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
