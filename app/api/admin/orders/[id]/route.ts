import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET single order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single()

    if (error) throw error

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PUT update order (mainly for status change)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, admin_notes } = body

    const updateData: Record<string, unknown> = {}
    
    if (status) {
      updateData.status = status
      // Set delivered_at timestamp when status changes to delivered
      if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString()
      }
    }
    
    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select('*, order_items(*)')
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Order PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

// DELETE order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete order items first (cascade should handle this, but just in case)
    await supabaseAdmin
      .from('order_items')
      .delete()
      .eq('order_id', id)

    const { error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Order DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    )
  }
}


