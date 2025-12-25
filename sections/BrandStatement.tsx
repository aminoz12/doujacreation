'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function BrandStatement() {
  const { t } = useLanguage()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50])

  return (
    <section ref={ref} className="section-padding bg-luxury-white">
      <div className="container-luxury">
        <motion.div
          style={{ opacity, y }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2
            className="font-serif text-4xl md:text-6xl lg:text-7xl mb-8 text-luxury-black"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {t.home.brand.title}{' '}
            <span className="text-gold-imperial">{t.home.brand.titleHighlight}</span>
          </motion.h2>
          <motion.div
            className="w-24 h-0.5 bg-gold-imperial mx-auto mb-8"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.p
            className="font-sans text-lg md:text-xl text-luxury-black/70 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t.home.brand.description}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

