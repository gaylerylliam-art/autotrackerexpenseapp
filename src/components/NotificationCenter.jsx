import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, CreditCard, PenTool, TrendingUp, X, Check, Clock, 
  ChevronRight, AlertCircle, Sparkles, Filter, MoreHorizontal,
  Fuel, Shield, Hammer, MapPin, Receipt
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const notifications = [
  {
    id: 1,
    category: 'TOLL',
    title: 'New Salik Charge',
    message: 'AED 4.00 deducted at Al Safa Gate (BMW X5)',
    time: '2m ago',
    icon: CreditCard,
    priority: 'low',
    unread: true
  },
  {
    id: 2,
    category: 'MAINTENANCE',
    title: 'Service Approaching',
    message: 'Tesla Model 3 scheduled maintenance in 48h',
    time: '1h ago',
    icon: PenTool,
    priority: 'high',
    unread: true
  },
  {
    id: 3,
    category: 'SPENDING',
    title: 'High Burn Alert',
    message: 'Fuel expenditure is 22% higher than last week',
    time: '4h ago',
    icon: TrendingUp,
    priority: 'medium',
    unread: false
  },
  {
    id: 4,
    category: 'ALERTS',
    title: 'Battery Low',
    message: 'BMW X5 battery voltage dropped below 11.8V',
    time: '6h ago',
    icon: AlertCircle,
    priority: 'high',
    unread: true
  }
]

const NotificationCenter = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1000] cursor-pointer"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
               "fixed right-0 top-0 bottom-0 z-[1001] w-full sm:w-[400px] h-full shadow-2xl flex flex-col",
               "bg-[#0D111C] border-l border-white/10"
            )}
          >
            {/* Header */}
            <div className="p-8 pb-6 flex items-center justify-between border-b border-white/5">
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <Bell className="w-5 h-5 text-accent animate-swing origin-top" />
                     <h3 className="text-2xl font-display font-black tracking-tighter text-white">Notifications</h3>
                  </div>
                  <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] font-black opacity-60">System Alerts & Updates</p>
               </div>
               <button 
                 onClick={onClose}
                 className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-muted hover:text-text transition-all scale-hover"
               >
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Filter Chips */}
            <div className="px-8 py-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5 bg-white/[0.01]">
               {['All', 'Alerts', 'Tolls', 'Fleet', 'Tax'].map((f, i) => (
                  <button 
                     key={f}
                     className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                        i === 0 ? "bg-accent/20 border-accent/40 text-accent" : "glass border-white/5 text-muted hover:border-white/20"
                     )}
                  >
                     {f}
                  </button>
               ))}
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
               <AnimatePresence mode="popLayout">
                  {notifications.map((n, i) => (
                     <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                           "p-5 rounded-[24px] border border-white/5 transition-all group relative",
                           n.unread ? "bg-white/[0.03] border-accent/10" : "bg-transparent opacity-60 hover:opacity-100"
                        )}
                     >
                        <div className="flex gap-4">
                           <div className={cn(
                              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                              n.priority === 'high' ? "bg-red-500/10 text-red-400 group-hover:scale-110" : 
                              n.priority === 'medium' ? "bg-amber-500/10 text-amber-400" : "bg-accent/10 text-accent"
                           )}>
                              <n.icon className="w-6 h-6" />
                           </div>
                           <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-start">
                                 <h4 className="font-display font-black text-sm text-[#F5F7FB] tracking-tight">{n.title}</h4>
                                 <span className="text-[9px] font-mono text-muted uppercase font-black opacity-40">{n.time}</span>
                              </div>
                              <p className="text-[11px] text-[#A8B3CF] leading-relaxed pr-4 font-medium">{n.message}</p>
                              
                              <div className="flex items-center gap-3 pt-2">
                                 <span className={cn(
                                    "text-[8px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                    n.priority === 'high' ? "bg-red-500/20 text-red-300" : "bg-white/5 text-muted"
                                 )}>
                                    {n.category}
                                 </span>
                                 <button className="text-[9px] font-mono font-black text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    Action Required
                                 </button>
                              </div>
                           </div>
                        </div>
                        {n.unread && (
                           <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(108,99,255,0.8)]" />
                        )}
                     </motion.div>
                  ))}
               </AnimatePresence>

               {notifications.length === 0 && (
                  <div className="py-20 flex flex-col items-center justify-center text-muted gap-4 text-center px-12">
                     <Sparkles className="w-16 h-16 opacity-10" />
                     <h5 className="font-display font-black text-lg tracking-tighter uppercase">All Caught Up</h5>
                     <p className="text-xs font-mono opacity-40 italic">Your fleet is running like a fine-tuned engine. No alerts currently pending.</p>
                  </div>
               )}
            </div>

            {/* Footer Summary */}
            <div className="p-8 border-t border-white/5 bg-[#0A0D16]">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                     <Check className="w-4 h-4 text-accent" />
                     <button className="text-[10px] font-mono font-black text-muted uppercase tracking-widest hover:text-white transition-colors">
                        Mark all as read
                     </button>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-muted" />
               </div>

               <div className="glass p-4 rounded-[24px] border border-accent/20 bg-accent/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-[14px] bg-accent/20 flex items-center justify-center text-accent">
                        <Sparkles className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] font-display font-black text-white uppercase tracking-tight">AI Fleet Advisor</p>
                        <p className="text-[8px] font-mono text-muted uppercase font-black opacity-60">Insight: Fuel cost up 12% in DXB</p>
                     </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-accent" />
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationCenter
