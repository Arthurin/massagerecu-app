CREATE TABLE IF NOT EXISTS giftcards (
  id TEXT PRIMARY KEY, -- ex: 260127.1
  payment_intent_id TEXT UNIQUE, -- idempotence Stripe, nullable (vente physique possible)
  buyer_name TEXT,
  recipient_name TEXT,
  date_creation DATE NOT NULL,
  date_expiration DATE NOT NULL,
  date_massage_done DATE, -- nullable
  title TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
  email TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'processing',
  is_tax_collected BOOLEAN NOT NULL DEFAULT FALSE,
  is_expired BOOLEAN NOT NULL DEFAULT FALSE
);

-- Index pour vérifications d’expiration
CREATE INDEX IF NOT EXISTS idx_cartecadeau_date_expiration
ON giftcards(date_expiration);

-- Index pour l'idempotence Stripe
CREATE UNIQUE INDEX IF NOT EXISTS giftcards_payment_intent_id_idx
  ON giftcards(payment_intent_id)
  WHERE payment_intent_id IS NOT NULL;

CREATE VIEW giftcards_not_expired AS
SELECT id, payment_intent_id, buyer_name, recipient_name, date_creation, date_expiration, date_massage_done, title, quantity, email, message, status, is_tax_collected,
  (date_expiration < CURRENT_DATE) AS is_expired
FROM giftcards