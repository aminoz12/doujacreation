import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET single tag
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { data: tag, error } = await supabaseAdmin
      .from('tags')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, tag })
  } catch (error) {
    console.error('Tag GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tag' },
      { status: 500 }
    )
  }
}

// PUT update tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { data: tag, error } = await supabaseAdmin
      .from('tags')
      .update({
        slug: body.slug,
        name_en: body.name_en,
        name_fr: body.name_fr
      })
      .eq('id', id)
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
    console.error('Tag PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update tag' },
      { status: 500 }
    )
  }
}

// DELETE tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { error } = await supabaseAdmin
      .from('tags')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Tag DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete tag' },
      { status: 500 }
    )
  }
}






