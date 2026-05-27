CREATE TABLE IF NOT EXISTS shares (
  id VARCHAR(12) PRIMARY KEY,
  ciphertext TEXT NOT NULL,
  iv TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS shares_expires_at_idx ON shares (expires_at);
