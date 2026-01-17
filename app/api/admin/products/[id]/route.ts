import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET single product with all relations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        product_images (*),
        product_sizes (*),
        product_colors (*),
        product_collections (collection_id),
        product_tags (tag_id)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Product GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Update product
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .update({
        sku: body.sku || null,
        name_en: body.name_en,
        name_fr: body.name_fr,
        description_en: body.description_en || null,
        description_fr: body.description_fr || null,
        price_eur: body.price_eur,
        original_price_eur: body.original_price_eur || null,
        is_promotion: body.is_promotion || false,
        promotion_start_date: body.promotion_start_date || null,
        promotion_end_date: body.promotion_end_date || null,
        promotion_label_en: body.promotion_label_en || null,
        promotion_label_fr: body.promotion_label_fr || null,
        stock_quantity: body.stock_quantity || 0,
        low_stock_threshold: body.low_stock_threshold || 5,
        is_featured: body.is_featured || false,
        is_new: body.is_new || false,
        status: body.status || 'draft',
        meta_title_en: body.meta_title_en || null,
        meta_title_fr: body.meta_title_fr || null,
        meta_description_en: body.meta_description_en || null,
        meta_description_fr: body.meta_description_fr || null,
        display_order: body.display_order || 0
      })
      .eq('id', id)
      .select()
      .single()

    if (productError) throw productError

    // Update images - delete old and insert new
    await supabaseAdmin.from('product_images').delete().eq('product_id', id)
    if (body.images && body.images.length > 0) {
      const { error: imagesError } = await supabaseAdmin
        .from('product_images')
        .insert(body.images.map((img: any) => ({
          product_id: id,
          image_url: img.image_url,
          display_order: img.display_order,
          alt_text_en: img.alt_text_en || null,
          alt_text_fr: img.alt_text_fr || null
        })))
      if (imagesError) console.error('Images update error:', imagesError)
    }

    // Update sizes
    await supabaseAdmin.from('product_sizes').delete().eq('product_id', id)
    if (body.sizes && body.sizes.length > 0) {
      const { error: sizesError } = await supabaseAdmin
        .from('product_sizes')
        .insert(body.sizes.map((s: any) => ({
          product_id: id,
          size: s.size,
          stock_quantity: s.stock_quantity || 0,
          price_adjustment: s.price_adjustment || 0,
          display_order: s.display_order || 0
        })))
      if (sizesError) console.error('Sizes update error:', sizesError)
    }

    // Update colors
    await supabaseAdmin.from('product_colors').delete().eq('product_id', id)
    if (body.colors && body.colors.length > 0) {
      const { error: colorsError } = await supabaseAdmin
        .from('product_colors')
        .insert(body.colors.map((c: any) => ({
          product_id: id,
          name_en: c.name_en,
          name_fr: c.name_fr,
          hex_code: c.hex_code,
          stock_quantity: c.stock_quantity || 0,
          display_order: c.display_order || 0
        })))
      if (colorsError) console.error('Colors update error:', colorsError)
    }

    // Update collections
    await supabaseAdmin.from('product_collections').delete().eq('product_id', id)
    if (body.collections && body.collections.length > 0) {
      const { error: collectionsError } = await supabaseAdmin
        .from('product_collections')
        .insert(body.collections.map((collectionId: string) => ({
          product_id: id,
          collection_id: collectionId
        })))
      if (collectionsError) console.error('Collections update error:', collectionsError)
    }

    // Update tags
    await supabaseAdmin.from('product_tags').delete().eq('product_id', id)
    if (body.tags && body.tags.length > 0) {
      const { error: tagsError } = await supabaseAdmin
        .from('product_tags')
        .insert(body.tags.map((tagId: string) => ({
          product_id: id,
          tag_id: tagId
        })))
      if (tagsError) console.error('Tags update error:', tagsError)
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Product PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Delete product (cascade will handle related records)
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}


