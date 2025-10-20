// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";
import { sendMail } from "@/lib/mailer";

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
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`
        );
        // Then define and call a method to handle the successful payment intent.
        handlePaymentIntentSucceeded(paymentIntent);
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
  // Extract customer email
  let customerEmail;

  // I expect receipt_email to be set
  if (paymentIntent.receipt_email) {
    customerEmail = paymentIntent.receipt_email;
  }

  // If email is stored in metadata
  else if (paymentIntent.metadata && paymentIntent.metadata.email) {
    customerEmail = paymentIntent.metadata.email;
  }

  // If there's a customer attached
  else if (paymentIntent.customer) {
    // Check if customer is already expanded (an object)
    if (
      typeof paymentIntent.customer === "object" &&
      paymentIntent.customer !== null
    ) {
      // Check if it's a non-deleted customer with email
      if (
        !("deleted" in paymentIntent.customer) &&
        "email" in paymentIntent.customer
      ) {
        customerEmail = paymentIntent.customer.email;
      }
    }
    // If it's just an ID string, retrieve the customer
    else if (typeof paymentIntent.customer === "string") {
      const customer = await stripe.customers.retrieve(paymentIntent.customer);
      if (!("deleted" in customer) && "email" in customer) {
        customerEmail = customer.email;
      }
    }
  }

  if (customerEmail) {
    // Send your own custom email
    await sendCustomEmail(customerEmail as string, {
      amount: (paymentIntent.amount / 100).toFixed(2),
      currency: paymentIntent.currency.toUpperCase(),
      paymentId: paymentIntent.id,
      // Add other details you want to include
    });
  }
}

async function sendCustomEmail(
  customerEmail: string,
  paymentInfos: { amount: string; currency: string; paymentId: string }
) {
  console.log(`Let's send an email to ${customerEmail}...`);
  try {
    await sendMail({
      to: customerEmail,
      subject: "[Massage Reçu] Merci pour votre achat !",
      text: `Bonjour, votre paiement d’un montant de ${paymentInfos.amount}€ a bien été reçu. Merci pour votre achat ! 🌿`,
      html: `
        <p>Bonjour,</p>
        <p>Votre paiement d’un montant de <strong>${paymentInfos.amount}€</strong> a bien été reçu.</p>
        <p>Merci pour votre achat et à très bientôt 🌿</p>
        <p><em>Massage Reçu</em></p>
      `,
    });
  } catch (err: any) {
    console.error("❌ Erreur lors de l'envoi :", err);
  }
}
