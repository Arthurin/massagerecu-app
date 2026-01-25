"use client";

import { useState, useEffect } from "react";

interface PaymentSuccessProps {
  paymentIntentId: string;
}

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 1000;

export default function PaymentSuccess({
  paymentIntentId,
}: PaymentSuccessProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentIntentId) {
      console.error("paymentIntentId is empty");
      return;
    }

    let retries = 0;
    let cancelled = false;

    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/payment-result/${paymentIntentId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          // 404 = webhook pas encore passé → retry
          if (res.status === 404 && retries < MAX_RETRIES) {
            retries++;
            setTimeout(fetchResult, RETRY_DELAY_MS);
            return;
          }

          // autre erreur → on arrête
          throw new Error("Failed to fetch payment result");
        }

        const data = await res.json();

        if (cancelled) return;

        if (data.email) {
          setEmail(data.email);
          setLoading(false);
        } else if (retries < MAX_RETRIES) {
          retries++;
          setTimeout(fetchResult, RETRY_DELAY_MS);
        } else {
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setLoading(false);
        }
      }
    };

    fetchResult();

    return () => {
      cancelled = true;
    };
  }, [paymentIntentId]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-green-50 border border-green-200 rounded-lg space-y-4">
      <h2 className="text-xl font-semibold text-green-800">
        ✅ Paiement confirmé
      </h2>

      <p className="text-green-900">
        Merci pour votre achat. Votre paiement a bien été pris en compte.
      </p>

      <p className="text-green-900">
        Votre carte cadeau est en cours de préparation.{" "}
        {loading && <span>Chargement des informations…</span>}
      </p>

      {email ? (
        <p className="text-green-900">
          📧 Elle sera envoyée par email à l'adresse suivante :
          <br />
          <strong>{email}</strong>
        </p>
      ) : (
        <p className="text-green-900">📧 Elle sera envoyée par email.</p>
      )}

      <p className="text-sm text-green-700">
        ⏳ L'envoi peut prendre quelques minutes.
        <br />
        Pensez à vérifier votre dossier spam si besoin.
      </p>
    </div>
  );
}
