'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { categories } from '@/data/products'
import { useLanguage } from '@/contexts/LanguageContext'
import ProductGrid from './ProductGrid'

const AUTO_SCROLL_INTERVAL = 3000 // 3 seconds per step

const HEADING = { fr: 'ACHETER PAR COLLECTIONS', en: 'SHOP BY COLLECTIONS' }

export default function CollectionsCarousel() {
  const { language } = useLanguage()
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const firstCardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    const cardElement = firstCardRef.current

    if (!scrollContainer || !cardElement) return

    const cardWidth = cardElement.clientWidth
    if (!cardWidth) return

    let index = 0

    const interval = window.setInterval(() => {
      if (!scrollRef.current) return

      index += 1

      // When we have scrolled through all original categories, jump back to start
      if (index >= categories.length) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'auto' })
        index = 1
      }

      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      })
    }, AUTO_SCROLL_INTERVAL)

    return () => {
      window.clearInterval(interval)
    }
  }, [])

  // Duplicate categories to keep a continuous strip for the loop
  const loopedCategories = [...categories, ...categories]

  const categoryImages = [
    '/cat1.png',
    '/cat2.png',
    '/cat3.png',
    '/cat4.png',
    '/cat5.png',
  ]

  return (
    <>
      <section className="pt-12 md:pt-16 pb-6 md:pb-8 bg-luxury-ivory">
        <div className="container-luxury">
          {/* Heading */}
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-10">
            <span className="hidden md:block h-px w-16 bg-gradient-to-r from-transparent to-gold-imperial" />
            <span className="w-1.5 h-1.5 rotate-45 border border-gold-imperial flex-shrink-0" />
            <h2 className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-luxury-black">
              {language === 'en' ? HEADING.en : HEADING.fr}
            </h2>
            <span className="w-1.5 h-1.5 rotate-45 border border-gold-imperial flex-shrink-0" />
            <span className="hidden md:block h-px w-16 bg-gradient-to-l from-transparent to-gold-imperial" />
          </div>

          {/* Scrolling row of categories */}
          <div
            ref={scrollRef}
            className="scrollbar-hide overflow-x-auto"
          >
            <div className="flex gap-4 md:gap-6 lg:gap-8 pb-4">
              {loopedCategories.map((category, index) => {
                const imageSrc = categoryImages[index % categoryImages.length]
                const isFirst = index === 0

                return (
                  <div
                    key={`${category.id}-${index}`}
                    ref={isFirst ? firstCardRef : undefined}
                    className="relative min-w-[220px] sm:min-w-[260px] md:min-w-[280px] lg:min-w-[300px] cursor-pointer"
                  >
                    <Link href={`/collections?category=${category.slug}`}>
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                          sizes="(max-width: 768px) 80vw, (max-width: 1200px) 60vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-luxury-black/20 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-sans text-sm md:text-lg tracking-[0.35em] text-luxury-white uppercase">
                            {category.name}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <ProductGrid />
    </>
  )
}

