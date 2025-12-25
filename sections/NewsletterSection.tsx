'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NewsletterSection() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  return (
    <section className="section-padding bg-luxury-black text-luxury-white">
      <div className="container-luxury">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-6xl mb-6 text-gold-imperial">
            {t.home.newsletter.title}
          </h2>
          <p className="font-sans text-lg text-luxury-white/70 mb-12 max-w-2xl mx-auto">
            {t.home.newsletter.description}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-luxury-white/50" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.home.newsletter.placeholder}
                className="w-full pl-12 pr-4 py-4 bg-luxury-white/10 border border-luxury-white/20 text-luxury-white placeholder-luxury-white/50 focus:outline-none focus:border-gold-imperial transition-colors font-sans"
                required
              />
            </div>
            <motion.button
              type="submit"
              className="px-8 py-4 bg-gold-imperial text-luxury-black font-sans text-sm tracking-wide uppercase hover:bg-gold-champagne transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t.home.newsletter.subscribe}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

