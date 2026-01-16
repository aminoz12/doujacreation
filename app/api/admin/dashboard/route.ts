import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Fetch all stats in parallel
    const [
      productsResult,
      collectionsResult,
      lowStockResult
    ] = await Promise.all([
      // Products stats
      supabaseAdmin.from('products').select('id, status, is_featured, is_new, is_promotion, promotion_start_date, promotion_end_date, stock_quantity, low_stock_threshold'),
      // Collections stats
      supabaseAdmin.from('collections').select('id, is_active'),
      // Low stock products
      supabaseAdmin
        .from('products')
        .select('id, name_en, stock_quantity, low_stock_threshold')
        .or('stock_quantity.lte.low_stock_threshold')
        .eq('status', 'published')
        .order('stock_quantity', { ascending: true })
        .limit(10)
    ])

    const products = productsResult.data || []
    const collections = collectionsResult.data || []
    const today = new Date().toISOString().split('T')[0]

    // Calculate stats
    const stats = {
      totalProducts: products.length,
      publishedProducts: products.filter(p => p.status === 'published').length,
      draftProducts: products.filter(p => p.status === 'draft').length,
      totalCollections: collections.length,
      activeCollections: collections.filter(c => c.is_active).length,
      lowStockProducts: products.filter(p => 
        p.status === 'published' && 
        p.stock_quantity <= p.low_stock_threshold
      ).length,
      activePromotions: products.filter(p => {
        if (!p.is_promotion) return false
        if (p.promotion_start_date && p.promotion_start_date > today) return false
        if (p.promotion_end_date && p.promotion_end_date < today) return false
        return true
      }).length,
      featuredProducts: products.filter(p => p.is_featured && p.status === 'published').length,
      newProducts: products.filter(p => p.is_new && p.status === 'published').length
    }

    // Filter low stock products properly
    const lowStockProducts = (lowStockResult.data || []).filter(p => 
      p.stock_quantity <= p.low_stock_threshold
    )

    return NextResponse.json({
      success: true,
      stats,
      lowStockProducts
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}

