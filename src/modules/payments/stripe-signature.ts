import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Prüft die Signatur eines Stripe-Webhooks (Header `Stripe-Signature`) ohne
 * zusätzliches Paket, nach dem dokumentierten Verfahren:
 * HMAC-SHA256 über "<timestamp>.<roher Body>" mit dem Webhook-Secret,
 * Vergleich mit allen v1-Signaturen, Zeitstempel höchstens `toleranceSeconds` alt.
 * Quelle: https://docs.stripe.com/webhooks#verify-manually
 */
export function verifyStripeSignature(
  payload: string,
  header: string | null,
  secret: string,
  options: { toleranceSeconds?: number; now?: () => number } = {},
): { ok: true; timestamp: number } | { ok: false; reason: string } {
  if (!header) return { ok: false, reason: "Signatur fehlt" };
  if (!secret) return { ok: false, reason: "Webhook-Secret fehlt" };
  const tolerance = options.toleranceSeconds ?? 300;
  const now = Math.floor((options.now ?? Date.now)() / 1000);

  const parts = header.split(",").map((p) => p.trim().split("="));
  const timestamp = Number(parts.find(([k]) => k === "t")?.[1]);
  const signatures = parts.filter(([k, v]) => k === "v1" && v).map(([, v]) => v);
  if (!Number.isSafeInteger(timestamp) || signatures.length === 0) return { ok: false, reason: "Signatur unvollständig" };
  if (Math.abs(now - timestamp) > tolerance) return { ok: false, reason: "Zeitstempel außerhalb der Toleranz" };

  const expected = createHmac("sha256", secret).update(`${timestamp}.${payload}`, "utf8").digest();
  const match = signatures.some((sig) => {
    if (!/^[0-9a-f]+$/i.test(sig)) return false;
    const given = Buffer.from(sig, "hex");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
  return match ? { ok: true, timestamp } : { ok: false, reason: "Signatur ungültig" };
}
