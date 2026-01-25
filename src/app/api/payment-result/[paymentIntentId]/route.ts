import { NextResponse } from "next/server";
import { getPaymentResult } from "@/lib/stripe/paymentResults";

export async function GET(
  _req: Request,
  { params }: { params: { paymentIntentId: string } }
) {
  const { paymentIntentId } = params;

  if (!paymentIntentId) {
    return NextResponse.json(
      { error: "paymentIntentId manquant" },
      { status: 400 }
    );
  }

  const result = getPaymentResult(paymentIntentId);

  console.log("[API payment-result] requested id:", paymentIntentId);
  console.log("[API payment-result] current store:", result);

  if (!result) {
    return NextResponse.json({ error: "Result not found" }, { status: 404 });
  }
  return NextResponse.json({
    status: result.status,
    email: result.email ?? null,
  });
}
