'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import Button from '@/components/Button'
import { pageTransition } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'

interface OrderInfo {
  id: string
  order_number: string
  total_amount: number
  payment_status: string
  currency: string
}

function CheckoutSuccessContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order')
  const [order, setOrder] = useState<OrderInfo | null>(null)
  const [loading, setLoading] = useState(!!orderId)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }
    fetch(`/api/checkout/order?order=${orderId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Not found'))))
      .then((data) => setOrder(data.order))
      .catch(() => setError('Order not found'))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        className="pt-24 md:pt-32 section-padding min-h-screen flex items-center justify-center"
      >
        <p className="text-luxury-black/70">{t.common.loading}</p>
      </motion.div>
    )
  }

  if (error || !orderId || !order) {
    return (
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        className="pt-24 md:pt-32 section-padding min-h-screen"
      >
        <div className="container-luxury text-center">
          <p className="text-luxury-black/70 mb-6">
            {error || 'Missing order reference.'}
          </p>
          <Button href="/collections">{t.cart.continue}</Button>
        </div>
      </motion.div>
    )
  }

  const isPaid = order.payment_status === 'paid'

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-24 md:pt-32"
    >
      <section className="section-padding bg-luxury-white min-h-screen">
        <div className="container-luxury max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle
              className={`w-20 h-20 mx-auto mb-6 ${
                isPaid ? 'text-green-600' : 'text-amber-500'
              }`}
            />
            <h1 className="font-serif text-3xl md:text-4xl mb-4 text-luxury-black">
              {isPaid
                ? (t.checkout?.successTitle ?? 'Thank you for your order')
                : (t.checkout?.pendingTitle ?? 'Order received')}
            </h1>
            <p className="text-luxury-black/70 mb-8">
              {isPaid
                ? (t.checkout?.successMessage ?? 'Your payment was successful. We will process your order shortly.')
                : (t.checkout?.pendingMessage ?? 'Your order has been created. Payment is being confirmed.')}
            </p>
            {order && (
              <div className="bg-luxury-ivory/50 rounded-lg p-6 mb-8 text-left">
                <p className="font-sans text-sm text-luxury-black/80">
                  <span className="font-medium">Order</span> {order.order_number}
                </p>
                <p className="font-sans text-sm text-luxury-black/80 mt-1">
                  <span className="font-medium">Total</span>{' '}
                  {order.total_amount.toFixed(2)} {order.currency}
                </p>
              </div>
            )}
            <Button href="/collections" variant="primary">
              {t.cart.continue}
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-24 md:pt-32 section-padding min-h-screen flex items-center justify-center">
          <p className="text-luxury-black/70">Loading...</p>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}
