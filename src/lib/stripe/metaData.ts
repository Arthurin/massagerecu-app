import {
  STRIPE_CARTE_CADEAU_METADATA_KEYS,
  StripeCarteCadeauMetadata,
} from "./types";
import Stripe from "stripe";

/**
 * Convertit un contrat métier STRICT
 * vers le format attendu par Stripe
 */
export function exportToStripeMetadata(
  data: StripeCarteCadeauMetadata
): Stripe.MetadataParam {
  return {
    purchaserName: data.purchaserName,
    purchaserEmail: data.purchaserEmail,
    recipientName: data.recipientName,
    message: data.message,
    stripeProductId: data.stripeProductId,
    quantity: data.quantity,
  };
}

export function extractFromStripeMetadata(
  metadata: Stripe.Metadata | null
): StripeCarteCadeauMetadata {
  if (!metadata) {
    throw new Error("Stripe metadata absente");
  }

  const result = {} as StripeCarteCadeauMetadata;

  for (const key of STRIPE_CARTE_CADEAU_METADATA_KEYS) {
    const value = metadata[key];
    if (!value) {
      throw new Error(`Metadata Stripe manquante : ${key}`);
    }
    result[key] = value;
  }

  return result;
}
