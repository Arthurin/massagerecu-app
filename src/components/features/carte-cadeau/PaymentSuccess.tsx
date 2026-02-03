"use client";

import { useState, useEffect } from "react";

interface PaymentSuccessProps {
  paymentIntentId: string;
}

type PaymentStatus = "init" | "processing" | "completed" | "failed" | "error";

const MAX_RETRIES = 15;
const RETRY_DELAY_MS = 1000;
const INITIAL_DELAY_MS = 1500;

export default function PaymentSuccess({
  paymentIntentId,
}: PaymentSuccessProps) {
  const [status, setStatus] = useState<PaymentStatus>("init");
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

        if (data.status === "processing") {
          setStatus("processing");
        }

        // processing → retry
        if (retries < MAX_RETRIES) {
          retries++;
          setTimeout(fetchResult, RETRY_DELAY_MS);
        } else {
          // trop de retries
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
    <div className="tw:max-w-xl tw:mx-auto tw:p-6 tw:rounded-lg tw:border tw:space-y-4">
      {/* TITRE */}
      <h2 className="tw:text-xl tw:font-semibold">
        {status === "completed"
          ? "✅ Paiement confirmé"
          : status === "processing" || status === "init"
          ? "⏳ Traitement en cours"
          : "❌ Problème lors du traitement"}
      </h2>

      {/* PROCESSING */}
      {(status === "init" || status === "processing") && (
        <>
          <div className="tw:flex tw:items-center tw:gap-3">
            <div className="tw:animate-spin tw:h-5 tw:w-5 tw:border-2 tw:border-gray-300 tw:border-t-transparent tw:rounded-full" />
            <p>
              Votre paiement a bien été pris en compte.
              <br />
              {status === "init"
                ? "Enregistrement de votre commande…"
                : "Préparation de votre carte cadeau…"}
            </p>
          </div>
          <p className="tw:text-sm tw:text-gray-600">
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

          <p className="tw:text-sm tw:text-gray-600">
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
            afin que je règle la situation rapidement. Je suis désolé pour la
            gêne occasionnée.
          </p>
        </>
      )}
    </div>
  );
}
