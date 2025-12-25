'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { pageTransition } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MaisonPage() {
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
              {t.maison.title}
            </h1>
            <div className="w-24 h-0.5 bg-gold-imperial mx-auto mb-8" />
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-16">
            <motion.div
              className="relative aspect-[16/9] overflow-hidden mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&h=675&fit=crop&q=90&auto=format"
                alt="Moroccan Heritage"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1200px"
              />
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl text-luxury-black mb-4">
                {t.maison.subtitle}
              </h2>
              <p className="font-sans text-lg text-luxury-black/70 leading-relaxed">
                {t.maison.description1}
              </p>
              <p className="font-sans text-lg text-luxury-black/70 leading-relaxed">
                {t.maison.description2}
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div>
                <h3 className="font-serif text-2xl text-gold-imperial mb-4">
                  {t.maison.craftsmanship}
                </h3>
                <p className="font-sans text-base text-luxury-black/70 leading-relaxed">
                  {t.maison.craftsmanshipText}
                </p>
              </div>
              <div>
                <h3 className="font-serif text-2xl text-gold-imperial mb-4">
                  {t.maison.heritage}
                </h3>
                <p className="font-sans text-base text-luxury-black/70 leading-relaxed">
                  {t.maison.heritageText}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

