import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { lineItems } = await req.json();
    const YOUR_DOMAIN = process.env.NEXT_PUBLIC_BASE_URL;

    const session = await stripe.checkout.sessions.create({
      ui_mode: "custom",
      line_items: lineItems,
      mode: "payment",
      automatic_tax: { enabled: true },
      return_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret) {
      return NextResponse.json(
        { error: "Impossible de créer la session Stripe" },
        { status: 500 }
      );
    }
    console.log(session);

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err: unknown) {
    let message = "Stripe Checkout error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
