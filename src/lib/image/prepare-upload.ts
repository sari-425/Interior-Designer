/**
 * Vorbereitung eines Raumfotos im Browser, bevor es irgendwohin übertragen
 * werden könnte.
 *
 * - Verkleinert auf höchstens PREPARED_MAX_SIDE Pixel an der längeren Seite.
 *   Mehr Auflösung bringt der KI keinen Vorteil, kostet aber Übertragungszeit.
 * - Zeichnet das Foto neu auf eine Zeichenfläche und speichert es als JPEG.
 *   Dabei gehen alle Metadaten verloren: EXIF, GPS-Standort, Kameramodell,
 *   Aufnahmezeit. Die Ausrichtung (Hochformat/Querformat) wendet der Browser
 *   vorher an, sodass das Bild richtig herum bleibt.
 * - Begrenzt die Dateigröße auf PREPARED_MAX_BYTES und senkt dafür
 *   schrittweise die JPEG-Qualität, aber nie unter eine gute Mindestqualität.
 *
 * Das vorbereitete Foto bleibt im Browser. Es wird erst übertragen, wenn die
 * KI-Gestaltung eingerichtet ist und die Person „Design erstellen“ wählt.
 */

export const PREPARED_MAX_SIDE = 2048;
export const PREPARED_MAX_BYTES = 4 * 1024 * 1024;
export const PREPARED_MIME = "image/jpeg";
/** Qualitätsstufen, die nacheinander versucht werden; 0,72 sieht bei Fotos noch sauber aus */
export const JPEG_QUALITY_STEPS = [0.88, 0.8, 0.72] as const;

/** Zielgröße: Seitenverhältnis bleibt, nie vergrößern, längere Seite höchstens maxSide */
export function targetSize(width: number, height: number, maxSide = PREPARED_MAX_SIDE): { width: number; height: number } {
  const long = Math.max(width, height);
  if (long <= maxSide) return { width, height };
  const scale = maxSide / long;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** Dateiname mit passender Endung für das vorbereitete JPEG */
export function preparedFileName(name: string): string {
  const base = name.replace(/\.[^./\\]+$/, "").trim() || "wohnzimmer";
  return `${base}.jpg`;
}

export interface PreparedPhoto {
  blob: Blob;
  width: number;
  height: number;
  quality: number;
}

export class PhotoPreparationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PhotoPreparationError";
  }
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, PREPARED_MIME, quality));
}

/**
 * Erzeugt aus einem bereits geladenen Bild eine verkleinerte JPEG-Kopie ohne
 * Metadaten. Nur im Browser verwendbar.
 */
export async function prepareRoomPhoto(image: HTMLImageElement): Promise<PreparedPhoto> {
  const size = targetSize(image.naturalWidth, image.naturalHeight);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new PhotoPreparationError("Zeichenfläche nicht verfügbar");
  // Weißer Hintergrund, damit transparente PNG-Bereiche nicht schwarz werden
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size.width, size.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, size.width, size.height);

  for (const quality of JPEG_QUALITY_STEPS) {
    const blob = await toBlob(canvas, quality);
    if (!blob) throw new PhotoPreparationError("JPEG konnte nicht erzeugt werden");
    if (blob.size <= PREPARED_MAX_BYTES) return { blob, ...size, quality };
  }
  throw new PhotoPreparationError("Foto bleibt auch komprimiert zu groß");
}
