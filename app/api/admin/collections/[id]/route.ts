import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET single collection
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { data: collection, error } = await supabaseAdmin
      .from('collections')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, collection })
  } catch (error) {
    console.error('Collection GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collection' },
      { status: 500 }
    )
  }
}

// PUT update collection
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { data: collection, error } = await supabaseAdmin
      .from('collections')
      .update({
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
      .eq('id', id)
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
    console.error('Collection PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update collection' },
      { status: 500 }
    )
  }
}

// PATCH partial update
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { data: collection, error } = await supabaseAdmin
      .from('collections')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, collection })
  } catch (error) {
    console.error('Collection PATCH error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update collection' },
      { status: 500 }
    )
  }
}

// DELETE collection
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { error } = await supabaseAdmin
      .from('collections')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Collection DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete collection' },
      { status: 500 }
    )
  }
}






