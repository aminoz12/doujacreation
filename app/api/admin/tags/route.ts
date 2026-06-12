import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/api-auth'

export const dynamic = 'force-dynamic'

// GET all tags
export async function GET() {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const { data: tags, error } = await supabaseAdmin
      .from('tags')
      .select('*')
      .order('name_en', { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, tags })
  } catch (error) {
    console.error('Tags GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tags' },
      { status: 500 }
    )
  }
}

// POST create new tag
export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (auth instanceof NextResponse) return auth
  try {
    const body = await request.json()

    const { data: tag, error } = await supabaseAdmin
      .from('tags')
      .insert({
        slug: body.slug,
        name_en: body.name_en,
        name_fr: body.name_fr
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'A tag with this slug already exists' },
          { status: 400 }
        )
      }
      throw error
    }

    return NextResponse.json({ success: true, tag })
  } catch (error) {
    console.error('Tags POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create tag' },
      { status: 500 }
    )
  }
}







