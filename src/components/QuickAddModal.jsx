import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Car, Receipt, Wrench, Shield, CreditCard, Plus, ChevronRight, Fuel, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const QuickAddModal = ({ isOpen, onClose, onAddVehicle, onAddExpense }) => {
  const navigate = useNavigate()

  const actions = [
    { 
      id: 'expense', 
      label: 'Log Expense', 
      sub: 'Fuel, Toll, or General',
      icon: Receipt, 
      color: 'bg-accent', 
      action: () => { onAddExpense?.(); onClose(); }
    },
    { 
      id: 'vehicle', 
      label: 'Add Vehicle', 
      sub: 'Expand your fleet',
      icon: Car, 
      color: 'bg-accent2', 
      action: () => { onAddVehicle?.(); onClose(); }
    },
    { 
      id: 'maintenance', 
      label: 'Maintenance', 
      sub: 'Schedule or log service',
      icon: PenTool, 
      color: 'bg-accent3', 
      action: () => { navigate('/maintenance'); onClose(); }
    },
    { 
      id: 'insurance', 
      label: 'Compliance', 
      sub: 'Renew or update docs',
      icon: Shield, 
      color: 'bg-accent4', 
      action: () => { navigate('/vehicles'); onClose(); }
    }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-bg/80 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="relative w-full max-w-lg glass rounded-[48px] border border-white/10 p-10 space-y-10 shadow-3xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/20 blur-[120px] -z-10" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-3xl font-display font-black tracking-tighter">Quick Action</h3>
                <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-black opacity-60">What would you like to track?</p>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-muted hover:text-text transition-all active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid gap-4">
               {actions.map((act, i) => (
                  <motion.button
                    key={act.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={act.action}
                    className="flex items-center gap-6 p-6 rounded-[32px] glass-card border border-white/5 hover:border-white/20 group transition-all text-left"
                  >
                     <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-110", act.color)}>
                        <act.icon className="w-7 h-7" />
                     </div>
                     <div className="flex-1 space-y-1">
                        <h4 className="text-lg font-display font-black text-text group-hover:text-accent transition-colors">{act.label}</h4>
                        <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-black opacity-60">{act.sub}</p>
                     </div>
                     <ChevronRight className="w-5 h-5 text-muted group-hover:text-text group-hover:translate-x-1 transition-all" />
                  </motion.button>
               ))}
            </div>

            <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 text-center">
               <p className="text-[9px] text-muted font-mono uppercase tracking-widest font-black opacity-40 italic">
                  Tip: Most actions can be automated via AI receipt scanning
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Subcomponent for Penshop etc if needed
const PenTool = (props) => (
   <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 19 7-7 3 3-7 7-3-3Z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z" /><path d="m2 2 5 2" /><path d="m5 5 2 5" /><path d="m2 2 5 5" />
   </svg>
)

export default QuickAddModal
