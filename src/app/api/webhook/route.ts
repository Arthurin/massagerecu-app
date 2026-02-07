// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { sendMail } from "@/lib/mailer";
import { generatePDF } from "@/lib/pdfUtils";

import { MASSAGE_CATALOG } from "@/lib/catalog/massageCatalog";
import { extractFromStripeMetadata } from "@/lib/stripe/metaData";
import { StripeCarteCadeauMetadata } from "@/lib/stripe/types";
import { MassageCatalogItem } from "@/lib/catalog/types";

import {
  createGiftcard,
  generateGiftcardId,
  giftcardExistsByPaymentIntent,
  GiftCardInsert,
  updateGiftCardStatusByPaymentIntent,
} from "@/lib/db/cartecadeau";

// Configure body parser for webhooks
export const config = {
  api: {
    bodyParser: false,
  },
};
export const runtime = "nodejs";

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
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed : ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
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
                `The parameter ${error.param} is invalid or missing.`,
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
      { status: 500 },
    );
  }
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
) {
  const paymentIntentId = paymentIntent.id;

  console.log(`Le paiement a été réussi (id : ${paymentIntentId})`);

  // 🔒 Idempotence Stripe
  const alreadyExists = await giftcardExistsByPaymentIntent(paymentIntentId);
  if (alreadyExists) {
    console.log("Carte cadeau déjà créée pour", paymentIntentId);
    return NextResponse.json({ received: true });
  }

  if (!paymentIntent.latest_charge) {
    throw new Error("No charge found on PaymentIntent");
  }

  const charge = await stripe.charges.retrieve(
    paymentIntent.latest_charge as string,
  );
  // on récupère les metadata et on vérifie qu'elles sont valides
  const metadata = extractFromStripeMetadata(paymentIntent.metadata);

  const catalogItem = MASSAGE_CATALOG[metadata.massagePriceId];

  if (!catalogItem) {
    throw new Error(
      "Massage inconnu dans le catalogue, id :" + metadata.massagePriceId,
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
      "Incohérence montant / metadata (possible fraude ou bien le catalogue des prix n'est pas à jour avec les prix du dashboard Stripe)",
    );
  }

  const giftId = await generateGiftcardId(new Date());

  const data = getGiftCardFullData(
    giftId,
    safePrice,
    catalogItem,
    metadata,
    charge,
    paymentIntentId,
  );

  const giftcard: GiftCardInsert = {
    id: giftId,
    paymentIntentId,
    buyerName: data.buyerName,
    recipientName: data.recipientName,
    dateCreation: data.dateCreation,
    dateExpiration: data.dateExpiration,
    title: data.giftTitle,
    quantity: data.quantity,
    email: data.buyerEmail,
    message: data.message,
    status: "processing",
    isTaxCollected: false,
    isExpired: false,
  };

  await createGiftcard(giftcard);
  console.log(`Traitement de la commande en cours pour ${data.buyerEmail}`);

  try {
    const pdfFields = {
      nomDestinataire: data.recipientName,
      nomAcheteur: data.buyerName,
      soin: data.giftTitle,
      dateExpiration: data.dateExpiration.toLocaleDateString("fr-FR"),
      idCarteCadeau: data.giftId,
      message: data.message,
    };

    const pdfBytes = await generatePDF(pdfFields);

    await sendCustomEmail(data.buyerEmail, {
      amount: data.priceWithCurrency,
      giftId: data.giftId,
      pdfBytes,
      recipientName: data.recipientName,
    });

    // gestion de l'idempotence : on marque le PaymentIntent comme traité si tout s'est bien passé
    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: {
        ...paymentIntent.metadata,
        processed: "true",
      },
    });

    //traitement terminé, on met à jour en base
    await updateGiftCardStatusByPaymentIntent(paymentIntentId, "completed", {
      clearError: true,
    });
    console.log(
      `✅ Traitement terminé de la carte cadeau (paymentintentid :${paymentIntentId})`,
    );
  } catch (err) {
    const errorMessage = normalizeErrorMessage(err);
    console.error(
      `Erreur lors de la génération du pdf et de l'envoi de l'email (paymentintentid :${paymentIntentId})`,
      err,
    );

    await updateGiftCardStatusByPaymentIntent(paymentIntentId, "failed", {
      errorCode: "EMAIL_PDF_PROCESSING",
      errorMessage,
      errorAt: new Date(),
      incrementFailureCount: true,
    });
  }
}

function normalizeErrorMessage(err: unknown, maxLength = 500) {
  let message =
    err instanceof Error ? err.message : typeof err === "string" ? err : "";

  if (!message) {
    message = "Unknown error";
  }

  // Normalize whitespace and truncate to avoid storing stack traces or PII
  message = message.replace(/\s+/g, " ").trim();
  if (message.length > maxLength) {
    message = message.slice(0, Math.max(0, maxLength - 3)) + "...";
  }

  return message;
}

async function sendCustomEmail(
  customerEmail: string,
  paymentInfos: {
    amount: string;
    giftId: string;
    pdfBytes: any;
    recipientName: string;
  },
) {
  console.log(`Let's send an email to ${customerEmail}...`);
  const filename = `Carte cadeau n°${paymentInfos.giftId}_${paymentInfos.recipientName}.pdf`;
  try {
    await sendMail({
      to: customerEmail,
      subject: "Voici votre carte cadeau",
      text: `Bonjour, votre paiement d'’un montant de ${paymentInfos.amount} a bien été reçu. Merci pour votre achat et à très bientôt ! 🌿`,
      html: `
        <p>Bonjour,</p>
        <p>Votre paiement d’un montant de <strong>${paymentInfos.amount}</strong> a bien été reçu.</p>
        <p>Merci pour votre achat et à très bientôt 🌿</p>
        <p><em>Massage Reçu</em></p>
      `,
      attachments: [
        {
          filename: filename,
          content: Buffer.from(paymentInfos.pdfBytes), // <--- conversion du Uint8Array en Buffer
          contentType: "application/pdf",
        },
      ],
    });
  } catch (err: any) {
    throw new Error(
      `Erreur lors de l'envoi par mail : ${err?.message ?? "erreur inconnue"}`,
    );
  }
}

function getGiftCardFullData(
  id: string,
  safePrice: number,
  catalogItem: MassageCatalogItem,
  metadata: StripeCarteCadeauMetadata,
  charge: Stripe.Charge,
  paymentId: string,
) {
  const price = (safePrice / 100).toFixed();
  const dateCreation = new Date();
  const dateExpiration = new Date();
  dateExpiration.setMonth(dateExpiration.getMonth() + 6); // expire dans 6 mois
  const title =
    metadata.quantity !== "1"
      ? `${catalogItem.title} (x${metadata.quantity})`
      : catalogItem.title;

  const email = charge.billing_details.email;
  if (email === null) {
    throw new Error(
      "Le mail de l'acheteur n'a pas pu être récupéré pour ce paiement (charge.billing_details.email est null)",
    );
  }
  console.log("charge data : ", charge);
  const buyerName = charge.billing_details.name;
  if (buyerName === null) {
    throw new Error(
      "Le nom de l'acheteur pour ce paiement n'a pas pu être récupéré (charge.billing_details.name est null)",
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
    quantity: Number(metadata.quantity ?? 1),
    message: metadata.message ?? "",
    dateCreation: dateCreation,
    dateExpiration: dateExpiration,
    paymentId: paymentId,
  };
}
