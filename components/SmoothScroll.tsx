'use client'

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)
  const rafIdRef = useRef<number>()

  useEffect(() => {
    // Only initialize on client
    if (typeof window === 'undefined') return

    const isReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0

    // Avoid custom smooth scroll on touch devices or when user prefers reduced motion
    if (isReducedMotion || isTouchDevice) {
      return
    }

    const lenis = new Lenis({
      duration: 0.9, // Slightly snappier for desktop
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      infinite: false,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      rafIdRef.current = requestAnimationFrame(raf)
    }

    rafIdRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return null
}

