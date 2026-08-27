# Oraik Engine setup

Oraik Engine is available at `/engine`. It has no registration flow and requires the configured administrator password followed by a time-based code from an authenticator app.

## 1. Provision services

1. Add a Neon Postgres integration to the existing Vercel project.
2. Create a Vercel Blob store.
3. Copy `.env.example` to `.env.local` for local Vercel development and set the same values in Vercel project settings.

## 2. Create the administrator secret

Run:

```powershell
npm run engine:hash-password
```

Store the printed value as `ADMIN_PASSWORD_SCRYPT` and set the login ID in `ADMIN_LOGIN_ID`. Never prefix these variables with `VITE_`.

Generate the authenticator secret and enrollment URI:

```powershell
npm run engine:setup-totp
```

Add the printed account to an authenticator app, then store only the secret as `ADMIN_TOTP_SECRET`. Keep the enrollment URI and secret out of source control.

## 3. Create and seed the database

```powershell
npm run db:migrate
npm run engine:seed
```

The seed is idempotent for post and product slugs. Run it once for a new database.

## 4. Local development

The ordinary `npm run dev` command serves the public Vite frontend but does not emulate Vercel Functions. Use Vercel's local runtime when testing authentication, persistence, or uploads:

```powershell
npx vercel dev
```

## Security notes

- `/engine` being absent from navigation is not a security boundary. Every Engine API operation validates the server-side session.
- TOTP follows RFC 6238, accepts only a narrow clock-skew window, and rejects reuse of a successfully verified time step.
- Uploaded files are limited to verified PNG, JPEG, and WebP data up to 4 MB, below Vercel Function request limits.
- Public contact details can be edited in Connected Accounts. The private OTP number remains a deployment secret.
