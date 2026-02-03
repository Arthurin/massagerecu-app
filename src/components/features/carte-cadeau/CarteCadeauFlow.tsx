"use client";

import type { StripeAddressElementOptions } from "@stripe/stripe-js";
import { useEffect, useRef, useState } from "react";
import MassageSelector from "./MassageSelector";
import CarteCadeauForm from "./CarteCadeauForm";
import StripeCheckout from "../stripe/StripeCheckout";
import PaymentSuccess from "./PaymentSuccess";
import StepIndicator from "./StepIndicator";
import { MassageOption, CarteCadeauFormData } from "./types";

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
  const [checkoutEmail, setCheckoutEmail] = useState<string>("");
  const [checkoutAddress, setCheckoutAddress] = useState<
    StripeAddressElementOptions["defaultValues"] | null
  >(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        setMassageCatalog(data.items);
      });
  }, []);

  useEffect(() => {
    containerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [step]);

  const goToStep = (next: Step) => {
    setStep(next);
    setMaxStepReached((prev) => (next > prev ? next : prev));
  };

  return (
    <div
      ref={containerRef}
      className="max-w-xl mx-auto px-4 sm:px-6 py-6 transition-all duration-300"
    >
      {step !== 4 && (
        <StepIndicator
          currentStep={step}
          maxStepReached={maxStepReached}
          onStepClick={(s) => {
            const targetStep = s as Step;

            if (targetStep === step) {
              return;
            }

            if (targetStep < step) {
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
      )}

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
