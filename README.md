# Secure Share

Password-protected secret sharing built with **Next.js**, **shadcn/ui**, and **PostgreSQL** (Neon on Vercel).

## Features

- **Share tab**: textarea for secrets, auto-generated 8-character password, one-click secure link
- **Decrypt tab**: share ID + password to reveal ciphertext
- **Direct links**: `/s/{id}` opens the decrypt flow for a specific share
- **Client-side encryption**: AES-256-GCM with PBKDF2; the server only stores ciphertext
- **TTL**: shares expire after 7 days by default (configurable)

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without `DATABASE_URL`, shares are stored in **this browser's localStorage** (local dev only). Links only work in the same browser where the secret was created.

### Local PostgreSQL (optional)

```bash
# Example with Neon dev branch or local Postgres
DATABASE_URL=postgresql://user:pass@localhost:5432/secure_share npm run db:migrate
npm run dev
```

## Deploy on Vercel (production)

1. Push this repository to GitHub and import it in [Vercel](https://vercel.com/new).
2. Add **Neon** (or **Vercel Postgres**) from the Marketplace → Storage.
3. Vercel injects `DATABASE_URL` (and often `POSTGRES_URL`) automatically.
4. Run the schema migration against your production database:

   ```bash
   DATABASE_URL="your-production-url" npm run db:migrate
   ```

   Or paste `db/schema.sql` into the Neon SQL Editor.

5. Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g. `https://secure-share.example.com`).
6. Deploy.

Storage priority: **PostgreSQL** (`DATABASE_URL`) → **Upstash Redis** (legacy fallback) → **localStorage** (no server env vars).

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/shares/storage` | Returns `{ mode, ttlSeconds }` |
| `POST` | `/api/shares` | Store encrypted payload, returns `{ id, url, expiresAt, storage }` |
| `GET` | `/api/shares/[id]` | Fetch encrypted payload for client-side decryption |

## Database schema

See [`db/schema.sql`](db/schema.sql). The `shares` table stores only encrypted blobs and expiry metadata—never plaintext or passwords.

## Security notes

- Plaintext and passwords never leave the browser unencrypted.
- Use HTTPS in production.
- Share the password through a separate channel from the link.
- Rotate or shorten `SHARE_TTL_SECONDS` for more sensitive data.
