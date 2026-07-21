# Bulk Inquiry Website

Landing page with an About Us section and a bulk inquiry form (image
uploads, description, email), plus a password-protected admin dashboard
to review submissions.

**Stack:** Next.js (App Router, TypeScript) · Tailwind CSS · Supabase
(Postgres + Storage + Auth)

## 1. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL editor and run [`supabase/schema.sql`](supabase/schema.sql) —
   it creates the `inquiries` table and the public `inquiry-images`
   storage bucket.
3. Grab your Project URL, **publishable** key, and **secret** key from
   **Project Settings -> API Keys** (the new key system — not the legacy
   `anon`/`service_role` JWT keys).
4. Create your admin account under **Authentication -> Users -> Add user**
   (email + password, mark "Auto Confirm User"). This is the account
   you'll log in to `/admin` with — there's no public sign-up page.

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and
`SUPABASE_SECRET_KEY` from Supabase.

The `SUPABASE_SECRET_KEY` is server-only and bypasses Row Level
Security — never expose it to the client or commit it.

## 3. Run locally

```bash
npm install
npm run dev
```

- Landing page + inquiry form: [http://localhost:3000](http://localhost:3000)
- Admin dashboard: [http://localhost:3000/admin](http://localhost:3000/admin)
  (redirects to `/admin/login`)

## 4. Deploy to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. Add the same environment variables from `.env.local` in the Vercel
   project settings.
3. Deploy.

## Moving to a different host later

- **Supabase** (Postgres + Storage + Auth) is accessed only through
  `@supabase/supabase-js` / `@supabase/ssr` with a URL/key pair — works
  from any host, or self-hosted Supabase.
- The Next.js app itself runs anywhere Node.js runs (`npm run build && npm run start`),
  or via Docker.
