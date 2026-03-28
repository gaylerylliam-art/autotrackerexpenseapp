import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import logo from '../assets/logo.png'

function cn(...inputs) { return twMerge(clsx(inputs)) }

/**
 * AppCard — The base UI component for all AutoTracker modules.
 * Integrates premium branding (logo corner/watermark) and accessibility.
 * 
 * @param {Object} props
 * @param {boolean} props.showLogo - Toggle subtle logo in corner
 * @param {string} props.logoPosition - 'top-right' | 'top-left' | 'background'
 * @param {number} props.logoOpacity - For watermark mode (0-100)
 * @param {boolean} props.loading - Show shimmer skeleton
 */
const AppCard = ({ 
  children, 
  className, 
  showLogo = false, 
  logoPosition = 'top-right', 
  logoOpacity = 5,
  loading = false,
  ...props 
}) => {
  if (loading) {
    return (
      <div className={cn("premium-card animate-pulse bg-slate-50 border-slate-100 min-h-[100px]", className)}>
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("premium-card relative overflow-hidden group", className)}
      {...props}
    >
      {/* Background Watermark Mode */}
      {showLogo && logoPosition === 'background' && (
        <div 
          className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
          style={{ opacity: logoOpacity / 100 }}
        >
          <img 
            src={logo} 
            alt="" 
            className="w-48 h-48 object-contain grayscale brightness-150 rotate-[-10deg] transform scale-125" 
          />
        </div>
      )}

      {/* Subtle Corner Logo */}
      {showLogo && (logoPosition === 'top-right' || logoPosition === 'top-left') && (
        <div className={cn(
          "absolute top-4 pointer-events-none transition-opacity duration-300 opacity-20 group-hover:opacity-40",
          logoPosition === 'top-right' ? "right-4" : "left-4"
        )}>
           <img src={logo} alt="AutoTrack" className="w-5 h-5 object-contain" />
        </div>
      )}

      {/* Card Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  )
}

export default AppCard
