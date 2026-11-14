import { expect, test, type Page } from "@playwright/test";
import { createPng } from "./helpers";

const photo = (width = 800, height = 600, name = "wohnzimmer.png") => ({
  name,
  mimeType: "image/png",
  buffer: createPng(width, height),
});

const alert = (page: Page) => page.getByRole("main").getByRole("alert");
const next = (page: Page) => page.getByRole("button", { name: /^(Weiter|Zur Zusammenfassung)$/ });

async function uploadAndChooseStyle(page: Page, style = "Japandi") {
  await page.goto("/gestalten");
  await page.locator('input[type="file"]').setInputFiles(photo());
  await expect(page.getByText("800 × 600 Pixel")).toBeVisible();
  await next(page).click();
  await page.getByText(style, { exact: true }).click();
  await next(page).click();
}

test("Kompletter Wohnzimmer-Ablauf bis zur Zusammenfassung", async ({ page }) => {
  await page.goto("/gestalten");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Wohnzimmer");

  // Ohne Foto geht es nicht weiter
  await next(page).click();
  await expect(alert(page)).toContainText("Bitte lade zuerst ein Foto");

  await page.locator('input[type="file"]').setInputFiles(photo());
  await expect(page.getByAltText("Vorschau deines Wohnzimmerfotos")).toBeVisible();
  await next(page).click();

  // Ohne Stil geht es nicht weiter
  await next(page).click();
  await expect(alert(page)).toContainText("Einrichtungsstil");
  await page.getByText("Landhaus", { exact: true }).click();
  await next(page).click();

  // Raumangaben
  await next(page).click();
  await expect(alert(page)).toContainText("Farben");
  await page.getByLabel("Raumgröße").fill("24,5");
  await page.getByText("Dachschräge", { exact: true }).click();
  await page.getByText("Haustiere im Haushalt", { exact: true }).click();
  await page.getByText("Warm und erdig").click();
  await next(page).click();
  await expect(alert(page)).toContainText("Atmosphäre");
  await page.getByText("Gemütlich", { exact: true }).click();
  await page.getByText("2.500 €").click();
  await page.getByLabel("Sonstige Wünsche").fill("Mehr Stauraum");
  await page.getByRole("group", { name: "Wie viele Designvarianten?" }).getByText("3", { exact: true }).click();
  await next(page).click();

  // Möbel behalten oder ersetzen
  await expect(page.getByRole("heading", { name: "Was bleibt, was kommt neu?" })).toBeVisible();
  for (const item of ["Sofa", "Couchtisch", "Fernseher"]) {
    await page.getByRole("radiogroup", { name: item, exact: true }).getByText("Behalten").click();
  }
  for (const item of ["TV-Möbel", "Teppich", "Vorhänge", "Beleuchtung"]) {
    await page.getByRole("radiogroup", { name: item, exact: true }).getByText("Ersetzen").click();
  }
  await expect(page.getByText("Bleibt (3)")).toBeVisible();
  await expect(page.getByText("Wird ersetzt (4)")).toBeVisible();
  // Raum und Oberflächen
  await page.getByRole("radiogroup", { name: "Bodenbelag", exact: true }).getByText("Behalten").click();
  await page.getByRole("radiogroup", { name: "Wandfarbe", exact: true }).getByText("Darf sich ändern").click();
  await next(page).click();

  // Zusammenfassung
  await expect(page.getByRole("heading", { name: "Deine Zusammenfassung" })).toBeVisible();
  await expect(page.getByAltText("Dein Wohnzimmerfoto")).toBeVisible();
  const main = page.getByRole("main");
  for (const text of ["24,5 m²", "Landhaus", "Warm und erdig", "Gemütlich", "bis 2.500 €", "Mehr Stauraum"]) {
    await expect(main.getByText(text, { exact: true })).toBeVisible();
  }
  await expect(main.getByText("Sofa, Couchtisch, Fernseher", { exact: true })).toBeVisible();
  await expect(main.getByText("TV-Möbel, Teppich, Vorhänge, Beleuchtung", { exact: true })).toBeVisible();
  await expect(main.getByText("Bodenbelag", { exact: true })).toBeVisible();
  await expect(main.getByText("Wandfarbe", { exact: true })).toBeVisible();
  await expect(main.getByText("3", { exact: true })).toBeVisible();
  await expect(main.getByText("Dachschräge", { exact: true })).toBeVisible();
  await expect(main.getByText("Haustiere im Haushalt", { exact: true })).toBeVisible();

  // Ergebnisansicht: ehrlich, ohne KI-Aufruf und ohne Foto-Übertragung
  const uploads: string[] = [];
  page.on("request", (r) => r.method() === "POST" && uploads.push(r.url()));
  await expect(page.getByRole("heading", { name: "Dein Ergebnis" })).toBeVisible();
  await expect(page.getByText("KI-Gestaltung in Vorbereitung")).toBeVisible();
  await expect(page.getByText("3 Designvarianten")).toBeVisible();
  await expect(page.getByText("Budgetaufteilung bis 2.500 €")).toBeVisible();
  await expect(page.getByText("Echte Produkte folgen später")).toBeVisible();
  await expect(page.getByRole("button", { name: /Design erstellen/ })).toBeDisabled();
  expect(uploads).toEqual([]);
  await expect(page.getByText("Deine Angaben sind vollständig.")).toBeVisible();
  // Ehrlicher Hinweis statt vorgetäuschter Generierung
  await expect(page.getByText("noch nicht abgeschickt, gespeichert oder von einer KI bearbeitet")).toBeVisible();

  // Korrigieren: zurück zum Stil, ändern, Angaben bleiben erhalten
  await page.getByRole("button", { name: "Einrichtungsstil ändern" }).click();
  await page.getByText("Skandinavisch", { exact: true }).click();
  await next(page).click();
  await expect(page.getByLabel("Raumgröße")).toHaveValue("24,5");
  await page.getByRole("button", { name: /^(4\. )?Möbel$/ }).click();
  await expect(page.getByText("Bleibt (3)")).toBeVisible();
  await page.getByRole("button", { name: /^(5\. )?Übersicht$/ }).click();
  await expect(main.getByText("Skandinavisch", { exact: true })).toBeVisible();

  // Foto austauschen
  await page.getByRole("button", { name: "Foto austauschen" }).click();
  await page.locator('input[type="file"]').setInputFiles(photo(1200, 900, "neu.png"));
  await expect(page.getByText("1200 × 900 Pixel")).toBeVisible();
  await expect(page.getByText("neu.png")).toBeVisible();
});

test("Ungültige Dateien werden mit verständlicher Meldung abgelehnt", async ({ page }) => {
  await page.goto("/gestalten");
  const input = page.locator('input[type="file"]');

  await input.setInputFiles({ name: "notiz.png", mimeType: "image/png", buffer: Buffer.from("kein Bild") });
  await expect(alert(page)).toContainText("kein gültiges Bild");

  await input.setInputFiles({ name: "animation.gif", mimeType: "image/gif", buffer: Buffer.from("GIF89a") });
  await expect(alert(page)).toContainText("JPG, PNG oder WebP");

  await input.setInputFiles({ name: "falsch.jpg", mimeType: "image/jpeg", buffer: createPng(800, 600) });
  await expect(alert(page)).toContainText("passen nicht zusammen");

  await input.setInputFiles(photo(300, 200, "klein.png"));
  await expect(alert(page)).toContainText("zu klein");

  // Nach einem Fehler funktioniert ein gültiges Foto
  await input.setInputFiles(photo());
  await expect(page.getByText("800 × 600 Pixel")).toBeVisible();
  await expect(alert(page)).toHaveCount(0);
});

test("Raumangaben werden geprüft", async ({ page }) => {
  await uploadAndChooseStyle(page, "Modern");
  await page.getByText("Kühl und klar").click();
  await page.getByText("Elegant", { exact: true }).click();

  await page.getByLabel("Raumgröße").fill("2");
  await next(page).click();
  await expect(alert(page)).toContainText("mindestens 5 m²");

  await page.getByLabel("Raumgröße").fill("");
  await page.getByLabel("Oder eigener Betrag").fill("50");
  await next(page).click();
  await expect(alert(page)).toContainText("mindestens 100");

  await page.getByLabel("Oder eigener Betrag").fill("3000");
  await next(page).click();
  await expect(page.getByRole("heading", { name: "Was bleibt, was kommt neu?" })).toBeVisible();
});

test("Zurück-Navigation behält alle Angaben", async ({ page }) => {
  await uploadAndChooseStyle(page);
  await page.getByText("Hell und natürlich").click();
  await page.getByText("Hell und luftig", { exact: true }).click();
  await page.getByRole("button", { name: "Zurück" }).click();
  await expect(page.getByRole("radio", { name: /Japandi/ })).toBeChecked();
  await page.getByRole("button", { name: "Zurück" }).click();
  await expect(page.getByText("800 × 600 Pixel")).toBeVisible();
  await next(page).click();
  await next(page).click();
  await expect(page.getByRole("radio", { name: /Hell und luftig/ })).toBeChecked();
});

test("Widersprüchliche Raummerkmale werden erklärt", async ({ page }) => {
  await uploadAndChooseStyle(page);
  await page.getByText("Niedrige Decke", { exact: true }).click();
  await page.getByText("Hohe Decke", { exact: true }).click();
  await page.getByText("Hell und natürlich").click();
  await page.getByText("Gemütlich", { exact: true }).click();
  await next(page).click();
  await expect(alert(page)).toContainText("entweder „Niedrige Decke“ oder „Hohe Decke“");
  await page.getByText("Hohe Decke", { exact: true }).click();
  await next(page).click();
  await expect(page.getByRole("heading", { name: "Was bleibt, was kommt neu?" })).toBeVisible();
});

/** Erzeugt im Browser ein großes JPEG und fügt einen EXIF-Block mit Testmarke (Standortdaten-Ersatz) ein. */
async function largeJpegWithExif(page: Page, width: number, height: number): Promise<Buffer> {
  const bytes = await page.evaluate(
    async ({ width, height }) => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#F2EDE5");
      gradient.addColorStop(1, "#777C6B");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#35352F";
      ctx.fillRect(width * 0.1, height * 0.6, width * 0.5, height * 0.2);
      const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.9));
      const jpeg = new Uint8Array(await blob.arrayBuffer());
      const text = new TextEncoder();
      // TIFF-Kopf (Big Endian) mit leerem Verzeichnis, danach die Testmarke
      const payload = new Uint8Array([
        ...text.encode("Exif\0\0"),
        0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        ...text.encode("GPS-TESTMARKE 52.5200N 13.4050E"),
      ]);
      const length = payload.length + 2;
      const app1 = new Uint8Array([0xff, 0xe1, length >> 8, length & 0xff, ...payload]);
      return Array.from(new Uint8Array([...jpeg.slice(0, 2), ...app1, ...jpeg.slice(2)]));
    },
    { width, height },
  );
  return Buffer.from(bytes);
}

test("Große Fotos werden im Browser verkleinert und ohne Metadaten vorbereitet", async ({ page }) => {
  const uploads: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET") uploads.push(r.url());
  });
  await page.goto("/gestalten");
  const original = await largeJpegWithExif(page, 4000, 3000);
  expect(original.includes(Buffer.from("GPS-TESTMARKE"))).toBe(true);

  await page.locator('input[type="file"]').setInputFiles({ name: "IMG_0001.jpg", mimeType: "image/jpeg", buffer: original });
  await expect(page.getByText("2048 × 1536 Pixel")).toBeVisible();
  await expect(page.getByTestId("photo-prepared")).toContainText("Verkleinert von 4000 × 3000");
  await expect(page.getByTestId("photo-prepared")).toContainText("Metadaten wie Standort");

  const prepared = Buffer.from(
    await page.getByAltText("Vorschau deines Wohnzimmerfotos").evaluate(async (img: HTMLImageElement) => {
      const res = await fetch(img.src);
      return Array.from(new Uint8Array(await res.arrayBuffer()));
    }),
  );
  // JPEG, kleiner als das Original, ohne EXIF-Block und ohne Testmarke
  expect(prepared.subarray(0, 3)).toEqual(Buffer.from([0xff, 0xd8, 0xff]));
  expect(prepared.includes(Buffer.from("Exif"))).toBe(false);
  expect(prepared.includes(Buffer.from("GPS-TESTMARKE"))).toBe(false);
  expect(prepared.length).toBeLessThanOrEqual(4 * 1024 * 1024);
  const dims = await page.getByAltText("Vorschau deines Wohnzimmerfotos").evaluate((img: HTMLImageElement) => [img.naturalWidth, img.naturalHeight]);
  expect(dims).toEqual([2048, 1536]);

  // Hochformat bleibt Hochformat
  await page.locator('input[type="file"]').setInputFiles({ name: "hoch.jpg", mimeType: "image/jpeg", buffer: await largeJpegWithExif(page, 3000, 4000) });
  await expect(page.getByText("1536 × 2048 Pixel")).toBeVisible();

  // Kleine Fotos werden nicht vergrößert
  await page.locator('input[type="file"]').setInputFiles(photo(1200, 900, "klein-genug.png"));
  await expect(page.getByText("1200 × 900 Pixel")).toBeVisible();
  await expect(page.getByTestId("photo-prepared")).not.toContainText("Verkleinert");

  // Nichts wurde übertragen
  expect(uploads).toEqual([]);
});
