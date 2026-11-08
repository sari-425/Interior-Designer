import { Button } from "@/components/ui/Button";
import { COLOR_WORLDS, ROOM_ELEMENTS } from "@/modules/design-request/options";
import { ROOM_TYPES } from "@/modules/rooms/room-types";
import { getDesignStyle } from "@/modules/styles/styles";
import { parseBudget, toDesignRequest, type WizardStepId } from "./draft";
import type { WizardDraft } from "./types";

interface SummaryStepProps {
  draft: WizardDraft;
  goTo: (step: WizardStepId) => void;
  onRestart: () => void;
}

export function SummaryStep({ draft, goTo, onRestart }: SummaryStepProps) {
  const result = toDesignRequest(draft);
  const room = ROOM_TYPES.find((r) => r.id === draft.roomType)?.name;
  const style = draft.style ? getDesignStyle(draft.style).name : undefined;
  const color = COLOR_WORLDS.find((c) => c.id === draft.colorWorld)?.name;
  const budget = parseBudget(draft.budgetInput);
  const keep = ROOM_ELEMENTS.filter((e) => draft.elements[e] === "keep");
  const change = ROOM_ELEMENTS.filter((e) => draft.elements[e] === "change");

  const rows: { label: string; value: string; step: WizardStepId }[] = [
    { label: "Raum", value: room ?? "–", step: "raum" },
    { label: "Stil", value: style ?? "–", step: "stil" },
    { label: "Farbwelt", value: color ?? "–", step: "wuensche" },
    { label: "Budget", value: budget ? `${budget.toLocaleString("de-DE")} €` : "–", step: "wuensche" },
    { label: "Gewünschte Möbel", value: draft.furniture.length ? draft.furniture.join(", ") : "Keine Vorgabe", step: "wuensche" },
    { label: "Bleibt erhalten", value: keep.length ? keep.join(", ") : "Keine Vorgabe", step: "wuensche" },
    { label: "Darf sich ändern", value: change.length ? change.join(", ") : "Keine Vorgabe", step: "wuensche" },
    { label: "Sonstige Wünsche", value: draft.notes.trim() || "–", step: "wuensche" },
    { label: "Designvarianten", value: String(draft.variants), step: "wuensche" },
  ];

  return (
    <div>
      <h2 className="text-3xl">Deine Auswahl</h2>
      <p className="mt-3 text-muted">Prüfe deine Angaben. Mit „Ändern“ kommst du direkt zum passenden Schritt.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {draft.photo && (
          <div className="overflow-hidden rounded-[var(--radius-card)] bg-sand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={draft.photo.url} alt="Dein Raumfoto" className="aspect-[4/3] w-full object-cover" />
          </div>
        )}
        <dl className="divide-y divide-line rounded-2xl border border-line bg-paper">
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-[8.5rem_1fr_auto] items-baseline gap-3 px-4 py-3 sm:grid-cols-[10rem_1fr_auto]">
              <dt className="text-sm text-muted">{row.label}</dt>
              <dd className="break-words">{row.value}</dd>
              <dd>
                <button
                  type="button"
                  onClick={() => goTo(row.step)}
                  aria-label={`${row.label} ändern`}
                  className="min-h-11 text-sm underline underline-offset-4 hover:text-taupe-deep"
                >
                  Ändern
                </button>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div role="status" className="mt-8 rounded-[var(--radius-card)] border border-taupe/50 bg-sand/40 p-6">
        {result.success ? (
          <>
            <p className="text-lg font-semibold">Deine Auswahl ist vollständig.</p>
            <p className="mt-2 leading-relaxed text-muted">
              Die KI-Gestaltung richten wir gerade ein. In dieser Vorschauversion kann deshalb noch kein Design
              erzeugt werden. Sobald es so weit ist, startest du hier deine Neugestaltung.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold">Es fehlen noch Angaben.</p>
            <p className="mt-2 text-muted">{result.error.issues[0]?.message}</p>
          </>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" onClick={onRestart}>
          Neu beginnen
        </Button>
      </div>
    </div>
  );
}
