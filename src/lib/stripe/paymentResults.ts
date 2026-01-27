import { pool } from "@/lib/db/client";

export async function savePaymentResult(
  paymentIntentId: string,
  { status, email }: { status: string; email: string | null }
) {
  await pool.query(
    `
    INSERT INTO payment_results (payment_intent_id, status, email)
    VALUES ($1, $2, $3)
    ON CONFLICT (payment_intent_id)
    DO UPDATE SET
      status = EXCLUDED.status,
      email = COALESCE(EXCLUDED.email, payment_results.email)
    `,
    [paymentIntentId, status, email]
  );
}

export async function getPaymentResult(paymentIntentId: string) {
  const { rows } = await pool.query(
    `
    SELECT status, email
    FROM payment_results
    WHERE payment_intent_id = $1
    `,
    [paymentIntentId]
  );

  return rows[0] ?? null;
}
