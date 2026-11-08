import type { DesignStyleId } from "@/modules/styles/styles";
import type { AtmosphereId, ColorWorldId, ItemDecision, LivingRoomItem } from "@/modules/design-request/options";

export interface RoomPhoto {
  /** Lokale Objekt-URL, nur in diesem Browser-Tab gültig */
  url: string;
  name: string;
  size: number;
  width: number;
  height: number;
}

/** Zwischenstand des Wohnzimmer-Projekts während der Eingabe */
export interface WizardDraft {
  photo: RoomPhoto | null;
  style: DesignStyleId | null;
  roomSizeInput: string;
  colorWorld: ColorWorldId | null;
  atmosphere: AtmosphereId | null;
  budgetInput: string;
  items: Partial<Record<LivingRoomItem, ItemDecision>>;
  notes: string;
}

export const INITIAL_DRAFT: WizardDraft = {
  photo: null,
  style: null,
  roomSizeInput: "",
  colorWorld: null,
  atmosphere: null,
  budgetInput: "1500",
  items: {},
  notes: "",
};
