import { pool } from "./pool";

export interface GiftCardInsert {
  id: string;
  paymentIntentId: string | null;

  buyerName: string | null;
  recipientName: string | null;

  dateCreation: Date;
  dateExpiration: Date;
  dateMassageDone?: Date | null;

  title: string;
  quantity: number;

  email: string | null;
  message: string | null;

  status: string;
  isTaxCollected: boolean;
  isExpired: boolean;
}

/**
 * Vérifie si un paymentIntentId existe déjà (idempotence Stripe)
 */
export async function giftcardExistsByPaymentIntent(
  paymentIntentId: string,
): Promise<boolean> {
  const res = await pool.query(
    `SELECT 1 FROM giftcards WHERE payment_intent_id = $1 LIMIT 1`,
    [paymentIntentId],
  );

  return (res.rowCount ?? 0) > 0;
}

/**
 * Génère l'id métier aammjj.n
 */
export async function generateGiftcardId(dateCreation: Date): Promise<string> {
  const y = dateCreation.getFullYear().toString().slice(2);
  const m = String(dateCreation.getMonth() + 1).padStart(2, "0");
  const d = String(dateCreation.getDate()).padStart(2, "0");

  const prefix = `${y}${m}${d}`;

  const res = await pool.query(
    `SELECT COUNT(*) FROM giftcards WHERE id LIKE $1`,
    [`${prefix}.%`],
  );

  const count = Number(res.rows[0].count);
  return `${prefix}.${count + 1}`;
}

export async function createGiftcard(data: GiftCardInsert) {
  const res = await pool.query(
    `
    INSERT INTO giftcards (
      id,
      payment_intent_id,
      buyer_name,
      recipient_name,
      date_creation,
      date_expiration,
      date_massage_done,
      title,
      quantity,
      email,
      message,
      status,
      is_tax_collected,
      is_expired
    )
    VALUES (
      $1, $2, $3, $4,
      $5, $6, $7,
      $8, $9, $10,
      $11, $12, $13, $14
    )
    RETURNING id
    `,
    [
      data.id,
      data.paymentIntentId,

      data.buyerName,
      data.recipientName,

      data.dateCreation,
      data.dateExpiration,
      data.dateMassageDone ?? null,

      data.title,
      data.quantity,

      data.email,
      data.message,

      data.status,
      data.isTaxCollected,
      data.isExpired,
    ],
  );

  return res.rows[0].id;
}

/**
 * Récupération d'une carte cadeau par paymentIntentId
 */
export async function getGiftcardByPaymentIntent(paymentIntentId: string) {
  const res = await pool.query(
    `
    SELECT
      id,
      email,
      status
    FROM giftcards
    WHERE payment_intent_id = $1
    `,
    [paymentIntentId],
  );

  return res.rows[0] ?? null;
}

export async function updateGiftCardStatusByPaymentIntent(
  paymentIntentId: string,
  status: "processing" | "completed" | "failed",
) {
  const res = await pool.query(
    `
    UPDATE giftcards
    SET status = $1
    WHERE payment_intent_id = $2
    `,
    [status, paymentIntentId],
  );

  return res.rowCount ?? 0;
}
