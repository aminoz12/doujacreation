import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// SumUp Hosted Checkout API – card, Apple Pay, Google Pay
// Docs: https://developer.sumup.com/online-payments/checkouts/hosted-checkout

interface CartItem {
  product_id: string
  product_name_en: string
  product_name_fr: string
  product_sku?: string
  product_image_url?: string
  quantity: number
  unit_price: number
  size?: string
  color?: string
}

interface CheckoutRequest {
  items: CartItem[]
  customer: {
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  shipping: {
    address: string
    city: string
    postal_code?: string
    country: string
  }
  customer_notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json()
    const { items, customer, shipping, customer_notes } = body

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Le panier est vide' },
        { status: 400 }
      )
    }

    if (!customer.email || !customer.first_name || !customer.last_name) {
      return NextResponse.json(
        { success: false, error: 'Informations client manquantes' },
        { status: 400 }
      )
    }

    if (!shipping.address || !shipping.city || !shipping.country) {
      return NextResponse.json(
        { success: false, error: 'Adresse de livraison manquante' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
    const shipping_cost = 0 // Free shipping or calculate based on location
    const total_amount = subtotal + shipping_cost

    // Create order in database first
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        customer_email: customer.email,
        customer_phone: customer.phone || null,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_postal_code: shipping.postal_code || null,
        shipping_country: shipping.country,
        subtotal,
        shipping_cost,
        total_amount,
        currency: 'EUR',
        payment_method: 'sumup',
        payment_status: 'pending',
        status: 'new',
        customer_notes: customer_notes || null
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la création de la commande' },
        { status: 500 }
      )
    }

    if (!order?.order_number) {
      console.error('Order missing order_number:', order)
      await supabaseAdmin.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { success: false, error: 'Commande invalide (order_number manquant)' },
        { status: 500 }
      )
    }

    // Add order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name_en: item.product_name_en,
      product_name_fr: item.product_name_fr || item.product_name_en,
      product_sku: item.product_sku || null,
      product_image_url: item.product_image_url || null,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
      size: item.size || null,
      color: item.color || null
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items error:', itemsError)
      // Delete the order if items failed
      await supabaseAdmin.from('orders').delete().eq('id', order.id)
      throw new Error('Erreur lors de l\'ajout des articles')
    }

    // Create SumUp checkout
    const sumupApiKey = process.env.SUMUP_API_KEY
    const sumupMerchantCode = process.env.SUMUP_MERCHANT_CODE

    if (!sumupApiKey || !sumupMerchantCode) {
      console.error('SumUp credentials not configured')
      // Return order without payment link for testing
      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          order_number: order.order_number,
          total_amount: order.total_amount
        },
        message: 'Commande créée (paiement non configuré)'
      })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const successUrl = `${siteUrl}/checkout/success?order=${order.id}`

    const amount = Math.round(Number(total_amount) * 100) / 100
    if (amount <= 0 || !Number.isFinite(amount)) {
      return NextResponse.json(
        { success: false, error: 'Montant invalide' },
        { status: 400 }
      )
    }

    // Create SumUp Hosted Checkout (card, Apple Pay, Google Pay)
    const checkoutPayload = {
      amount,
      checkout_reference: String(order.order_number),
      currency: 'EUR',
      description: `Commande Zinachic #${order.order_number}`.slice(0, 255),
      merchant_code: String(sumupMerchantCode).trim(),
      redirect_url: successUrl,
      hosted_checkout: { enabled: true }
    }
    const checkoutResponse = await fetch('https://api.sumup.com/v0.1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sumupApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutPayload)
    })

    if (!checkoutResponse.ok) {
      const errorData = (await checkoutResponse.json().catch(() => ({}))) as Record<string, unknown>
      const sumupMessage =
        typeof errorData?.error_message === 'string' ? errorData.error_message
        : typeof errorData?.message === 'string' ? errorData.message
        : typeof errorData?.error === 'string' ? errorData.error
        : typeof errorData?.param === 'string' ? `Paramètre invalide: ${errorData.param}` : null
      const fallback =
        checkoutResponse.status === 401 ? 'Clé API ou code marchand invalide. Vérifiez SUMUP_API_KEY et SUMUP_MERCHANT_CODE.'
        : checkoutResponse.status === 403 ? 'Paiements en ligne non autorisés pour ce compte SumUp.'
        : checkoutResponse.status === 400 ? 'Paramètres SumUp invalides (montant, devise, merchant_code).'
        : `SumUp a répondu: ${checkoutResponse.status}`
      console.error('SumUp checkout error:', checkoutResponse.status, JSON.stringify(errorData))
      return NextResponse.json(
        {
          success: false,
          error: 'Erreur lors de la création du paiement',
          details: sumupMessage || fallback
        },
        { status: 500 }
      )
    }

    const checkoutData = await checkoutResponse.json()

    // Prefer Hosted Checkout URL (card, Apple Pay, Google Pay); fallback to legacy pay link
    const checkoutUrl =
      checkoutData.hosted_checkout_url ||
      `https://pay.sumup.com/b2c/Q${checkoutData.id}`

    await supabaseAdmin
      .from('orders')
      .update({ sumup_checkout_id: checkoutData.id })
      .eq('id', order.id)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount
      },
      checkout_url: checkoutUrl
    })

  } catch (error) {
    console.error('Checkout error:', error)
    const message = error instanceof Error ? error.message : 'Erreur lors du checkout'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}



