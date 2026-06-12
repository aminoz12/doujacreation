'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Scissors, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const COPY = {
  fr: {
    eyebrow: 'Sur-mesure',
    title: 'Votre pièce, créée pour vous',
    description:
      'Caftans et takchitas confectionnés à vos mesures par nos artisans. Partagez votre occasion et vos préférences — nous vous recontactons sous 48h avec une proposition.',
    bullets: ['Mesures personnalisées', 'Choix des tissus & broderies', 'Accompagnement dédié'],
    name: 'Nom complet',
    email: 'Email',
    phone: 'Téléphone',
    occasion: 'Occasion',
    occasionPlaceholder: 'Mariage, Aïd, soirée…',
    eventDate: 'Date de l’événement',
    budget: 'Budget indicatif',
    message: 'Votre projet (mesures, couleurs, inspirations)',
    submit: 'Demander un devis',
    sending: 'Envoi…',
    successTitle: 'Demande reçue',
    successMsg: 'Merci ! Notre atelier vous recontacte très vite.',
    error: 'Une erreur est survenue. Réessayez.',
  },
  en: {
    eyebrow: 'Made to measure',
    title: 'Your piece, created for you',
    description:
      'Caftans and takchitas tailored to your measurements by our artisans. Share your occasion and preferences — we reply within 48h with a proposal.',
    bullets: ['Custom measurements', 'Choice of fabrics & embroidery', 'Dedicated guidance'],
    name: 'Full name',
    email: 'Email',
    phone: 'Phone',
    occasion: 'Occasion',
    occasionPlaceholder: 'Wedding, Eid, evening…',
    eventDate: 'Event date',
    budget: 'Indicative budget',
    message: 'Your project (measurements, colours, inspiration)',
    submit: 'Request a quote',
    sending: 'Sending…',
    successTitle: 'Request received',
    successMsg: 'Thank you! Our atelier will be in touch shortly.',
    error: 'Something went wrong. Please try again.',
  },
}

export default function MadeToMeasure() {
  const { language } = useLanguage()
  const c = language === 'fr' ? COPY.fr : COPY.en

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    occasion: '',
    event_date: '',
    budget: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/bespoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-luxury-white/10 border border-luxury-white/20 text-luxury-white placeholder-luxury-white/40 focus:outline-none focus:border-gold-imperial transition-colors font-sans text-sm'

  return (
    <section className="section-padding bg-luxury-black text-luxury-white overflow-hidden">
      <div className="container-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: pitch + image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Scissors className="w-5 h-5 text-gold-imperial" />
              <span className="font-sans text-sm tracking-[0.2em] uppercase text-gold-imperial">
                {c.eyebrow}
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl mb-6">{c.title}</h2>
            <p className="font-sans text-luxury-white/70 leading-relaxed mb-8 max-w-lg">
              {c.description}
            </p>
            <ul className="space-y-3 mb-10">
              {c.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 font-sans text-luxury-white/85">
                  <Check className="w-4 h-4 text-gold-imperial flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="relative aspect-[16/10] hidden lg:block overflow-hidden">
              <Image
                src="/elegance-section.png"
                alt={c.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 0vw, 40vw"
              />
              <div className="absolute inset-0 border border-gold-imperial/30" />
            </div>
          </motion.div>

          {/* Right: lead form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-luxury-white/5 border border-luxury-white/10 p-6 md:p-8"
          >
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gold-imperial/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-gold-imperial" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-gold-imperial">{c.successTitle}</h3>
                <p className="font-sans text-luxury-white/70">{c.successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input className={inputClass} placeholder={c.name} value={form.name} onChange={set('name')} required />
                  <input className={inputClass} type="email" placeholder={c.email} value={form.email} onChange={set('email')} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input className={inputClass} type="tel" placeholder={c.phone} value={form.phone} onChange={set('phone')} />
                  <input className={inputClass} placeholder={c.occasionPlaceholder} value={form.occasion} onChange={set('occasion')} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-luxury-white/50 mb-1 font-sans">{c.eventDate}</label>
                    <input className={inputClass} type="date" value={form.event_date} onChange={set('event_date')} />
                  </div>
                  <div>
                    <label className="block text-xs text-luxury-white/50 mb-1 font-sans">{c.budget}</label>
                    <input className={inputClass} placeholder="€" value={form.budget} onChange={set('budget')} />
                  </div>
                </div>
                <textarea className={inputClass} rows={4} placeholder={c.message} value={form.message} onChange={set('message')} />
                {status === 'error' && <p className="text-sm text-red-400">{c.error}</p>}
                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full px-8 py-4 bg-gold-imperial text-luxury-black font-sans text-sm tracking-wide uppercase hover:bg-gold-champagne transition-colors disabled:opacity-60"
                  whileHover={status === 'sending' ? undefined : { scale: 1.02 }}
                  whileTap={status === 'sending' ? undefined : { scale: 0.98 }}
                >
                  {status === 'sending' ? c.sending : c.submit}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
