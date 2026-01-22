import { MassageCatalogItem } from "./types";

export const MASSAGE_CATALOG: Record<string, MassageCatalogItem> = {
  price_1RyCL1ENgi07PwIewz2vuZXv: {
    title: "Massage 1h",
    unitPrice: 60,
    stripeProductId: "price_1RyCL1ENgi07PwIewz2vuZXv",
  },
  "massage-2h": {
    title: "Massage 2h",
    unitPrice: 80,
    stripeProductId: "price_2IyIjhfhghjyFjwIewz2vuZXv",
  },
} as const;

/**
 * Helper pratique pour le front
 */
export const getCatalogList = (): MassageCatalogItem[] =>
  Object.values(MASSAGE_CATALOG);
