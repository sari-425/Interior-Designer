export const ROOM_TYPES = [
  { id: "wohnzimmer", name: "Wohnzimmer" },
  { id: "schlafzimmer", name: "Schlafzimmer" },
  { id: "kueche", name: "Küche" },
  { id: "bad", name: "Bad" },
  { id: "kinderzimmer", name: "Kinderzimmer" },
  { id: "buero", name: "Büro" },
  { id: "sonstige", name: "Sonstiger Raum" },
] as const;

export type RoomTypeId = (typeof ROOM_TYPES)[number]["id"];

export const ROOM_TYPE_IDS = ROOM_TYPES.map((r) => r.id) as [RoomTypeId, ...RoomTypeId[]];
