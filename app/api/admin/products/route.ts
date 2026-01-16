import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET all products with images
export async function GET() {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        product_images (*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error('Products GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Create product
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .insert({
        sku: body.sku || null,
        name_en: body.name_en,
        name_fr: body.name_fr,
        description_en: body.description_en || null,
        description_fr: body.description_fr || null,
        price_mad: body.price_mad,
        original_price_mad: body.original_price_mad || null,
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
      .select()
      .single()

    if (productError) throw productError

    const productId = product.id

    // Add images
    if (body.images && body.images.length > 0) {
      const { error: imagesError } = await supabaseAdmin
        .from('product_images')
        .insert(body.images.map((img: any) => ({
          product_id: productId,
          image_url: img.image_url,
          display_order: img.display_order,
          alt_text_en: img.alt_text_en || null,
          alt_text_fr: img.alt_text_fr || null
        })))
      if (imagesError) console.error('Images insert error:', imagesError)
    }

    // Add sizes
    if (body.sizes && body.sizes.length > 0) {
      const { error: sizesError } = await supabaseAdmin
        .from('product_sizes')
        .insert(body.sizes.map((s: any) => ({
          product_id: productId,
          size: s.size,
          stock_quantity: s.stock_quantity || 0,
          price_adjustment: s.price_adjustment || 0,
          display_order: s.display_order || 0
        })))
      if (sizesError) console.error('Sizes insert error:', sizesError)
    }

    // Add colors
    if (body.colors && body.colors.length > 0) {
      const { error: colorsError } = await supabaseAdmin
        .from('product_colors')
        .insert(body.colors.map((c: any) => ({
          product_id: productId,
          name_en: c.name_en,
          name_fr: c.name_fr,
          hex_code: c.hex_code,
          stock_quantity: c.stock_quantity || 0,
          display_order: c.display_order || 0
        })))
      if (colorsError) console.error('Colors insert error:', colorsError)
    }

    // Add collections
    if (body.collections && body.collections.length > 0) {
      const { error: collectionsError } = await supabaseAdmin
        .from('product_collections')
        .insert(body.collections.map((collectionId: string) => ({
          product_id: productId,
          collection_id: collectionId
        })))
      if (collectionsError) console.error('Collections insert error:', collectionsError)
    }

    // Add tags
    if (body.tags && body.tags.length > 0) {
      const { error: tagsError } = await supabaseAdmin
        .from('product_tags')
        .insert(body.tags.map((tagId: string) => ({
          product_id: productId,
          tag_id: tagId
        })))
      if (tagsError) console.error('Tags insert error:', tagsError)
    }

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Products POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

