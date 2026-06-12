'use client'

import { motion } from 'framer-motion'
import HeroSection from '@/sections/HeroSection'
import CollectionsCarousel from '@/sections/CollectionsCarousel'
import ShopTheOccasion from '@/sections/ShopTheOccasion'
import SignatureCollection from '@/sections/SignatureCollection'
import EleganceSection from '@/sections/EleganceSection'
import MadeToMeasure from '@/sections/MadeToMeasure'
import SizeFabricGuide from '@/sections/SizeFabricGuide'
import InstagramGallery from '@/sections/InstagramGallery'
import TestimonialsSection from '@/sections/TestimonialsSection'
import FAQSection from '@/sections/FAQSection'
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
      <ShopTheOccasion />
      <SignatureCollection />
      <EleganceSection />
      <MadeToMeasure />
      <SizeFabricGuide />
      <InstagramGallery />
      <TestimonialsSection />
      <FAQSection />
    </motion.div>
  )
}



