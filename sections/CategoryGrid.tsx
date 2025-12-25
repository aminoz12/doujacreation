'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { categories } from '@/data/products'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CategoryGrid() {
  const { t } = useLanguage()
  return (
    <section className="section-padding bg-luxury-ivory">
      <div className="container-luxury">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-6xl mb-4 text-luxury-black">
            {t.home.categories.title}
          </h2>
          <div className="w-24 h-0.5 bg-gold-imperial mx-auto" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
        >
          {categories.map((category, index) => {
            // Cat images for categories
            const categoryImages = [
              '/cat1.png', // Caftan
              '/cat2.png', // Jellaba
              '/cat3.png', // Takchita
              '/cat4.png', // Homme
              '/cat5.png', // Accessories
              '/cat1.png', // Home (reusing cat1.png)
            ]
            
            return (
            <motion.div
              key={category.id}
              variants={staggerItem}
              className="group relative overflow-hidden bg-luxury-white cursor-pointer"
            >
              <Link href={`/collections?category=${category.slug}`}>
                <div className="relative aspect-[4/7] overflow-hidden">
                  <Image
                    src={categoryImages[index] || categoryImages[0]}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <motion.h3
                    className="font-serif text-3xl md:text-4xl text-luxury-white z-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {category.name}
                  </motion.h3>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-imperial transition-all duration-500" />
              </Link>
            </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

