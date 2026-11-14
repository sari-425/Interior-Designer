import { DESIGN_PACKAGES, isPaidPackage } from "@/modules/pricing/packages";
import { getPaymentsStatus } from "./config";
import type { CheckoutRequest, CheckoutSession, PaymentProvider } from "./types";

type Env = Readonly<Record<string, string | undefined>>;

export class PaymentsDisabledError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = "PaymentsDisabledError";
  }
}

/**
 * Startet einen Bezahlvorgang. Preis und Beschreibung stammen ausschließlich
 * aus der serverseitigen Paketliste. Ohne aktive Konfiguration wird nichts
 * aufgerufen. Es gibt derzeit keinen eingetragenen PaymentProvider.
 */
export async function startCheckout(
  request: CheckoutRequest,
  provider: PaymentProvider | null,
  env: Env = process.env,
): Promise<CheckoutSession> {
  const status = getPaymentsStatus(env);
  if (!status.enabled) throw new PaymentsDisabledError(status.reason);
  if (!provider) throw new PaymentsDisabledError("Kein Zahlungsanbieter eingerichtet.");
  const pkg = DESIGN_PACKAGES.find((p) => p.id === request.packageId);
  if (!pkg) throw new RangeError(`Unbekanntes Paket „${request.packageId}“.`);
  if (!isPaidPackage(pkg)) throw new RangeError(`Das Paket „${pkg.name}“ ist kostenlos und braucht keinen Bezahlvorgang.`);
  for (const url of [request.successUrl, request.cancelUrl]) {
    const base = env.NEXT_PUBLIC_SITE_URL?.trim();
    if (!base || !url.startsWith(base)) throw new RangeError("Rücksprung-URLs müssen zur eigenen Seite gehören.");
  }
  return provider.createCheckout({
    ...request,
    amountCents: pkg.priceCents,
    description: `DesignBySari ${pkg.name} – 1 Wohnzimmer, ${pkg.designVariants} Designvarianten`,
  });
}
