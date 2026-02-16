'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  onClick,
  href,
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseClasses = 'btn-luxury'
  const variantClasses =
    variant === 'primary' ? 'btn-luxury-primary' : 'btn-luxury'

  const buttonContent = (
    <motion.button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.button>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className={`${baseClasses} ${variantClasses} ${className} inline-block text-center`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.a>
    )
  }

  return buttonContent
}



