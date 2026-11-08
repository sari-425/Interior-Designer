"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { validateStep, type WizardStepId } from "./draft";
import { PhotoStep } from "./PhotoStep";
import { FurnitureStep } from "./FurnitureStep";
import { RoomDetailsStep } from "./RoomDetailsStep";
import { StyleStep } from "./StyleStep";
import { SummaryStep } from "./SummaryStep";
import { INITIAL_DRAFT, type WizardDraft } from "./types";

const STEPS: { id: WizardStepId; label: string }[] = [
  { id: "foto", label: "Foto" },
  { id: "stil", label: "Stil" },
  { id: "raum", label: "Raum" },
  { id: "moebel", label: "Möbel" },
  { id: "uebersicht", label: "Übersicht" },
];

export function DesignWizard() {
  const [draft, setDraft] = useState<WizardDraft>(INITIAL_DRAFT);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const photoUrl = useRef<string | null>(null);

  const step = STEPS[index];
  const update = (patch: Partial<WizardDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setError(null);
  };

  // Lokale Bild-URL beim Verlassen der Seite freigeben
  useEffect(() => {
    photoUrl.current = draft.photo?.url ?? null;
  }, [draft.photo]);
  useEffect(() => () => {
    if (photoUrl.current) URL.revokeObjectURL(photoUrl.current);
  }, []);

  // Nach Schrittwechsel: nach oben scrollen und Fokus setzen (Tastatur, Screenreader)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    panelRef.current?.focus({ preventScroll: true });
  }, [index]);

  function next() {
    const problem = validateStep(step.id, draft);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setIndex((i) => Math.max(i - 1, 0));
  }

  function goTo(id: WizardStepId) {
    setError(null);
    setIndex(STEPS.findIndex((s) => s.id === id));
  }

  function restart() {
    if (draft.photo) URL.revokeObjectURL(draft.photo.url);
    setDraft(INITIAL_DRAFT);
    setError(null);
    setIndex(0);
  }

  /** Ein Schritt ist anklickbar, wenn alle vorherigen gültig sind. */
  const reachable = (target: number) =>
    STEPS.slice(0, target).every((s) => validateStep(s.id, draft) === null);

  return (
    <div ref={rootRef} className="scroll-mt-24">
      <nav aria-label="Fortschritt" className="mb-10">
        <ol className="grid grid-cols-5 gap-2">
          {STEPS.map((s, i) => {
            const state = i < index ? "done" : i === index ? "current" : "todo";
            const canJump = i !== index && reachable(i);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => canJump && goTo(s.id)}
                  disabled={!canJump}
                  aria-current={state === "current" ? "step" : undefined}
                  className="group flex w-full flex-col gap-2 text-left disabled:cursor-default"
                >
                  <span
                    className={`h-1 rounded-full ${state === "todo" ? "bg-line" : state === "current" ? "bg-charcoal" : "bg-taupe"}`}
                  />
                  <span
                    className={`text-xs sm:text-sm ${state === "current" ? "font-semibold text-charcoal" : "text-muted"} ${canJump ? "group-hover:text-charcoal" : ""}`}
                  >
                    <span className="hidden sm:inline">{i + 1}. </span>
                    {s.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div ref={panelRef} tabIndex={-1} className="outline-none" aria-live="polite">
        {step.id === "foto" && <PhotoStep photo={draft.photo} onChange={(photo) => update({ photo })} />}
        {step.id === "stil" && <StyleStep value={draft.style} onChange={(style) => update({ style })} />}
        {step.id === "raum" && <RoomDetailsStep draft={draft} update={update} />}
        {step.id === "moebel" && <FurnitureStep draft={draft} update={update} />}
        {step.id === "uebersicht" && <SummaryStep draft={draft} goTo={goTo} onRestart={restart} />}
      </div>

      {error && (
        <p role="alert" className="mt-8 rounded-xl bg-error/10 px-4 py-3 text-error">
          {error}
        </p>
      )}

      {step.id !== "uebersicht" && (
        <div className="sticky bottom-0 -mx-4 mt-10 flex items-center justify-between gap-3 border-t border-line bg-cream/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0">
          {index > 0 ? (
            <Button variant="secondary" onClick={back}>
              Zurück
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={next} size="lg">
            {index === STEPS.length - 2 ? "Zur Zusammenfassung" : "Weiter"}
          </Button>
        </div>
      )}
    </div>
  );
}
