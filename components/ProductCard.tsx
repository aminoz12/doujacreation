'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { productSlug } from '@/lib/slug'

export interface ProductCardData {
  id: string
  slug?: string
  name: string
  category?: string
  price: number
  originalPrice?: number | null
  description?: string
  images?: string[]
  image?: string
  featured?: boolean
  new?: boolean
  isNew?: boolean
  isSale?: boolean
}

interface ProductCardProps {
  product: ProductCardData
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useLanguage()
  
  const imageUrl = product.image || (product.images && product.images[0]) || '/images/placeholder.jpg'
  const isNew = product.new || product.isNew
  const isSale = product.isSale || (product.originalPrice && product.originalPrice > 0)
  
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
      <Link href={`/product/${product.slug ?? productSlug(product.id, product.name)}`}>
        <div className="relative overflow-hidden bg-luxury-white">
          {/* Image Container */}
          <div className="relative aspect-[3/5] overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index === 0}
              quality={75}
            />
            {isNew && (
              <div className="absolute top-4 left-4 bg-gold-imperial text-luxury-black px-3 py-1 text-xs font-sans tracking-wide uppercase">
                {t.collections.new}
              </div>
            )}
            {isSale && (
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
                {product.price.toLocaleString('fr-FR')} €
              </span>
              {product.originalPrice && product.originalPrice > 0 && (
                <span className="font-sans text-sm text-luxury-black/40 line-through">
                  {product.originalPrice.toLocaleString('fr-FR')} €
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
