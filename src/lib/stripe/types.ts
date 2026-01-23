export interface StripeCarteCadeauMetadata {
  purchaserName: string;
  purchaserEmail: string;
  recipientName: string;
  message: string;
  massagePriceId: string;
  quantity: string;
}

export const STRIPE_CARTE_CADEAU_METADATA_KEYS = [
  "purchaserName",
  "purchaserEmail",
  "recipientName",
  "message",
  "massagePriceId",
  "quantity",
] as const;

export const OPTIONAL_METADATA_KEYS = ["message"] as const;
type OptionalKey = (typeof OPTIONAL_METADATA_KEYS)[number]; //message must exist but it can be the empty value ''
