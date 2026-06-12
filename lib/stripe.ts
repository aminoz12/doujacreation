import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY

if (!secretKey) {
  // Don't throw at import time — the storefront must still render without
  // payment configured. Checkout routes handle the null case explicitly.
  console.warn('STRIPE_SECRET_KEY is not set — checkout will be disabled.')
}

// Pin nothing here: the installed stripe SDK pins its own API version, which
// keeps request/response typings in sync with the library.
export const stripe = secretKey ? new Stripe(secretKey) : null

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
