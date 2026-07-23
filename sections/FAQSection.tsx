'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import SectionHeading from '@/components/SectionHeading'

export default function FAQSection() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqItems = t.home.faq?.items ?? []

  if (faqItems.length === 0) return null

  return (
    <section className="section-padding bg-luxury-white gold-texture">
      <div className="container-luxury">
        {/* Title */}
        <SectionHeading
          eyebrow="FAQ"
          title={t.home.faq?.title ?? 'FAQ'}
          className="mb-16"
        />

        {/* Accordion */}
        <motion.div
          className="max-w-3xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {faqItems.map((item: { q: string; a: string }, index: number) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="border-b border-luxury-black/10 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between gap-4 py-5 md:py-6 text-left group"
                aria-expanded={openIndex === index}
              >
                <span className="font-sans text-base md:text-lg text-luxury-black font-medium group-hover:text-gold-imperial transition-colors duration-300 pr-4">
                  {item.q}
                </span>
                <span
                  className={`flex-shrink-0 w-10 h-10 rounded-full border border-gold-imperial/40 flex items-center justify-center transition-all duration-300 group-hover:border-gold-imperial group-hover:bg-gold-imperial/5 ${
                    openIndex === index ? 'bg-gold-imperial/10 border-gold-imperial rotate-180' : ''
                  }`}
                >
                  <ChevronDown className="w-5 h-5 text-gold-imperial" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <p className="font-sans text-base md:text-lg text-luxury-black/75 leading-relaxed pb-5 md:pb-6 pl-0 pr-14">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
