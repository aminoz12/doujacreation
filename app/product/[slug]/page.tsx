'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { products as staticProducts } from '@/data/products'
import { productSlug } from '@/lib/slug'
import Button from '@/components/Button'
import { ChevronLeft, ChevronRight, ChevronDown, Plus, Minus, Ruler, Sparkles, Truck } from 'lucide-react'
import { pageTransition } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'

interface ProductData {
  id: string
  name: string
  name_en?: string
  name_fr?: string
  description: string
  description_fr?: string
  price: number
  originalPrice?: number | null
  images: string[]
  size_guide_en?: string | null
  size_guide_fr?: string | null
  fabric_care_en?: string | null
  fabric_care_fr?: string | null
}

// Standard size chart, shown when a product has no custom size guide.
const DEFAULT_SIZES = [
  { label: 'XS', eu: '34', bust: '82', waist: '64', hips: '90' },
  { label: 'S', eu: '36', bust: '86', waist: '68', hips: '94' },
  { label: 'M', eu: '38', bust: '90', waist: '72', hips: '98' },
  { label: 'L', eu: '40', bust: '94', waist: '76', hips: '102' },
  { label: 'XL', eu: '42', bust: '99', waist: '81', hips: '107' },
  { label: 'XXL', eu: '44', bust: '104', waist: '86', hips: '112' },
]

type GuidePanelId = 'size' | 'fabric' | 'shipping'

function GuidePanel({
  icon,
  title,
  isOpen,
  onToggle,
  children,
}: {
  icon: ReactNode
  title: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div
      className={`border transition-colors duration-300 ${
        isOpen
          ? 'border-gold-imperial/60 bg-luxury-ivory/60'
          : 'border-luxury-black/10 hover:border-gold-imperial/40'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group"
      >
        <span className="flex items-center gap-3">
          <span
            className={`transition-colors duration-300 ${
              isOpen ? 'text-gold-imperial' : 'text-luxury-black/40 group-hover:text-gold-imperial'
            }`}
          >
            {icon}
          </span>
          <span className="font-sans text-sm tracking-widest uppercase text-luxury-black group-hover:text-gold-imperial transition-colors duration-300">
            {title}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 text-gold-imperial transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6">
              <div className="w-10 h-px bg-gold-imperial/50 mb-4" />
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProductPage() {
  const { t, language } = useLanguage()
  const { addItem } = useCart()
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : ''
  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [openPanel, setOpenPanel] = useState<GuidePanelId | null>('size')

  const togglePanel = (id: GuidePanelId) =>
    setOpenPanel((prev) => (prev === id ? null : id))

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
            description_fr: p.description_fr || '',
            price: p.price,
            originalPrice: p.originalPrice ?? p.original_price_eur,
            images: images.length ? images : (p.image ? [p.image] : []),
            size_guide_en: p.size_guide_en,
            size_guide_fr: p.size_guide_fr,
            fabric_care_en: p.fabric_care_en,
            fabric_care_fr: p.fabric_care_fr
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

  // Language-aware content (FR first when the site is in French, EN otherwise).
  const isFr = language === 'fr'
  const displayName = isFr && product.name_fr ? product.name_fr : product.name
  const displayDescription =
    (isFr ? product.description_fr || product.description : product.description) || ''
  const sizeGuide = isFr
    ? product.size_guide_fr || product.size_guide_en
    : product.size_guide_en || product.size_guide_fr
  const fabricCare = isFr
    ? product.fabric_care_fr || product.fabric_care_en
    : product.fabric_care_en || product.fabric_care_fr

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
                      aria-label={t.product.prevImage}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedImageIndex((prev) => (prev + 1) % imageList.length)
                      }
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-luxury-white/80 hover:bg-luxury-white p-2 transition-colors"
                      aria-label={t.product.nextImage}
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
                        alt={`${product.name} ${t.product.imageView} ${index + 1}`}
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
                  {displayName}
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
                  {displayDescription}
                </p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-sans text-sm tracking-wide uppercase text-luxury-black/70">
                    {t.product.quantity}
                  </span>
                  <div className="flex items-center border border-luxury-black/20">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="p-2 hover:bg-luxury-ivory transition-colors"
                      aria-label={t.product.decreaseQty}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 font-sans text-lg min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="p-2 hover:bg-luxury-ivory transition-colors"
                      aria-label={t.product.increaseQty}
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
                <div className="space-y-3">
                  <GuidePanel
                    icon={<Ruler className="w-4 h-4" />}
                    title={t.product.sizeGuide}
                    isOpen={openPanel === 'size'}
                    onToggle={() => togglePanel('size')}
                  >
                    {sizeGuide ? (
                      <ul>
                        {sizeGuide
                          .split('\n')
                          .map((line) => line.trim())
                          .filter(Boolean)
                          .map((line, i) => (
                            <li
                              key={i}
                              className="flex gap-3 py-2.5 border-b border-luxury-black/5 last:border-0 font-sans text-sm text-luxury-black/75 leading-relaxed"
                            >
                              <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gold-imperial flex-shrink-0" />
                              {line}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left font-sans text-sm">
                            <thead>
                              <tr className="border-b border-gold-imperial/40 text-luxury-black/60 uppercase text-xs tracking-wide">
                                {t.product.sizeCols.map((col) => (
                                  <th key={col} className="py-2 pr-4 font-medium">{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {DEFAULT_SIZES.map((s) => (
                                <tr
                                  key={s.label}
                                  className="border-b border-luxury-black/5 last:border-0 text-luxury-black hover:bg-gold-imperial/5 transition-colors"
                                >
                                  <td className="py-2.5 pr-4 font-serif text-base">{s.label}</td>
                                  <td className="py-2.5 pr-4">{s.eu}</td>
                                  <td className="py-2.5 pr-4">{s.bust}</td>
                                  <td className="py-2.5 pr-4">{s.waist}</td>
                                  <td className="py-2.5 pr-4">{s.hips}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="mt-4 font-sans text-sm text-luxury-black/60 italic">
                          {t.product.sizeNote}
                        </p>
                      </div>
                    )}
                  </GuidePanel>

                  <GuidePanel
                    icon={<Sparkles className="w-4 h-4" />}
                    title={t.product.fabricCare}
                    isOpen={openPanel === 'fabric'}
                    onToggle={() => togglePanel('fabric')}
                  >
                    <div className="space-y-3">
                      {(fabricCare || t.product.careText)
                        .split('\n')
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line, i) => (
                          <p key={i} className="font-sans text-sm text-luxury-black/75 leading-relaxed">
                            {line}
                          </p>
                        ))}
                    </div>
                  </GuidePanel>

                  <GuidePanel
                    icon={<Truck className="w-4 h-4" />}
                    title={t.product.shipping}
                    isOpen={openPanel === 'shipping'}
                    onToggle={() => togglePanel('shipping')}
                  >
                    <p className="font-sans text-sm text-luxury-black/75 leading-relaxed">
                      {t.product.shippingText}
                    </p>
                  </GuidePanel>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
