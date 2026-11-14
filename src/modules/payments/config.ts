/**
 * Zahlungen (Stripe) – nur vorbereitet, standardmäßig AUS.
 *
 * Zahlungen sind erst aktiv, wenn
 *   PAYMENTS_ENABLED=true  und  STRIPE_SECRET_KEY  und  STRIPE_WEBHOOK_SECRET
 * gesetzt sind. Ein Live-Schlüssel (sk_live_…) wird zusätzlich nur mit
 * PAYMENTS_ALLOW_LIVE=true akzeptiert, damit nie versehentlich echt kassiert wird.
 */
type Env = Readonly<Record<string, string | undefined>>;

export type PaymentsStatus =
  | { enabled: false; reason: string }
  | { enabled: true; mode: "test" | "live" };

export function getPaymentsStatus(env: Env = process.env): PaymentsStatus {
  if (env.PAYMENTS_ENABLED?.trim().toLowerCase() !== "true") {
    return { enabled: false, reason: "Zahlungen sind deaktiviert (PAYMENTS_ENABLED ist nicht true)." };
  }
  const key = env.STRIPE_SECRET_KEY?.trim() ?? "";
  if (!key) return { enabled: false, reason: "STRIPE_SECRET_KEY fehlt." };
  if (!env.STRIPE_WEBHOOK_SECRET?.trim()) return { enabled: false, reason: "STRIPE_WEBHOOK_SECRET fehlt." };
  if (key.startsWith("sk_test_") || key.startsWith("rk_test_")) return { enabled: true, mode: "test" };
  if (key.startsWith("sk_live_") || key.startsWith("rk_live_")) {
    return env.PAYMENTS_ALLOW_LIVE?.trim().toLowerCase() === "true"
      ? { enabled: true, mode: "live" }
      : { enabled: false, reason: "Live-Schlüssel ohne PAYMENTS_ALLOW_LIVE=true wird nicht verwendet." };
  }
  return { enabled: false, reason: "STRIPE_SECRET_KEY hat ein unbekanntes Format." };
}
