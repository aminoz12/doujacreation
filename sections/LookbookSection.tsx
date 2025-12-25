'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { lookbookImages } from '@/data/lookbook'
import { ArrowRight } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LookbookSection() {
  const { t } = useLanguage()
  return (
    <section className="py-12 md:py-16 bg-luxury-white">
      <div className="container-luxury">
        <motion.div
          className="flex justify-between items-end mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h2 className="font-serif text-4xl md:text-6xl mb-4 text-luxury-black">
              {t.home.lookbook.title}
            </h2>
            <div className="w-24 h-0.5 bg-gold-imperial" />
          </div>
          <Link
            href="/lookbook"
            className="hidden md:flex items-center gap-2 text-gold-imperial hover:gap-4 transition-all duration-300 font-sans text-sm tracking-wide uppercase"
          >
            {t.home.lookbook.viewFull}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {lookbookImages.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              variants={staggerItem}
              className="group relative overflow-hidden aspect-[3/4]"
            >
              <Link href="/lookbook">
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
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

