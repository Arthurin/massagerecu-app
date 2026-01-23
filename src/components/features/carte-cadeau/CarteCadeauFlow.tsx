"use client";

import { useEffect, useState } from "react";
import MassageSelector from "./MassageSelector";
import CarteCadeauForm from "./CarteCadeauForm";
import { MassageOption, CarteCadeauOrder } from "./types";
import StripeCheckout from "@/components/features/stripe/StripeCheckout";
import PaymentSuccess from "./PaymentSuccess";

type Step = "select" | "form" | "payment" | "success";

export default function CarteCadeauFlow() {
  const [order, setOrder] = useState<CarteCadeauOrder | null>(null);
  const [step, setStep] = useState<Step>("select");
  const [massageCatalog, setMassageCatalog] = useState<MassageOption[]>([]);

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        setMassageCatalog(data.items);
      });
  }, []);

  return (
    <>
      {step === "select" && (
        <MassageSelector
          options={massageCatalog}
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
          checkoutData={{
            purchaserEmail: order.formData.purchaserEmail,
            purchaserName: order.formData.purchaserName,
            recipientName: order.formData.recipientName,
            message: order.formData.message,
            massagePriceId: order.massage.massagePriceId,
            quantity: order.formData.quantity,
          }}
          onSuccess={() => setStep("success")}
        />
      )}

      {step === "success" && order && (
        <PaymentSuccess purchaserEmail={order.formData.purchaserEmail} />
      )}
    </>
  );
}
