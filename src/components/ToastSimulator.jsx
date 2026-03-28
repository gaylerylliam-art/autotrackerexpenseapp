import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CreditCard, PenTool, TrendingUp, Sparkles, X, ChevronRight, CornerDownLeft, Command } from 'lucide-react'

const initialToasts = [
  {
    id: 't1',
    type: 'TOLL',
    title: 'New Salik Deduction',
    message: 'AED 4.00 at Al Garhoud • BMW X5',
    icon: CreditCard,
    color: 'text-accent4',
    bg: 'bg-accent4/10',
    delay: 5000 // Show after 5s
  },
  {
    id: 't2',
    type: 'MAINTENANCE',
    title: 'Service Alert',
    message: 'Tesla Model 3: Brake pads scheduled for tomorrow',
    icon: PenTool,
    color: 'text-accent2',
    bg: 'bg-accent2/10',
    delay: 15000 // Show after 15s
  }
]

const ToastSimulator = () => {
  const [activeToasts, setActiveToasts] = useState([])

  useEffect(() => {
    const timers = initialToasts.map(toast => {
      return setTimeout(() => {
        setActiveToasts(prev => [...prev, toast])
      }, toast.delay)
    })

    return () => timers.forEach(clearTimeout)
  }, [])

  const removeToast = (id) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] w-full max-w-sm px-4 space-y-4 pointer-events-none">
      <AnimatePresence>
        {activeToasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            className="w-full glass border border-white/10 rounded-[32px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.6)] pointer-events-auto group relative cursor-pointer active:scale-95 transition-all"
            onClick={() => removeToast(t.id)}
          >
            <div className="p-5 flex items-center gap-4 bg-white/[0.02]">
               <div className={`w-12 h-12 rounded-2xl ${t.bg} border border-white/5 flex items-center justify-center ${t.color} shrink-0`}>
                  <t.icon className="w-6 h-6" />
               </div>
               <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                     <h4 className="font-display font-black text-sm tracking-tighter leading-tight text-white">{t.title}</h4>
                     <span className="text-[8px] font-mono text-muted uppercase font-black bg-white/5 px-1.5 py-0.5 rounded tracking-widest">{t.type}</span>
                  </div>
                  <p className="text-[10px] text-muted leading-relaxed font-body pr-4">{t.message}</p>
               </div>
               <button className="w-6 h-6 rounded-full glass border border-white/5 flex items-center justify-center text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
               </button>
            </div>
            {/* Progress line indicator (auto-dismiss mock) */}
            <motion.div 
               initial={{ scaleX: 1 }}
               animate={{ scaleX: 0 }}
               transition={{ duration: 6, ease: 'linear' }}
               onAnimationComplete={() => removeToast(t.id)}
               className={`h-1 w-full origin-left ${t.bg.replace('/10', '/30')}`}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ToastSimulator
