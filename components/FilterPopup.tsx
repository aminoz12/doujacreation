'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown } from 'lucide-react'

interface FilterPopupProps {
  isOpen: boolean
  onClose: () => void
  onFilterChange: (filters: FilterState) => void
  filters: FilterState
}

export interface FilterState {
  category: string
  size: string
  priceRange: [number, number]
  color: string
}

const categories = [
  'All', 'Dresses', 'Abayas', 'Blazers', 'Outerwear', 'Jackets', 
  'Sweaters', 'Tops', 'Blouses', 'Shirts', 'Pants', 'Skirts', 'Leggings'
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const colors = [
  'Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Yellow', 
  'Purple', 'Orange', 'Brown', 'Gray', 'Navy', 'Beige', 'Cream', 'Gold', 'Silver'
]

export default function FilterPopup({ isOpen, onClose, onFilterChange, filters }: FilterPopupProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'size', 'price', 'color'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const applyFilters = () => {
    onFilterChange(localFilters)
    onClose()
  }

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      category: 'All',
      size: '',
      priceRange: [0, 5000],
      color: ''
    }
    setLocalFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-luxury-black">Filters</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Category Filter */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleSection('category')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <h3 className="font-sans text-lg font-medium text-luxury-black">Category</h3>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform ${
                      expandedSections.includes('category') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {expandedSections.includes('category') && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setLocalFilters(prev => ({ ...prev, category }))}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          localFilters.category === category
                            ? 'bg-gold-imperial text-white border-gold-imperial'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gold-imperial'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleSection('size')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <h3 className="font-sans text-lg font-medium text-luxury-black">Size</h3>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform ${
                      expandedSections.includes('size') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {expandedSections.includes('size') && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setLocalFilters(prev => ({ 
                          ...prev, 
                          size: prev.size === size ? '' : size 
                        }))}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          localFilters.size === size
                            ? 'bg-gold-imperial text-white border-gold-imperial'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gold-imperial'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleSection('price')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <h3 className="font-sans text-lg font-medium text-luxury-black">Price</h3>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform ${
                      expandedSections.includes('price') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {expandedSections.includes('price') && (
                  <div className="mt-3 space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{localFilters.priceRange[0]} Dh</span>
                      <span>{localFilters.priceRange[1]} Dh</span>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={localFilters.priceRange[0]}
                        onChange={(e) => setLocalFilters(prev => ({
                          ...prev,
                          priceRange: [parseInt(e.target.value), prev.priceRange[1]]
                        }))}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={localFilters.priceRange[1]}
                        onChange={(e) => setLocalFilters(prev => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div className="pb-4">
                <button
                  onClick={() => toggleSection('color')}
                  className="w-full flex items-center justify-between py-2"
                >
                  <h3 className="font-sans text-lg font-medium text-luxury-black">Color</h3>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform ${
                      expandedSections.includes('color') ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {expandedSections.includes('color') && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setLocalFilters(prev => ({ 
                          ...prev, 
                          color: prev.color === color ? '' : color 
                        }))}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          localFilters.color === color
                            ? 'bg-gold-imperial text-white border-gold-imperial'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gold-imperial'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 px-4 py-3 bg-gold-imperial text-white rounded-lg hover:bg-gold-champagne transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
