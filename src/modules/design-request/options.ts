/** Auswahlmöglichkeiten für ein Wohnzimmer-Projekt */

export const COLOR_WORLDS = [
  { id: "hell-natuerlich", name: "Hell und natürlich", swatches: ["#f4f1eb", "#d9c3a3", "#b9a58c"] },
  { id: "warm-erdig", name: "Warm und erdig", swatches: ["#efe3d3", "#c99a6e", "#7a6a3f"] },
  { id: "ruhig-gruen", name: "Ruhiges Grün", swatches: ["#e6e7df", "#a9ae9b", "#5c6152"] },
  { id: "kuehl-hell", name: "Kühl und klar", swatches: ["#eef0f0", "#c4cacb", "#6f7a7d"] },
  { id: "dunkel-elegant", name: "Dunkel und elegant", swatches: ["#bfae96", "#5a4a3b", "#2b2b27"] },
  { id: "passend-zum-stil", name: "Passend zum Stil", swatches: ["#f2ede5", "#d8c8b5", "#a58d71"] },
] as const;
export type ColorWorldId = (typeof COLOR_WORLDS)[number]["id"];
export const COLOR_WORLD_IDS = COLOR_WORLDS.map((c) => c.id) as [ColorWorldId, ...ColorWorldId[]];

export const ATMOSPHERES = [
  { id: "gemuetlich", name: "Gemütlich", description: "Warm, weich, zum Ankommen" },
  { id: "hell-luftig", name: "Hell und luftig", description: "Offen, leicht, viel Licht" },
  { id: "ruhig", name: "Ruhig und entspannt", description: "Wenig Ablenkung, zum Abschalten" },
  { id: "elegant", name: "Elegant", description: "Edel, aufgeräumt, stilvoll" },
  { id: "lebendig", name: "Lebendig", description: "Mutig, mit Charakter" },
  { id: "familienfreundlich", name: "Familienfreundlich", description: "Robust, praktisch, viel Platz" },
] as const;
export type AtmosphereId = (typeof ATMOSPHERES)[number]["id"];
export const ATMOSPHERE_IDS = ATMOSPHERES.map((a) => a.id) as [AtmosphereId, ...AtmosphereId[]];

/** Typische Wohnzimmer-Möbel, die behalten oder ersetzt werden können */
export const LIVING_ROOM_ITEMS = [
  "Sofa",
  "Sessel",
  "Couchtisch",
  "Fernseher",
  "TV-Möbel",
  "Regal",
  "Sideboard",
  "Esstisch und Stühle",
  "Teppich",
  "Vorhänge",
  "Beleuchtung",
  "Pflanzen",
  "Dekoration",
] as const;
export type LivingRoomItem = (typeof LIVING_ROOM_ITEMS)[number];

/** Was mit einem vorhandenen Möbelstück passieren soll */
export const ITEM_DECISIONS = [
  { id: "none", label: "Nicht vorhanden" },
  { id: "keep", label: "Behalten" },
  { id: "replace", label: "Ersetzen" },
] as const;
export type ItemDecision = (typeof ITEM_DECISIONS)[number]["id"];

/**
 * Raum und Oberflächen (aus Phase 1 übernommen). „Vorhandene Möbel“ wird jetzt
 * einzeln über LIVING_ROOM_ITEMS erfasst, „Beleuchtung“ ebenfalls dort.
 */
export const ROOM_SURFACES = ["Bodenbelag", "Wandfarbe", "Decke", "Einbauten (z. B. Schränke)", "Heizkörper"] as const;
export type RoomSurface = (typeof ROOM_SURFACES)[number];

export const SURFACE_DECISIONS = [
  { id: "open", label: "Egal" },
  { id: "keep", label: "Behalten" },
  { id: "change", label: "Darf sich ändern" },
] as const;
export type SurfaceDecision = (typeof SURFACE_DECISIONS)[number]["id"];

/** Merkmale des Raums, die die Gestaltung beeinflussen (Mehrfachauswahl, optional) */
export const ROOM_FEATURES = [
  "Viel Tageslicht",
  "Wenig Tageslicht",
  "Große Fensterfront",
  "Dachschräge",
  "Niedrige Decke",
  "Hohe Decke",
  "Offener Wohn- und Essbereich",
  "Kamin oder Ofen",
  "Balkon- oder Terrassentür",
] as const;
export type RoomFeature = (typeof ROOM_FEATURES)[number];

/** Besondere Anforderungen an die Einrichtung (Mehrfachauswahl, optional) */
export const SPECIAL_REQUIREMENTS = [
  "Kinderfreundlich",
  "Haustiere im Haushalt",
  "Viel Stauraum",
  "Homeoffice-Ecke",
  "Barrierearm",
  "Pflegeleichte Materialien",
  "Platz für Gäste",
] as const;
export type SpecialRequirement = (typeof SPECIAL_REQUIREMENTS)[number];

export const VARIANT_COUNTS = [1, 2, 3, 4] as const;
export type VariantCount = (typeof VARIANT_COUNTS)[number];

export const BUDGET_PRESETS = [500, 1000, 1500, 2500, 5000] as const;
export const BUDGET_MIN = 100;
export const BUDGET_MAX = 50_000;

export const ROOM_SIZE_MIN = 5;
export const ROOM_SIZE_MAX = 200;

export const NOTES_MAX = 500;
