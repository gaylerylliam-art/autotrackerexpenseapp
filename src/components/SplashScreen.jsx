import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2800)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-brand-gradient overflow-hidden cursor-default select-none">
      {/* Decorative Light Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-white/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-white/5 blur-[80px] rounded-full" />
      
      <div className="relative flex flex-col items-center gap-12">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
           className="relative"
        >
          <div className="w-32 h-32 rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center p-6 relative z-10 transition-transform hover:scale-105 duration-500">
             <img src={logo} alt="AutoTrack" className="w-full h-full object-contain brightness-0 invert opacity-90 animate-pulse" />
          </div>
          <motion.div 
             animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.3, 0.5] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="absolute -inset-10 bg-white/10 rounded-full blur-3xl" 
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="text-center">
             <h1 className="text-white text-3xl font-bold tracking-tight mb-1">AutoTracker</h1>
             <p className="text-white/60 text-[12px] font-medium tracking-[0.2em] uppercase">SaaS Optimization Node</p>
          </div>
          
          <div className="w-32 h-1 rounded-full bg-white/10 overflow-hidden relative mt-4">
             <motion.div 
                className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 }}
             />
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.8 }}
        className="text-white/50 text-[10px] font-bold uppercase tracking-[0.3em] absolute bottom-12"
      >
        Enterprise Node • Alpha-7
      </motion.div>
    </div>
  )
}

export default SplashScreen
