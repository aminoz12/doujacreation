'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface SectionHeadingProps {
  title: string
  eyebrow?: string
  eyebrowIcon?: ReactNode
  subtitle?: string
  align?: 'center' | 'left'
  tone?: 'light' | 'dark'
  className?: string
  children?: ReactNode
}

export default function SectionHeading({
  title,
  eyebrow,
  eyebrowIcon,
  subtitle,
  align = 'center',
  tone = 'light',
  className = 'mb-14',
  children,
}: SectionHeadingProps) {
  const isCenter = align === 'center'
  const titleColor = tone === 'light' ? 'text-luxury-black' : 'text-luxury-white'
  const subtitleColor = tone === 'light' ? 'text-luxury-black/65' : 'text-luxury-white/70'

  return (
    <motion.div
      className={`${isCenter ? 'text-center' : 'text-left'} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {eyebrow && (
        <div
          className={`flex items-center gap-2.5 mb-4 ${isCenter ? 'justify-center' : ''}`}
        >
          {eyebrowIcon && <span className="text-gold-imperial">{eyebrowIcon}</span>}
          <span className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-gold-imperial">
            {eyebrow}
          </span>
        </div>
      )}
      {/* Title row styled like "ACHETER PAR COLLECTIONS": line — diamond — TITLE — diamond — line */}
      <div className={`flex items-center gap-3 md:gap-4 ${isCenter ? 'justify-center' : ''}`}>
        {isCenter ? (
          <span className="hidden md:block h-px w-16 bg-gradient-to-r from-transparent to-gold-imperial" />
        ) : (
          <span className="hidden md:block h-px w-8 bg-gold-imperial flex-shrink-0" />
        )}
        <span className="w-1.5 h-1.5 rotate-45 border border-gold-imperial flex-shrink-0" />
        <h2 className={`font-sans text-xs md:text-sm tracking-[0.3em] uppercase ${titleColor}`}>
          {title}
        </h2>
        <span className="w-1.5 h-1.5 rotate-45 border border-gold-imperial flex-shrink-0" />
        <span className="hidden md:block h-px w-16 bg-gradient-to-l from-transparent to-gold-imperial" />
      </div>
      {subtitle && (
        <p
          className={`mt-5 font-sans text-base md:text-lg leading-relaxed ${subtitleColor} ${
            isCenter ? 'max-w-2xl mx-auto' : 'max-w-lg'
          }`}
        >
          {subtitle}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  )
}
