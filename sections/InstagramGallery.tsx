'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram, ShoppingBag } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'
import { instagramPosts, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/data/instagram'

const COPY = {
  fr: {
    title: 'Portées par vous',
    subtitle: 'Nos créations dans la vraie vie. Identifiez-nous pour apparaître ici.',
    follow: 'Suivre',
  },
  en: {
    title: 'As Worn By You',
    subtitle: 'Our pieces in real life. Tag us to be featured.',
    follow: 'Follow',
  },
}

export default function InstagramGallery() {
  const { language } = useLanguage()
  const c = language === 'fr' ? COPY.fr : COPY.en

  return (
    <section className="section-padding bg-luxury-ivory">
      <div className="container-luxury">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-6xl mb-4 text-luxury-black">{c.title}</h2>
          <div className="w-24 h-0.5 bg-gold-imperial mx-auto mb-6" />
          <p className="font-sans text-lg text-luxury-black/70 max-w-2xl mx-auto mb-6">
            {c.subtitle}
          </p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-sm tracking-wide uppercase text-luxury-black hover:text-gold-imperial transition-colors"
          >
            <Instagram className="w-5 h-5" />
            @{INSTAGRAM_HANDLE}
            <span className="ml-1 px-3 py-1 border border-gold-imperial text-gold-imperial text-xs">
              {c.follow}
            </span>
          </a>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
        >
          {instagramPosts.map((post) => (
            <motion.div key={post.id} variants={staggerItem}>
              <Link href={post.href} className="group relative block aspect-square overflow-hidden bg-luxury-white">
                <Image
                  src={post.image}
                  alt={post.caption || 'Zinachic'}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/45 transition-colors duration-500 flex flex-col items-center justify-center gap-2 text-center px-3">
                  {post.shoppable && (
                    <ShoppingBag className="w-6 h-6 text-luxury-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}
                  {post.caption && (
                    <span className="font-sans text-xs text-luxury-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {post.caption}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
