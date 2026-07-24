'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import SectionHeading from '@/components/SectionHeading'
import { useLanguage } from '@/contexts/LanguageContext'

const COPY = {
  fr: {
    eyebrow: 'La Maison',
    title: "Tu es l'élégance",
    imageAlt: 'Mariée et invitée vêtues de Kaftan Elegance',
    p1: "À travers les villes et les cultures, les femmes qui choisissent Kaftan Elegance ne se contentent pas de s'habiller : elles expriment leur identité, leur beauté et leur force.",
    p2: "C'est votre endroit. Votre élégance. Votre histoire.",
  },
  en: {
    eyebrow: 'The Maison',
    title: 'You are elegance',
    imageAlt: 'Bride and guest dressed in Kaftan Elegance',
    p1: 'Across cities and cultures, the women who choose Kaftan Elegance do more than dress: they express their identity, their beauty and their strength.',
    p2: 'This is your place. Your elegance. Your story.',
  },
}

export default function EleganceSection() {
  const { language } = useLanguage()
  const c = language === 'en' ? COPY.en : COPY.fr

  return (
    <section className="section-padding bg-luxury-white">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Image (~60% width on large screens) */}
          <motion.div
            className="lg:col-span-7 relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/cover.png"
              alt={c.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 65vw"
              priority={false}
            />
          </motion.div>

          {/* Right: Text block (~35–40% width) */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-center px-0 lg:pl-4"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <SectionHeading
              eyebrow={c.eyebrow}
              title={c.title}
              align="left"
              className="mb-8"
            />
            <div className="space-y-6">
              <p className="font-sans text-base md:text-lg text-luxury-black/80 leading-relaxed">
                {c.p1}
              </p>
              <p className="font-sans text-base md:text-lg text-luxury-black/80 leading-relaxed">
                {c.p2}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
