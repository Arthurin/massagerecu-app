"use client";

import { useState } from "react";
import MassageSelector from "./MassageSelector";
import CarteCadeauForm from "./CarteCadeauForm";
import { MassageOption, CarteCadeauOrder } from "./types";
import StripeCheckout from "@/components/features/stripe/StripeCheckout";

type Step = "select" | "form" | "payment" | "success";

const massageOptions: MassageOption[] = [
  {
    id: "massage-1h",
    title: "Massage 1h",
    price: 60,
    stripePriceId: "price_1RyCL1ENgi07PwIewz2vuZXv",
  },
  {
    id: "californien",
    title: "Massage Californien",
    price: 85,
    stripePriceId: "price_XXXXXXXXXXXX2",
  },
];

export default function CarteCadeauFlow() {
  const [order, setOrder] = useState<CarteCadeauOrder | null>(null);
  const [step, setStep] = useState<Step>("select");

  return (
    <>
      {step === "select" && (
        <MassageSelector
          options={massageOptions}
          onSelect={(massage) => {
            setOrder({ massage, formData: {} as any });
            setStep("form");
          }}
        />
      )}

      {step === "form" && order && (
        <CarteCadeauForm
          initialData={order.formData}
          onSubmit={(formData) => {
            setOrder({ massage: order.massage, formData });
            setStep("payment");
          }}
        />
      )}

      {step === "payment" && order && (
        <StripeCheckout
          lineItems={[
            {
              price: order.massage.stripePriceId,
              quantity: order.formData.quantity,
            },
          ]}
          checkoutData={{
            purchaserEmail: order.formData.purchaserEmail,
            purchaserName: order.formData.purchaserName,
            recipientName: order.formData.recipientName,
            message: order.formData.message,
          }}
          onSuccess={() => setStep("success")}
        />
      )}

      {step === "success" && order && (
        <div className="success">
          <h2>✅ Paiement confirmé</h2>
          <p>
            La carte cadeau pour <strong>{order.massage.title}</strong> a bien
            été achetée.
          </p>
          <p>
            Un email a été envoyé à{" "}
            <strong>{order.formData.purchaserEmail}</strong>.
          </p>
        </div>
      )}
    </>
  );
}
