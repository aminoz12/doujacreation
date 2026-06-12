'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'

interface Occasion {
  tag: string
  image: string
  label: { fr: string; en: string }
  blurb: { fr: string; en: string }
}

const OCCASIONS: Occasion[] = [
  {
    tag: 'wedding',
    image: '/cat3.png',
    label: { fr: 'Mariage', en: 'Wedding' },
    blurb: { fr: 'Takchitas & robes de cérémonie', en: 'Takchitas & ceremony gowns' },
  },
  {
    tag: 'eid',
    image: '/a1.png',
    label: { fr: 'Aïd', en: 'Eid' },
    blurb: { fr: 'Caftans pour les jours de fête', en: 'Caftans for the celebration' },
  },
  {
    tag: 'henna',
    image: '/a2.png',
    label: { fr: 'Soirée Henné', en: 'Henna Night' },
    blurb: { fr: 'Pièces rituelles & raffinées', en: 'Ritual, refined pieces' },
  },
  {
    tag: 'evening',
    image: '/cover.png',
    label: { fr: 'Soirée', en: 'Evening' },
    blurb: { fr: 'Élégance pour vos invitations', en: 'Elegance for every invitation' },
  },
]

const COPY = {
  fr: { title: 'Acheter par occasion', subtitle: 'Des sélections pensées pour chaque grand moment' },
  en: { title: 'Shop the Occasion', subtitle: 'Curated edits for every grand moment' },
}

export default function ShopTheOccasion() {
  const { language } = useLanguage()
  const c = language === 'en' || language === 'nl' || language === 'es' ? COPY.en : COPY.fr
  const lang = language === 'fr' ? 'fr' : 'en'

  return (
    <section className="section-padding bg-luxury-white">
      <div className="container-luxury">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-6xl mb-4 text-luxury-black">{c.title}</h2>
          <div className="w-24 h-0.5 bg-gold-imperial mx-auto mb-6" />
          <p className="font-sans text-lg text-luxury-black/70 max-w-2xl mx-auto">{c.subtitle}</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
        >
          {OCCASIONS.map((occasion) => (
            <motion.div key={occasion.tag} variants={staggerItem}>
              <Link
                href={`/produits?tag=${occasion.tag}`}
                className="group relative block overflow-hidden bg-luxury-ivory"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={occasion.image}
                    alt={occasion.label[lang]}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/75 via-luxury-black/10 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 text-center">
                  <h3 className="font-serif text-2xl md:text-3xl text-luxury-white">
                    {occasion.label[lang]}
                  </h3>
                  <p className="font-sans text-xs md:text-sm text-luxury-white/80 mt-1">
                    {occasion.blurb[lang]}
                  </p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-imperial transition-all duration-500" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
