export interface PaymentResult {
  email: string | null;
  createdAt: number;
  status: "processing" | "completed" | "failed";
}

const store = new Map<string, PaymentResult>();

const TTL_MS = 30 * 60 * 1000; // 30 minutes

function cleanup() {
  const now = Date.now();

  for (const [key, value] of store.entries()) {
    if (now - value.createdAt > TTL_MS) {
      store.delete(key);
    }
  }
}

export function savePaymentResult(
  paymentIntentId: string,
  result: PaymentResult
) {
  console.log("[STORE] Saving payment for paymentIntentId : ", paymentIntentId);

  cleanup();

  const previous = store.get(paymentIntentId);

  store.set(paymentIntentId, {
    ...previous,
    ...result,
    createdAt: result.createdAt ?? previous?.createdAt ?? Date.now(),
  });

  console.log("[STORE] after save :", store.get(paymentIntentId));
  console.log("[STORE] store size", store.size);
}

export function getPaymentResult(paymentIntentId: string) {
  cleanup(); // nettoyage avant lecture
  return store.get(paymentIntentId) ?? null;
}
