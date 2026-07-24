'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import SectionHeading from '@/components/SectionHeading'

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
  const { t, language } = useLanguage()
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
    <section className="section-padding bg-luxury-ivory overflow-hidden">
      <div className="container-luxury">
        <div className="flex justify-between items-end mb-12">
          <SectionHeading
            title={t.home.signature.title}
            align="left"
            className="mb-0"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/collections"
              className="hidden md:flex items-center gap-2 text-gold-imperial hover:gap-4 transition-all duration-300 font-sans text-sm tracking-wide uppercase"
            >
              {t.home.signature.viewAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

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
              <div key={i} className="flex-shrink-0 w-80 md:w-96 aspect-[3/4] bg-luxury-white/70 animate-pulse rounded" />
            ))
          ) : products.length > 0 ? (
            products.map((product, index) => (
              <div key={product.id} className="flex-shrink-0 w-80 md:w-96">
                <ProductCard
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name:
                      language === 'en'
                        ? product.name_en || product.name_fr || product.name
                        : product.name_fr || product.name_en || product.name,
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
            <p className="text-luxury-black/60 font-sans text-sm py-8">{t.common.noProductsYet}</p>
          )}
        </div>
      </div>
    </section>
  )
}

