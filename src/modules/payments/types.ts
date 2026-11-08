import type { DesignPackage } from "@/modules/pricing/packages";

/**
 * Zahlungsablauf (geplant):
 * 1. Person wählt ein Paket → Server erstellt eine Stripe-Checkout-Sitzung
 *    (Preis kommt immer vom Server aus DESIGN_PACKAGES, nie aus dem Browser).
 * 2. Stripe leitet nach der Zahlung zurück.
 * 3. Erst der signierte Webhook `checkout.session.completed` schaltet das Paket frei.
 */

export interface CheckoutRequest {
  packageId: DesignPackage["id"];
  projectId: string;
  userId: string;
  /** Absolute URLs der eigenen Seite */
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSession {
  id: string;
  /** Weiterleitung zur Bezahlseite des Zahlungsanbieters */
  url: string;
}

export interface PaymentProvider {
  readonly id: string;
  createCheckout(request: CheckoutRequest & { amountCents: number; description: string }): Promise<CheckoutSession>;
}

/** Freischaltung nach erfolgreicher Zahlung */
export interface Entitlement {
  userId: string;
  projectId: string;
  packageId: DesignPackage["id"];
  paidAmountCents: number;
  paymentReference: string;
  grantedAt: string;
}
