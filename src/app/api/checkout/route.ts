import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

/**
 * Types attendus depuis le frontend
 */
interface LineItem {
  price: string;
  quantity: number;
}

interface CheckoutData {
  purchaserEmail: string;
  purchaserName: string;
  recipientName: string;
  message?: string;
}

interface CheckoutRequestBody {
  lineItems: LineItem[];
  checkoutData: CheckoutData;
}

/**
 * POST /api/checkout
 */
export async function POST(req: Request) {
  try {
    /* ----------------------------------
     * 1️⃣ Lecture et validation du body
     * ---------------------------------- */
    const body = (await req.json()) as CheckoutRequestBody;
    const { lineItems, checkoutData } = body;

    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { error: "lineItems manquant, commande incorrecte" },
        { status: 400 }
      );
    }

    if (!checkoutData?.purchaserEmail) {
      return NextResponse.json(
        { error: "checkoutData.purchaserEmail manquant" },
        { status: 400 }
      );
    }

    /* ----------------------------------
     * 2️⃣ Récupération sécurisée des prix Stripe
     * ---------------------------------- */
    let amount = 0;

    for (const item of lineItems) {
      if (!item.price || !item.quantity) {
        return NextResponse.json(
          { error: "commande (lineItem) invalide" },
          { status: 400 }
        );
      }

      // 🔐 récupération du prix depuis Stripe (anti-fraude)
      const price = await stripe.prices.retrieve(item.price);

      if (!price.unit_amount) {
        return NextResponse.json(
          { error: "Quantité d'achat invalide" },
          { status: 400 }
        );
      }

      amount += price.unit_amount * item.quantity;
    }

    if (amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    /* ----------------------------------
     * 3️⃣ Création du PaymentIntent
     * ---------------------------------- */
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",

      // email utilisé par Stripe (reçus, conformité)
      receipt_email: checkoutData.purchaserEmail,

      // paiement embarqué, sans redirection
      automatic_payment_methods: {
        enabled: true,
      },

      metadata: {
        purchaserName: checkoutData.purchaserName,
        purchaserEmail: checkoutData.purchaserEmail,
        recipientName: checkoutData.recipientName,
        message: checkoutData.message ?? "",
        productType: "carte_cadeau",
      },
    });

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
      { status: 500 }
    );
  }
}
