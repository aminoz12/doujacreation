'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import FilterPopup, { FilterState } from '@/components/FilterPopup'
import { pageTransition, staggerContainer } from '@/lib/motion-variants'

interface Product {
  id: string
  name: string
  name_en: string
  name_fr: string
  description: string
  price: number
  originalPrice?: number
  isPromotion: boolean
  images: string[]
  collections: string[]
  tags: string[]
  stockQuantity: number
  isFeatured: boolean
  isNew: boolean
}

export default function ProduitsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [collections, setCollections] = useState<{ slug: string; name_fr: string }[]>([])
  const [selectedCollection, setSelectedCollection] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    size: '',
    priceRange: [0, 5000],
    color: ''
  })

  useEffect(() => {
    fetchProducts()
    fetchCollections()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?_t=${Date.now()}`, { cache: 'no-store' })
      const data = await res.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/collections')
      const data = await res.json()
      if (data.success) {
        setCollections(data.collections)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des collections:', error)
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Collection filter
      if (selectedCollection !== 'all' && !product.collections.includes(selectedCollection)) {
        return false
      }
      
      // Price range filter
      if (filters.priceRange[0] > product.price || filters.priceRange[1] < product.price) {
        return false
      }
      
      return true
    })
  }, [selectedCollection, filters, products])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  if (loading) {
    return (
      <div className="pt-12 md:pt-16 min-h-screen bg-luxury-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-imperial"></div>
      </div>
    )
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-12 md:pt-16 min-h-screen bg-luxury-white"
    >
      <section className="section-padding">
        <div className="container-luxury">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl mb-4 text-luxury-black">
              PRODUITS
            </h1>
            <div className="w-24 h-0.5 bg-gold-imperial mx-auto mb-8" />
            <p className="font-sans text-lg text-luxury-black/70 max-w-2xl mx-auto">
              Découvrez notre collection exclusive de créations marocaines artisanales
            </p>
          </motion.div>

          {/* Collection Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              onClick={() => setSelectedCollection('all')}
              className={`px-6 py-2 font-sans text-sm tracking-wide uppercase transition-all duration-300 ${
                selectedCollection === 'all'
                  ? 'bg-gold-imperial text-white'
                  : 'bg-white text-luxury-black border border-gray-300 hover:border-gold-imperial'
              }`}
            >
              Tous
            </button>
            {collections.map(collection => (
              <button
                key={collection.slug}
                onClick={() => setSelectedCollection(collection.slug)}
                className={`px-6 py-2 font-sans text-sm tracking-wide uppercase transition-all duration-300 ${
                  selectedCollection === collection.slug
                    ? 'bg-gold-imperial text-white'
                    : 'bg-white text-luxury-black border border-gray-300 hover:border-gold-imperial'
                }`}
              >
                {collection.name_fr}
              </button>
            ))}
          </motion.div>

          {/* Filter Button */}
          <motion.div
            className="flex justify-end mb-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gold-imperial transition-colors duration-300"
            >
              <Filter className="w-4 h-4" />
              <span className="font-sans text-sm">Filtrer</span>
            </button>
          </motion.div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name_fr || product.name,
                    price: product.price || 0,
                    originalPrice: product.originalPrice,
                    image: product.images?.[0] || '/images/placeholder.jpg',
                    isNew: product.isNew,
                    isSale: product.isPromotion,
                    category: product.collections?.[0] || 'produit'
                  }}
                  index={index}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="font-sans text-lg text-gray-600">
                Aucun produit trouvé.
              </p>
              <button
                onClick={() => {
                  setSelectedCollection('all')
                  setFilters({
                    category: 'All',
                    size: '',
                    priceRange: [0, 5000],
                    color: ''
                  })
                }}
                className="mt-4 px-6 py-2 bg-gold-imperial text-white rounded-lg hover:bg-gold-champagne transition-colors"
              >
                Effacer les filtres
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Filter Popup */}
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
        filters={filters}
      />
    </motion.div>
  )
}
