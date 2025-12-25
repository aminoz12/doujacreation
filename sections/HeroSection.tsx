'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Button from '@/components/Button'
import { fadeInUp, luxuryEase } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HeroSection() {
  const { t } = useLanguage()
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Parallax Effect */}
      <motion.div
        className="absolute inset-0 gold-texture"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: luxuryEase }}
      >
        <Image
          src="/hero.jpg"
          alt="Luxury Moroccan Caftan"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={95}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/70 via-luxury-black/50 to-luxury-black/80" />
      </motion.div>

      {/* Content */}
      <div className="container-luxury relative z-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            initial: {},
            animate: {
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}
          className="mx-auto max-w-4xl text-center px-4 md:px-8"
        >
          <motion.h1
            variants={fadeInUp}
            className="hero-caveat text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-luxury-white mb-6 tracking-luxury"
          >
            {t.home.hero.title}
          </motion.h1>
          <motion.div
            variants={fadeInUp}
            className="w-32 h-0.5 bg-gold-imperial/90 mx-auto mb-8 rounded-full animate-gold-shimmer"
          />
          <motion.p
            variants={fadeInUp}
            className="font-sans text-lg md:text-xl text-luxury-white/90 mb-12 max-w-2xl mx-auto tracking-wide"
          >
            {t.home.hero.subtitle}
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button href="/collections" variant="primary">
              {t.home.hero.explore}
            </Button>
            <Button href="/lookbook" variant="secondary" className="border-luxury-white text-luxury-white hover:bg-luxury-white hover:text-luxury-black">
              {t.home.hero.lookbook}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-gold-imperial"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  )
}

