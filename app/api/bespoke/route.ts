import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Public lead-capture endpoint for made-to-measure / bespoke requests.
// Writes go through the service-role client server-side; the row is only
// readable by the admin (see bespoke-schema.sql RLS).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clamp(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, max)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const name = clamp(body.name, 150)
    const email = clamp(body.email, 255)
    const phone = clamp(body.phone, 50)
    const occasion = clamp(body.occasion, 100)
    const event_date = clamp(body.event_date, 20)
    const budget = clamp(body.budget, 50)
    const message = clamp(body.message, 2000)

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Nom et email requis' },
        { status: 400 }
      )
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email invalide' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin.from('bespoke_requests').insert({
      name,
      email,
      phone,
      occasion,
      // Only store a real date; ignore malformed values
      event_date: event_date && /^\d{4}-\d{2}-\d{2}$/.test(event_date) ? event_date : null,
      budget,
      message,
    })

    if (error) {
      console.error('Bespoke insert error:', error)
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'envoi de la demande" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Bespoke API error:', error)
    return NextResponse.json(
      { success: false, error: 'Requête invalide' },
      { status: 400 }
    )
  }
}
