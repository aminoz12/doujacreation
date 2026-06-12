import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe'

// Stripe webhook — the ONLY trusted source for marking an order paid.
// Configure in the Stripe dashboard with endpoint:
//   https://yourdomain.com/api/checkout/webhook
// and set STRIPE_WEBHOOK_SECRET to the signing secret.

// We must read the raw body to verify the Stripe signature, so disable any
// body parsing/caching.
export const dynamic = 'force-dynamic'

async function markOrder(
  match: { column: 'stripe_session_id' | 'order_number' | 'id' | 'stripe_payment_intent_id'; value: string },
  fields: Record<string, unknown>
) {
  const { error } = await supabaseAdmin
    .from('orders')
    .update(fields)
    .eq(match.column, match.value)
  if (error) {
    console.error('Failed to update order from webhook:', error)
    return false
  }
  return true
}

export async function POST(request: NextRequest) {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    console.error('Stripe webhook not configured (missing key or signing secret)')
    return NextResponse.json({ success: false, error: 'Not configured' }, { status: 500 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ success: false, error: 'Missing signature' }, { status: 400 })
  }

  // Raw body is required for signature verification.
  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        // Treat as paid only when Stripe reports the payment captured.
        if (session.payment_status === 'paid' || event.type === 'checkout.session.async_payment_succeeded') {
          const orderId = session.metadata?.order_id
          const paymentIntentId =
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id ?? null

          const fields = {
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id: paymentIntentId,
          }

          const ok = orderId
            ? await markOrder({ column: 'id', value: orderId }, fields)
            : await markOrder({ column: 'stripe_session_id', value: session.id }, fields)

          if (!ok) {
            return NextResponse.json({ success: false }, { status: 500 })
          }
        }
        break
      }

      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session.metadata?.order_id
        await (orderId
          ? markOrder({ column: 'id', value: orderId }, { payment_status: 'failed' })
          : markOrder({ column: 'stripe_session_id', value: session.id }, { payment_status: 'failed' }))
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const paymentIntentId =
          typeof charge.payment_intent === 'string'
            ? charge.payment_intent
            : charge.payment_intent?.id
        if (paymentIntentId) {
          await markOrder(
            { column: 'stripe_payment_intent_id', value: paymentIntentId },
            { payment_status: 'refunded' }
          )
        }
        break
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ success: false, error: 'Processing failed' }, { status: 500 })
  }
}
