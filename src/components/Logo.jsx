import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Logo = ({ 
  type = 'full', 
  theme = 'light', 
  className = '', 
  animate = false 
}) => {
  const isDark = theme === 'dark'
  
  const iconMarkup = (
    <svg 
      viewBox="0 0 100 100" 
      className={cn(
        "w-full h-full drop-shadow-sm",
        animate && "animate-pulse"
      )}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>

      {/* Car Body Silhouette */}
      <path 
        d="M20 65C20 68.3 22.7 71 26 71H74C77.3 71 80 68.3 80 65V58C80 50 72 40 50 40C28 40 20 50 20 58V65Z" 
        fill="url(#brandGradient)"
      />
      
      {/* Front Windows */}
      <path 
        d="M32 55C32 50 38 46 50 46C62 46 68 50 68 55" 
        stroke="white" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        opacity="0.3"
      />

      {/* Location Pin */}
      <path 
        d="M50 15C42 15 36 21 36 29C36 39 50 48 50 48C50 48 64 39 64 29C64 21 58 15 50 15Z" 
        fill="#2563EB" 
      />
      <circle cx="50" cy="29" r="4.5" fill="white" />
    </svg>
  )

  if (type === 'icon') {
    return (
      <div className={cn(
        "relative flex items-center justify-center aspect-square overflow-hidden bg-white/10 rounded-2xl p-2 border border-slate-100", 
        className
      )}>
        {iconMarkup}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-3 select-none cursor-default", className)}>
      <div className={cn(
          "relative flex items-center justify-center",
          type === 'full' ? "w-10 h-10" : "w-8 h-8"
        )}>
           {iconMarkup}
      </div>
      
      <div className="flex flex-col">
          <div className={cn(
            "font-display font-extrabold tracking-tight leading-none",
            type === 'full' ? "text-2xl" : "text-xl",
            "text-slate-900"
          )}>
            <span>Auto</span>
            <span className="text-primary">Tracker</span>
          </div>
          {type === 'full' && (
            <span className="text-[9px] font-display font-bold uppercase tracking-[0.2em] mt-1 text-slate-400 opacity-60">
               Financial Intelligence
            </span>
          )}
      </div>
    </div>
  )
}

export default Logo
