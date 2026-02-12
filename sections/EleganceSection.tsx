'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function EleganceSection() {
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
              alt="Bride and guest dressed in KE"
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
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-gold-imperial uppercase tracking-wide -mt-32 mb-8 font-semibold">
              Tu es l&apos;élégance
            </h2>
            <div className="space-y-6">
              <p className="font-sans text-base md:text-lg text-luxury-black/80 leading-relaxed">
                À travers les villes et les cultures, les femmes qui choisissent Kaftan Elegance ne se contentent pas de s&apos;habiller : elles expriment leur identité, leur beauté et leur force.
              </p>
              <p className="font-sans text-base md:text-lg text-luxury-black/80 leading-relaxed">
                C&apos;est votre endroit. Votre élégance. Votre histoire.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
