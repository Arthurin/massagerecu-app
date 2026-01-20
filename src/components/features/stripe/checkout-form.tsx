"use client";

import { useCheckout, PaymentElement } from "@stripe/react-stripe-js";
import { useState, FormEvent } from "react";

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
  const checkout = useCheckout();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const result = await checkout.confirm({
      email,
    });

    if (result.type === "error") {
      const errorMessage = result.error.message ?? "Erreur lors du paiement.";
      setMessage(errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
      return;
    }

    // Paiement confirmé
    onSuccess();
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3>Votre commande</h3>

      <PaymentElement id="payment-element" />

      <button disabled={isLoading} id="submit">
        {isLoading ? (
          <div className="spinner">Paiement en cours...</div>
        ) : (
          `Payer ${checkout.total.total.amount} maintenant`
        )}
      </button>
      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" className="error">
          {message}
        </div>
      )}
    </form>
  );
}
