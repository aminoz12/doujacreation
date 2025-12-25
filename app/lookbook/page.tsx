'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { lookbookImages } from '@/data/lookbook'
import { pageTransition, staggerContainer, staggerItem } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LookbookPage() {
  const { t } = useLanguage()
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
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl mb-4 text-luxury-black">
              {t.lookbook.title}
            </h1>
            <div className="w-24 h-0.5 bg-gold-imperial mx-auto mb-8" />
            <p className="font-sans text-lg text-luxury-black/70 max-w-2xl mx-auto">
              {t.lookbook.subtitle}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {lookbookImages.map((item, index) => (
              <motion.div
                key={item.id}
                variants={staggerItem}
                className="group relative overflow-hidden aspect-[3/4]"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-serif text-2xl text-luxury-white mb-2">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm text-gold-champagne uppercase tracking-wide">
                    {item.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

