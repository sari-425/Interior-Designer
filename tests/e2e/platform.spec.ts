import { expect, test } from "@playwright/test";

test("Sicherheits-Header werden gesetzt", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("Design-Schnittstelle meldet ehrlich, dass die KI nicht eingerichtet ist", async ({ request }) => {
  const response = await request.post("/api/designs", { multipart: { request: "{}" } });
  expect(response.status()).toBe(503);
  expect(await response.json()).toMatchObject({ ok: false, error: "ai_not_configured" });
});

test("Zahlungs-Webhook ist deaktiviert", async ({ request }) => {
  const response = await request.post("/api/payments/webhook", { data: "{}" });
  expect(response.status()).toBe(503);
});

test("Vorschau ist für Suchmaschinen gesperrt, Sitemap und Vorschaubild existieren", async ({ request, page }) => {
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/gestalten");
  expect(sitemap).not.toContain("/impressum");
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /opengraph-image/);
});
