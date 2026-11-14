import {
  LIVING_ROOM_ITEMS,
  ROOM_FEATURES,
  ROOM_SURFACES,
  SPECIAL_REQUIREMENTS,
  type LivingRoomItem,
  type RoomSurface,
} from "@/modules/design-request/options";
import { livingRoomRequestSchema, type LivingRoomRequest } from "@/modules/design-request/schema";
import type { WizardDraft } from "./types";

/** Wandelt die Budget-Eingabe ("1.500", "1500 €") in ganze Euro um. */
export function parseBudget(input: string): number | null {
  const digits = input.replace(/[^\d]/g, "");
  if (!digits) return null;
  const value = Number(digits);
  return Number.isSafeInteger(value) ? value : null;
}

/**
 * Liest die optionale Raumgröße ("24", "24,5", "24.5 m²").
 * Leere Eingabe ist erlaubt (null). Ungültige Eingaben ergeben NaN,
 * damit die Prüfung eine verständliche Meldung liefern kann.
 */
export function parseRoomSize(input: string): number | null {
  const cleaned = input.replace(/m²|m2|qm/gi, "").trim();
  if (!cleaned) return null;
  if (!/^\d{1,4}([.,]\d{1,2})?$/.test(cleaned)) return Number.NaN;
  return Number(cleaned.replace(",", "."));
}

export function itemsWith(draft: WizardDraft, decision: "keep" | "replace"): LivingRoomItem[] {
  return LIVING_ROOM_ITEMS.filter((item) => draft.items[item] === decision);
}

export function surfacesWith(draft: WizardDraft, decision: "keep" | "change"): RoomSurface[] {
  return ROOM_SURFACES.filter((surface) => draft.surfaces[surface] === decision);
}

/** Erzeugt aus dem Entwurf eine geprüfte Wohnzimmer-Anfrage. */
export function toLivingRoomRequest(draft: WizardDraft) {
  return livingRoomRequestSchema.safeParse({
    roomType: "wohnzimmer",
    roomSizeSqm: parseRoomSize(draft.roomSizeInput),
    roomFeatures: ROOM_FEATURES.filter((f) => draft.roomFeatures.includes(f)),
    style: draft.style ?? undefined,
    colorWorld: draft.colorWorld ?? undefined,
    atmosphere: draft.atmosphere ?? undefined,
    budgetEur: parseBudget(draft.budgetInput) ?? undefined,
    keep: itemsWith(draft, "keep"),
    replace: itemsWith(draft, "replace"),
    keepSurfaces: surfacesWith(draft, "keep"),
    changeSurfaces: surfacesWith(draft, "change"),
    requirements: SPECIAL_REQUIREMENTS.filter((r) => draft.requirements.includes(r)),
    notes: draft.notes,
    variants: draft.variants,
  } satisfies Record<keyof LivingRoomRequest, unknown>);
}

export type WizardStepId = "foto" | "stil" | "raum" | "moebel" | "uebersicht";

const STEP_FIELDS: Partial<Record<WizardStepId, readonly (keyof LivingRoomRequest)[]>> = {
  raum: ["roomSizeSqm", "roomFeatures", "colorWorld", "atmosphere", "budgetEur", "requirements", "notes", "variants"],
  moebel: ["keep", "replace", "keepSurfaces", "changeSurfaces"],
};

/** Prüft einen einzelnen Schritt und liefert eine verständliche Fehlermeldung. */
export function validateStep(step: WizardStepId, draft: WizardDraft): string | null {
  if (step === "foto") return draft.photo ? null : "Bitte lade zuerst ein Foto deines Wohnzimmers hoch.";
  if (step === "stil") return draft.style ? null : "Bitte wähle einen Einrichtungsstil.";
  const fields = STEP_FIELDS[step];
  if (!fields) return null;
  const result = toLivingRoomRequest(draft);
  if (result.success) return null;
  const issue = result.error.issues.find((i) => fields.includes(i.path[0] as keyof LivingRoomRequest));
  return issue?.message ?? null;
}
