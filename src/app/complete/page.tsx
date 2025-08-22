"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Complete() {
  const [status, setStatus] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentIntentStatus, setPaymentIntentStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get("session_id");
    if (!sessionId) {
      setError("Identifiant de session manquant.");
      setIsLoading(false);
      return;
    }

    fetch(`/api/session-status?session_id=${sessionId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error("Impossible de récupérer le statut de la session.");
        }
        return data;
      })
      .then((data) => {
        setStatus(data.status);
        setPaymentIntentId(data.payment_intent_id);
        setPaymentStatus(data.payment_status);
        setPaymentIntentStatus(data.payment_intent_status);

        // Handle different session statuses
        if (data.status !== "complete") {
          setError(`Le paiement n'a pas été complété. Status: ${data.status}`);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          err.message || "Impossible de récupérer les informations de paiement."
        );
        setIsLoading(false);
      });
  }, []);

  const handleTryAgain = () => {
    // Redirect back to checkout page
    router.push("/checkout");
  };

  if (isLoading) {
    return <div>Loading payment status...</div>;
  }

  return (
    <div>
      {status === "complete" ? (
        <div>
          <h2>✅ Merci ! Votre paiement a été validé.</h2>
          <p>Session status: {status}</p>
          <p>Payment intent ID: {paymentIntentId}</p>
          <p>Payment status: {paymentStatus}</p>
          <p>Payment intent status: {paymentIntentStatus}</p>
        </div>
      ) : (
        <div>
          <h2>❌ Erreur !</h2>
          <p>{error}</p>
          <button onClick={handleTryAgain}>Essayer à nouveau</button>
        </div>
      )}
    </div>
  );
}
