import { Button } from "@/components/ui/Button";
import { ATMOSPHERES, COLOR_WORLDS } from "@/modules/design-request/options";
import { getDesignStyle } from "@/modules/styles/styles";
import { itemsWith, parseBudget, parseRoomSize, toLivingRoomRequest, type WizardStepId } from "./draft";
import type { WizardDraft } from "./types";

interface SummaryStepProps {
  draft: WizardDraft;
  goTo: (step: WizardStepId) => void;
  onRestart: () => void;
}

interface Row {
  label: string;
  value: string;
  /** Schritt zum Korrigieren; ohne Angabe nicht änderbar */
  step?: WizardStepId;
}

function SummaryList({ title, rows, goTo }: { title: string; rows: Row[]; goTo: (s: WizardStepId) => void }) {
  return (
    <section>
      <h3 className="text-xl">{title}</h3>
      <dl className="mt-3 divide-y divide-line rounded-2xl border border-line bg-paper">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[7.5rem_1fr_auto] items-baseline gap-3 px-4 py-3 sm:grid-cols-[10rem_1fr_auto]">
            <dt className="text-sm text-muted">{row.label}</dt>
            <dd className="break-words">{row.value}</dd>
            <dd>
              {row.step && (
                <button
                  type="button"
                  onClick={() => row.step && goTo(row.step)}
                  aria-label={`${row.label} ändern`}
                  className="min-h-11 text-sm underline underline-offset-4 hover:text-taupe-deep"
                >
                  Ändern
                </button>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function SummaryStep({ draft, goTo, onRestart }: SummaryStepProps) {
  const result = toLivingRoomRequest(draft);
  const size = parseRoomSize(draft.roomSizeInput);
  const budget = parseBudget(draft.budgetInput);
  const keep = itemsWith(draft, "keep");
  const replace = itemsWith(draft, "replace");
  const none = "Keine Angabe";

  const roomRows: Row[] = [
    { label: "Raum", value: "Wohnzimmer" },
    {
      label: "Raumgröße",
      value: size !== null && Number.isFinite(size) ? `${size.toLocaleString("de-DE")} m²` : none,
      step: "raum",
    },
    { label: "Einrichtungsstil", value: draft.style ? getDesignStyle(draft.style).name : none, step: "stil" },
    { label: "Farben", value: COLOR_WORLDS.find((c) => c.id === draft.colorWorld)?.name ?? none, step: "raum" },
    { label: "Atmosphäre", value: ATMOSPHERES.find((a) => a.id === draft.atmosphere)?.name ?? none, step: "raum" },
    { label: "Budget", value: budget ? `bis ${budget.toLocaleString("de-DE")} €` : none, step: "raum" },
    { label: "Wünsche", value: draft.notes.trim() || none, step: "raum" },
  ];
  const furnitureRows: Row[] = [
    { label: "Bleibt", value: keep.length ? keep.join(", ") : "Nichts ausgewählt", step: "moebel" },
    { label: "Wird ersetzt", value: replace.length ? replace.join(", ") : "Nichts ausgewählt", step: "moebel" },
  ];

  return (
    <div>
      <h2 className="text-3xl">Deine Zusammenfassung</h2>
      <p className="mt-3 text-muted">Prüfe deine Angaben. Mit „Ändern“ kommst du direkt zum passenden Schritt.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.25fr]">
        <section>
          <h3 className="text-xl">Dein Foto</h3>
          {draft.photo && (
            <div className="mt-3 overflow-hidden rounded-[var(--radius-card)] bg-sand">
              {/* Lokale Vorschau aus dem Browser-Speicher, daher kein next/image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={draft.photo.url} alt="Dein Wohnzimmerfoto" className="aspect-[4/3] w-full object-cover" />
            </div>
          )}
          <button
            type="button"
            onClick={() => goTo("foto")}
            className="mt-3 min-h-11 text-sm underline underline-offset-4 hover:text-taupe-deep"
          >
            Foto austauschen
          </button>
        </section>
        <div className="space-y-8">
          <SummaryList title="Raumangaben" rows={roomRows} goTo={goTo} />
          <SummaryList title="Möbel" rows={furnitureRows} goTo={goTo} />
        </div>
      </div>

      <div role="status" className="mt-10 rounded-[var(--radius-card)] border border-taupe/50 bg-sand/40 p-6">
        {result.success ? (
          <>
            <p className="text-lg font-semibold">Deine Angaben sind vollständig.</p>
            <p className="mt-2 leading-relaxed text-muted">
              Die KI-Gestaltung richten wir gerade ein. In dieser Vorschauversion wird dein Projekt deshalb noch nicht
              abgeschickt, gespeichert oder von einer KI bearbeitet. Sobald es so weit ist, startest du hier dein
              neues Wohnzimmer-Design.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold">Es fehlen noch Angaben.</p>
            <p className="mt-2 text-muted">{result.error.issues[0]?.message}</p>
          </>
        )}
      </div>

      <div className="mt-8">
        <Button variant="secondary" onClick={onRestart}>
          Neues Projekt beginnen
        </Button>
      </div>
    </div>
  );
}
