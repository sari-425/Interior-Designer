/** Auswahlmöglichkeiten der Design-Konfiguration */

export const COLOR_WORLDS = [
  { id: "hell-natuerlich", name: "Hell und natürlich", swatches: ["#f4f1eb", "#d9c3a3", "#b9a58c"] },
  { id: "warm-erdig", name: "Warm und erdig", swatches: ["#efe3d3", "#c99a6e", "#7a6a3f"] },
  { id: "ruhig-gruen", name: "Ruhiges Grün", swatches: ["#e6e7df", "#a9ae9b", "#5c6152"] },
  { id: "kuehl-hell", name: "Kühl und klar", swatches: ["#eef0f0", "#c4cacb", "#6f7a7d"] },
  { id: "dunkel-elegant", name: "Dunkel und elegant", swatches: ["#bfae96", "#5a4a3b", "#2b2b27"] },
  { id: "ueberrasch-mich", name: "Passend zum Stil", swatches: ["#f2ede5", "#d8c8b5", "#a58d71"] },
] as const;
export type ColorWorldId = (typeof COLOR_WORLDS)[number]["id"];
export const COLOR_WORLD_IDS = COLOR_WORLDS.map((c) => c.id) as [ColorWorldId, ...ColorWorldId[]];

export const FURNITURE_OPTIONS = [
  "Sofa",
  "Sessel",
  "Couchtisch",
  "Esstisch und Stühle",
  "Bett",
  "Kleiderschrank",
  "Regal",
  "Sideboard",
  "Schreibtisch",
  "Teppich",
  "Leuchten",
  "Vorhänge",
  "Pflanzen",
  "Dekoration",
] as const;
export type FurnitureOption = (typeof FURNITURE_OPTIONS)[number];

/** Raumelemente, die erhalten oder verändert werden können */
export const ROOM_ELEMENTS = [
  "Bodenbelag",
  "Wandfarbe",
  "Decke und Beleuchtung",
  "Einbauten (z. B. Küche, Schränke)",
  "Vorhandene Möbel",
  "Heizkörper",
] as const;
export type RoomElement = (typeof ROOM_ELEMENTS)[number];

export const BUDGET_PRESETS = [500, 1000, 1500, 2500, 5000] as const;
export const BUDGET_MIN = 100;
export const BUDGET_MAX = 50_000;

export const VARIANT_COUNTS = [1, 2, 3, 4] as const;
export type VariantCount = (typeof VARIANT_COUNTS)[number];
