"use client";

import { useEffect, useState } from "react";
import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import { StripeCheckoutProps } from "./types";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function StripeCheckout({
  massage,
  checkoutData,
  onSuccess,
  formRef,
  email,
  addressDefaultValues,
  onEmailChange,
  onAddressChange,
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const totalAmount = checkoutData.quantity * massage.unitPrice;

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            checkoutData: {
              ...checkoutData,
              massagePriceId: massage.massagePriceId,
            },
          }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok || !data.clientSecret) {
          throw new Error(data.error || "Impossible de créer le paiement");
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Erreur API Checkout :", err.message);
          setErrorMessage(
            "Impossible de charger le formulaire de paiement. Veuillez réessayer plus tard.",
          );
        } else {
          console.error("Erreur API Checkout inconnue :", err);
          setErrorMessage("Une erreur inconnue est survenue.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [massage, checkoutData]);

  if (errorMessage) {
    return <div className="alert alert-danger">{errorMessage}</div>;
  }

  const appearance: Appearance = {
    theme: "stripe",
  };

  const elementsOptions: StripeElementsOptions | null = clientSecret
    ? { clientSecret, appearance, loader: "auto" }
    : null;

  return (
    <div className="tw:space-y-6">
      {/* 🧾 RÉCAP COMMANDE */}
      <div className="tw:mb-6">
        <h3 className="tw:pb-4 text-center">Votre commande</h3>
        <div className="order-summary mb-4">
          <div className="tw:flex tw:py-3">
            <div className="fw-light-bold tw:grow">
              {checkoutData.quantity > 1 && (
                <>
                  <span>{checkoutData.quantity}</span> x&nbsp;
                </>
              )}

              <span>{massage.title}</span>
            </div>
            <div className="item-price fw-light-bold ps-3">
              {" "}
              {totalAmount.toFixed(0)}&nbsp;€
            </div>
          </div>
        </div>
      </div>

      {/* 💳 STRIPE */}
      {loading ? (
        <p>Chargement du paiement…</p>
      ) : clientSecret && elementsOptions ? (
        <Elements
          stripe={stripePromise}
          options={elementsOptions}
          key={clientSecret}
        >
          <CheckoutForm
            onSuccess={onSuccess}
            formRef={formRef}
            defaultEmail={email}
            addressDefaultValues={addressDefaultValues}
            onEmailChange={onEmailChange}
            onAddressChange={onAddressChange}
          />
        </Elements>
      ) : (
        <div className="alert alert-danger">
          Impossible de charger le formulaire de paiement. Veuillez réessayer
          plus tard.
        </div>
      )}
    </div>
  );
}
