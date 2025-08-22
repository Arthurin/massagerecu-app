"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout-form";
import { loadStripe, StripeCheckoutElementsOptions } from "@stripe/stripe-js";
import { StripeErrorBoundary } from "./StripeErrorBoundary";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lineItems: [
              { price: "price_1RyCL1ENgi07PwIewz2vuZXv", quantity: 1 },
            ],
          }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok || !data.clientSecret) {
          throw new Error(
            data.error || "Impossible de récupérer le clientSecret Stripe"
          );
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Erreur API Checkout :", err.message);
          setErrorMessage(
            "Impossible de charger le formulaire de paiement. Veuillez réessayer plus tard."
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
  }, []);

  const appearance = useMemo<StripeCheckoutElementsOptions["appearance"]>(
    () => ({ theme: "stripe" }),
    []
  );

  if (loading) return <div>Chargement du formulaire de paiement...</div>;
  if (errorMessage)
    return (
      <div className="p-6 bg-red-100 text-red-800 rounded-lg">
        ⚠️ {errorMessage}
      </div>
    );
  if (!clientSecret)
    return (
      <div className="p-6 bg-red-100 text-red-800 rounded-lg">
        ⚠️ clientSecret manquant
      </div>
    );

  return (
    <CheckoutProvider
      stripe={stripePromise!}
      options={{
        fetchClientSecret: async () => clientSecret!,
        elementsOptions: { appearance },
      }}
    >
      <CheckoutForm />
    </CheckoutProvider>
  );
}
