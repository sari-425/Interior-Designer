import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { isSiteIndexable, PUBLIC_ROUTES, siteUrl } from "@/lib/site";
import { PaymentsDisabledError, startCheckout } from "@/modules/payments/checkout";
import { getPaymentsStatus } from "@/modules/payments/config";
import { verifyStripeSignature } from "@/modules/payments/stripe-signature";
import type { PaymentProvider } from "@/modules/payments/types";

describe("Zahlungen: Konfiguration", () => {
  const base = { PAYMENTS_ENABLED: "true", STRIPE_SECRET_KEY: "sk_test_abc", STRIPE_WEBHOOK_SECRET: "whsec_x" };

  it("ist standardmäßig aus", () => {
    expect(getPaymentsStatus({}).enabled).toBe(false);
    expect(getPaymentsStatus({ STRIPE_SECRET_KEY: "sk_test_abc", STRIPE_WEBHOOK_SECRET: "whsec_x" }).enabled).toBe(false);
  });

  it("nutzt Testschlüssel und Live-Schlüssel nur mit ausdrücklicher Freigabe", () => {
    expect(getPaymentsStatus(base)).toEqual({ enabled: true, mode: "test" });
    expect(getPaymentsStatus({ ...base, STRIPE_SECRET_KEY: "sk_live_abc" }).enabled).toBe(false);
    expect(getPaymentsStatus({ ...base, STRIPE_SECRET_KEY: "sk_live_abc", PAYMENTS_ALLOW_LIVE: "true" })).toEqual({ enabled: true, mode: "live" });
    expect(getPaymentsStatus({ ...base, STRIPE_WEBHOOK_SECRET: "" }).enabled).toBe(false);
    expect(getPaymentsStatus({ ...base, STRIPE_SECRET_KEY: "pk_test_abc" }).enabled).toBe(false);
  });
});

describe("Zahlungen: Checkout", () => {
  const env = { PAYMENTS_ENABLED: "true", STRIPE_SECRET_KEY: "sk_test_abc", STRIPE_WEBHOOK_SECRET: "whsec_x", NEXT_PUBLIC_SITE_URL: "https://designbysari.test" };
  const req = { packageId: "plus" as const, projectId: "p1", userId: "u1", successUrl: "https://designbysari.test/ok", cancelUrl: "https://designbysari.test/abbruch" };
  const provider: PaymentProvider = { id: "test", createCheckout: async (r) => ({ id: "cs_1", url: `https://pay.test/${r.amountCents}` }) };

  it("startet ohne Freigabe nie einen Bezahlvorgang", async () => {
    await expect(startCheckout(req, provider, {})).rejects.toBeInstanceOf(PaymentsDisabledError);
    await expect(startCheckout(req, null, env)).rejects.toBeInstanceOf(PaymentsDisabledError);
  });

  it("nimmt den Preis immer vom Server und erlaubt nur eigene Rücksprung-Adressen", async () => {
    expect((await startCheckout(req, provider, env)).url).toBe("https://pay.test/1990");
    await expect(startCheckout({ ...req, successUrl: "https://boese.test/ok" }, provider, env)).rejects.toBeInstanceOf(RangeError);
    await expect(startCheckout({ ...req, packageId: "gratis" as never }, provider, env)).rejects.toBeInstanceOf(RangeError);
    await expect(startCheckout({ ...req, packageId: "vorschau" as never }, provider, env)).rejects.toThrow(/kostenlos/);
    await expect(startCheckout({ ...req, packageId: "premium" as never }, provider, env)).rejects.toBeInstanceOf(RangeError);
  });
});

describe("Zahlungen: Webhook-Signatur", () => {
  const secret = "whsec_test";
  const payload = '{"type":"checkout.session.completed"}';
  const now = 1_700_000_000;
  const sign = (t: number, body = payload, key = secret) => createHmac("sha256", key).update(`${t}.${body}`).digest("hex");
  const opts = { now: () => now * 1000 };

  it("akzeptiert gültige Signaturen", () => {
    expect(verifyStripeSignature(payload, `t=${now},v1=${sign(now)}`, secret, opts)).toEqual({ ok: true, timestamp: now });
    expect(verifyStripeSignature(payload, `t=${now},v1=abc,v1=${sign(now)}`, secret, opts).ok).toBe(true);
  });

  it("lehnt manipulierte, alte oder fehlende Signaturen ab", () => {
    expect(verifyStripeSignature(payload + " ", `t=${now},v1=${sign(now)}`, secret, opts).ok).toBe(false);
    expect(verifyStripeSignature(payload, `t=${now},v1=${sign(now, payload, "falsch")}`, secret, opts).ok).toBe(false);
    expect(verifyStripeSignature(payload, `t=${now - 600},v1=${sign(now - 600)}`, secret, opts).ok).toBe(false);
    expect(verifyStripeSignature(payload, null, secret, opts).ok).toBe(false);
    expect(verifyStripeSignature(payload, `v1=${sign(now)}`, secret, opts).ok).toBe(false);
  });
});

describe("Website-Angaben", () => {
  it("nutzt eine gültige Basis-URL", () => {
    expect(siteUrl({}).toString()).toBe("http://localhost:3000/");
    expect(siteUrl({ NEXT_PUBLIC_SITE_URL: "https://designbysari.de/" }).origin).toBe("https://designbysari.de");
    expect(siteUrl({ NEXT_PUBLIC_SITE_URL: "kein url" }).toString()).toBe("http://localhost:3000/");
  });

  it("ist bis zum Start nicht indexierbar und listet keine Rechtsentwürfe", () => {
    expect(isSiteIndexable({})).toBe(false);
    expect(isSiteIndexable({ SITE_INDEXABLE: "true" })).toBe(true);
    expect(PUBLIC_ROUTES).not.toContain("/impressum");
  });
});
