import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY?.trim()

// A valid Stripe secret key is a single line like sk_test_xxx / sk_live_xxx,
// ASCII only. Guard against malformed values (wrong characters, line breaks,
// copy-paste corruption) so we fail with a clear message instead of a cryptic
// "connection to Stripe" / ERR_INVALID_CHAR error when the request is sent.
const keyValid = !!secretKey && /^sk_(test|live)_[A-Za-z0-9]+$/.test(secretKey)

if (!secretKey) {
  // Don't throw at import time — the storefront must still render without
  // payment configured. Checkout routes handle the null case explicitly.
  console.warn('STRIPE_SECRET_KEY is not set — checkout will be disabled.')
} else if (!keyValid) {
  console.error(
    'STRIPE_SECRET_KEY is malformed — it must be a single-line sk_test_/sk_live_ key with ASCII characters only (no spaces, line breaks, or special characters). Checkout is disabled until this is fixed.'
  )
}

// Pin nothing here: the installed stripe SDK pins its own API version, which
// keeps request/response typings in sync with the library.
export const stripe = keyValid ? new Stripe(secretKey as string) : null

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
