'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CraftsmanshipSection() {
  const { t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section ref={ref} className="section-padding bg-luxury-ivory">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            className="relative aspect-[4/5] overflow-hidden"
            style={{ y: imageY }}
          >
            <Image
              src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop&q=90&auto=format"
              alt="Moroccan Craftsmanship"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Content */}
          <motion.div style={{ opacity: textOpacity }}>
            <motion.h2
              className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 text-luxury-black"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {t.home.craftsmanship.title}
            </motion.h2>
            <motion.div
              className="w-24 h-0.5 bg-gold-imperial mb-8"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.p
              className="font-sans text-lg text-luxury-black/70 leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {t.home.craftsmanship.description1}
            </motion.p>
            <motion.p
              className="font-sans text-lg text-luxury-black/70 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t.home.craftsmanship.description2}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

