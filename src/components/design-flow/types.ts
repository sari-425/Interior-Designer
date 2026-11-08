import type { DesignStyleId } from "@/modules/styles/styles";
import type { RoomTypeId } from "@/modules/rooms/room-types";
import type { ColorWorldId, FurnitureOption, RoomElement, VariantCount } from "@/modules/design-request/options";

export interface RoomPhoto {
  /** Lokale Objekt-URL, nur im Browser gültig */
  url: string;
  name: string;
  size: number;
  width: number;
  height: number;
}

export type ElementChoice = "keep" | "change" | "open";

export interface WizardDraft {
  photo: RoomPhoto | null;
  roomType: RoomTypeId | null;
  style: DesignStyleId | null;
  colorWorld: ColorWorldId | null;
  budgetInput: string;
  furniture: FurnitureOption[];
  elements: Partial<Record<RoomElement, ElementChoice>>;
  notes: string;
  variants: VariantCount;
}

export const INITIAL_DRAFT: WizardDraft = {
  photo: null,
  roomType: null,
  style: null,
  colorWorld: null,
  budgetInput: "1500",
  furniture: [],
  elements: {},
  notes: "",
  variants: 2,
};
