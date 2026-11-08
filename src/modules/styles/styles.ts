/**
 * Designstile als Konfiguration.
 * Neue Stile werden hier ergänzt; Oberfläche und spätere KI-Prompts
 * lesen ausschließlich aus dieser Liste.
 */
export type DesignStyleId =
  | "modern"
  | "skandinavisch"
  | "minimalistisch"
  | "industrial"
  | "boho"
  | "klassisch"
  | "luxus"
  | "japandi";

export interface DesignStyle {
  id: DesignStyleId;
  name: string;
  description: string;
  /** Typische Merkmale, kurz und verständlich */
  traits: readonly string[];
  /** Farben für die Illustration des Stils (keine Produktfarben) */
  palette: {
    wall: string;
    floor: string;
    sofa: string;
    accent: string;
    rug: string;
  };
}

export const DESIGN_STYLES: readonly DesignStyle[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Klare Linien, ruhige Flächen und gezielte Akzente.",
    traits: ["Klare Formen", "Neutrale Basis", "Wenige starke Akzente"],
    palette: { wall: "#ece7df", floor: "#b9a58c", sofa: "#5f6159", accent: "#35352f", rug: "#d8c8b5" },
  },
  {
    id: "skandinavisch",
    name: "Skandinavisch",
    description: "Hell, natürlich und gemütlich mit viel Holz.",
    traits: ["Helles Holz", "Weiche Textilien", "Viel Tageslicht"],
    palette: { wall: "#f4f1eb", floor: "#d9c3a3", sofa: "#c9c2b6", accent: "#777c6b", rug: "#ebe3d6" },
  },
  {
    id: "minimalistisch",
    name: "Minimalistisch",
    description: "Weniger Dinge, mehr Ruhe. Jedes Stück hat seinen Platz.",
    traits: ["Reduziert", "Offene Flächen", "Verborgener Stauraum"],
    palette: { wall: "#f2efe9", floor: "#cfc3b3", sofa: "#e2dcd2", accent: "#a58d71", rug: "#ece6dc" },
  },
  {
    id: "industrial",
    name: "Industrial",
    description: "Rohe Materialien, Metall und dunkle Töne im Loft-Charakter.",
    traits: ["Metall und Holz", "Dunkle Akzente", "Offene Struktur"],
    palette: { wall: "#c9c3ba", floor: "#6f5d4a", sofa: "#4a4a44", accent: "#2b2b27", rug: "#8d8577" },
  },
  {
    id: "boho",
    name: "Boho",
    description: "Warm, entspannt und persönlich mit Mustern und Pflanzen.",
    traits: ["Natürliche Fasern", "Muster", "Viele Pflanzen"],
    palette: { wall: "#efe3d3", floor: "#b48a62", sofa: "#c99a6e", accent: "#7a6a3f", rug: "#d9b892" },
  },
  {
    id: "klassisch",
    name: "Klassisch",
    description: "Zeitlose Eleganz mit symmetrischer Ordnung.",
    traits: ["Symmetrie", "Edle Stoffe", "Zeitlose Formen"],
    palette: { wall: "#ebe4d8", floor: "#8e6f52", sofa: "#7b8471", accent: "#5c4a36", rug: "#cdbba2" },
  },
  {
    id: "luxus",
    name: "Luxus",
    description: "Hochwertige Materialien und eine ruhige, edle Atmosphäre.",
    traits: ["Samt und Stein", "Warme Metalle", "Dezente Beleuchtung"],
    palette: { wall: "#dcd3c6", floor: "#5a4a3b", sofa: "#35352f", accent: "#a58d71", rug: "#bfae96" },
  },
  {
    id: "japandi",
    name: "Japandi",
    description: "Japanische Ruhe trifft skandinavische Wärme.",
    traits: ["Niedrige Möbel", "Naturtöne", "Handwerk"],
    palette: { wall: "#ede7dd", floor: "#a88d6d", sofa: "#bdb3a3", accent: "#4c4a40", rug: "#d6cab8" },
  },
] as const;

export const DESIGN_STYLE_IDS = DESIGN_STYLES.map((s) => s.id) as [
  DesignStyleId,
  ...DesignStyleId[],
];

export function getDesignStyle(id: DesignStyleId): DesignStyle {
  const style = DESIGN_STYLES.find((s) => s.id === id);
  if (!style) throw new Error(`Unbekannter Designstil: ${id}`);
  return style;
}
