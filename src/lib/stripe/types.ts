export interface StripeCarteCadeauMetadata {
  purchaserName: string;
  purchaserEmail: string;
  recipientName: string;
  message: string;
  stripeProductId: string;
  quantity: string;
}

export const STRIPE_CARTE_CADEAU_METADATA_KEYS = [
  "purchaserName",
  "purchaserEmail",
  "recipientName",
  "message",
  "stripeProductId",
  "quantity",
] as const;
