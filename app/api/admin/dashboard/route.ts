import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Fetch all stats in parallel
    const [
      productsResult,
      collectionsResult,
      ordersResult,
      recentOrdersResult
    ] = await Promise.all([
      // Products stats
      supabaseAdmin.from('products').select('id, name_fr, name_en, sku, status, is_featured, is_new, is_promotion, promotion_start_date, promotion_end_date, stock_quantity, low_stock_threshold'),
      // Collections stats
      supabaseAdmin.from('collections').select('id, is_active'),
      // Orders stats
      supabaseAdmin.from('orders').select('id, status'),
      // Recent orders
      supabaseAdmin
        .from('orders')
        .select('id, order_number, customer_first_name, customer_last_name, total_amount, currency, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    const products = productsResult.data || []
    const collections = collectionsResult.data || []
    const orders = ordersResult.data || []
    const recentOrders = recentOrdersResult.data || []
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

    // Order stats
    const orderStats = {
      newOrders: orders.filter(o => o.status === 'new').length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      deliveredOrders: orders.filter(o => o.status === 'delivered').length
    }

    // Get low stock products details
    const lowStockProducts = products
      .filter(p => p.status === 'published' && p.stock_quantity <= p.low_stock_threshold)
      .map(p => ({
        id: p.id,
        name_fr: p.name_fr,
        name_en: p.name_en,
        sku: p.sku,
        stock_quantity: p.stock_quantity,
        low_stock_threshold: p.low_stock_threshold
      }))

    return NextResponse.json({
      success: true,
      stats,
      orderStats,
      recentOrders,
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





