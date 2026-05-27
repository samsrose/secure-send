# Secure Share

Password-protected secret sharing built with **Next.js**, **shadcn/ui**, and **Upstash Redis** (Vercel-compatible NoSQL).

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

Without Upstash credentials, shares are stored in **this browser's localStorage** (local dev only). Links only work in the same browser where the secret was created. Add Upstash Redis for production.

## Deploy on Vercel

1. Push this repository to GitHub and import it in [Vercel](https://vercel.com/new).
2. Add **Upstash Redis** from the Vercel Marketplace (Storage).
3. Vercel injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` automatically.
4. Set `NEXT_PUBLIC_APP_URL` to your production domain (e.g. `https://secure-share.example.com`).
5. Deploy.

## API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/shares` | Store encrypted payload, returns `{ id, url, expiresAt }` |
| `GET` | `/api/shares/[id]` | Fetch encrypted payload for client-side decryption |

## Security notes

- Plaintext and passwords never leave the browser unencrypted.
- Use HTTPS in production.
- Share the password through a separate channel from the link.
- Rotate or shorten `SHARE_TTL_SECONDS` for more sensitive data.
