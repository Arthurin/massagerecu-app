// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { sendMail } from "@/lib/mailer";
import { generatePDF } from "@/lib/pdfUtils";

import * as GoogleSheets from "@/lib/googleSheets";
import { MASSAGE_CATALOG } from "@/lib/catalog/massageCatalog";
import { extractFromStripeMetadata } from "@/lib/stripe/metaData";
import { StripeCarteCadeauMetadata } from "@/lib/stripe/types";
import { MassageCatalogItem } from "@/lib/catalog/types";
import { savePaymentResult } from "@/lib/stripe/paymentResults";

// Configure body parser for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers(); // await the headers Promise
  const signature = headersList.get("stripe-signature") as string;
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed : ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        console.log(event.data);
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      case "payment_intent.payment_failed":
        // Get the object affected
        const paymentIntentError = event.data.object;

        // Use stored information to get an error object
        const error = paymentIntentError.last_payment_error;

        // Use its type to choose a response
        switch (error?.type) {
          case "card_error":
            console.log(`A payment error occurred: ${error.message}`);
            break;
          case "invalid_request_error":
            console.log("An invalid request occurred.");
            if (error.param) {
              console.log(
                `The parameter ${error.param} is invalid or missing.`
              );
            }
            break;
          default:
            console.log("Another problem occurred, maybe unrelated to Stripe.");
            break;
        }
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a response to acknowledge receipt of the event
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error(`Webhook error during event handler: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Event Handler Error: ${err.message}` },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  console.log(`Le paiement a été réussi (id : ${paymentIntent.id})`);

  if (!paymentIntent.latest_charge) {
    throw new Error("No charge found on PaymentIntent");
  }

  const charge = await stripe.charges.retrieve(
    paymentIntent.latest_charge as string
  );
  try {
    // marquage du paiement comme "en cours de traitement"
    savePaymentResult(paymentIntent.id, {
      status: "processing",
      email: charge.billing_details.email ?? null,
      createdAt: Date.now(),
    });

    if (paymentIntent.metadata?.processed === "true") {
      console.log(
        `⏭️ PaymentIntent ${paymentIntent.id} déjà traité par le webhook, idempotence ok on ignore cet événement.`
      );
      return;
    }

    // 🔁 Idempotence google sheet
    const alreadyProcessed = await GoogleSheets.isPaymentAlreadyProcessed(
      paymentIntent.id
    );

    if (alreadyProcessed) {
      console.log(
        `↩️ Idempotence remarquée car l'entrée ${paymentIntent.id} est déjà présente dans le tableau.`
      );
      return NextResponse.json({ received: true });
    }

    // on récupère les metadata et on vérifie qu'elles sont valides
    const metadata = extractFromStripeMetadata(paymentIntent.metadata);

    const catalogItem = MASSAGE_CATALOG[metadata.massagePriceId];

    if (!catalogItem) {
      throw new Error(
        "Massage inconnu dans le catalogue, id :" + metadata.massagePriceId
      );
    }

    // expected Amount
    const safePrice = catalogItem.unitPrice * Number(metadata.quantity) * 100;

    if (paymentIntent.amount !== safePrice) {
      console.log("quantité : ", Number(metadata.quantity));
      console.log("unitPrice : ", catalogItem.unitPrice);
      console.log("safePrice ", safePrice);
      console.log("amount ", paymentIntent.amount);
      // log + alerte
      throw new Error(
        "Incohérence montant / metadata (possible fraude ou bien le catalogue des prix n'est pas à jour avec les prix du dashboard Stripe)"
      );
    }

    const data = getGiftCardFullData(
      paymentIntent.id,
      safePrice,
      catalogItem,
      metadata,
      charge
    );

    console.log(`Traitement de la commande en cours pour ${data.buyerEmail}`);

    await GoogleSheets.appendRow([
      data.giftId, // N° du bon
      "", // MASSAGE FAIT, laisser vide
      data.expirationDate, // Date d'expiration
      data.recipientName, // Bénéficiaire
      data.buyerName, // Acheteur
      data.giftTitle, // Titre
      "", // Déclaration, laisser vide
      "vente en ligne", // Règlement
      data.buyerEmail, // Contact
      data.purchaseDate, // Date d'achat
      data.message, // Message
    ]);

    console.log(
      `✅ Carte cadeau ${paymentIntent.id} enregistrée dans Google Sheet`
    );

    const pdfFields = {
      nomDestinataire: data.recipientName,
      nomAcheteur: data.buyerName,
      montant: data.priceWithCurrency,
      dateExpiration: data.expirationDate,
      idCarteCadeau: data.giftId,
    };

    const pdfBytes = await generatePDF(pdfFields);

    await sendCustomEmail(data.buyerEmail, {
      amount: data.priceWithCurrency,
      paymentId: paymentIntent.id,
      pdfBytes,
    });

    // gestion de l'idempotence : on marque le PaymentIntent comme traité si tout s'est bien passé
    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: {
        ...paymentIntent.metadata,
        processed: "true",
      },
    });
    savePaymentResult(paymentIntent.id, {
      status: "completed",
      email: charge.billing_details.email ?? null,
      createdAt: Date.now(),
    });
  } catch (err) {
    savePaymentResult(paymentIntent.id, {
      status: "post-treatment-failed",
      email: charge.billing_details.email ?? null,
      createdAt: Date.now(),
    });
  }
}

async function sendCustomEmail(
  customerEmail: string,
  paymentInfos: {
    amount: string;
    paymentId: string;
    pdfBytes: any;
  }
) {
  console.log(`Let's send an email to ${customerEmail}...`);
  try {
    await sendMail({
      to: customerEmail,
      subject: "[Massage Reçu] Merci pour votre achat !",
      text: `Bonjour, votre paiement d’un montant de ${paymentInfos.amount} a bien été reçu. Merci pour votre achat ! 🌿`,
      html: `
        <p>Bonjour,</p>
        <p>Votre paiement d’un montant de <strong>${paymentInfos.amount}</strong> a bien été reçu.</p>
        <p>Merci pour votre achat et à très bientôt 🌿</p>
        <p><em>Massage Reçu</em></p>
      `,
      attachments: [
        {
          filename: "recu.pdf",
          content: Buffer.from(paymentInfos.pdfBytes), // <--- conversion du Uint8Array en Buffer
          contentType: "application/pdf",
        },
      ],
    });
  } catch (err: any) {
    throw new Error(
      `Erreur lors de l'envoi : ${err?.message ?? "erreur inconnue"}`
    );
  }
}

function getGiftCardFullData(
  id: string,
  safePrice: number,
  catalogItem: MassageCatalogItem,
  metadata: StripeCarteCadeauMetadata,
  charge: Stripe.Charge
) {
  const price = (safePrice / 100).toFixed();
  const today = Date.now();
  const title =
    metadata.quantity !== "1"
      ? `${catalogItem.title} (x${metadata.quantity})`
      : catalogItem.title;

  const email = charge.billing_details.email;
  if (email === null) {
    throw new Error(
      "Le mail de l'acheteur n'a pas pu être récupéré pour ce paiement (charge.billing_details.email est null)"
    );
  }
  const address = charge.billing_details.address;
  const buyerName = charge.billing_details.name;
  if (buyerName === null) {
    throw new Error(
      "Le nom de l'acheteur pour ce paiement n'a pas pu être récupéré (charge.billing_details.name est null)"
    );
  }

  return {
    giftId: id,
    giftTitle: title,
    recipientName: metadata.recipientName ?? "",
    buyerName: buyerName,
    buyerEmail: email,
    price: price,
    priceWithCurrency: `${price}€`,
    message: metadata.message ?? "",
    purchaseDate: new Date(today * 1000).toLocaleDateString("fr-FR"),
    expirationDate: new Date(
      today + 183 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("fr-FR"),
  };
}
