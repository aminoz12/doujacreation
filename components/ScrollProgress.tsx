'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const rafId = useRef<number>()

  useEffect(() => {
    let ticking = false

    const updateScrollProgress = () => {
      if (!ticking) {
        ticking = true
        rafId.current = requestAnimationFrame(() => {
          const scrollPx = document.documentElement.scrollTop
          const winHeightPx =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight
          const scrolled = winHeightPx > 0 ? scrollPx / winHeightPx : 0
          setScrollProgress(Math.max(0, Math.min(1, scrolled)))
          ticking = false
        })
      }
    }

    // Use passive listener for better performance
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    
    // Initial calculation
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  // Use spring animation for smoother updates
  const scaleX = useSpring(scrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-gold-imperial z-50 origin-left pointer-events-none"
      style={{ scaleX }}
      initial={{ scaleX: 0 }}
    />
  )
}

