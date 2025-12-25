'use client'

import { useState, useMemo, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { products, categories } from '@/data/products'
import { pageTransition, staggerContainer, staggerItem } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'

function CollectionsContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all')

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products
    return products.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-24 md:pt-32"
    >
      <section className="section-padding bg-luxury-white">
        <div className="container-luxury">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl mb-4 text-luxury-black">
              {t.collections.title}
            </h1>
            <div className="w-24 h-0.5 bg-gold-imperial mx-auto mb-8" />
            <p className="font-sans text-lg text-luxury-black/70 max-w-2xl mx-auto">
              {t.collections.subtitle}
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 font-sans text-sm tracking-wide uppercase transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-gold-imperial text-luxury-black'
                  : 'bg-transparent border border-luxury-black/20 text-luxury-black/70 hover:border-gold-imperial hover:text-gold-imperial'
              }`}
            >
              {t.collections.all}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 font-sans text-sm tracking-wide uppercase transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gold-imperial text-luxury-black'
                    : 'bg-transparent border border-luxury-black/20 text-luxury-black/70 hover:border-gold-imperial hover:text-gold-imperial'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* Products Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filteredProducts.map((product, index) => (
              <motion.div key={product.id} variants={staggerItem}>
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

function LoadingFallback() {
  const { t } = useLanguage()
  return (
    <div className="pt-24 md:pt-32 section-padding bg-luxury-white">
      <div className="container-luxury text-center">
        <p className="font-sans text-lg text-luxury-black/70">{t.common.loading}</p>
      </div>
    </div>
  )
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CollectionsContent />
    </Suspense>
  )
}

