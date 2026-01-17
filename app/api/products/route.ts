import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET published products for the frontend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const collection = searchParams.get('collection')
    const featured = searchParams.get('featured')
    const isNew = searchParams.get('new')
    const limit = searchParams.get('limit')

    let query = supabase
      .from('products')
      .select(`
        *,
        product_images (*),
        product_sizes (*),
        product_colors (*),
        product_collections (
          collection_id,
          collections (*)
        ),
        product_tags (
          tag_id,
          tags (*)
        )
      `)
      .eq('status', 'published')
      .order('display_order', { ascending: true })

    // Filter by collection
    if (collection) {
      // First get the collection ID
      const { data: collectionData } = await supabase
        .from('collections')
        .select('id')
        .eq('slug', collection)
        .single()

      if (collectionData) {
        const { data: productIds } = await supabase
          .from('product_collections')
          .select('product_id')
          .eq('collection_id', collectionData.id)

        if (productIds && productIds.length > 0) {
          query = query.in('id', productIds.map(p => p.product_id))
        }
      }
    }

    // Filter by featured
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Filter by new
    if (isNew === 'true') {
      query = query.eq('is_new', true)
    }

    // Limit results
    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data: products, error } = await query

    if (error) throw error

    // Transform products for frontend
    const transformedProducts = (products || []).map(product => ({
      id: product.id,
      sku: product.sku,
      name: product.name_en,
      name_en: product.name_en,
      name_fr: product.name_fr,
      description: product.description_en,
      description_en: product.description_en,
      description_fr: product.description_fr,
      price: product.price_eur,
      originalPrice: product.original_price_eur,
      isPromotion: product.is_promotion,
      promotionLabel: product.promotion_label_en,
      stockQuantity: product.stock_quantity,
      isFeatured: product.is_featured,
      isNew: product.is_new,
      images: (product.product_images || [])
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((img: any) => img.image_url),
      sizes: (product.product_sizes || [])
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((s: any) => ({
          size: s.size,
          stock: s.stock_quantity,
          priceAdjustment: s.price_adjustment
        })),
      colors: (product.product_colors || [])
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((c: any) => ({
          name: c.name_en,
          name_en: c.name_en,
          name_fr: c.name_fr,
          hex: c.hex_code,
          stock: c.stock_quantity
        })),
      collections: (product.product_collections || [])
        .map((pc: any) => pc.collections?.slug)
        .filter(Boolean),
      tags: (product.product_tags || [])
        .map((pt: any) => pt.tags?.slug)
        .filter(Boolean)
    }))

    return NextResponse.json({ success: true, products: transformedProducts })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}


