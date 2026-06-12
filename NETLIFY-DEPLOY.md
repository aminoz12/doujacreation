# Deploying Zinachic to Netlify

This app is a **server-rendered Next.js 14 site** (API routes, middleware,
Stripe, Supabase, sharp image processing). The included [netlify.toml](netlify.toml)
sets it up with the official Next.js runtime — do **not** deploy it as a static
site.

---

## 1. Connect the repo
Netlify → **Add new site → Import an existing project** → pick this Git repo.
Netlify reads `netlify.toml` automatically:
- Build command: `npm run build`
- Publish dir: `.next`
- Plugin: `@netlify/plugin-nextjs` (installed automatically)
- Node 20

No manual build settings needed.

## 2. Environment variables
Set these in **Site settings → Environment variables** (Production + Deploy
previews). Values come from your new Supabase project and Stripe dashboard.

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (keep secret) |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys (`sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks (`whsec_…`, see step 5) |
| `NEXT_PUBLIC_SITE_URL` | Your final URL, e.g. `https://zinachic.fr` (no trailing slash) |

> `NEXT_PUBLIC_*` vars are baked in at build time — after changing them,
> trigger a redeploy.

## 3. Database
In your new Supabase project's SQL editor, run **[supabase-setup.sql](supabase-setup.sql)**
once. It creates all tables, RLS, functions, the `product-images` storage
bucket, and seed data (incl. the occasion tags).

## 4. First deploy
Trigger the deploy. Verify:
- Storefront loads at the Netlify URL
- `/admin/login` works (default `dija` / `dija123@` → **change it immediately**)
- A product image upload in the admin succeeds (confirms `sharp` works on the
  function runtime)

## 5. Stripe webhook
Once you know the site URL, in Stripe → **Developers → Webhooks → Add endpoint**:
- URL: `https://<your-domain>/api/checkout/webhook`
- Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
  `checkout.session.async_payment_failed`, `checkout.session.expired`,
  `charge.refunded`
- Copy the **Signing secret** → set `STRIPE_WEBHOOK_SECRET` in Netlify → redeploy.

Then run a real test payment and confirm the order flips to `paid` in the admin.

## 6. Custom domain
Netlify → **Domain management** → add your domain, point DNS, enable HTTPS.
Update `NEXT_PUBLIC_SITE_URL` to the custom domain and redeploy, and update the
Stripe webhook URL to match.

---

## Notes & gotchas
- **`vercel.json` is ignored by Netlify** — harmless to leave for dual-deploy.
- **`sharp`** ships the `@img/sharp-linux-x64` binary (verified in the lockfile);
  Netlify's Linux build installs it automatically. No extra config.
- **Middleware** runs as a Netlify Edge Function; the admin API 401 gate and
  login redirects work unchanged.
- **`/lookbook` redirects to `/produits`** (force redirect in `netlify.toml`) —
  remove that block if you want the lookbook page back.
- **Images:** `next.config.js` allows `*.supabase.co`, so your new Supabase
  project's image URLs work without changes.
- If a deploy fails on `next build`, check the deploy log — the same
  `npm run build` passes locally, so failures are almost always a missing env
  var or Node version mismatch.
