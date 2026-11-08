import { describe, expect, it } from "vitest";
import {
  detectImageFormat,
  formatBytes,
  MAX_IMAGE_BYTES,
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
