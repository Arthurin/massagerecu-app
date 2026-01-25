"use client";

import { useEffect, useState } from "react";
import MassageSelector from "./MassageSelector";
import CarteCadeauForm from "./CarteCadeauForm";
import StripeCheckout from "../stripe/StripeCheckout";
import PaymentSuccess from "./PaymentSuccess";
import StepIndicator from "./StepIndicator";
import { MassageOption, CarteCadeauOrder, CarteCadeauFormData } from "./types";

type Step = 1 | 2 | 3 | 4 | 5;

export default function CarteCadeauFlow() {
  const [step, setStep] = useState<Step>(1);
  const [maxStepReached, setMaxStepReached] = useState<Step>(1);

  const [massage, setMassage] = useState<MassageOption | null>(null);
  const [formData, setFormData] = useState<CarteCadeauFormData | null>(null);
  const [massageCatalog, setMassageCatalog] = useState<MassageOption[]>([]);
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        setMassageCatalog(data.items);
      });
  }, []);

  const goToStep = (next: Step) => {
    setStep(next);
    setMaxStepReached((prev) => (next > prev ? next : prev));
  };

  return (
    <div className="max-w-xl mx-auto">
      <StepIndicator
        currentStep={step}
        maxStepReached={maxStepReached}
        onStepClick={(s) => s <= maxStepReached && setStep(s as Step)}
      />

      {step === 1 && (
        <MassageSelector
          options={massageCatalog}
          onSelect={(m) => {
            setMassage(m);
            goToStep(2);
          }}
        />
      )}

      {step === 2 && massage && (
        <CarteCadeauForm
          massage={massage}
          onSubmit={(data) => {
            setFormData(data);
            goToStep(3);
          }}
        />
      )}

      {step === 3 && massage && formData && (
        <StripeCheckout
          massage={massage}
          checkoutData={formData}
          onSuccess={(id) => {
            setPaymentIntentId(id);
            goToStep(4);
          }}
        />
      )}

      {step === 4 && <PaymentSuccess paymentIntentId={paymentIntentId} />}
    </div>
  );
}
