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
  await page.getByText("Warm und erdig").click();
  await next(page).click();
  await expect(alert(page)).toContainText("Atmosphäre");
  await page.getByText("Gemütlich", { exact: true }).click();
  await page.getByText("2.500 €").click();
  await page.getByLabel("Sonstige Wünsche").fill("Mehr Stauraum");
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
