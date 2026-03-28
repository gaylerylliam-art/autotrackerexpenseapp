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
  className = '', 
  animate = false 
}) => {
  const iconMarkup = (
    <motion.div
      initial={animate ? { scale: 0.9, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : false}
      className={cn(
        "relative flex items-center justify-center p-1",
        className
      )}
    >
       <img 
          src={logoPng} 
          alt="AutoTrack" 
          className={cn(
            "w-full h-full object-contain",
            animate && "animate-pulse"
          )} 
       />
    </motion.div>
  )

  if (type === 'icon') return iconMarkup

  return (
    <div className={cn("flex items-center gap-4 select-none cursor-default", className)}>
      <div className={cn(
          "relative flex items-center justify-center bg-white border border-slate-100 rounded-2xl shadow-xl shadow-blue-500/5 p-2",
          type === 'full' ? "w-12 h-12" : "w-10 h-10"
        )}>
           <img src={logoPng} alt="" className="w-full h-full object-contain" />
      </div>
      
      <div className="flex flex-col">
          <div className={cn(
            "font-display font-extrabold tracking-tighter leading-none text-slate-900",
            type === 'full' ? "text-2xl" : "text-xl"
          )}>
            <span>Auto</span>
            <span className="text-primary truncate">Track</span>
          </div>
          {type === 'full' && (
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-400 opacity-60">
               Vehicle Intelligence
            </span>
          )}
      </div>
    </div>
  )
}

export default Logo
