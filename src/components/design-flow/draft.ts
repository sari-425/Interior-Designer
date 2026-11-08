import { designRequestSchema, type DesignRequest } from "@/modules/design-request/schema";
import { ROOM_ELEMENTS, type RoomElement } from "@/modules/design-request/options";
import type { WizardDraft } from "./types";

/** Wandelt die Budget-Eingabe ("1.500", "1500 €") in eine Zahl um. */
export function parseBudget(input: string): number | null {
  const digits = input.replace(/[^\d]/g, "");
  if (!digits) return null;
  const value = Number(digits);
  return Number.isSafeInteger(value) ? value : null;
}

/** Erzeugt aus dem Entwurf eine geprüfte Design-Anfrage. */
export function toDesignRequest(draft: WizardDraft) {
  const keep: RoomElement[] = ROOM_ELEMENTS.filter((e) => draft.elements[e] === "keep");
  const change: RoomElement[] = ROOM_ELEMENTS.filter((e) => draft.elements[e] === "change");
  return designRequestSchema.safeParse({
    roomType: draft.roomType ?? undefined,
    style: draft.style ?? undefined,
    colorWorld: draft.colorWorld ?? undefined,
    budget: parseBudget(draft.budgetInput) ?? undefined,
    furniture: draft.furniture,
    keep,
    change,
    notes: draft.notes,
    variants: draft.variants,
  } satisfies Partial<Record<keyof DesignRequest, unknown>>);
}

export type WizardStepId = "foto" | "raum" | "stil" | "wuensche" | "uebersicht";

/** Prüft einen einzelnen Schritt und liefert eine verständliche Fehlermeldung. */
export function validateStep(step: WizardStepId, draft: WizardDraft): string | null {
  switch (step) {
    case "foto":
      return draft.photo ? null : "Bitte lade zuerst ein Foto deines Raums hoch.";
    case "raum":
      return draft.roomType ? null : "Bitte wähle aus, welcher Raum es ist.";
    case "stil":
      return draft.style ? null : "Bitte wähle einen Designstil.";
    case "wuensche": {
      if (!draft.colorWorld) return "Bitte wähle eine Farbwelt.";
      const result = toDesignRequest(draft);
      if (result.success) return null;
      const relevant = result.error.issues.find((i) =>
        ["budget", "notes", "change", "variants", "furniture"].includes(String(i.path[0])),
      );
      return relevant?.message ?? null;
    }
    case "uebersicht":
      return null;
  }
}
