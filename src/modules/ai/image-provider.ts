/**
 * Rückwärtskompatible Einstiegsdatei. Die Typen der KI-Schicht liegen in
 * `types.ts`, die Fehlerarten in `errors.ts`.
 */
export type {
  GeneratedImage,
  ImageGenerationInput,
  ImageGenerationProvider,
  SourcePhoto,
} from "./types";
export { AiNotConfiguredError } from "./errors";
