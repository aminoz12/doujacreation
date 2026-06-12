# Zinachic — Security Audit

_Date: 2026-06-12 · Scope: full repository, focus on auth, payments, data access._

Severity legend: 🔴 Critical · 🟠 High · 🟡 Medium · 🔵 Low / hardening

---

## 1. Fixed in this change

### 🔴 F1 — Admin API had no authorization (was wide open)
`/api/admin/*` route handlers used the service-role Supabase client directly and
never checked a session. The route matcher in `middleware.ts` only covered
`/admin/*` (pages), **not** `/api/admin/*`, and even there it only checked that a
cookie was *present*, not valid. Anyone could `POST/PUT/DELETE /api/admin/products`,
read `/api/admin/orders` (customer PII — a GDPR breach), upload/delete files, etc.

**Fix:** added `requireAdmin()` ([lib/api-auth.ts](lib/api-auth.ts)) and called it at
the top of every protected admin handler. The route handler is now the real
authorization boundary. `middleware.ts` was also extended to cover
`/api/admin/:path*` and return `401` early for cookieless requests (defense in
depth, not the primary gate).

### 🔴 F2 — Checkout trusted client-supplied prices
`POST /api/checkout` computed the charge from `item.unit_price` in the request
body, so a tampered payload could buy anything for €0.01.

**Fix:** prices are now resolved server-side from the `products` table; the
client `unit_price` is ignored. Only `status = 'published'` products are
purchasable, quantities are validated as positive integers, and the order
total and Stripe line items are built from DB prices only.
See [app/api/checkout/route.ts](app/api/checkout/route.ts).

### 🔴 F3 — Payment webhook was forgeable
The old SumUp webhook marked an order `paid` purely from an unauthenticated POST
body. Anyone who guessed an order number (sequential `ZC-YYYYMMDD-XXXX`) could
mark it paid and receive goods for free.

**Fix:** migrated to Stripe. The webhook now verifies the `stripe-signature`
header against `STRIPE_WEBHOOK_SECRET` using `stripe.webhooks.constructEvent`
over the **raw** request body, and only marks paid on
`checkout.session.completed` (with `payment_status === 'paid'`) or
`checkout.session.async_payment_succeeded`.
See [app/api/checkout/webhook/route.ts](app/api/checkout/webhook/route.ts).

### 🔵 F4 — Silent service-role fallback
`supabaseAdmin` silently fell back to the anon client when
`SUPABASE_SERVICE_ROLE_KEY` was missing, causing confusing RLS failures. Now it
warns loudly and disables session persistence on both clients.
See [lib/supabase.ts](lib/supabase.ts).

### 🔵 F5 — Orphaned pending orders on payment-init failure
Checkout now rolls back the order + items if the Stripe session can't be
created.

---

## 2. Open findings (recommended next)

### 🟠 O1 — No rate limiting / lockout on admin login
`POST /api/admin/login` allows unlimited password attempts. With a single known
username this enables brute force. **Recommend:** per-IP + per-username rate
limiting (e.g. Upstash Ratelimit) and exponential backoff.

### 🟠 O2 — `order_number` collisions at scale
`generate_order_number()` uses `FLOOR(RANDOM()*10000)` with a `UNIQUE`
constraint, so inserts will intermittently fail by birthday-collision as volume
grows (≈1% chance per order at ~14 orders/day). **Recommend:** a daily sequence
or `gen_random_uuid()`-derived suffix.

### 🟡 O3 — Stock is never decremented
Orders don't reduce `stock_quantity`, so the store can oversell. **Recommend:**
decrement stock inside the `paid` webhook handler, ideally via a Postgres
function/transaction that also guards against negative stock.

### 🟡 O4 — PostgREST filter injection in orders search
[app/api/admin/orders/route.ts](app/api/admin/orders/route.ts) interpolates the
raw `search` query param into a `.or('...ilike.%${search}%...')` filter string.
Now behind admin auth (lower risk), but a crafted value containing `,`/`)` can
still alter the filter. **Recommend:** sanitize/escape or use parameterized
`.ilike()` calls.

### 🟡 O5 — Cart cleared before payment confirmation
[app/checkout/page.tsx](app/checkout/page.tsx) calls `clearCart()` *before*
redirecting to the payment page, so a customer who cancels at Stripe returns to
an empty cart. **Recommend:** clear the cart only on the success page after a
confirmed `paid` status.

### 🟡 O6 — Webhook logs / PII
The previous webhook logged the full payload. The new one doesn't, but review
all `console.log` of order data to avoid writing customer PII to logs.

### 🔵 O7 — Public order endpoint
`GET /api/checkout/order?order=<uuid>` returns order details to anyone with the
UUID. UUIDs are unguessable so risk is low, but consider scoping to a signed
token if order data becomes more sensitive.

### 🔵 O8 — Session hygiene
Expired `admin_sessions` rows are deleted lazily on access but never swept.
Consider a scheduled cleanup. Admin cookie is `httpOnly` + `secure` in prod
(good); consider `sameSite: 'strict'` for the admin cookie.

### 🔵 O9 — Default admin credentials in docs
Docs reference `dija / dija123@`. Ensure production credentials were rotated and
that this default no longer exists in the live `admins` table.

### 🔵 O10 — Secrets hygiene
`.env.local` is correctly git-ignored. The now-unused **SumUp API key** and
merchant code should be revoked in the SumUp dashboard. Confirm the Supabase
service-role key has never been committed or shared; rotate if in doubt.

### 🔵 O11 — No CSP / no tests / no CI
No Content-Security-Policy header (only `X-Frame-Options`/nosniff via
`vercel.json`); no automated tests; no CI pipeline. **Recommend:** add a CSP,
tests for the three fixes above, and a GitHub Action running
`tsc --noEmit && next lint && next build`.

---

## 3. Verified OK
- Admin passwords use bcrypt (cost 10); session tokens are 256-bit CSPRNG.
- `orders` / `order_items` RLS exposes only a service-role policy, so the anon
  storefront key cannot read customer orders.
- Admin cookie is `httpOnly` and `secure` in production.
- Public products/collections APIs correctly use the anon client.

---

## 4. Required deployment steps for the Stripe switch
1. `npm install` (adds the `stripe` package — already in `package.json`).
2. Run [stripe-migration.sql](stripe-migration.sql) in the Supabase SQL editor.
3. Set env vars (see [.env.example](.env.example)): `STRIPE_SECRET_KEY`,
   `STRIPE_WEBHOOK_SECRET`, and confirm `NEXT_PUBLIC_SITE_URL`.
4. Create a Stripe webhook endpoint → `https://<domain>/api/checkout/webhook`,
   subscribing to: `checkout.session.completed`,
   `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed`, `checkout.session.expired`,
   `charge.refunded`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET`.
5. Remove the old `SUMUP_API_KEY` / `SUMUP_MERCHANT_CODE` env vars and revoke
   the SumUp key.
