"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { LivingRoomRequest } from "@/modules/design-request/schema";
import type { DesignResult } from "@/modules/ai/types";
import { getDesignStyle } from "@/modules/styles/styles";
import type { RoomPhoto } from "./types";

interface ResultPanelProps {
  request: LivingRoomRequest;
  photo: RoomPhoto;
  /** Vom Server ermittelt: Sind alle KI-Anbieter eingerichtet? */
  aiEnabled: boolean;
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; result: DesignResult };

const euro = (n: number) => `${n.toLocaleString("de-DE")} €`;

/**
 * Ergebnisansicht. Ist die KI nicht eingerichtet, wird nichts übertragen und
 * offen erklärt, was später hier erscheint. Ist sie eingerichtet, werden
 * Angaben und Foto an /api/designs geschickt und die KI-Ergebnisse
 * gekennzeichnet angezeigt.
 */
export function ResultPanel({ request, photo, aiEnabled }: ResultPanelProps) {
  const [state, setState] = useState<State>({ status: "idle" });
  const style = getDesignStyle(request.style);

  async function requestDesign() {
    setState({ status: "loading" });
    try {
      const blob = await fetch(photo.url).then((r) => r.blob());
      const form = new FormData();
      form.set("request", JSON.stringify(request));
      form.set("photo", new File([blob], photo.name, { type: blob.type }));
      const response = await fetch("/api/designs", { method: "POST", body: form });
      const body = (await response.json().catch(() => null)) as
        | { ok: true; result: DesignResult }
        | { ok: false; message: string }
        | null;
      if (body?.ok) setState({ status: "done", result: body.result });
      else setState({ status: "error", message: body?.message ?? "Die Gestaltung ist fehlgeschlagen. Bitte versuche es erneut." });
    } catch {
      setState({ status: "error", message: "Keine Verbindung. Bitte prüfe dein Internet und versuche es erneut." });
    }
  }

  return (
    <section aria-labelledby="ergebnis-titel" className="mt-10 rounded-[var(--radius-card)] border border-line bg-paper p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="ergebnis-titel" className="text-2xl">
          Dein Ergebnis
        </h3>
        {!aiEnabled && <Badge>KI-Gestaltung in Vorbereitung</Badge>}
      </div>

      {!aiEnabled && (
        <>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            Die KI ist noch nicht angebunden. Deshalb wird hier noch kein Design erzeugt und dein Foto wird nicht
            übertragen. Sobald die KI-Gestaltung startet, siehst du an dieser Stelle:
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            <li className="rounded-2xl bg-sand/40 p-4">
              <p className="font-semibold">
                {request.variants} {request.variants === 1 ? "Designvariante" : "Designvarianten"}
              </p>
              <p className="mt-1 text-sm text-muted">im Stil {style.name}, als KI-Bild gekennzeichnet</p>
            </li>
            <li className="rounded-2xl bg-sand/40 p-4">
              <p className="font-semibold">Budgetaufteilung bis {euro(request.budgetEur)}</p>
              <p className="mt-1 text-sm text-muted">je Variante nach Kategorien, geprüft gegen dein Budget</p>
            </li>
            <li className="rounded-2xl bg-sand/40 p-4">
              <p className="font-semibold">Echte Produkte folgen später</p>
              <p className="mt-1 text-sm text-muted">Eine Einkaufsliste ist in Vorbereitung und noch nicht enthalten</p>
            </li>
          </ul>
          <Button className="mt-6" disabled aria-describedby="ergebnis-titel">
            Design erstellen (noch nicht verfügbar)
          </Button>
        </>
      )}

      {aiEnabled && state.status !== "done" && (
        <>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">
            Wenn du auf „Design erstellen“ tippst, werden deine Angaben und dein Foto verschlüsselt an DesignBySari
            übertragen und von einer KI bearbeitet.
          </p>
          <Button className="mt-6" size="lg" onClick={requestDesign} disabled={state.status === "loading"}>
            {state.status === "loading" ? "Design wird erstellt …" : "Design erstellen"}
          </Button>
          {state.status === "error" && (
            <p role="alert" className="mt-4 rounded-xl bg-error/10 px-4 py-3 text-error">
              {state.message}
            </p>
          )}
        </>
      )}

      {state.status === "done" && (
        <div className="mt-6 space-y-10">
          {state.result.analysis.warnings.length > 0 && (
            <p className="rounded-xl bg-sand/40 px-4 py-3 text-sm">Hinweis: {state.result.analysis.warnings.join(" ")}</p>
          )}
          {state.result.variants.map((variant, i) => (
            <article key={i} className="grid gap-5 md:grid-cols-2">
              <figure className="relative overflow-hidden rounded-2xl bg-sand">
                {/* Bild des KI-Anbieters, Größe unbekannt, daher kein next/image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={variant.image.url} alt={`KI-Entwurf: ${variant.title}`} className="aspect-[4/3] w-full object-cover" />
                <Badge tone="demo" className="absolute left-3 top-3">
                  KI-generiert
                </Badge>
              </figure>
              <div>
                <h4 className="text-xl">{variant.title}</h4>
                <p className="mt-2 leading-relaxed text-muted">{variant.description}</p>
                {variant.shoppingList.length > 0 && (
                  <>
                    <p className="mt-4 text-sm font-semibold">Budgetaufteilung</p>
                    <ul className="mt-2 divide-y divide-line text-sm">
                      {variant.shoppingList.map((item) => (
                        <li key={item.category} className="flex justify-between py-1.5">
                          <span>{item.category}</span>
                          <span>{euro(item.budgetEur)}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="mt-4 text-xs text-muted">
                  Abgebildete Möbel sind KI-Entwürfe und keine konkreten Produkte. Passende echte Produkte folgen mit
                  der Produktsuche.
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
