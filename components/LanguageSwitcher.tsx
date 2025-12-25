'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { languages } from '@/lib/translations'
import { ChevronDown } from 'lucide-react'

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark'
}

export default function LanguageSwitcher({ variant = 'light' }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find((l) => l.code === language) || languages[0]

  const baseColor =
    variant === 'dark' ? 'text-luxury-white' : 'text-luxury-black/80'
  const hoverClasses =
    'hover:text-gold-imperial hover:[text-shadow:0_0_12px_rgba(199,161,74,0.9)]'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 font-sans text-sm uppercase tracking-wide transition-all duration-300 ${baseColor} ${hoverClasses}`}
      >
        <span>{currentLang.flag}</span>
        <span className="hidden md:inline">{currentLang.code.toUpperCase()}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 bg-luxury-white border border-luxury-black/10 shadow-lg min-w-[160px] z-50"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 font-sans text-sm tracking-wide uppercase transition-colors flex items-center gap-3 ${
                  language === lang.code
                    ? 'bg-gold-imperial/10 text-gold-imperial'
                    : 'text-luxury-black/80 hover:bg-luxury-ivory hover:text-gold-imperial'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}



