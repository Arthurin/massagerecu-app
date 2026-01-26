"use client";

import { useState, useEffect } from "react";

interface PaymentSuccessProps {
  paymentIntentId: string;
}

type PaymentStatus = "processing" | "completed" | "failed" | "error";

const MAX_RETRIES = 15;
const RETRY_DELAY_MS = 1000;
const INITIAL_DELAY_MS = 1500;

export default function PaymentSuccess({
  paymentIntentId,
}: PaymentSuccessProps) {
  const [status, setStatus] = useState<PaymentStatus>("processing");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentIntentId) {
      console.error("paymentIntentId is empty");
      setStatus("error");
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

          throw new Error(
            "Le résultat du traitement de la commande est indisponible"
          );
        }

        const data = await res.json();
        if (cancelled) return;

        if (data.status === "completed") {
          setEmail(data.email ?? null);
          setStatus("completed");
          return;
        }

        if (data.status === "failed") {
          setStatus("failed");
          return;
        }

        // processing → retry
        if (retries < MAX_RETRIES) {
          retries++;
          setTimeout(fetchResult, RETRY_DELAY_MS);
        } else {
          setStatus("error");
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setStatus("error");
        }
      }
    };

    const initialTimeout = setTimeout(fetchResult, INITIAL_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(initialTimeout);
    };
  }, [paymentIntentId]);

  return (
    <div className="max-w-xl mx-auto p-6 rounded-lg border space-y-4">
      {/* TITRE */}
      <h2 className="text-xl font-semibold">
        {status === "completed"
          ? "✅ Paiement confirmé"
          : status === "processing"
          ? "⏳ Traitement en cours"
          : "❌ Problème lors du traitement"}
      </h2>

      {/* PROCESSING */}
      {status === "processing" && (
        <>
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-transparent rounded-full" />
            <p>
              Votre paiement a bien été pris en compte.
              <br />
              Nous préparons votre carte cadeau…
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Cette étape peut prendre quelques instants.
          </p>
        </>
      )}

      {/* SUCCESS */}
      {status === "completed" && (
        <>
          <p>🎉 Votre carte cadeau a été générée avec succès.</p>

          {email ? (
            <p>
              📧 Elle vient d'être envoyée à :
              <br />
              <strong>{email}</strong>
            </p>
          ) : (
            <p>📧 Elle va vous être envoyée par email.</p>
          )}

          <p className="text-sm text-gray-600">
            Pensez à vérifier votre dossier spam si nécessaire.
          </p>
        </>
      )}

      {/* FAILED / ERROR */}
      {(status === "failed" || status === "error") && (
        <>
          <p>
            Votre paiement a bien été effectué, mais une erreur est survenue
            lors de la finalisation de votre commande.
          </p>

          <p>
            👉{" "}
            <a
              href="mailto:massagerecu@gmail.com"
              aria-label="Contacter moi par email"
            >
              Contactez-moi par email
            </a>{" "}
            afin que je règle la situation rapidement.
          </p>
        </>
      )}
    </div>
  );
}
