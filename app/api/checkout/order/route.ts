import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

// Public endpoint used by the success page. It also CONFIRMS the payment with
// Stripe (no webhook needed): if the order is still pending, we retrieve the
// Checkout Session; when it's paid we backfill the customer/delivery details
// that Stripe collected and mark the order paid.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('order')
    if (!orderId) {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 })
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, total_amount, currency, payment_status, stripe_session_id')
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    let paymentStatus = order.payment_status

    // Confirm with Stripe if still pending.
    if (paymentStatus === 'pending' && order.stripe_session_id && stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id)

        if (session.payment_status === 'paid') {
          const cd = session.customer_details
          // Stripe moved shipping to collected_information in newer API versions;
          // read whichever is present.
          const ship =
            (session as { shipping_details?: { name?: string | null; address?: Record<string, string | null> } })
              .shipping_details ||
            (session as { collected_information?: { shipping_details?: { name?: string | null; address?: Record<string, string | null> } } })
              .collected_information?.shipping_details
          const addr = ship?.address
          const fullName = ship?.name || cd?.name || ''
          const [firstName, ...rest] = fullName.trim().split(/\s+/)
          const lastName = rest.join(' ')
          const paymentIntentId =
            typeof session.payment_intent === 'string'
              ? session.payment_intent
              : session.payment_intent?.id ?? null

          const update: Record<string, unknown> = {
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id: paymentIntentId,
          }
          if (cd?.email) update.customer_email = cd.email
          if (cd?.phone) update.customer_phone = cd.phone
          if (firstName) update.customer_first_name = firstName
          if (lastName) update.customer_last_name = lastName
          if (addr?.line1) {
            update.shipping_address = [addr.line1, addr.line2].filter(Boolean).join(', ')
            if (addr.city) update.shipping_city = addr.city
            if (addr.postal_code) update.shipping_postal_code = addr.postal_code
            if (addr.country) update.shipping_country = addr.country
          }

          await supabaseAdmin.from('orders').update(update).eq('id', order.id)
          paymentStatus = 'paid'
        } else if (session.status === 'expired') {
          await supabaseAdmin.from('orders').update({ payment_status: 'failed' }).eq('id', order.id)
          paymentStatus = 'failed'
        }
      } catch (e) {
        console.error('Stripe session confirm error:', e)
      }
    }

    return NextResponse.json({
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
        currency: order.currency,
        payment_status: paymentStatus,
      },
    })
  } catch (e) {
    console.error('Order fetch error:', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
