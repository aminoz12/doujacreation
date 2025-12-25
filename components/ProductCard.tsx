'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/data/products'
import { useLanguage } from '@/contexts/LanguageContext'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useLanguage()
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden bg-luxury-white">
          {/* Image Container */}
          <div className="relative aspect-[3/5] overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
            {product.new && (
              <div className="absolute top-4 left-4 bg-gold-imperial text-luxury-black px-3 py-1 text-xs font-sans tracking-wide uppercase">
                {t.collections.new}
              </div>
            )}
            {product.originalPrice && (
              <div className="absolute top-4 right-4 bg-luxury-black text-luxury-white px-3 py-1 text-xs font-sans tracking-wide">
                {t.collections.sale}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 border border-transparent group-hover:border-gold-imperial transition-all duration-500">
            <h3 className="font-serif text-xl mb-2 text-luxury-black group-hover:text-gold-imperial transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-3">
              <span className="font-sans text-lg text-gold-imperial">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="font-sans text-sm text-luxury-black/40 line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

