import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET all collections
export async function GET() {
  try {
    const { data: collections, error } = await supabaseAdmin
      .from('collections')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, collections })
  } catch (error) {
    console.error('Collections GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
      { status: 500 }
    )
  }
}

// POST create new collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data: collection, error } = await supabaseAdmin
      .from('collections')
      .insert({
        slug: body.slug,
        name_en: body.name_en,
        name_fr: body.name_fr,
        description_en: body.description_en || null,
        description_fr: body.description_fr || null,
        image_url: body.image_url || null,
        meta_title_en: body.meta_title_en || null,
        meta_title_fr: body.meta_title_fr || null,
        meta_description_en: body.meta_description_en || null,
        meta_description_fr: body.meta_description_fr || null,
        display_order: body.display_order || 0,
        is_active: body.is_active ?? true
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, error: 'A collection with this slug already exists' },
          { status: 400 }
        )
      }
      throw error
    }

    return NextResponse.json({ success: true, collection })
  } catch (error) {
    console.error('Collections POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create collection' },
      { status: 500 }
    )
  }
}







