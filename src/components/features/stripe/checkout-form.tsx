"use client";

import React, { useState, FormEvent } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { StripePaymentElementOptions } from "@stripe/stripe-js";

interface CheckoutFormProps {
  email: string;
  onSuccess: () => void;
  onError?: (message: string) => void;
}

export default function CheckoutForm({
  email,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: email,
      },
      redirect: "if_required",
    });

    if (error) {
      console.log(error);
      console.error(error.type);
      let errorMessage =
        "Le paiement a échoué. Vérifiez vos informations ou veuillez me contacter en cas d'erreur répétée.";

      switch (error.type) {
        case "card_error":
          errorMessage =
            "Le paiement a échoué. Veuillez vérifier les informations saisies. " +
            error.message;
          break;
        case "validation_error":
          errorMessage =
            "Le paiement n'a pu être effectué. Veuillez vérifier les informations saisies.";
          break;
        default:
      }

      setMessage(errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
      return;
    }

    // Paiement confirmé
    onSuccess();
    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: "accordion",
      defaultCollapsed: false,
      radios: true,
      spacedAccordionItems: true,
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3>Votre commande</h3>

      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <div className="d-grid gap-2 mt-3">
        <button
          disabled={isLoading || !stripe || !elements}
          className="btn btn-primary btn-lg py-2"
        >
          {isLoading ? "Paiement en cours…" : "Payer maintenant"}
        </button>
      </div>
      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" className="error">
          {message}
        </div>
      )}
    </form>
  );
}
