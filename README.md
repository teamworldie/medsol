# Real Estate CRM Template

A reusable backend + admin dashboard for a real estate agency site, built with Next.js, Prisma (Postgres/Supabase), and NextAuth. Extracted from a client project — the public-facing marketing site is intentionally left as a blank placeholder (`src/app/page.tsx`) since that's the part that should be custom per project.

## What's included

- **Admin dashboard** (`/admin`) — dashboard, leads, properties, viewings, tasks, messages, blog, media, analytics, settings
- **Auth** — email/password login (NextAuth + bcrypt), forgot/reset password flow, rate limiting
- **Data model** (`prisma/schema.prisma`) — User, Lead, Property, Viewing, Task, Message, BlogPost, Media, Tag, PasswordResetToken
- **Server Actions** (`src/app/actions/`) — CRUD for everything above
- **Media storage** — Supabase Storage integration for uploads
- **Transactional email** — Resend, used for password reset emails
- **Error monitoring** — Sentry, pre-wired (optional — works without it configured)

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in the values (see comments in that file for where each one comes from — Supabase project settings, Resend, Sentry).
3. `npx prisma migrate deploy` (applies the schema to your database)
4. `npx prisma db seed` (creates a default admin user — **change the password immediately after first login**, it's set to `admin123` in `seed.ts`)
5. `npm run dev`
6. Log in at `/admin/login` with the seeded admin account

## Before using this for a new client

- **`src/lib/siteConfig.ts`** — set `SITE_NAME`, used in generated SEO titles and password-reset emails. One place, one edit.
- **`src/app/admin/(protected)/AdminShell.tsx`** and **`src/app/admin/login/page.tsx`** — currently say "Admin Portal"; swap in the client's name/logo if wanted.
- **`seed.ts`** — change the seeded admin email/name before running in production.
- **`src/app/page.tsx`** — replace this placeholder with the actual public marketing site for the new client.
- **`next.config.ts`** — add any external image hosts the new site's photos will come from under `images.remotePatterns`.
- Demo/fallback data scattered through the admin pages (visible only when the database has no real rows yet, e.g. in `leads/page.tsx`, `viewings/page.tsx`, `tasks/page.tsx`, `blog/page.tsx`) uses generic placeholder names — fine to leave as-is, or replace.

## Testing

`npm test` runs the Vitest unit tests (`src/lib/*.test.ts`) — slug generation, password policy, rate limiting, read-time calculation, file-type detection, property/blog data shaping.
