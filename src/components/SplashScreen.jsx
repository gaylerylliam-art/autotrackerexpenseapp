import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2500) // 2.5s duration
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-white overflow-hidden cursor-default select-none">
      {/* Background Subtle Glow */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 bg-radial-at-center from-purple-50 to-transparent opacity-60"
      />

      <div className="relative flex flex-col items-center gap-12">
        <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 10 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Logo type="full" theme="light" className="scale-150 sm:scale-[2]" animate={true} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-48 h-1 rounded-full bg-slate-100 overflow-hidden relative">
             <motion.div 
                className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 }}
             />
          </div>
          <span className="text-[10px] text-slate-400 font-display font-bold uppercase tracking-[0.4em] text-center ml-[0.4em]">
            UAE Fleet Intelligence System
          </span>
        </motion.div>
      </div>
      
      {/* Subtle Bottom Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 text-[8px] font-mono tracking-[0.5em] text-slate-400 font-bold uppercase"
      >
        Version 2.2.0 • Build 2026.03
      </motion.div>
    </div>
  )
}

export default SplashScreen
