import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import logoPng from '../assets/logo.png'

function cn(...inputs) { return twMerge(clsx(inputs)) }

/**
 * Branded AutoTrack Logo component.
 * Uses the official PNG asset with premium styling.
 */
const Logo = ({ 
  type = 'full', 
  variant = 'dark', // 'light' for dark bgs, 'dark' for light bgs
  className = '', 
  animate = false 
}) => {
  const isLight = variant === 'light'
  
  const containerClasses = cn(
    "relative flex items-center justify-center rounded-[18px] lg:rounded-[20px]",
    isLight 
      ? "bg-white/10 backdrop-blur-md border border-white/20 shadow-none" 
      : "bg-gradient-to-br from-[#0A66C2] to-[#00C6FF] shadow-lg shadow-blue-500/20",
    "transition-all duration-300 hover:scale-[1.03] p-[10px]",
    type === 'full' ? "w-14 h-14" : "w-10 h-10",
    className
  )

  const iconMarkup = (
    <motion.div
      initial={animate ? { scale: 0.9, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      className={containerClasses}
    >
       <img 
          src={logoPng} 
          alt="AutoTrack" 
          className={cn(
            "w-full h-full object-contain",
            !isLight && "brightness-0 invert opacity-90", // White icon on blue bg
            isLight && "brightness-0 invert opacity-100", // Brighter white on sidebar
            animate && "animate-pulse"
          )} 
       />
    </motion.div>
  )

  if (type === 'icon') return iconMarkup

  return (
    <div className={cn("flex items-center gap-4 select-none cursor-default", className)}>
      <div className={containerClasses}>
         <img 
            src={logoPng} 
            alt="Logo" 
            className={cn(
               "w-full h-full object-contain",
               !isLight && "brightness-0 invert opacity-90",
               isLight && "brightness-0 invert opacity-100"
            )} 
         />
      </div>
      
      <div className="flex flex-col">
          <div className={cn(
            "font-semibold tracking-tight leading-[1.1]",
            isLight ? "text-white" : "text-text-primary",
            type === 'full' ? "text-[22px]" : "text-[18px]"
          )}>
            <span>Auto</span>
            <span className={cn(isLight ? "text-white opacity-80" : "text-primary", "italic")}>Tracker</span>
          </div>
          {type === 'full' && (
            <span className={cn(
               "text-[10px] font-bold uppercase tracking-widest mt-0.5 opacity-40",
               isLight ? "text-white" : "text-text-secondary"
            )}>
               Precision Systems
            </span>
          )}
      </div>
    </div>
  )
}

export default Logo
