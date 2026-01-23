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

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        receipt_email: email,
      },
      redirect: "if_required",
    });

    if (result.error) {
      console.error(result.error);
      let errorMessage =
        "Le paiement a échoué. Vérifiez vos informations ou veuillez me contacter en cas d'erreur répétée.";

      switch (result.error.type) {
        case "card_error":
          errorMessage = "Le paiement a échoué. " + result.error.message;
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

    if (result.paymentIntent?.status === "succeeded") {
      // Paiement confirmé
      onSuccess();
    } else {
      console.error(
        "résultat du paiement dans un état inconnu, paymentIntent.status est est attendu avec la valeur succeeded",
        result.paymentIntent
      );
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
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
        {/* Show any error or success messages */}
        {message && (
          <div id="payment-message" className="alert alert-danger text-center">
            {message}
          </div>
        )}
      </div>
    </form>
  );
}
