'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

interface ApiProduct {
  id: string
  slug?: string
  name: string
  name_fr?: string
  name_en?: string
  price: number
  originalPrice?: number | null
  images: string[]
  isNew?: boolean
  isFeatured?: boolean
}

export default function SignatureCollection() {
  const { t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/products?limit=8&_t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products)
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="section-padding bg-luxury-white overflow-hidden">
      <div className="container-luxury">
        <motion.div
          className="flex justify-between items-end mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h2 className="font-serif text-2xl md:text-3xl mb-4 text-luxury-black uppercase tracking-wide">
              {t.home.signature.title}
            </h2>
            <div className="w-24 h-0.5 bg-gold-imperial" />
          </div>
          <Link
            href="/collections"
            className="hidden md:flex items-center gap-2 text-gold-imperial hover:gap-4 transition-all duration-300 font-sans text-sm tracking-wide uppercase"
          >
            {t.home.signature.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-6"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 md:w-96 aspect-[3/4] bg-luxury-ivory animate-pulse rounded" />
            ))
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <div key={product.id} className="flex-shrink-0 w-80 md:w-96">
                <ProductCard
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name: product.name_fr || product.name_en || product.name,
                    price: product.price,
                    originalPrice: product.originalPrice ?? undefined,
                    images: product.images || [],
                    isNew: product.isNew,
                  }}
                  index={index}
                />
              </div>
            ))
          ) : (
            <p className="text-luxury-black/60 font-sans text-sm py-8">Aucun produit pour le moment.</p>
          )}
        </div>
      </div>
    </section>
  )
}

