import { describe, expect, it } from "vitest";
import {
  detectImageFormat,
  formatBytes,
  MAX_IMAGE_BYTES,
  readImageDimensions,
  validateImageDimensions,
  validateImageFile,
} from "@/lib/validation/image-upload";

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46, 0x49, 0x46, 0, 1]);
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0x0d]);
const WEBP = new Uint8Array([...Buffer.from("RIFF"), 0x24, 0, 0, 0, ...Buffer.from("WEBP")]);
const TEXT = new Uint8Array(Buffer.from("hello world!"));

describe("detectImageFormat", () => {
  it("erkennt JPEG, PNG und WebP an der Signatur", () => {
    expect(detectImageFormat(JPEG)).toBe("jpeg");
    expect(detectImageFormat(PNG)).toBe("png");
    expect(detectImageFormat(WEBP)).toBe("webp");
  });

  it("lehnt andere Inhalte und zu kurze Daten ab", () => {
    expect(detectImageFormat(TEXT)).toBeNull();
    expect(detectImageFormat(new Uint8Array([0xff, 0xd8]))).toBeNull();
    expect(detectImageFormat(new Uint8Array())).toBeNull();
  });
});

describe("validateImageFile", () => {
  it("akzeptiert ein gültiges Foto", () => {
    expect(validateImageFile({ type: "image/png", size: 2048 }, PNG)).toEqual({ ok: true, format: "png" });
  });

  it("lehnt nicht unterstützte Formate ab", () => {
    const r = validateImageFile({ type: "image/gif", size: 2048 }, PNG);
    expect(r.ok).toBe(false);
  });

  it("lehnt leere und zu große Dateien ab", () => {
    expect(validateImageFile({ type: "image/png", size: 0 }, PNG).ok).toBe(false);
    const big = validateImageFile({ type: "image/png", size: MAX_IMAGE_BYTES + 1 }, PNG);
    expect(big.ok).toBe(false);
    if (!big.ok) expect(big.error).toContain("10,0 MB");
  });

  it("akzeptiert genau die Maximalgröße", () => {
    expect(validateImageFile({ type: "image/jpeg", size: MAX_IMAGE_BYTES }, JPEG).ok).toBe(true);
  });

  it("erkennt umbenannte Nicht-Bilder", () => {
    expect(validateImageFile({ type: "image/png", size: 100 }, TEXT).ok).toBe(false);
  });

  it("erkennt Widersprüche zwischen Dateityp und Inhalt", () => {
    const r = validateImageFile({ type: "image/png", size: 100 }, JPEG);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("passen nicht zusammen");
  });
});

describe("validateImageDimensions", () => {
  it("akzeptiert übliche Fotogrößen im Hoch- und Querformat", () => {
    expect(validateImageDimensions(4032, 3024).ok).toBe(true);
    expect(validateImageDimensions(480, 640).ok).toBe(true);
    expect(validateImageDimensions(640, 480).ok).toBe(true);
  });

  it("lehnt zu kleine, zu große und ungültige Maße ab", () => {
    expect(validateImageDimensions(639, 480).ok).toBe(false);
    expect(validateImageDimensions(640, 479).ok).toBe(false);
    expect(validateImageDimensions(12_001, 3000).ok).toBe(false);
    expect(validateImageDimensions(0, 0).ok).toBe(false);
    expect(validateImageDimensions(Number.NaN, 600).ok).toBe(false);
  });
});

describe("formatBytes", () => {
  it("formatiert deutsch", () => {
    expect(formatBytes(512)).toBe("1 KB");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(1.5 * 1024 * 1024)).toBe("1,5 MB");
  });
});

describe("readImageDimensions (Serverprüfung)", () => {
  it("liest PNG-Maße", async () => {
    const { createPng } = await import("../e2e/helpers");
    expect(readImageDimensions(new Uint8Array(createPng(800, 600)))).toEqual({ width: 800, height: 600 });
  });

  it("liest JPEG-Maße hinter anderen Segmenten", () => {
    const app0 = [0xff, 0xe0, 0x00, 0x10, ...Buffer.from("JFIF\0"), 1, 1, 0, 0, 1, 0, 1, 0, 0];
    const dht = [0xff, 0xc4, 0x00, 0x04, 0x00, 0x00];
    const sof2 = [0xff, 0xc2, 0x00, 0x11, 0x08, 0x02, 0x58, 0x03, 0x20, 0x03, 1, 0x22, 0, 2, 0x11, 1, 3, 0x11, 1];
    const jpeg = new Uint8Array([0xff, 0xd8, ...app0, ...dht, ...sof2, 0xff, 0xd9]);
    expect(readImageDimensions(jpeg)).toEqual({ width: 800, height: 600 });
  });

  it("liest WebP-Maße (VP8X, VP8L, VP8)", () => {
    const head = (chunk: string) => [...Buffer.from("RIFF"), 0, 0, 0, 0, ...Buffer.from("WEBP"), ...Buffer.from(chunk), 0, 0, 0, 0];
    // VP8X: Flags (4 Bytes), dann Breite-1 und Höhe-1 als 24 Bit
    const vp8x = new Uint8Array([...head("VP8X"), 0, 0, 0, 0, 0x1f, 0x03, 0x00, 0x57, 0x02, 0x00]);
    expect(readImageDimensions(vp8x)).toEqual({ width: 800, height: 600 });
    // VP8L: Signatur 0x2f, dann 14 Bit Breite-1 und 14 Bit Höhe-1
    const bits = (800 - 1) | ((600 - 1) << 14);
    const vp8l = new Uint8Array([...head("VP8L"), 0x2f, bits & 0xff, (bits >> 8) & 0xff, (bits >> 16) & 0xff, (bits >> 24) & 0xff]);
    expect(readImageDimensions(vp8l)).toEqual({ width: 800, height: 600 });
    // VP8: 3 Bytes Frame-Tag, Startcode 9d 01 2a, dann Breite und Höhe (16 Bit LE)
    const vp8 = new Uint8Array([...head("VP8 "), 0, 0, 0, 0x9d, 0x01, 0x2a, 0x20, 0x03, 0x58, 0x02]);
    expect(readImageDimensions(vp8)).toEqual({ width: 800, height: 600 });
  });

  it("liefert null bei unbekannten oder abgeschnittenen Daten", () => {
    expect(readImageDimensions(TEXT)).toBeNull();
    expect(readImageDimensions(PNG)).toBeNull();
    expect(readImageDimensions(JPEG)).toBeNull();
    expect(readImageDimensions(WEBP)).toBeNull();
  });
});
