import { describe, expect, it } from "vitest";
import { MIN_IMAGE_LONG_SIDE, MIN_IMAGE_SIDE, validateImageDimensions } from "@/lib/validation/image-upload";
import { PREPARED_MAX_SIDE, preparedFileName, targetSize } from "@/lib/image/prepare-upload";

describe("Vorbereitung des Raumfotos", () => {
  it("verkleinert große Fotos auf höchstens 2048 Pixel und behält das Seitenverhältnis", () => {
    expect(targetSize(4032, 3024)).toEqual({ width: 2048, height: 1536 });
    expect(targetSize(3024, 4032)).toEqual({ width: 1536, height: 2048 });
    expect(targetSize(12000, 9000)).toEqual({ width: 2048, height: 1536 });
  });

  it("vergrößert kleine Fotos nie", () => {
    expect(targetSize(800, 600)).toEqual({ width: 800, height: 600 });
    expect(targetSize(PREPARED_MAX_SIDE, 1000)).toEqual({ width: PREPARED_MAX_SIDE, height: 1000 });
  });

  it("übliche Fotoformate bleiben nach dem Verkleinern groß genug", () => {
    for (const [w, h] of [[4032, 3024], [6000, 4000], [4000, 3000], [3840, 2160], [MIN_IMAGE_LONG_SIDE, MIN_IMAGE_SIDE]]) {
      const t = targetSize(w, h);
      expect(validateImageDimensions(t.width, t.height).ok).toBe(true);
    }
  });

  it("vergibt eine .jpg-Endung", () => {
    expect(preparedFileName("IMG_1234.HEIC.png")).toBe("IMG_1234.HEIC.jpg");
    expect(preparedFileName("wohnzimmer.webp")).toBe("wohnzimmer.jpg");
    expect(preparedFileName(".png")).toBe("wohnzimmer.jpg");
  });
});
