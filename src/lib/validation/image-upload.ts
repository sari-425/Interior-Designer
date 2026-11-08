/**
 * Prüfung hochgeladener Raumfotos.
 *
 * Geprüft wird dreifach: Dateityp laut Browser, tatsächlicher Dateiinhalt
 * (Signatur der ersten Bytes) und Bildmaße. Dieselben Funktionen werden ab
 * Phase 2 auch serverseitig verwendet, denn Angaben des Browsers allein
 * sind nicht vertrauenswürdig.
 */

export const ACCEPTED_IMAGE_TYPES = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type AcceptedMimeType = keyof typeof ACCEPTED_IMAGE_TYPES;
export type ImageFormat = (typeof ACCEPTED_IMAGE_TYPES)[AcceptedMimeType];

export const ACCEPT_ATTRIBUTE = ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MIN_IMAGE_SIDE = 480; // kürzere Seite in Pixeln
export const MIN_IMAGE_LONG_SIDE = 640; // längere Seite in Pixeln
export const MAX_IMAGE_SIDE = 12_000;

/** Anzahl Bytes, die für die Formaterkennung gelesen werden müssen */
export const SIGNATURE_BYTES = 12;

export type ImageValidationResult =
  | { ok: true; format: ImageFormat }
  | { ok: false; error: string };

export function isAcceptedMimeType(type: string): type is AcceptedMimeType {
  return Object.prototype.hasOwnProperty.call(ACCEPTED_IMAGE_TYPES, type);
}

/** Erkennt JPEG, PNG oder WebP anhand der Datei-Signatur. */
export function detectImageFormat(bytes: Uint8Array): ImageFormat | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpeg";
  }
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length >= png.length && png.every((b, i) => bytes[i] === b)) {
    return "png";
  }
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (bytes.length >= 12 && ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") {
    return "webp";
  }
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

/** Prüft Dateityp, Größe und Inhalt. */
export function validateImageFile(
  file: { type: string; size: number },
  signature: Uint8Array,
): ImageValidationResult {
  if (!isAcceptedMimeType(file.type)) {
    return { ok: false, error: "Bitte lade ein Foto im Format JPG, PNG oder WebP hoch." };
  }
  if (file.size <= 0) {
    return { ok: false, error: "Die Datei ist leer. Bitte wähle ein anderes Foto." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      error: `Das Foto ist ${formatBytes(file.size)} groß. Erlaubt sind bis zu ${formatBytes(MAX_IMAGE_BYTES)}.`,
    };
  }
  const detected = detectImageFormat(signature);
  if (!detected) {
    return { ok: false, error: "Die Datei ist kein gültiges Bild. Bitte wähle ein echtes Foto aus." };
  }
  if (detected !== ACCEPTED_IMAGE_TYPES[file.type]) {
    return {
      ok: false,
      error: "Dateiendung und Inhalt passen nicht zusammen. Bitte speichere das Foto neu und versuche es erneut.",
    };
  }
  return { ok: true, format: detected };
}

/** Prüft die Bildmaße, damit die KI genug Details erkennen kann. */
export function validateImageDimensions(width: number, height: number): ImageValidationResult | { ok: true } {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return { ok: false, error: "Das Bild konnte nicht gelesen werden. Bitte versuche ein anderes Foto." };
  }
  const short = Math.min(width, height);
  const long = Math.max(width, height);
  if (short < MIN_IMAGE_SIDE || long < MIN_IMAGE_LONG_SIDE) {
    return {
      ok: false,
      error: `Das Foto ist mit ${width} × ${height} Pixeln zu klein. Bitte nutze mindestens ${MIN_IMAGE_LONG_SIDE} × ${MIN_IMAGE_SIDE} Pixel.`,
    };
  }
  if (long > MAX_IMAGE_SIDE) {
    return {
      ok: false,
      error: `Das Foto ist mit ${width} × ${height} Pixeln zu groß. Bitte verkleinere es auf höchstens ${MAX_IMAGE_SIDE} Pixel pro Seite.`,
    };
  }
  return { ok: true };
}
