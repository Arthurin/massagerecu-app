// app/api/session-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ error: "session_id manquant" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    const paymentIntent = session.payment_intent;
    let payment_intent_id = "";
    let payment_intent_status = "";

    if (typeof paymentIntent !== "string" && paymentIntent) {
      payment_intent_id = paymentIntent.id;
      payment_intent_status = paymentIntent.status;
    }

    return NextResponse.json({
      status: session.status,
      payment_status: session.payment_status,
      payment_intent_id,
      payment_intent_status,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 }
    );
  }
}
