"use client";

import type { Ref } from "react";
import React, { useState, FormEvent } from "react";
import {
  PaymentElement,
  useStripe,
  AddressElement,
  LinkAuthenticationElement,
  useElements,
} from "@stripe/react-stripe-js";
import type { StripePaymentElementOptions } from "@stripe/stripe-js";

interface CheckoutFormProps {
  onSuccess: (paymentIntentId: string) => void;
  onError?: (message: string) => void;
  formRef?: Ref<HTMLFormElement>;
}

export default function CheckoutForm({
  onSuccess,
  onError,
  formRef,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
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
      redirect: "if_required",
    });

    console.log("Résultat du paiement :", result);

    if (result.error) {
      console.error(result.error);
      let errorMessage = "Le paiement a échoué.";
      let errorMessageDetails =
        result.error.message ??
        "Si le problème persiste contactez-moi : j'aime résoudre les bugs 🤓";

      switch (result.error.type) {
        case "card_error":
          errorMessage = "La tentative de paiement a échoué.";
          break;
        case "validation_error":
          errorMessage =
            "Les champs sont incomplets ou erronés. Veuillez vérifier les informations saisies.";
          errorMessageDetails = ` Vous pouvez refuser de donner votre adresse pour la facturation.
            Dans ce cas une adresse factice fera l'affaire : "refus - 35000 Rennes".`;
          break;
        case "invalid_request_error":
          errorMessage = result.error.message ?? "Le paiement a échoué.";
          errorMessageDetails =
            "Veuillez rafraichir la page et réessayer. Si le problème persiste contactez-moi : j'aime résoudre les bugs 🤓";
          break;
        default:
      }

      setMessage(errorMessage);
      setErrorDetails(errorMessageDetails);
      onError?.(errorMessage);
      setIsLoading(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      // Paiement confirmé
      onSuccess(result.paymentIntent.id);
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <h3>Coordonnées</h3>

      {/* Email + Link */}
      <LinkAuthenticationElement />

      {/* Adresse de facturation */}
      <AddressElement
        options={{
          mode: "billing",
          fields: {
            phone: "never",
          },
        }}
      />

      <h3>Paiement</h3>
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
            {errorDetails && (
              <>
                <br />
                {errorDetails}
              </>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
