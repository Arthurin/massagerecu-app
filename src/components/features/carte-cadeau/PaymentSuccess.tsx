"use client";

import { useState, useEffect } from "react";

interface PaymentSuccessProps {
  paymentIntentId: string;
}

type PaymentStatus =
  | "init"
  | "processing"
  | "completed"
  | "failed"
  | "error"
  | "timeout"
  | "fetch_failed";

type StepState = "pending" | "active" | "done" | "error";

const MAX_RETRIES = 15;
const RETRY_DELAY_MS = 1000;
const INITIAL_DELAY_MS = 1500;

export default function PaymentSuccess({
  paymentIntentId,
}: PaymentSuccessProps) {
  const [status, setStatus] = useState<PaymentStatus>("init");
  const [email, setEmail] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [lastKnownStatus, setLastKnownStatus] = useState<"init" | "processing">(
    "init",
  );
  const isProcessing = status === "init" || status === "processing";
  const isSuccess = status === "completed";
  const isError = status === "failed" || status === "error";
  const isTimeout = status === "timeout";
  const isFetchFailed = status === "fetch_failed";
  const isPending = isProcessing || isTimeout || isFetchFailed;
  const statusTone = isSuccess ? "success" : isPending ? "processing" : "error";

  const statusTitle = isSuccess
    ? "Commande envoyée"
    : isTimeout
      ? "Traitement en cours — confirmation en attente"
      : isFetchFailed
        ? "Vérification en attente"
        : isProcessing
          ? "Traitement en cours"
          : "Problème lors du traitement";

  const errorStep =
    status === "failed" ? 3 : status === "error" ? (hasResult ? 2 : 1) : null;

  const getStepState = (step: 1 | 2 | 3): StepState => {
    if (errorStep) {
      if (step < errorStep) return "done";
      if (step === errorStep) return "error";
      return "error";
    }

    if (isFetchFailed) {
      return "pending";
    }

    if (!hasResult) {
      return step === 1 ? "active" : "pending";
    }

    if (status === "timeout") {
      if (lastKnownStatus === "processing") {
        if (step === 3) return "pending";
        return "done";
      }

      if (step === 1) return "done";
      return "pending";
    }

    if (status === "init") {
      if (step === 1) return "done";
      if (step === 2) return "active";
      return "pending";
    }

    if (status === "processing") {
      if (step === 3) return "active";
      return "done";
    }

    if (status === "completed") {
      return "done";
    }

    return "pending";
  };

  const step1State = getStepState(1);
  const step2State = getStepState(2);
  const step3State = getStepState(3);

  useEffect(() => {
    if (!paymentIntentId) {
      console.error("paymentIntentId is empty");
      setFetchFailed(true);
      setStatus("fetch_failed");
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

          setFetchFailed(true);
          setStatus("fetch_failed");
          return;
        }

        const data = await res.json();
        if (cancelled) return;
        setHasResult(true);

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
          setLastKnownStatus("processing");
          setStatus("processing");
        } else if (data.status === "init") {
          setLastKnownStatus("init");
          setStatus("init");
        }

        // processing -> retry
        if (retries < MAX_RETRIES) {
          retries++;
          setTimeout(fetchResult, RETRY_DELAY_MS);
        } else {
          // trop de retries
          setStatus("timeout");
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setFetchFailed(true);
          setStatus("fetch_failed");
        }
      }
    };

    const initialTimeout = setTimeout(fetchResult, INITIAL_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(initialTimeout);
    };
  }, [paymentIntentId]);

  const renderStepIcon = (state: StepState) => {
    if (state === "done") {
      return <span className="payment-success__step-check">✅</span>;
    }

    if (state === "error") {
      return <span className="payment-success__step-cross">❌</span>;
    }

    if (isTimeout || isFetchFailed) {
      return <span className="payment-success__step-hourglass">⏳</span>;
    }

    return <span className="payment-success__step-spinner" />;
  };

  const getStepClass = (state: StepState) => {
    if (state === "done") return "payment-success__step--done";
    if (state === "error") return "payment-success__step--error";
    if (state === "active") return "payment-success__step--active";
    return "payment-success__step--pending";
  };

  return (
    <section
      className={`payment-success payment-success--${statusTone}`}
      aria-live="polite"
    >
      {/* EN-TÊTE */}
      <div className="payment-success__header">
        <div className="payment-success__icon" aria-hidden="true">
          {isSuccess ? (
            <span className="payment-success__icon-glyph" aria-hidden="true">
              ✅
            </span>
          ) : isTimeout || isFetchFailed ? (
            <span className="payment-success__icon-glyph" aria-hidden="true">
              ⏳
            </span>
          ) : isPending ? (
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

      {/* ETAPES */}
      <div className="payment-success__steps" aria-label="Suivi du traitement">
        <div className={`payment-success__step ${getStepClass(step1State)}`}>
          <div className="payment-success__step-icon" aria-hidden="true">
            {renderStepIcon(step1State)}
          </div>
          <div className="payment-success__step-text">
            Enregistrement de votre commande.
          </div>
        </div>

        <div className={`payment-success__step ${getStepClass(step2State)}`}>
          <div className="payment-success__step-icon" aria-hidden="true">
            {renderStepIcon(step2State)}
          </div>
          <div className="payment-success__step-text">
            Préparation de votre carte cadeau.
          </div>
        </div>

        <div className={`payment-success__step ${getStepClass(step3State)}`}>
          <div className="payment-success__step-icon" aria-hidden="true">
            {renderStepIcon(step3State)}
          </div>
          <div className="payment-success__step-text">
            Envoi de votre carte cadeau par email.
          </div>
        </div>
      </div>

      {/* SUCCESS */}
      {isSuccess && (
        <div className="payment-success__stack">
          <p>Votre carte cadeau est prête.</p>

          <div className="payment-success__panel payment-success__panel--success">
            <p>
              {email
                ? "Elle vient d'être envoyée à :"
                : "Elle vous sera envoyée par email dans quelques instants."}
            </p>
            {email && <p className="payment-success__email">{email}</p>}
          </div>

          <p className="payment-success__hint">
            Pensez à vérifier vos spam si besoin.
          </p>
        </div>
      )}

      {/* FAILED / ERROR */}
      {isTimeout && (
        <div className="payment-success__stack">
          <p>
            Votre paiement a bien été confirmé et le traitement continue en
            arrière-plan. Vous pouvez quitter la page et poursuivre votre
            navigation. Vous recevrez votre carte cadeau par email dès qu’elle
            sera prête.
          </p>
          <div className="payment-success__panel">
            <p>Si vous n’avez rien reçu d’ici 30 minutes, contactez‑moi.</p>
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

      {isFetchFailed && (
        <div className="payment-success__stack">
          <p>
            Nous n'avons pas pu confirmer le résultat de la commande pour
            l’instant. Votre paiement a bien été pris en compte et le traitement
            peut continuer en arrière-plan. Vous recevrez votre carte cadeau par
            email dès qu’elle sera prête.
          </p>
          <div className="payment-success__panel">
            <p>Si vous n’avez rien reçu d’ici 30 minutes, contactez‑moi.</p>
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

      {isError && (
        <div className="payment-success__stack">
          <p>
            Votre paiement a bien été confirmé, mais une erreur est survenue
            lors du traitement de votre commande. Je suis désolé pour la gêne
            occasionnée.
          </p>

          <div className="payment-success__panel payment-success__panel--error">
            <p>
              Contactez-moi par email pour recevoir votre carte cadeau au plus
              vite :
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
