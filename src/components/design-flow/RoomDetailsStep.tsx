import { useId } from "react";
import {
  ATMOSPHERES,
  BUDGET_PRESETS,
  COLOR_WORLDS,
  NOTES_MAX,
  ROOM_SIZE_MAX,
  ROOM_SIZE_MIN,
  VARIANT_COUNTS,
} from "@/modules/design-request/options";
import { ChoiceCard, ToggleChip } from "./ChoiceCard";
import { parseBudget } from "./draft";
import type { WizardDraft } from "./types";

interface RoomDetailsStepProps {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
}

const euro = (n: number) => `${n.toLocaleString("de-DE")} €`;

export function RoomDetailsStep({ draft, update }: RoomDetailsStepProps) {
  const sizeId = useId();
  const sizeHintId = useId();
  const budgetId = useId();
  const notesId = useId();
  const budget = parseBudget(draft.budgetInput);

  return (
    <div className="space-y-14">
      <div>
        <h2 className="text-3xl">Erzähl uns von deinem Wohnzimmer</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Je genauer du beschreibst, was du dir vorstellst, desto besser passt das Ergebnis.
        </p>
      </div>

      <div className="max-w-xs">
        <label htmlFor={sizeId} className="text-xl font-semibold">
          Raumgröße <span className="text-base font-normal text-muted">(optional)</span>
        </label>
        <p id={sizeHintId} className="mt-1 text-sm text-muted">
          Ungefähr reicht, z. B. 24 oder 24,5.
        </p>
        <div className="mt-3 flex items-center rounded-xl border border-line bg-paper focus-within:border-charcoal">
          <input
            id={sizeId}
            inputMode="decimal"
            autoComplete="off"
            placeholder={`${ROOM_SIZE_MIN} bis ${ROOM_SIZE_MAX}`}
            aria-describedby={sizeHintId}
            value={draft.roomSizeInput}
            onChange={(e) => update({ roomSizeInput: e.target.value })}
            className="min-h-12 w-full rounded-xl bg-transparent px-4 text-lg outline-none placeholder:text-muted/60"
          />
          <span className="pr-4 text-muted">m²</span>
        </div>
      </div>

      <fieldset>
        <legend className="text-xl font-semibold">Farben</legend>
        <p className="mt-1 text-sm text-muted">Welche Farbwelt wünschst du dir?</p>
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
        <legend className="text-xl font-semibold">Atmosphäre</legend>
        <p className="mt-1 text-sm text-muted">Wie soll sich dein Wohnzimmer anfühlen?</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ATMOSPHERES.map((a) => (
            <ChoiceCard
              key={a.id}
              name="atmosphere"
              value={a.id}
              selected={draft.atmosphere === a.id}
              onSelect={() => update({ atmosphere: a.id })}
              className="p-4"
            >
              <span className="pr-6 font-medium">{a.name}</span>
              <span className="mt-1 text-sm leading-snug text-muted">{a.description}</span>
            </ChoiceCard>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xl font-semibold">Maximales Budget</legend>
        <p className="mt-1 text-sm text-muted">Gesamtbetrag für neue Möbel und Deko in deinem Wohnzimmer.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {BUDGET_PRESETS.map((preset) => (
            <ToggleChip key={preset} checked={budget === preset} onChange={() => update({ budgetInput: String(preset) })}>
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

      <div>
        <label htmlFor={notesId} className="text-xl font-semibold">
          Sonstige Wünsche <span className="text-base font-normal text-muted">(optional)</span>
        </label>
        <p className="mt-1 text-sm text-muted">Zum Beispiel „mehr Stauraum“ oder „Platz zum Spielen für die Kinder“.</p>
        <textarea
          id={notesId}
          rows={3}
          maxLength={NOTES_MAX}
          value={draft.notes}
          onChange={(e) => update({ notes: e.target.value })}
          className="mt-3 w-full rounded-xl border border-line bg-paper p-4 outline-none focus:border-charcoal"
        />
        <p className="mt-1 text-right text-xs text-muted">
          {draft.notes.length} / {NOTES_MAX}
        </p>
      </div>

      <fieldset>
        <legend className="text-xl font-semibold">Wie viele Designvarianten?</legend>
        <p className="mt-1 text-sm text-muted">So viele unterschiedliche Vorschläge möchtest du später sehen.</p>
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
