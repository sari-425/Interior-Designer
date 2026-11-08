import type { LivingRoomRequest } from "@/modules/design-request/schema";

/**
 * Gemeinsame Typen der KI-Schicht.
 *
 * Die Gestaltung läuft in drei getrennten Schritten, die jeweils von einem
 * eigenen, austauschbaren Anbieter erledigt werden können:
 *   1. Bildanalyse    – was ist auf dem Foto zu sehen? (Bild-KI / Vision-Modell)
 *   2. Designplanung  – welche Varianten passen zu Wünschen und Budget? (Sprachmodell)
 *   3. Bildgenerierung – wie sieht der Raum danach aus? (Bild-KI)
 */

export type AcceptedImageMime = "image/jpeg" | "image/png" | "image/webp";

/** Raumfoto als Eingabe für die KI. Entweder im Speicher oder im privaten Bucket abgelegt. */
export type SourcePhoto =
  | { kind: "inline"; bytes: Uint8Array; mimeType: AcceptedImageMime; width: number; height: number }
  | {
      kind: "stored";
      /** Pfad im privaten Speicher, z. B. "<nutzer-id>/<projekt-id>/original.jpg" */
      storagePath: string;
      mimeType: AcceptedImageMime;
      width: number;
      height: number;
    };

/** Jeder Anbieter meldet, was ein Aufruf voraussichtlich und tatsächlich kostet (US-Cent). */
export interface CostInfo {
  /** Tatsächliche Kosten laut Anbieter, null wenn unbekannt */
  costUsdCents: number | null;
}

// ---------- 1. Bildanalyse ----------

export interface RoomAnalysis {
  /** Erkannte Möbel und Elemente, in den Begriffen von LIVING_ROOM_ITEMS soweit möglich */
  detectedItems: string[];
  lighting: "hell" | "mittel" | "dunkel" | "unbekannt";
  /** Kurze sachliche Beschreibung des Ausgangszustands */
  description: string;
  /** Warnungen, z. B. „Personen im Bild“ oder „Foto unscharf“ */
  warnings: string[];
}

export interface RoomAnalysisProvider {
  readonly id: string;
  readonly displayName: string;
  /** Geschätzte Kosten pro Aufruf in US-Cent (für die Kostenkontrolle vor dem Aufruf) */
  readonly estimatedCostUsdCents: number;
  analyze(input: { photo: SourcePhoto; signal: AbortSignal }): Promise<RoomAnalysis & CostInfo>;
}

// ---------- 2. Designplanung ----------

export interface DesignPlanVariant {
  title: string;
  /** Beschreibung für Nutzerinnen und Nutzer (Deutsch) */
  description: string;
  /** Anweisung für die Bild-KI (vom Planer erzeugt, Sprache je nach Anbieter) */
  imagePrompt: string;
  /**
   * Produktkategorien mit Budgetanteil, Grundlage für die spätere Produktsuche.
   * Die Summe darf das Budget der Anfrage nicht überschreiten (siehe output-schema.ts).
   */
  shoppingList: { category: string; budgetEur: number }[];
}

export interface DesignPlan {
  variants: DesignPlanVariant[];
}

export interface DesignPlanningProvider {
  readonly id: string;
  readonly displayName: string;
  readonly estimatedCostUsdCents: number;
  plan(input: {
    request: LivingRoomRequest;
    analysis: RoomAnalysis;
    brief: string;
    signal: AbortSignal;
  }): Promise<DesignPlan & CostInfo>;
}

// ---------- 3. Bildgenerierung ----------

export interface GeneratedImage {
  /** Entweder eine kurzlebige URL des Anbieters oder ein Pfad im privaten Speicher */
  url: string;
  width: number;
  height: number;
  /** Ergebnisse sind immer KI-generiert und werden so gekennzeichnet */
  aiGenerated: true;
}

export interface ImageGenerationInput {
  photo: SourcePhoto;
  variant: DesignPlanVariant;
  request: LivingRoomRequest;
  signal: AbortSignal;
}

export interface ImageGenerationProvider {
  readonly id: string;
  readonly displayName: string;
  /** Geschätzte Kosten pro erzeugtem Bild in US-Cent */
  readonly estimatedCostUsdCents: number;
  generate(input: ImageGenerationInput): Promise<GeneratedImage & CostInfo>;
}

// ---------- Ergebnis ----------

export interface DesignVariantResult {
  title: string;
  description: string;
  image: GeneratedImage;
  shoppingList: DesignPlanVariant["shoppingList"];
  /** Summe der Budgetaufteilung in Euro, liegt immer innerhalb von `DesignResult.budgetEur` */
  shoppingListTotalEur: number;
}

export interface DesignResult {
  variants: DesignVariantResult[];
  analysis: RoomAnalysis;
  /** Budget der Anfrage in Euro, gegen das jede Variante geprüft wurde */
  budgetEur: number;
  /** Summe der bekannten Kosten in US-Cent; null, wenn ein Anbieter keine Kosten meldet */
  costUsdCents: number | null;
  providers: { analysis: string; planning: string; generation: string };
}
