'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, X } from 'lucide-react'
import Button from '@/components/Button'
import { pageTransition } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CartPage() {
  const { t } = useLanguage()
  // This is a UI-only cart page as specified
  const cartItems: any[] = [] // Empty cart for now

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-24 md:pt-32"
    >
      <section className="section-padding bg-luxury-white min-h-screen">
        <div className="container-luxury">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl mb-4 text-luxury-black">
              {t.cart.title}
            </h1>
            <div className="w-24 h-0.5 bg-gold-imperial mx-auto" />
          </motion.div>

          {cartItems.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ShoppingBag className="w-16 h-16 text-luxury-black/20 mx-auto mb-6" />
              <p className="font-sans text-lg text-luxury-black/70 mb-8">
                {t.cart.empty}
              </p>
              <Button href="/collections" variant="primary">
                {t.cart.continue}
              </Button>
            </motion.div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Cart items would be rendered here */}
              <div className="space-y-6 mb-12">
                {/* Cart item components */}
              </div>
              <div className="border-t border-luxury-black/10 pt-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-2xl text-luxury-black">{t.cart.total}</span>
                  <span className="font-serif text-2xl text-gold-imperial">$0.00</span>
                </div>
                <Button variant="primary" className="w-full">
                  {t.cart.checkout}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}

