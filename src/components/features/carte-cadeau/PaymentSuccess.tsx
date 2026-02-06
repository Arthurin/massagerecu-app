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
  const isProcessing = status === "init" || status === "processing";
  const isSuccess = status === "completed";
  const isError = status === "failed" || status === "error";
  const statusTone = isSuccess
    ? "success"
    : isProcessing
      ? "processing"
      : "error";

  const statusTitle = isSuccess
    ? "Paiement confirmé"
    : isProcessing
      ? "Traitement en cours"
      : "Problème lors du traitement";

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
          // 404 = webhook pas encore passé -> retry
          if (res.status === 404 && retries < MAX_RETRIES) {
            retries++;
            setTimeout(fetchResult, RETRY_DELAY_MS);
            return;
          }

          throw new Error(
            "Le résultat du traitement de la commande est indisponible",
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

        // processing -> retry
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
    <section className={`payment-success--${statusTone}`} aria-live="polite">
      {/* EN-TÊTE */}
      <div className="payment-success__header">
        <div className="payment-success__icon" aria-hidden="true">
          {isSuccess ? (
            <span className="payment-success__icon-glyph" aria-hidden="true">
              ✅
            </span>
          ) : isProcessing ? (
            <span
              className="payment-success__icon-spinner"
              aria-hidden="true"
            />
          ) : (
            "!"
          )}
        </div>
        <h3 className="payment-success__title">{statusTitle}</h3>
      </div>

      {/* PROCESSING */}
      {isProcessing && (
        <div className="payment-success__stack">
          <div className="payment-success__row">
            <div className="payment-success__spinner" aria-hidden="true" />
            <p>Votre paiement a bien été pris en compte.</p>
          </div>
          <div className="payment-success__panel">
            <p>
              {status === "init"
                ? "Enregistrement de votre commande..."
                : "Préparation de votre carte cadeau..."}
            </p>
            <p className="payment-success__hint">
              Cette étape peut prendre quelques instants.
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {isSuccess && (
        <div className="payment-success__stack">
          <p>Votre carte cadeau a été générée avec succès.</p>

          <div className="payment-success__panel payment-success__panel--success">
            <p>
              {email
                ? "Elle vient d'être envoyée à :"
                : "Elle va vous être envoyée par email."}
            </p>
            {email && <p className="payment-success__email">{email}</p>}
          </div>

          <p className="payment-success__hint">
            Pensez à vérifier votre dossier spam si nécessaire.
          </p>
        </div>
      )}

      {/* FAILED / ERROR */}
      {isError && (
        <div className="payment-success__stack">
          <p>
            Votre paiement a bien été enregistré, mais une erreur est survenue
            lors de l'envoit de votre commande. Je suis désolé pour la gêne
            occasionnée.
          </p>

          <div className="payment-success__panel payment-success__panel--error">
            <p>
              Contactez-moi par email pour que vous puissiez recevoir votre
              carte cadeau au plus vite :
            </p>
            <a
              href="mailto:massagerecu@gmail.com"
              aria-label="Contacter moi par email"
              className="payment-success__link"
            >
              massagerecu@gmail.com
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
