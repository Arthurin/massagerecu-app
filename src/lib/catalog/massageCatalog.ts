import { MassageCatalogItem } from "./types";
const PRICE_1H = "price_1SsTFMENgi07PwIeppJAywo6";
const PRICE_1H30 = "price_1SsW2qENgi07PwIe9kc2OuMu";
const PRICE_2H = "price_1SsW3IENgi07PwIeXvu7BHJ7";

export const MASSAGE_CATALOG: Record<string, MassageCatalogItem> = {
  [PRICE_1H]: {
    title: "Massage de 1h00",
    description: "Carte cadeau pour un massage de 1h00.",
    unitPrice: 60,
    massagePriceId: PRICE_1H,
  },
  [PRICE_1H30]: {
    title: "Massage de 1h30",
    description: "Carte cadeau pour un massage de 1h30.",
    unitPrice: 80,
    massagePriceId: PRICE_1H30,
  },
  [PRICE_2H]: {
    title: "Massage de 2h00",
    description: "Carte cadeau pour un massage de 2h00.",
    unitPrice: 100,
    massagePriceId: PRICE_2H,
  },
} as const;

/**
 * Helper pratique pour le front
 */
export const getCatalogList = (): MassageCatalogItem[] =>
  Object.values(MASSAGE_CATALOG);
