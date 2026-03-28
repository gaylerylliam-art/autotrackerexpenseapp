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
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-white overflow-hidden cursor-default select-none">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent" />
      
      <div className="relative flex flex-col items-center gap-16">
        <motion.div
           initial={{ opacity: 0, scale: 0.8, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
           className="relative group"
        >
          <div className="w-40 h-40 rounded-[48px] bg-white border border-slate-100 shadow-2xl flex items-center justify-center p-8 relative z-10">
             <img src={logo} alt="AutoTrack" className="w-full h-full object-contain animate-pulse" />
          </div>
          <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.1, 0.2] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="absolute -inset-10 bg-primary/20 rounded-full blur-3xl" 
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="text-center">
             <h1 className="text-3xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">
                Auto<span className="text-primary italic">Track</span>
             </h1>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-3">
                Vehicle Intelligence OS
             </p>
          </div>
          
          <div className="w-32 h-1 rounded-full bg-slate-100 overflow-hidden relative mt-4 shadow-sm">
             <motion.div 
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.4 }}
             />
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 2 }}
        className="absolute bottom-12 text-[8px] font-bold tracking-[0.6em] text-slate-400 uppercase"
      >
        Enterprise Node • V 6.0.4
      </motion.div>
    </div>
  )
}

export default SplashScreen
