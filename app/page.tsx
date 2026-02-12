'use client'

import { motion } from 'framer-motion'
import HeroSection from '@/sections/HeroSection'
import CollectionsCarousel from '@/sections/CollectionsCarousel'
import SignatureCollection from '@/sections/SignatureCollection'
import EleganceSection from '@/sections/EleganceSection'
import TestimonialsSection from '@/sections/TestimonialsSection'
import { pageTransition } from '@/lib/motion-variants'

export default function Home() {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <HeroSection />
      <CollectionsCarousel />
      <SignatureCollection />
      <EleganceSection />
      <TestimonialsSection />
    </motion.div>
  )
}



