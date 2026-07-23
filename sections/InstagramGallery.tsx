'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Play, ShoppingBag } from 'lucide-react'
import { staggerContainer, staggerItem } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'
import { instagramPosts, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/data/instagram'
import SectionHeading from '@/components/SectionHeading'

const COPY = {
  fr: {
    title: 'Un caftan pour chaque moment spécial',
    subtitle: 'Portées par vous — identifiez-nous pour apparaître ici.',
    follow: 'Suivre',
  },
  en: {
    title: 'A caftan for every special moment',
    subtitle: 'As worn by you — tag us to be featured.',
    follow: 'Follow',
  },
}

// Muted looping reel that only plays while visible on screen — keeps the page
// light even with 8 clips. Falls back to the poster image while a clip is missing.
function ReelVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.3 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className="absolute inset-0 h-full w-full object-cover"
      muted
      loop
      playsInline
      preload="metadata"
    />
  )
}

export default function InstagramGallery() {
  const { language } = useLanguage()
  const c = language === 'fr' ? COPY.fr : COPY.en

  return (
    <section className="section-padding bg-luxury-white">
      <div className="container-luxury">
        <SectionHeading
          eyebrow="Instagram"
          eyebrowIcon={<Instagram className="w-4 h-4" />}
          title={c.title}
          subtitle={c.subtitle}
          className="mb-12"
        >
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
        </SectionHeading>

        {/* Reels strip: 9:16 cards, 5 per row on desktop, snap-scroll on smaller screens */}
        <motion.div
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
        >
          {instagramPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={staggerItem}
              className="snap-start flex-none w-[65%] sm:w-[42%] md:w-[30%] lg:w-[calc((100%-4rem)/5)]"
            >
              <Link
                href={post.href}
                className="group relative block aspect-[9/16] overflow-hidden rounded-2xl bg-luxury-black/5"
              >
                {post.video ? (
                  <ReelVideo src={post.video} poster={post.image} />
                ) : (
                  <Image
                    src={post.image}
                    alt={post.caption || 'Zinachic'}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 65vw, (max-width: 1024px) 32vw, 20vw"
                  />
                )}
                {post.video && (
                  <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-luxury-black/50 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 text-luxury-white" fill="currentColor" />
                  </span>
                )}
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
