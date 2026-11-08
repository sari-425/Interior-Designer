import { expect, test } from "@playwright/test";

test("Startseite zeigt Marke, Claim und führt zur Gestaltung", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/DesignBySari/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Dein Zuhause.");
  await expect(page.getByText("Beispiel · Illustration").first()).toBeVisible();
  await expect(page.getByText("9,90 €").first()).toBeVisible();

  await page.getByRole("main").getByRole("link", { name: "Jetzt Wohnzimmer planen" }).first().click();
  await expect(page).toHaveURL(/\/gestalten$/);
  await expect(page.getByRole("heading", { name: "Lade ein Foto deines Wohnzimmers hoch" })).toBeVisible();
});

test("Vorschauversion wird ehrlich gekennzeichnet", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Die KI-Gestaltung ist in Vorbereitung, Designpakete sind noch nicht buchbar")).toBeVisible();
  await expect(page.getByRole("main").getByText("Die KI-Gestaltung ist noch in Vorbereitung.")).toBeVisible();
  await expect(page.getByText("In Vorbereitung", { exact: true }).first()).toBeVisible();

  await page.goto("/preise");
  await expect(page.getByText("Paket noch nicht buchbar").first()).toBeVisible();
  await expect(page.getByText("Geplant", { exact: true }).first()).toBeVisible();
  await page.getByText("Kann ich DesignBySari schon nutzen?").click();
  await expect(page.getByText("Die KI-Gestaltung und die Designpakete sind noch in Vorbereitung.")).toBeVisible();

  await page.goto("/gestalten");
  await expect(page.getByText("deshalb wird noch kein Design erzeugt")).toBeVisible();
});

test("Vorher/Nachher-Regler ist per Tastatur bedienbar", async ({ page }) => {
  await page.goto("/");
  const slider = page.getByRole("slider", { name: "Vorher-Nachher-Vergleich verschieben" }).first();
  await slider.focus();
  await page.keyboard.press("ArrowRight");
  await expect(slider).toHaveValue("51");
});

test("Alle Seiten und Rechtsseiten sind erreichbar", async ({ page }) => {
  for (const [path, heading] of [
    ["/stile", "Acht Stile"],
    ["/preise", "Einfache Pakete"],
    ["/impressum", "Impressum"],
    ["/datenschutz", "Datenschutzerklärung"],
    ["/agb", "Allgemeine Geschäftsbedingungen"],
    ["/transparenz", "KI und Partnerlinks"],
  ] as const) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
  }
  await page.goto("/impressum");
  await expect(page.getByText("Entwurf, nicht rechtsverbindlich.")).toBeVisible();
});

test("Unbekannte Seiten zeigen eine 404-Seite", async ({ page }) => {
  const res = await page.goto("/gibt-es-nicht");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("existiert (noch) nicht");
});

test("Navigation funktioniert auf jeder Bildschirmgröße", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Menü öffnen" }).click();
    await page.getByRole("navigation", { name: "Mobile Navigation" }).getByRole("link", { name: "Preise" }).click();
  } else {
    await page.getByRole("navigation", { name: "Hauptnavigation" }).getByRole("link", { name: "Preise" }).click();
  }
  await expect(page).toHaveURL(/\/preise$/);
});

test("Keine horizontale Scrollleiste", async ({ page }) => {
  for (const path of ["/", "/stile", "/preise", "/gestalten"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
