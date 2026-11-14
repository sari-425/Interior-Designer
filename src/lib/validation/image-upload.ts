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

/**
 * Liest Breite und Höhe direkt aus den Bilddaten (für die Prüfung auf dem
 * Server, wo kein Browser das Bild dekodiert). Unterstützt PNG, JPEG und WebP.
 * Liefert null, wenn die Maße nicht sicher erkannt werden.
 */
export function readImageDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  const format = detectImageFormat(bytes);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const fits = (offset: number, length: number) => offset >= 0 && offset + length <= bytes.length;

  if (format === "png") {
    // IHDR-Chunk folgt direkt auf die 8-Byte-Signatur
    if (!fits(16, 8) || String.fromCharCode(...bytes.slice(12, 16)) !== "IHDR") return null;
    return { width: view.getUint32(16), height: view.getUint32(20) };
  }

  if (format === "jpeg") {
    let offset = 2;
    while (fits(offset, 4)) {
      if (bytes[offset] !== 0xff) return null;
      const marker = bytes[offset + 1];
      if (marker === 0xff) {
        offset += 1; // Füllbyte
        continue;
      }
      if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
        offset += 2; // Marker ohne Länge
        continue;
      }
      const length = view.getUint16(offset + 2);
      if (length < 2) return null;
      // SOF-Marker (Start of Frame) enthalten die Maße; DHT (C4), JPG (C8) und DAC (CC) nicht
      const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isSof) {
        if (!fits(offset + 5, 4)) return null;
        return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
      }
      if (marker === 0xda) return null; // Bilddaten beginnen, ohne dass Maße gefunden wurden
      offset += 2 + length;
    }
    return null;
  }

  if (format === "webp") {
    if (!fits(12, 4)) return null;
    const chunk = String.fromCharCode(...bytes.slice(12, 16));
    if (chunk === "VP8X" && fits(24, 6)) {
      const w = 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16));
      const h = 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16));
      return { width: w, height: h };
    }
    if (chunk === "VP8 " && fits(26, 4)) {
      // Frame-Header: Startcode 9d 01 2a, danach 14-Bit-Breite und -Höhe
      if (bytes[23] !== 0x9d || bytes[24] !== 0x01 || bytes[25] !== 0x2a) return null;
      return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
    }
    if (chunk === "VP8L" && fits(21, 4)) {
      if (bytes[20] !== 0x2f) return null;
      const b = view.getUint32(21, true);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
    return null;
  }

  return null;
}
