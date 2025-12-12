import Stripe from "stripe";

// Le SDK de Stripe impose un typage strict : il ne te laisse utiliser que les versions d’API officiellement supportées au moment de la publication du package.
// Je pourrais aussi retirer le numéro de version d’API pour que ce soit géré par Stripe via le dashboard de dev.
// et dans ce cas : export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});
