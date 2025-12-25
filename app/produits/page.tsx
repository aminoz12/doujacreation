'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Filter, ChevronDown } from 'lucide-react'
import { products } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import FilterPopup, { FilterState } from '@/components/FilterPopup'
import { pageTransition, staggerContainer } from '@/lib/motion-variants'

const categories = [
  'All', 'Dresses', 'Abayas', 'Blazers', 'Outerwear', 'Jackets', 
  'Sweaters', 'Tops', 'Blouses', 'Shirts', 'Pants', 'Skirts', 'Leggings'
]

export default function ProduitsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    size: '',
    priceRange: [0, 5000],
    color: ''
  })

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory.toLowerCase()) {
        return false
      }
      
      // Popup filters
      if (filters.category !== 'All' && product.category !== filters.category.toLowerCase()) {
        return false
      }
      
      if (filters.priceRange[0] > product.price || filters.priceRange[1] < product.price) {
        return false
      }
      
      return true
    })
  }, [selectedCategory, filters])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    if (newFilters.category !== 'All') {
      setSelectedCategory(newFilters.category)
    }
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

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 font-sans text-sm tracking-wide uppercase transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gold-imperial text-white'
                    : 'bg-white text-luxury-black border border-gray-300 hover:border-gold-imperial'
                }`}
              >
                {category}
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
              <span className="font-sans text-sm">Filter</span>
            </button>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </motion.div>

          {/* No Products Found */}
          {filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="font-sans text-lg text-gray-600">
                No products found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setFilters({
                    category: 'All',
                    size: '',
                    priceRange: [0, 5000],
                    color: ''
                  })
                }}
                className="mt-4 px-6 py-2 bg-gold-imperial text-white rounded-lg hover:bg-gold-champagne transition-colors"
              >
                Clear Filters
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
