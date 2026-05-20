# rewrito

AI-powered professional communication: humanize AI text, rewrite LinkedIn posts, and improve professional emails.

## What's Included

- AI Humanizer, LinkedIn Post Rewriter, and Professional Email Rewriter
- Anonymous trials with server-side usage enforcement
- Supabase Auth with Google OAuth and email magic links
- Resend welcome emails after first successful sign-in
- Dashboard with rewrite history
- AI quality scoring plus AI-generated confidence scoring
- SEO pages, sitemap, robots config, and production-ready metadata
- Tailwind CSS with a lightweight animated abstract interface

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Run `supabase/schema.sql` in your Supabase SQL editor before testing auth, usage, or history.

## Production Setup

1. Set `NEXT_PUBLIC_SITE_URL=https://rewrito.ai` in Vercel.
2. Add the rest of `.env.example` values in Vercel Project Settings.
3. In Supabase Auth URL Configuration, set:
   - Site URL: `https://rewrito.ai`
   - Redirect URL: `https://rewrito.ai/auth/callback`
   - Optional local redirect: `http://localhost:3000/auth/callback`
4. In Supabase Auth Providers, enable Google and add the Google OAuth client ID and secret.
5. In Google Cloud Console, add Supabase's Google callback URL as an authorized redirect URI. Supabase shows the exact URL in Auth Providers > Google.
6. To send magic links from `hello@rewrito.ai`, configure Supabase Auth SMTP with your mail provider and set the sender/from address to `hello@rewrito.ai`. Verify SPF, DKIM, and DMARC for `rewrito.ai`.
7. To send welcome emails from Resend, add `RESEND_API_KEY`, `RESEND_FROM`, and optionally `REWRITO_REVIEW_URL` in Vercel. The auth callback sends one welcome email and stores `welcome_email_sent_at` in `profiles`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## Structure

```text
src/app/api/rewrite/route.ts       server-side rewrite endpoint
src/app/auth/callback/route.ts     auth callback for Google and magic links
src/components/tools/ToolWorkspace.tsx
src/components/tools/ScoreCard.tsx
src/lib/ai/provider.ts
src/lib/prompts/index.ts
src/lib/email/welcome.ts
src/lib/supabase/server.ts
src/lib/supabase/client.ts
supabase/schema.sql
```

## Security

- Keep `.env.local` out of git.
- Rotate any keys that were ever committed or shared.
- The Supabase service role key must only be used server-side.
