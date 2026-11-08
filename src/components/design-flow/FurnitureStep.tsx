import { ITEM_DECISIONS, LIVING_ROOM_ITEMS, type ItemDecision, type LivingRoomItem } from "@/modules/design-request/options";
import { itemsWith } from "./draft";
import { SegmentedChoice } from "./SegmentedChoice";
import type { WizardDraft } from "./types";

interface FurnitureStepProps {
  draft: WizardDraft;
  update: (patch: Partial<WizardDraft>) => void;
}

const slug = (item: string) => item.toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-");

export function FurnitureStep({ draft, update }: FurnitureStepProps) {
  const keep = itemsWith(draft, "keep");
  const replace = itemsWith(draft, "replace");

  const setDecision = (item: LivingRoomItem, decision: ItemDecision) =>
    update({ items: { ...draft.items, [item]: decision } });

  return (
    <div>
      <h2 className="text-3xl">Was bleibt, was kommt neu?</h2>
      <p className="mt-3 max-w-2xl text-muted">
        Sag uns für jedes Möbelstück in deinem Wohnzimmer, ob es bleiben oder ersetzt werden soll. Was du nicht hast,
        lässt du auf „Nicht vorhanden“. Möchtest du etwas neu dazu, wähle „Ersetzen“.
      </p>

      <ul className="mt-8 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-paper">
        {LIVING_ROOM_ITEMS.map((item) => {
          const id = `item-${slug(item)}`;
          return (
            <li key={item} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span id={id} className="text-[1.05rem]">
                {item}
              </span>
              <SegmentedChoice
                name={id}
                labelledBy={id}
                options={ITEM_DECISIONS}
                value={draft.items[item] ?? "none"}
                onChange={(decision) => setDecision(item, decision)}
              />
            </li>
          );
        })}
      </ul>

      <div className="mt-6 grid gap-3 sm:grid-cols-2" aria-live="polite">
        <div className="rounded-2xl bg-sand/40 p-5">
          <p className="text-sm font-semibold">Bleibt ({keep.length})</p>
          <p className="mt-1 text-muted">{keep.length ? keep.join(", ") : "Noch nichts ausgewählt"}</p>
        </div>
        <div className="rounded-2xl bg-sand/40 p-5">
          <p className="text-sm font-semibold">Wird ersetzt ({replace.length})</p>
          <p className="mt-1 text-muted">{replace.length ? replace.join(", ") : "Noch nichts ausgewählt"}</p>
        </div>
      </div>
    </div>
  );
}
