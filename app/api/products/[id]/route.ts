import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET single product for frontend
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: product, error } = await supabase
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
      .eq('id', id)
      .eq('status', 'published')
      .single()

    if (error || !product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Transform product for frontend
    const transformedProduct = {
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
      promotionLabel_en: product.promotion_label_en,
      promotionLabel_fr: product.promotion_label_fr,
      stockQuantity: product.stock_quantity,
      isFeatured: product.is_featured,
      isNew: product.is_new,
      metaTitle_en: product.meta_title_en,
      metaTitle_fr: product.meta_title_fr,
      metaDescription_en: product.meta_description_en,
      metaDescription_fr: product.meta_description_fr,
      images: (product.product_images || [])
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((img: any) => ({
          url: img.image_url,
          alt_en: img.alt_text_en,
          alt_fr: img.alt_text_fr
        })),
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
        .map((pc: any) => ({
          slug: pc.collections?.slug,
          name_en: pc.collections?.name_en,
          name_fr: pc.collections?.name_fr
        }))
        .filter((c: any) => c.slug),
      tags: (product.product_tags || [])
        .map((pt: any) => ({
          slug: pt.tags?.slug,
          name_en: pt.tags?.name_en,
          name_fr: pt.tags?.name_fr
        }))
        .filter((t: any) => t.slug)
    }

    return NextResponse.json({ success: true, product: transformedProduct })
  } catch (error) {
    console.error('Product API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}


