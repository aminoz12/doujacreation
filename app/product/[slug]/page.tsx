'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { products as staticProducts } from '@/data/products'
import { productSlug } from '@/lib/slug'
import Button from '@/components/Button'
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'
import { pageTransition } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'

interface ProductData {
  id: string
  name: string
  name_en?: string
  name_fr?: string
  description: string
  price: number
  originalPrice?: number | null
  images: string[]
}

export default function ProductPage() {
  const { t } = useLanguage()
  const { addItem } = useCart()
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }
    const staticMatch = staticProducts.find(
      (p) => productSlug(p.id, p.name) === slug || p.id === slug
    )
    if (staticMatch) {
      setProduct({
        id: staticMatch.id,
        name: staticMatch.name,
        description: staticMatch.description,
        price: staticMatch.price,
        originalPrice: staticMatch.originalPrice,
        images: staticMatch.images
      })
      setLoading(false)
      return
    }
    fetch(`/api/products/${slug}?_t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data.success && data.product) {
          const p = data.product
          const images = Array.isArray(p.images)
            ? p.images.map((img: string | { url: string }) => (typeof img === 'string' ? img : img.url))
            : []
          setProduct({
            id: p.id,
            name: p.name_en || p.name,
            name_en: p.name_en,
            name_fr: p.name_fr,
            description: p.description_en || p.description || '',
            price: p.price,
            originalPrice: p.originalPrice ?? p.original_price_eur,
            images: images.length ? images : (p.image ? [p.image] : [])
          })
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="pt-24 md:pt-32 section-padding min-h-screen flex items-center justify-center">
        <p className="text-luxury-black/70">{t.common.loading}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-24 md:pt-32 section-padding text-center">
        <h1 className="font-serif text-4xl mb-4">{t.common.notFound}</h1>
        <Button href="/collections">{t.product.backToCollections}</Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      product_name_en: product.name,
      product_name_fr: product.name_fr || product.name,
      product_image_url: product.images[0],
      quantity,
      unit_price: product.price
    })
  }

  const imageList = product.images?.length ? product.images : ['/logo.png']

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
            <div className="relative">
              <div className="relative aspect-[3/4] overflow-hidden mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={imageList[selectedImageIndex] || imageList[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
                {imageList.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedImageIndex(
                          (prev) => (prev - 1 + imageList.length) % imageList.length
                        )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-luxury-white/80 hover:bg-luxury-white p-2 transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) => (prev + 1) % imageList.length)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-luxury-white/80 hover:bg-luxury-white p-2 transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              {imageList.length > 1 && (
                <div className="flex gap-4">
                  {imageList.map((img, index) => (
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
                        src={img}
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
                    {product.price.toLocaleString('fr-FR')} €
                  </span>
                  {product.originalPrice != null && product.originalPrice > 0 && (
                    <span className="font-sans text-lg text-luxury-black/40 line-through">
                      {product.originalPrice.toLocaleString('fr-FR')} €
                    </span>
                  )}
                </div>
                <p className="font-sans text-lg text-luxury-black/70 leading-relaxed mb-8">
                  {product.description}
                </p>
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
