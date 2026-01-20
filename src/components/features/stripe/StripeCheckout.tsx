"use client";

import { useEffect, useMemo, useState } from "react";
import CheckoutForm from "./checkout-form";
import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from "@stripe/stripe-js";

import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export interface StripeLineItem {
  price: string;
  quantity: number;
}

interface StripeCheckoutProps {
  lineItems: StripeLineItem[];
  checkoutData: {
    purchaserEmail: string;
    purchaserName: string;
    recipientName: string;
    message?: string;
  };
  onSuccess: () => void;
}

export default function StripeCheckout({
  lineItems,
  checkoutData,
  onSuccess,
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lineItems, checkoutData }),
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
  }, [lineItems, checkoutData]);

  const appearance = {
    theme: "stripe",
    rules: {
      ".Input": {
        padding: "12px",
        fontSize: "16px",
      },
      ".Label": {
        fontWeight: "500",
      },
    },
  } as const;

  /** 
  // thème à choisir entre 'stripe', 'night', ou 'flat'
  const appearanceObject: Appearance = {
    theme: "stripe",
    rules: {
      ".AccordionItem": {
        backgroundColor: "#f6f6f6",
        boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.03)",
      },
      ".Input": {
        padding: "12px",
      },
    },
  };

    // Je peux également personnaliser davantage avec variables et rules
    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "Ideal Sans, system-ui, sans-serif",
      spacingUnit: "2px",
      borderRadius: "4px",
    },
    rules: {
      ".Tab": {
        border: "1px solid #E0E6EB",
        boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.03)",
      },
      ".Tab:hover": {
        color: "var(--colorText)",
      },
      ".Input": {
        padding: "12px",
      },
    },

  const appearance = useMemo<StripeCheckoutElementsOptions["appearance"]>(
    () => appearanceObject,
    []
  );*/

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

  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";
  const elementsOptions: StripeElementsOptions = {
    clientSecret,
    appearance,
    loader,
  };

  return (
    <Elements
      stripe={stripePromise}
      options={elementsOptions}
      key={clientSecret}
    >
      <CheckoutForm onSuccess={onSuccess} email={checkoutData.purchaserEmail} />
    </Elements>
  );
}
