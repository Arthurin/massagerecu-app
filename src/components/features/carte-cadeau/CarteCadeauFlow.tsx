"use client";

import type { StripeAddressElementOptions } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import MassageSelector from "./MassageSelector";
import CarteCadeauForm from "./CarteCadeauForm";
import StripeCheckout from "../stripe/StripeCheckout";
import PaymentSuccess from "./PaymentSuccess";
import StepIndicator from "./StepIndicator";
import { MassageOption, CarteCadeauFormData } from "./types";
import type { CheckoutFormPersistHandle } from "../stripe/CheckoutForm";

type Step = 1 | 2 | 3 | 4 | 5;

export default function CarteCadeauFlow() {
  const [step, setStep] = useState<Step>(1);
  const [maxStepReached, setMaxStepReached] = useState<Step>(1);

  const [massage, setMassage] = useState<MassageOption | null>(null);
  const [formData, setFormData] = useState<CarteCadeauFormData | null>(null);
  const [massageCatalog, setMassageCatalog] = useState<MassageOption[]>([]);
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const formRef = useRef<HTMLFormElement | null>(null);
  const checkoutFormRef = useRef<HTMLFormElement | null>(null);
  const checkoutPersistRef = useRef<CheckoutFormPersistHandle | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState<string>("");
  const [checkoutAddress, setCheckoutAddress] = useState<
    StripeAddressElementOptions["defaultValues"] | null
  >(null);

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
        onStepClick={async (s) => {
          const targetStep = s as Step;

          if (targetStep === step) {
            return;
          }

          if (targetStep < step) {
            if (step === 3) {
              await checkoutPersistRef.current?.persistContactDetails();
            }
            setStep(targetStep);
            return;
          }

          if (step === 2 && targetStep === 3) {
            formRef.current?.requestSubmit();
            return;
          }

          if (step === 3 && targetStep === 4) {
            checkoutFormRef.current?.requestSubmit();
            return;
          }

          if (targetStep <= maxStepReached) {
            setStep(targetStep);
          }
        }}
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
          initialData={formData}
          formRef={formRef}
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
          formRef={checkoutFormRef}
          persistRef={checkoutPersistRef}
          email={checkoutEmail}
          addressDefaultValues={checkoutAddress}
          onEmailChange={setCheckoutEmail}
          onAddressChange={setCheckoutAddress}
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
