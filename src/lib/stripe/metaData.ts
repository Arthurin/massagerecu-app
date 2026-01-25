import {
  STRIPE_CARTE_CADEAU_METADATA_KEYS,
  StripeCarteCadeauMetadata,
  OPTIONAL_METADATA_KEYS,
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
    recipientName: data.recipientName,
    message: data.message ?? "",
    massagePriceId: data.massagePriceId,
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

    const isOptional = (OPTIONAL_METADATA_KEYS as readonly string[]).includes(
      key
    );

    if (value === undefined || value === null) {
      throw new Error(`Metadata Stripe absente : ${key}`);
    }

    if (!isOptional && value.trim() === "") {
      throw new Error(`Metadata Stripe vide : ${key}`);
    }

    result[key] = value;
  }

  return result;
}
