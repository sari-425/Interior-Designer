import type { LivingRoomRequest } from "@/modules/design-request/schema";

/**
 * Gemeinsame Schnittstelle für alle KI-Bildanbieter.
 *
 * Der Rest der Anwendung spricht ausschließlich mit dieser Schnittstelle.
 * Ein konkreter Anbieter (z. B. fal.ai, Replicate, OpenAI) wird später als
 * eigene Datei ergänzt und in `registry.ts` eingetragen. API-Schlüssel werden
 * nur serverseitig aus Umgebungsvariablen gelesen und nie im Code gespeichert.
 */

export interface SourcePhoto {
  /** Pfad im privaten Speicher, z. B. "<nutzer-id>/<projekt-id>/original.jpg" */
  storagePath: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  width: number;
  height: number;
}

export interface ImageGenerationInput {
  projectId: string;
  request: LivingRoomRequest;
  photo: SourcePhoto;
  variantCount: number;
}

export interface GeneratedImage {
  storagePath: string;
  width: number;
  height: number;
  /** Ergebnisse sind immer KI-generiert und werden so gekennzeichnet */
  aiGenerated: true;
}

export type ImageGenerationResult =
  | {
      status: "succeeded";
      providerId: string;
      images: GeneratedImage[];
      /** Tatsächliche Kosten laut Anbieter in US-Cent, falls bekannt */
      costUsdCents: number | null;
    }
  | { status: "failed"; providerId: string; error: string; retryable: boolean };

export interface ImageGenerationProvider {
  readonly id: string;
  readonly displayName: string;
  generate(input: ImageGenerationInput): Promise<ImageGenerationResult>;
}

/** Wird geworfen, solange kein KI-Anbieter eingerichtet und freigegeben ist. */
export class AiNotConfiguredError extends Error {
  constructor(message = "Die KI-Bildgenerierung ist noch nicht eingerichtet.") {
    super(message);
    this.name = "AiNotConfiguredError";
  }
}
