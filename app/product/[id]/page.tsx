'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { use } from 'react'
import { products } from '@/data/products'
import Button from '@/components/Button'
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'
import { pageTransition } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { t } = useLanguage()
  const { id } = use(params)
  const product = products.find((p) => p.id === id)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="pt-24 md:pt-32 section-padding text-center">
        <h1 className="font-serif text-4xl mb-4">{t.common.notFound}</h1>
        <Button href="/collections">{t.product.backToCollections}</Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    // Handle add to cart
    console.log('Add to cart:', product.id, quantity)
  }

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative aspect-[3/4] overflow-hidden mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={product.images[selectedImageIndex] || product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          (prev) => (prev - 1 + product.images.length) % product.images.length
                        )
                      }
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-luxury-white/80 hover:bg-luxury-white p-2 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-luxury-white/80 hover:bg-luxury-white p-2 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square w-20 overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-gold-imperial'
                          : 'border-transparent hover:border-gold-imperial/50'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-4 text-luxury-black">
                  {product.name}
                </h1>
                <div className="w-24 h-0.5 bg-gold-imperial mb-6" />

                <div className="flex items-center gap-4 mb-8">
                  <span className="font-serif text-3xl text-gold-imperial">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="font-sans text-lg text-luxury-black/40 line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <p className="font-sans text-lg text-luxury-black/70 leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-sans text-sm tracking-wide uppercase text-luxury-black/70">
                    {t.product.quantity}
                  </span>
                  <div className="flex items-center border border-luxury-black/20">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="p-2 hover:bg-luxury-ivory transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 font-sans text-lg min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="p-2 hover:bg-luxury-ivory transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  className="w-full mb-8"
                >
                  {t.product.addToCart}
                </Button>

                {/* Accordion Details */}
                <div className="space-y-4">
                  <details className="border-b border-luxury-black/10 pb-4">
                    <summary className="font-sans text-sm tracking-wide uppercase text-luxury-black cursor-pointer hover:text-gold-imperial transition-colors">
                      {t.product.careInstructions}
                    </summary>
                    <p className="mt-4 font-sans text-sm text-luxury-black/70 leading-relaxed">
                      {t.product.careText}
                    </p>
                  </details>
                  <details className="border-b border-luxury-black/10 pb-4">
                    <summary className="font-sans text-sm tracking-wide uppercase text-luxury-black cursor-pointer hover:text-gold-imperial transition-colors">
                      {t.product.shipping}
                    </summary>
                    <p className="mt-4 font-sans text-sm text-luxury-black/70 leading-relaxed">
                      {t.product.shippingText}
                    </p>
                  </details>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

