CREATE TABLE IF NOT EXISTS payment_results (
  payment_intent_id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
