import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

// Stripe Checkout — card payments (and wallets) via Stripe-hosted Checkout.
// Docs: https://stripe.com/docs/payments/checkout

interface CartItem {
  product_id: string
  product_name_en?: string
  product_name_fr?: string
  product_sku?: string
  product_image_url?: string
  quantity: number
  // NOTE: any price sent by the client is IGNORED. Prices are resolved
  // server-side from the database to prevent price tampering.
  unit_price?: number
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

    // Customer & delivery details are collected on the Stripe Checkout page
    // (shipping_address_collection / phone_number_collection below, all
    // required) and backfilled onto the order after payment. They are optional
    // in this request — the cart sends only items.

    // ---------------------------------------------------------------------
    // SERVER-SIDE PRICING — never trust prices from the client.
    // Resolve each line's price from the products table (only published
    // products can be purchased). The cart's `unit_price` is discarded.
    // ---------------------------------------------------------------------
    const productIds = Array.from(new Set(items.map((i) => i.product_id)))

    const { data: dbProducts, error: productsError } = await supabaseAdmin
      .from('products')
      .select('id, name_en, name_fr, price_eur, status, stock_quantity')
      .in('id', productIds)

    if (productsError) {
      console.error('Product lookup error:', productsError)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la validation du panier' },
        { status: 500 }
      )
    }

    const productMap = new Map((dbProducts || []).map((p) => [p.id, p]))

    const pricedItems = items.map((item) => {
      const product = productMap.get(item.product_id)
      const quantity = Math.floor(Number(item.quantity))

      if (!product || product.status !== 'published') {
        throw new Error(`Article indisponible: ${item.product_name_en ?? item.product_id}`)
      }
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error('Quantité invalide')
      }

      const unit_price = Number(product.price_eur)
      if (!Number.isFinite(unit_price) || unit_price <= 0) {
        throw new Error(`Prix invalide pour ${product.name_en}`)
      }

      return {
        product_id: product.id,
        product_name_en: product.name_en,
        product_name_fr: product.name_fr || product.name_en,
        product_sku: item.product_sku || null,
        product_image_url: item.product_image_url || null,
        quantity,
        unit_price,
        total_price: Math.round(unit_price * quantity * 100) / 100,
        size: item.size || null,
        color: item.color || null,
      }
    })

    const subtotal =
      Math.round(pricedItems.reduce((sum, i) => sum + i.total_price, 0) * 100) / 100
    const shipping_cost = 0 // Free shipping for now
    const total_amount = Math.round((subtotal + shipping_cost) * 100) / 100

    if (total_amount <= 0 || !Number.isFinite(total_amount)) {
      return NextResponse.json(
        { success: false, error: 'Montant invalide' },
        { status: 400 }
      )
    }

    // Create order in database first (server-computed totals only)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_first_name: customer?.first_name || '',
        customer_last_name: customer?.last_name || '',
        customer_email: customer?.email || '',
        customer_phone: customer?.phone || null,
        shipping_address: shipping?.address || '',
        shipping_city: shipping?.city || '',
        shipping_postal_code: shipping?.postal_code || null,
        shipping_country: shipping?.country || '',
        subtotal,
        shipping_cost,
        total_amount,
        currency: 'EUR',
        payment_method: 'stripe',
        payment_status: 'pending',
        status: 'new',
        customer_notes: customer_notes || null,
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
      if (order?.id) await supabaseAdmin.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { success: false, error: 'Commande invalide (order_number manquant)' },
        { status: 500 }
      )
    }

    // Add order items (with server-resolved prices)
    const orderItems = pricedItems.map((item) => ({
      order_id: order.id,
      ...item,
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items error:', itemsError)
      await supabaseAdmin.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'ajout des articles" },
        { status: 500 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Payment is required: if Stripe isn't configured (missing/invalid key),
    // roll back the order and fail clearly rather than creating a phantom
    // "pending" order with no way to pay.
    if (!stripe) {
      console.error('Checkout failed: STRIPE_SECRET_KEY is missing or invalid — see lib/stripe.ts warning above')
      await supabaseAdmin.from('order_items').delete().eq('order_id', order.id)
      await supabaseAdmin.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        {
          success: false,
          error: 'Le paiement est momentanément indisponible.',
          details: 'STRIPE_SECRET_KEY manquante ou invalide sur le serveur.',
        },
        { status: 503 }
      )
    }

    // When the cart didn't already provide an address (the "PAYER" flow),
    // make Stripe Checkout collect the delivery address, name and phone — all
    // required — and we backfill them onto the order after payment.
    const collectAtStripe = !shipping?.address
    const allowedCountries = [
      'FR', 'MA', 'BE', 'LU', 'CH', 'ES', 'DE', 'NL', 'IT', 'PT', 'GB', 'US', 'CA',
    ] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection['allowed_countries']

    // Create Stripe Checkout Session
    let session
    try {
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        ...(customer?.email ? { customer_email: customer.email } : {}),
        client_reference_id: String(order.order_number),
        line_items: pricedItems.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(item.unit_price * 100),
            product_data: {
              name: item.product_name_en,
              ...(item.product_image_url && /^https?:\/\//.test(item.product_image_url)
                ? { images: [item.product_image_url] }
                : {}),
            },
          },
        })),
        ...(collectAtStripe
          ? {
              shipping_address_collection: { allowed_countries: allowedCountries },
              phone_number_collection: { enabled: true },
              billing_address_collection: 'required' as const,
            }
          : {}),
        metadata: {
          order_id: order.id,
          order_number: String(order.order_number),
        },
        payment_intent_data: {
          metadata: {
            order_id: order.id,
            order_number: String(order.order_number),
          },
        },
        success_url: `${siteUrl}/checkout/success?order=${order.id}`,
        cancel_url: `${siteUrl}/cart`,
      })
    } catch (stripeErr) {
      console.error('Stripe checkout error:', stripeErr)
      // Roll back the pending order so we don't leave orphans on failure.
      await supabaseAdmin.from('order_items').delete().eq('order_id', order.id)
      await supabaseAdmin.from('orders').delete().eq('id', order.id)
      const details = stripeErr instanceof Error ? stripeErr.message : undefined
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la création du paiement', details },
        { status: 500 }
      )
    }

    await supabaseAdmin
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
      },
      checkout_url: session.url,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    const message = error instanceof Error ? error.message : 'Erreur lors du checkout'
    return NextResponse.json({ success: false, error: message }, { status: 400 })
  }
}
