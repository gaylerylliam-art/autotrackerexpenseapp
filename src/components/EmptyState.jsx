import React from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/logo.png'
import { Plus } from 'lucide-react'

const EmptyState = ({ 
  title = "No data yet", 
  message = "Ready to start tracking? Add your first entry below.", 
  actionLabel = "Add Record", 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-20 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="relative">
         <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl" />
         <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-32 h-32 rounded-[40px] bg-white border border-slate-100 shadow-2xl flex items-center justify-center p-6 relative z-10"
         >
            <img src={logo} alt="AutoTrack" className="w-full h-full object-contain grayscale opacity-20" />
         </motion.div>
         <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Plus className="w-6 h-6" />
         </div>
      </div>

      <div className="space-y-2 max-w-sm">
         <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight">{title}</h3>
         <p className="text-sm text-slate-400 font-medium leading-relaxed">{message}</p>
      </div>

      {onAction && (
        <button 
           onClick={onAction}
           className="h-12 px-8 btn-primary rounded-xl text-xs font-bold transition-transform hover:scale-105 active:scale-95"
        >
           {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState
