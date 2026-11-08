import { expect, test } from "@playwright/test";
import { createPng } from "./helpers";

test("Kompletter Gestaltungs-Ablauf bis zur Übersicht", async ({ page }) => {
  await page.goto("/gestalten");

  // Ohne Foto geht es nicht weiter
  await page.getByRole("button", { name: "Weiter" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Bitte lade zuerst ein Foto");

  await page.locator('input[type="file"]').setInputFiles({
    name: "wohnzimmer.png",
    mimeType: "image/png",
    buffer: createPng(800, 600),
  });
  await expect(page.getByText("800 × 600 Pixel")).toBeVisible();
  await page.getByRole("button", { name: "Weiter" }).click();

  await page.getByText("Wohnzimmer", { exact: true }).click();
  await page.getByRole("button", { name: "Weiter" }).click();

  await page.getByText("Japandi", { exact: true }).click();
  await page.getByRole("button", { name: "Weiter" }).click();

  // Farbwelt fehlt noch
  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Farbwelt");

  await page.getByText("Warm und erdig").click();
  await page.getByText("2.500 €").click();
  await page.getByText("Sofa", { exact: true }).click();
  await page.getByRole("radiogroup", { name: "Bodenbelag" }).getByText("Behalten").click();
  await page.getByLabel("Sonstige Wünsche").fill("Mehr Stauraum");
  await page.getByRole("button", { name: "Zur Übersicht" }).click();

  await expect(page.getByRole("heading", { name: "Deine Auswahl" })).toBeVisible();
  await expect(page.getByText("Deine Auswahl ist vollständig.")).toBeVisible();
  const summary = page.locator("dl");
  await expect(summary).toContainText("Wohnzimmer");
  await expect(summary).toContainText("Japandi");
  await expect(summary).toContainText("2.500 €");
  await expect(summary).toContainText("Bodenbelag");
  // Ehrlicher Hinweis statt vorgetäuschter Generierung
  await expect(page.getByText("noch kein Design erzeugt werden")).toBeVisible();

  // Ändern springt zum passenden Schritt
  await page.getByRole("button", { name: "Stil ändern" }).click();
  await expect(page.getByRole("group", { name: "Welcher Stil gefällt dir?" })).toBeVisible();
});

test("Ungültige Dateien werden mit verständlicher Meldung abgelehnt", async ({ page }) => {
  await page.goto("/gestalten");
  const input = page.locator('input[type="file"]');

  await input.setInputFiles({ name: "notiz.png", mimeType: "image/png", buffer: Buffer.from("kein Bild") });
  await expect(page.getByRole("main").getByRole("alert")).toContainText("kein gültiges Bild");

  await input.setInputFiles({ name: "animation.gif", mimeType: "image/gif", buffer: Buffer.from("GIF89a") });
  await expect(page.getByRole("main").getByRole("alert")).toContainText("JPG, PNG oder WebP");

  await input.setInputFiles({ name: "klein.png", mimeType: "image/png", buffer: createPng(300, 200) });
  await expect(page.getByRole("main").getByRole("alert")).toContainText("zu klein");
});

test("Ungültiges Budget wird gemeldet", async ({ page }) => {
  await page.goto("/gestalten");
  await page.locator('input[type="file"]').setInputFiles({
    name: "raum.png",
    mimeType: "image/png",
    buffer: createPng(800, 600),
  });
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByText("Büro", { exact: true }).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByText("Modern", { exact: true }).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByText("Kühl und klar").click();
  await page.getByLabel("Oder eigener Betrag").fill("50");
  await page.getByRole("button", { name: "Zur Übersicht" }).click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("mindestens 100");
});
