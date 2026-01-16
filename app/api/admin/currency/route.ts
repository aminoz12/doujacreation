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

    return NextResponse.json({ success: true, currencies })
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
      const { error } = await supabaseAdmin
        .from('currency_rates')
        .update({ rate_from_mad: currency.rate_from_mad })
        .eq('id', currency.id)

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Currency PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update currency rates' },
      { status: 500 }
    )
  }
}

