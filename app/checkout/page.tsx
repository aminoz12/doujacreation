'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Button from '@/components/Button'
import { pageTransition } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'

export default function CheckoutPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Morocco',
    customer_notes: ''
  })

  if (items.length === 0 && !loading) {
    return (
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        className="pt-24 md:pt-32 section-padding min-h-screen"
      >
        <div className="container-luxury text-center">
          <p className="text-luxury-black/70 mb-6">{t.cart.empty}</p>
          <Button href="/collections">{t.cart.continue}</Button>
        </div>
      </motion.div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: {
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            phone: form.phone || undefined
          },
          shipping: {
            address: form.address,
            city: form.city,
            postal_code: form.postal_code || undefined,
            country: form.country
          },
          customer_notes: form.customer_notes || undefined
        })
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = data.details ? `${data.error}: ${data.details}` : (data.error || 'Checkout failed')
        setError(msg)
        setLoading(false)
        return
      }
      if (data.checkout_url) {
        clearCart()
        window.location.href = data.checkout_url
        return
      }
      clearCart()
      router.push(`/checkout/success?order=${data.order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const shippingCost = 0
  const total = subtotal + shippingCost

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-24 md:pt-32"
    >
      <section className="section-padding bg-luxury-white min-h-screen">
        <div className="container-luxury max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl mb-8 text-luxury-black">
            {t.checkout?.title ?? 'Checkout'}
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-luxury-black border-b border-gold-imperial/30 pb-2">
                {t.checkout?.customerDetails}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-luxury-black/80 mb-1">
                    {t.checkout?.firstName} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-luxury-black/20 rounded focus:border-gold-imperial focus:outline-none"
                    value={form.first_name}
                    onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-black/80 mb-1">
                    {t.checkout?.lastName} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-luxury-black/20 rounded focus:border-gold-imperial focus:outline-none"
                    value={form.last_name}
                    onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-black/80 mb-1">
                  {t.checkout?.email} *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-luxury-black/20 rounded focus:border-gold-imperial focus:outline-none"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-black/80 mb-1">
                  {t.checkout?.phone}
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-luxury-black/20 rounded focus:border-gold-imperial focus:outline-none"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>

              <h2 className="font-serif text-xl text-luxury-black border-b border-gold-imperial/30 pb-2 pt-4">
                {t.checkout?.shippingAddress}
              </h2>
              <div>
                <label className="block text-sm font-medium text-luxury-black/80 mb-1">
                  {t.checkout?.address} *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-luxury-black/20 rounded focus:border-gold-imperial focus:outline-none"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-luxury-black/80 mb-1">
                    {t.checkout?.city} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-luxury-black/20 rounded focus:border-gold-imperial focus:outline-none"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-black/80 mb-1">
                    {t.checkout?.postalCode}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-luxury-black/20 rounded focus:border-gold-imperial focus:outline-none"
                    value={form.postal_code}
                    onChange={(e) => setForm((f) => ({ ...f, postal_code: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-black/80 mb-1">
                  {t.checkout?.country} *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-luxury-black/20 rounded focus:border-gold-imperial focus:outline-none"
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-black/80 mb-1">
                  {t.checkout?.notes}
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-2 border border-luxury-black/20 rounded focus:border-gold-imperial focus:outline-none"
                  value={form.customer_notes}
                  onChange={(e) => setForm((f) => ({ ...f, customer_notes: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <div className="bg-luxury-ivory/50 rounded-lg p-6 sticky top-28">
                <h2 className="font-serif text-xl text-luxury-black mb-4">Order summary</h2>
                <ul className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <li key={`${item.product_id}-${item.size ?? ''}-${item.color ?? ''}`} className="flex gap-3">
                      {item.product_image_url && (
                        <div className="relative w-16 h-20 flex-shrink-0 rounded overflow-hidden bg-luxury-white">
                          <Image
                            src={item.product_image_url}
                            alt={item.product_name_en}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-sans text-sm text-luxury-black truncate">
                          {item.product_name_en}
                        </p>
                        <p className="text-xs text-luxury-black/60">
                          ×{item.quantity} — {(item.unit_price * item.quantity).toFixed(2)} €
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-luxury-black/10 pt-4 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-black/80">Subtotal</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-luxury-black/80">Shipping</span>
                    <span>{shippingCost.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg pt-2">
                    <span>Total</span>
                    <span className="text-gold-imperial">{total.toFixed(2)} €</span>
                  </div>
                </div>
                {error && (
                  <p className="mt-4 text-sm text-red-600">{error}</p>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-6"
                  disabled={loading}
                >
                  {loading ? (t.checkout?.creatingOrder ?? 'Creating order...') : (t.checkout?.payWithCard ?? 'Pay with card, Apple Pay or Google Pay')}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </motion.div>
  )
}
