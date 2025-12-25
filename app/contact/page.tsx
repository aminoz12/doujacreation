'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import Button from '@/components/Button'
import { pageTransition } from '@/lib/motion-variants'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-24 md:pt-32"
    >
      <section className="section-padding bg-luxury-white">
        <div className="container-luxury">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl mb-4 text-luxury-black">
              {t.contact.title}
            </h1>
            <div className="w-24 h-0.5 bg-gold-imperial mx-auto mb-8" />
            <p className="font-sans text-lg text-luxury-black/70 max-w-2xl mx-auto">
              {t.contact.subtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <h2 className="font-serif text-3xl mb-6 text-luxury-black">
                  {t.contact.getInTouch}
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-gold-imperial mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-sans text-sm tracking-wide uppercase text-luxury-black/50 mb-1">
                        {t.contact.email}
                      </p>
                      <a
                        href="mailto:contact@doujacreation.com"
                        className="font-sans text-lg text-luxury-black hover:text-gold-imperial transition-colors"
                      >
                        contact@doujacreation.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-gold-imperial mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-sans text-sm tracking-wide uppercase text-luxury-black/50 mb-1">
                        {t.contact.phone}
                      </p>
                      <a
                        href="tel:+1234567890"
                        className="font-sans text-lg text-luxury-black hover:text-gold-imperial transition-colors"
                      >
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-gold-imperial mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-sans text-sm tracking-wide uppercase text-luxury-black/50 mb-1">
                        {t.contact.address}
                      </p>
                      <p className="font-sans text-lg text-luxury-black">
                        {t.contact.addressLine1}
                        <br />
                        {t.contact.addressLine2}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block font-sans text-sm tracking-wide uppercase text-luxury-black/70 mb-2"
                >
                  {t.contact.name}
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-luxury-black/20 bg-luxury-ivory text-luxury-black focus:outline-none focus:border-gold-imperial transition-colors font-sans"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block font-sans text-sm tracking-wide uppercase text-luxury-black/70 mb-2"
                >
                  {t.contact.email}
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-luxury-black/20 bg-luxury-ivory text-luxury-black focus:outline-none focus:border-gold-imperial transition-colors font-sans"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block font-sans text-sm tracking-wide uppercase text-luxury-black/70 mb-2"
                >
                  {t.contact.message}
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 border border-luxury-black/20 bg-luxury-ivory text-luxury-black focus:outline-none focus:border-gold-imperial transition-colors font-sans resize-none"
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                {t.contact.send}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

