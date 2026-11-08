/**
 * Raumtypen. DesignBySari startet ausschließlich mit Wohnzimmern.
 * Weitere Raumtypen werden hier ergänzt, sobald sie unterstützt werden.
 */
export const ROOM_TYPES = [{ id: "wohnzimmer", name: "Wohnzimmer" }] as const;

export type RoomTypeId = (typeof ROOM_TYPES)[number]["id"];

export const DEFAULT_ROOM_TYPE: RoomTypeId = "wohnzimmer";
