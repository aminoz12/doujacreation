import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET all currency rates
export async function GET() {
  try {
    const { data: currencies, error } = await supabaseAdmin
      .from('currency_rates')
      .select('*')
      .order('currency_code', { ascending: true })

    if (error) throw error

    // Ensure EUR rate is always 1.0 (base currency)
    const fixedCurrencies = currencies?.map(c => ({
      ...c,
      rate_from_eur: c.currency_code === 'EUR' ? 1.0 : c.rate_from_eur
    }))

    return NextResponse.json({ success: true, currencies: fixedCurrencies })
  } catch (error) {
    console.error('Currency GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch currency rates' },
      { status: 500 }
    )
  }
}

// PUT update currency rates
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { currencies } = body

    for (const currency of currencies) {
      // Don't allow changing EUR rate - it's always 1.0
      if (currency.currency_code === 'EUR') continue
      
      const { error } = await supabaseAdmin
        .from('currency_rates')
        .update({ rate_from_eur: currency.rate_from_eur })
        .eq('id', currency.id)

      if (error) throw error
    }

    // Ensure EUR is always 1.0 in database
    await supabaseAdmin
      .from('currency_rates')
      .update({ rate_from_eur: 1.0 })
      .eq('currency_code', 'EUR')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Currency PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update currency rates' },
      { status: 500 }
    )
  }
}


