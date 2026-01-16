'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  Percent,
  Star,
  Filter,
  X
} from 'lucide-react'
import type { Product, ProductImage } from '@/lib/supabase'

interface ProductWithImages extends Product {
  product_images: ProductImage[]
}

const statusColors = {
  draft: 'bg-slate-500/20 text-slate-400',
  published: 'bg-green-500/20 text-green-400',
  archived: 'bg-orange-500/20 text-orange-400',
  out_of_season: 'bg-blue-500/20 text-blue-400'
}

const statusLabels = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
  out_of_season: 'Out of Season'
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const filterParam = searchParams.get('filter')
  
  const [products, setProducts] = useState<ProductWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    // Handle URL filter params
    if (filterParam === 'low-stock') {
      setStatusFilter('low-stock')
    } else if (filterParam === 'promotions') {
      setStatusFilter('promotion')
    }
  }, [filterParam])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const filteredProducts = products.filter(p => {
    // Search filter
    const matchesSearch = 
      p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    
    if (!matchesSearch) return false

    // Status filter
    if (statusFilter === 'all') return true
    if (statusFilter === 'low-stock') return p.stock_quantity <= p.low_stock_threshold
    if (statusFilter === 'promotion') return p.is_promotion
    if (statusFilter === 'featured') return p.is_featured
    if (statusFilter === 'new') return p.is_new
    return p.status === statusFilter
  })

  const getMainImage = (product: ProductWithImages) => {
    const images = product.product_images || []
    const sorted = [...images].sort((a, b) => a.display_order - b.display_order)
    return sorted[0]?.image_url
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-400 mt-1">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-medium rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center px-4 py-2.5 rounded-lg border transition-colors ${
            showFilters || statusFilter !== 'all'
              ? 'bg-amber-500/10 border-amber-500/50 text-amber-500'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
          }`}
        >
          <Filter size={18} className="mr-2" />
          Filters
          {statusFilter !== 'all' && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500 text-slate-900 rounded">1</span>
          )}
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-slate-800 rounded-xl border border-slate-700 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-300">Filter by</span>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="text-xs text-amber-500 hover:text-amber-400"
              >
                Clear filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All' },
              { value: 'published', label: 'Published' },
              { value: 'draft', label: 'Draft' },
              { value: 'archived', label: 'Archived' },
              { value: 'low-stock', label: 'Low Stock', icon: <AlertTriangle size={14} /> },
              { value: 'promotion', label: 'On Sale', icon: <Percent size={14} /> },
              { value: 'featured', label: 'Featured', icon: <Star size={14} /> },
              { value: 'new', label: 'New Arrivals' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`flex items-center px-3 py-1.5 rounded-full text-sm transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {filter.icon && <span className="mr-1">{filter.icon}</span>}
                {filter.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700 mb-4">
            <Plus size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
          <p className="text-slate-400 mb-4">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Create your first product to get started'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Link
              href="/admin/products/new"
              className="inline-flex items-center px-4 py-2 bg-amber-500 text-slate-900 font-medium rounded-lg hover:bg-amber-400 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add Product
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider hidden lg:table-cell">SKU</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider hidden sm:table-cell">Flags</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-700 mr-3 flex-shrink-0">
                          {getMainImage(product) ? (
                            <Image
                              src={getMainImage(product)!}
                              alt={product.name_en}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-white truncate">{product.name_en}</p>
                          <p className="text-sm text-slate-400 truncate">{product.name_fr}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <code className="text-sm text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                        {product.sku || '-'}
                      </code>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div>
                        <span className="text-white font-medium">
                          {product.price_mad.toLocaleString()} MAD
                        </span>
                        {product.original_price_mad && product.is_promotion && (
                          <p className="text-sm text-slate-500 line-through">
                            {product.original_price_mad.toLocaleString()} MAD
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        product.stock_quantity === 0
                          ? 'bg-red-500/20 text-red-400'
                          : product.stock_quantity <= product.low_stock_threshold
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {product.stock_quantity === 0 && <AlertTriangle size={12} className="mr-1" />}
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
                        {statusLabels[product.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {product.is_featured && (
                          <span className="p-1 bg-amber-500/20 rounded" title="Featured">
                            <Star size={14} className="text-amber-400" />
                          </span>
                        )}
                        {product.is_new && (
                          <span className="px-1.5 py-0.5 bg-blue-500/20 rounded text-xs text-blue-400" title="New">
                            NEW
                          </span>
                        )}
                        {product.is_promotion && (
                          <span className="p-1 bg-green-500/20 rounded" title="On Sale">
                            <Percent size={14} className="text-green-400" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

