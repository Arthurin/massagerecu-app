import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { StripeMetaData } from "@/components/features/stripe/types";
import { exportToStripeMetadata } from "@/lib/stripe/metaData";
import { createCheckoutIdempotencyKey } from "@/lib/stripe/idempotency";

function sanitizeText(input: string | null): string {
  if (!input) return "";
  return input.replace(/[<>]/g, "");
}

/**
 * POST /api/checkout
 */
export async function POST(req: Request) {
  try {
    /* ----------------------------------
     * 1️⃣ Lecture et validation du body
     * ---------------------------------- */
    const body = (await req.json()) as StripeMetaData; //Type attendu depuis le frontend
    const { checkoutData } = body;

    const metadata = exportToStripeMetadata({
      recipientName: sanitizeText(checkoutData.recipientName),
      message: sanitizeText(checkoutData.message),
      quantity: checkoutData.quantity.toString(),
      massagePriceId: sanitizeText(checkoutData.massagePriceId),
    });

    /* ----------------------------------
     * 2️⃣ Récupération sécurisée des prix Stripe
     * ---------------------------------- */
    let amount = 0;

    if (!checkoutData.massagePriceId || !checkoutData.quantity) {
      return NextResponse.json(
        { error: "commande invalide, prix/quantité manquante" },
        { status: 400 },
      );
    }

    const quantity = checkoutData.quantity;

    // 🔐 récupération du prix depuis Stripe (anti-fraude)
    const priceProductId = await stripe.prices.retrieve(
      checkoutData.massagePriceId,
    );
    console.log("PRIX", priceProductId);
    if (!priceProductId.unit_amount) {
      return NextResponse.json(
        { error: "Prix Stripe invalide" },
        { status: 400 },
      );
    }
    if (priceProductId.currency !== "eur") {
      throw new Error("Devise non supportée");
    }

    if (quantity <= 0 || quantity > 15) {
      throw new Error("Quantité invalide");
    }

    amount += priceProductId.unit_amount * quantity;

    if (amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    /* ----------------------------------
     * 3️⃣ Création du PaymentIntent
     * ---------------------------------- */
    const idempotencyKey = createCheckoutIdempotencyKey({
      recipientName: checkoutData.recipientName,
      massagePriceId: checkoutData.massagePriceId,
      quantity: checkoutData.quantity,
    });
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency: "eur",

        // paiement embarqué, sans redirection
        automatic_payment_methods: {
          enabled: true,
        },

        metadata: metadata,
      },
      {
        idempotencyKey,
      },
    );

    /* ----------------------------------
     * 4️⃣ Réponse au frontend
     * ---------------------------------- */
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Erreur API /checkout :", err);

    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Erreur serveur Stripe" },
      { status: 500 },
    );
  }
}
