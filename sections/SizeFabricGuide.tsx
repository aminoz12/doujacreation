'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Ruler, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const COPY = {
  fr: {
    title: 'Guide des tailles & tissus',
    subtitle: 'Choisissez la bonne taille et prenez soin de vos pièces',
    sizeTab: 'Tailles',
    fabricTab: 'Tissus & entretien',
    cols: ['Taille', 'FR/EU', 'Poitrine (cm)', 'Taille (cm)', 'Hanches (cm)'],
    note: 'Entre deux tailles, choisissez la plus grande. Pour un ajustement parfait, optez pour le sur-mesure.',
    fabrics: [
      { name: 'Soie & satin', desc: 'Tombé fluide et lumineux, idéal pour les takchitas de cérémonie.' },
      { name: 'Brocart & fil d’or', desc: 'Matière structurée et précieuse pour les grandes occasions.' },
      { name: 'Mousseline', desc: 'Légère et aérienne, parfaite pour les superpositions estivales.' },
    ],
    care: 'Entretien : nettoyage à sec recommandé. Rangez à l’abri de la lumière, sur cintre rembourré. Repassez à basse température sur l’envers.',
  },
  en: {
    title: 'Size & Fabric Guide',
    subtitle: 'Find your fit and care for your pieces',
    sizeTab: 'Sizing',
    fabricTab: 'Fabric & care',
    cols: ['Size', 'FR/EU', 'Bust (cm)', 'Waist (cm)', 'Hips (cm)'],
    note: 'Between two sizes, choose the larger. For a perfect fit, choose made-to-measure.',
    fabrics: [
      { name: 'Silk & satin', desc: 'Fluid, luminous drape — ideal for ceremony takchitas.' },
      { name: 'Brocade & gold thread', desc: 'Structured, precious fabric for grand occasions.' },
      { name: 'Chiffon', desc: 'Light and airy, perfect for summer layering.' },
    ],
    care: 'Care: dry clean recommended. Store away from light on a padded hanger. Iron inside-out on low heat.',
  },
}

const SIZES = [
  { label: 'XS', eu: '34', bust: '82', waist: '64', hips: '90' },
  { label: 'S', eu: '36', bust: '86', waist: '68', hips: '94' },
  { label: 'M', eu: '38', bust: '90', waist: '72', hips: '98' },
  { label: 'L', eu: '40', bust: '94', waist: '76', hips: '102' },
  { label: 'XL', eu: '42', bust: '99', waist: '81', hips: '107' },
  { label: 'XXL', eu: '44', bust: '104', waist: '86', hips: '112' },
]

export default function SizeFabricGuide() {
  const { language } = useLanguage()
  const c = language === 'fr' ? COPY.fr : COPY.en
  const [tab, setTab] = useState<'size' | 'fabric'>('size')

  return (
    <section className="section-padding bg-luxury-ivory">
      <div className="container-luxury max-w-4xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-luxury-black">{c.title}</h2>
          <div className="w-24 h-0.5 bg-gold-imperial mx-auto mb-6" />
          <p className="font-sans text-lg text-luxury-black/70">{c.subtitle}</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setTab('size')}
            className={`flex items-center gap-2 px-6 py-2.5 font-sans text-sm tracking-wide uppercase transition-all duration-300 ${
              tab === 'size'
                ? 'bg-gold-imperial text-luxury-black'
                : 'bg-luxury-white text-luxury-black border border-luxury-black/15 hover:border-gold-imperial'
            }`}
          >
            <Ruler className="w-4 h-4" />
            {c.sizeTab}
          </button>
          <button
            onClick={() => setTab('fabric')}
            className={`flex items-center gap-2 px-6 py-2.5 font-sans text-sm tracking-wide uppercase transition-all duration-300 ${
              tab === 'fabric'
                ? 'bg-gold-imperial text-luxury-black'
                : 'bg-luxury-white text-luxury-black border border-luxury-black/15 hover:border-gold-imperial'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {c.fabricTab}
          </button>
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-luxury-white p-6 md:p-8 border border-luxury-black/10"
        >
          {tab === 'size' ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm">
                  <thead>
                    <tr className="border-b border-gold-imperial/40 text-luxury-black/60 uppercase text-xs tracking-wide">
                      {c.cols.map((col) => (
                        <th key={col} className="py-3 pr-4 font-medium">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SIZES.map((s) => (
                      <tr key={s.label} className="border-b border-luxury-black/5 text-luxury-black">
                        <td className="py-3 pr-4 font-serif text-base">{s.label}</td>
                        <td className="py-3 pr-4">{s.eu}</td>
                        <td className="py-3 pr-4">{s.bust}</td>
                        <td className="py-3 pr-4">{s.waist}</td>
                        <td className="py-3 pr-4">{s.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-6 font-sans text-sm text-luxury-black/60 italic">{c.note}</p>
            </>
          ) : (
            <div className="space-y-6">
              {c.fabrics.map((f) => (
                <div key={f.name} className="flex gap-4">
                  <span className="mt-1 w-2 h-2 rounded-full bg-gold-imperial flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-xl text-luxury-black">{f.name}</h3>
                    <p className="font-sans text-sm text-luxury-black/70 mt-1">{f.desc}</p>
                  </div>
                </div>
              ))}
              <p className="pt-4 border-t border-luxury-black/10 font-sans text-sm text-luxury-black/60">
                {c.care}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
