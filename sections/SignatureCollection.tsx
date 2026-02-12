'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import ProductCard from '@/components/ProductCard'
import { featuredProducts } from '@/data/products'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SignatureCollection() {
  const { t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)

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
          {featuredProducts.map((product, index) => (
            <div key={product.id} className="flex-shrink-0 w-80 md:w-96">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

