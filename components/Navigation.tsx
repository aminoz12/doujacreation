'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navigation() {
  const { t } = useLanguage()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    let ticking = false
    let rafId: number

    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        rafId = requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50)
          ticking = false
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/collections', label: t.nav.collections },
    { href: '/produits', label: 'PRODUITS' },
    { href: '/maison', label: t.nav.maison },
    { href: '/contact', label: t.nav.contact },
  ]

  const desktopNavLinkBase =
    'font-sans text-sm tracking-wide uppercase transition-all duration-300'
  const desktopNavLinkColor = isHome
    ? isScrolled
      ? 'text-luxury-black/85'
      : 'text-luxury-white'
    : 'text-luxury-black/85'
  const desktopNavLinkHover =
    'hover:text-gold-imperial hover:[text-shadow:0_0_12px_rgba(199,161,74,0.9)]'
  const languageVariant = isHome
    ? isScrolled
      ? 'light'
      : 'dark'
    : 'light'

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'bg-luxury-white/95 backdrop-blur-sm border-b border-gold-imperial/10'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-20 md:h-24">
            <Link href="/" className="font-serif text-xl md:text-2xl text-gold-imperial tracking-wider">
              DoujaCreation
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${desktopNavLinkBase} ${desktopNavLinkColor} ${desktopNavLinkHover}`}
                >
                  {link.label}
                </Link>
              ))}
              <LanguageSwitcher variant={languageVariant} />
              <button className="relative">
                <ShoppingBag
                  className={`w-5 h-5 transition-all duration-300 ${desktopNavLinkColor} ${desktopNavLinkHover}`}
                />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold-imperial rounded-full text-xs text-luxury-black flex items-center justify-center">
                  0
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-luxury-black"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-luxury-white md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="font-serif text-2xl text-luxury-black hover:text-gold-imperial transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

