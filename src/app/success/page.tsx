"use client";

import { useEffect, useState } from "react";

export default function Success() {
  const [status, setStatus] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentIntentStatus, setPaymentIntentStatus] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get("session_id");
    if (!sessionId) return;

    fetch(`/api/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setPaymentIntentId(data.payment_intent_id);
        setPaymentStatus(data.payment_status);
        setPaymentIntentStatus(data.payment_intent_status);
      });
  }, []);

  return (
    <div>
      <h2>✅ Merci ! Votre paiement a été validé.</h2>
      <p>Session status: {status}</p>
      <p>Payment intent ID: {paymentIntentId}</p>
      <p>Payment status: {paymentStatus}</p>
      <p>Payment intent status: {paymentIntentStatus}</p>
    </div>
  );
}
