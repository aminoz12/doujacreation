'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, X } from 'lucide-react'
import Button from '@/components/Button'
import { pageTransition } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const { t } = useLanguage()
  const { items, removeItem, updateQuantity, subtotal } = useCart()

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

          {items.length === 0 ? (
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
              <div className="space-y-6 mb-12">
                {items.map((item) => (
                  <div
                    key={`${item.product_id}-${item.size ?? ''}-${item.color ?? ''}`}
                    className="flex gap-4 md:gap-6 p-4 border border-luxury-black/10 rounded-lg"
                  >
                    {item.product_image_url && (
                      <div className="relative w-24 h-28 flex-shrink-0 rounded overflow-hidden bg-luxury-ivory">
                        <Image
                          src={item.product_image_url}
                          alt={item.product_name_en}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-luxury-black truncate">
                        {item.product_name_en}
                      </p>
                      <p className="text-sm text-luxury-black/60 mt-1">
                        {(item.unit_price * item.quantity).toFixed(2)} €
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              Math.max(0, item.quantity - 1),
                              item.size,
                              item.color
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border border-luxury-black/20 rounded hover:bg-luxury-ivory"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.quantity + 1,
                              item.size,
                              item.color
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border border-luxury-black/20 rounded hover:bg-luxury-ivory"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product_id, item.size, item.color)}
                      className="p-2 text-luxury-black/50 hover:text-luxury-black self-start"
                      aria-label="Remove"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-luxury-black/10 pt-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-2xl text-luxury-black">{t.cart.total}</span>
                  <span className="font-serif text-2xl text-gold-imperial">
                    {subtotal.toFixed(2)} €
                  </span>
                </div>
                <Link href="/checkout">
                  <Button variant="primary" className="w-full">
                    {t.cart.checkout}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  )
}

