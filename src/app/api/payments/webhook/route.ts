import "server-only";
import { getPaymentsStatus } from "@/modules/payments/config";
import { verifyStripeSignature } from "@/modules/payments/stripe-signature";

/**
 * POST /api/payments/webhook – Empfang von Stripe-Ereignissen (vorbereitet).
 *
 * Solange Zahlungen deaktiviert sind, antwortet die Route mit 503.
 * Ist alles konfiguriert, wird die Signatur geprüft. Die Freischaltung von
 * Paketen (Entitlement speichern) folgt mit der Datenbank; bis dahin wird
 * ein gültiges Ereignis mit 501 beantwortet, damit Stripe es erneut zustellt
 * und nichts verloren geht.
 */
export async function POST(request: Request) {
  const status = getPaymentsStatus();
  if (!status.enabled) {
    return Response.json({ ok: false, error: "payments_disabled" }, { status: 503 });
  }
  const payload = await request.text();
  const check = verifyStripeSignature(
    payload,
    request.headers.get("stripe-signature"),
    process.env.STRIPE_WEBHOOK_SECRET ?? "",
  );
  if (!check.ok) return Response.json({ ok: false, error: "invalid_signature" }, { status: 400 });
  return Response.json({ ok: false, error: "not_implemented" }, { status: 501 });
}
