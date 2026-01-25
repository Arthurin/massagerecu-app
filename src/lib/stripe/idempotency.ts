import crypto from "crypto";

/**
 * Génère une idempotency key Stripe stable
 * pour une intention de paiement donnée
 */
export function createCheckoutIdempotencyKey(input: {
  purchaserName: string;
  massagePriceId: string;
  quantity: number;
}): string {
  const raw = [
    input.purchaserName.toLowerCase(),
    input.massagePriceId,
    input.quantity,
  ].join("|");

  return crypto.createHash("sha256").update(raw).digest("hex");
}
