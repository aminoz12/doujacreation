import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Free exchange rate API - no key required (EUR as base currency)
const EXCHANGE_API_URL = 'https://api.exchangerate-api.com/v4/latest/EUR'

interface ExchangeRateResponse {
  base: string
  date: string
  rates: {
    [key: string]: number
  }
}

export async function POST() {
  try {
    // Fetch latest rates from API
    const response = await fetch(EXCHANGE_API_URL, {
      next: { revalidate: 0 } // Don't cache
    })

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates')
    }

    const data: ExchangeRateResponse = await response.json()

    // Ensure EUR rate is always 1.0 (base currency)
    await supabaseAdmin
      .from('currency_rates')
      .update({ 
        rate_from_eur: 1.0,
        updated_at: new Date().toISOString()
      })
      .eq('currency_code', 'EUR')

    // Update rates in database (USD and MAD relative to EUR)
    const currencies = ['USD', 'MAD']
    
    for (const currency of currencies) {
      if (data.rates[currency]) {
        const { error } = await supabaseAdmin
          .from('currency_rates')
          .update({ 
            rate_from_eur: data.rates[currency],
            updated_at: new Date().toISOString()
          })
          .eq('currency_code', currency)

        if (error) {
          console.error(`Failed to update ${currency}:`, error)
        }
      }
    }

    // Fetch updated rates
    const { data: updatedRates, error: fetchError } = await supabaseAdmin
      .from('currency_rates')
      .select('*')
      .order('currency_code', { ascending: true })

    if (fetchError) throw fetchError

    // Ensure EUR rate is always 1.0 in response
    const fixedRates = updatedRates?.map(c => ({
      ...c,
      rate_from_eur: c.currency_code === 'EUR' ? 1.0 : c.rate_from_eur
    }))

    return NextResponse.json({ 
      success: true, 
      message: 'Rates updated successfully',
      currencies: fixedRates,
      source: 'exchangerate-api.com',
      date: data.date
    })
  } catch (error) {
    console.error('Currency sync error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sync exchange rates. Please try again later.' },
      { status: 500 }
    )
  }
}

