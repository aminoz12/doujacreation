'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Instagram, Facebook, Mail } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  
  const footerLinks = {
    shop: [
      { href: '/collections', label: t.nav.collections },
      { href: '/collections?category=caftan', label: 'Caftans' },
      { href: '/collections?category=jellaba', label: 'Jellabas' },
      { href: '/collections?category=takchita', label: 'Takchitas' },
    ],
    maison: [
      { href: '/maison', label: t.footer.maison },
      { href: '/lookbook', label: t.nav.lookbook },
      { href: '/contact', label: t.nav.contact },
    ],
  }

  return (
    <footer className="bg-luxury-black text-luxury-white section-padding border-t border-gold-imperial/20">
      <div className="container-luxury">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-10 mb-12">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Link href="/">
                <Image 
                  src="/logo.png" 
                  alt="Zina Chic" 
                  width={160} 
                  height={64} 
                  className="h-14 md:h-16 w-auto object-contain brightness-0 invert"
                />
              </Link>
            </motion.div>
            <motion.p
              className="text-luxury-white/70 text-sm leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t.footer.description}
            </motion.p>
          </div>

          <div>
            <motion.h4
              className="font-serif text-xs tracking-[0.25em] uppercase mb-6 text-gold-champagne/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t.footer.shop}
            </motion.h4>
            <motion.ul
              className="space-y-3 text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-luxury-white/70 transition-all duration-300 hover:text-gold-imperial hover:[text-shadow:0_0_10px_rgba(199,161,74,0.9)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>

          <div>
            <motion.h4
              className="font-serif text-lg mb-6 text-gold-champagne"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Maison
            </motion.h4>
            <motion.ul
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {footerLinks.maison.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-luxury-white/70 hover:text-gold-imperial transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        <motion.div
          className="pt-6 mt-4 border-t border-gold-imperial/20 flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-luxury-white/50 text-sm">
            © {new Date().getFullYear()} Zinachic. {t.footer.copyright}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-luxury-white/15 flex items-center justify-center text-luxury-white/70 transition-all duration-300 hover:text-gold-imperial hover:border-gold-imperial/70 hover:bg-gold-imperial/10 hover:[box-shadow:0_0_18px_rgba(199,161,74,0.7)]"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-luxury-white/15 flex items-center justify-center text-luxury-white/70 transition-all duration-300 hover:text-gold-imperial hover:border-gold-imperial/70 hover:bg-gold-imperial/10 hover:[box-shadow:0_0_18px_rgba(199,161,74,0.7)]"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-luxury-white/15 flex items-center justify-center text-luxury-white/70 transition-all duration-300 hover:text-gold-imperial hover:border-gold-imperial/70 hover:bg-gold-imperial/10 hover:[box-shadow:0_0_18px_rgba(199,161,74,0.7)]"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

