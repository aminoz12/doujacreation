import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// SumUp Webhook for payment status updates
// Configure this URL in your SumUp dashboard: https://yourdomain.com/api/checkout/webhook

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log webhook for debugging
    console.log('SumUp Webhook received:', JSON.stringify(body, null, 2))

    const { event_type, checkout_reference, transaction_id, status } = body

    if (!checkout_reference) {
      return NextResponse.json({ success: false, error: 'Missing checkout reference' }, { status: 400 })
    }

    // Find order by order_number (checkout_reference)
    const { data: order, error: findError } = await supabaseAdmin
      .from('orders')
      .select('id, payment_status')
      .eq('order_number', checkout_reference)
      .single()

    if (findError || !order) {
      console.error('Order not found for checkout_reference:', checkout_reference)
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // Update payment status based on webhook event
    let payment_status = order.payment_status
    let paid_at = null

    if (event_type === 'CHECKOUT_COMPLETED' || status === 'PAID') {
      payment_status = 'paid'
      paid_at = new Date().toISOString()
    } else if (event_type === 'CHECKOUT_FAILED' || status === 'FAILED') {
      payment_status = 'failed'
    } else if (event_type === 'CHECKOUT_REFUNDED' || status === 'REFUNDED') {
      payment_status = 'refunded'
    }

    // Update order
    const updateData: Record<string, unknown> = {
      payment_status,
      sumup_transaction_id: transaction_id || null
    }

    if (paid_at) {
      updateData.paid_at = paid_at
    }

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', order.id)

    if (updateError) {
      console.error('Failed to update order:', updateError)
      return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 })
    }

    console.log(`Order ${checkout_reference} payment status updated to: ${payment_status}`)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Allow GET for webhook verification (some services ping GET first)
export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'SumUp webhook endpoint' })
}

