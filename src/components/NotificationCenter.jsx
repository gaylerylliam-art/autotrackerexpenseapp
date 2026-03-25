import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, CreditCard, PenTool, TrendingUp, X, Check, Clock, ChevronRight, AlertCircle, Sparkles } from 'lucide-react'

const notifications = [
  {
    id: 1,
    type: 'TOLL',
    title: 'New Salik Charge',
    message: 'AED 4.00 deducted at Al Safa Gate (BMW X5)',
    time: '2m ago',
    icon: CreditCard,
    color: 'text-accent4',
    bg: 'bg-accent4/10',
    unread: true
  },
  {
    id: 2,
    type: 'MAINTENANCE',
    title: 'Service Approaching',
    message: 'Tesla Model 3 scheduled maintenance in 48h',
    time: '1h ago',
    icon: PenTool,
    color: 'text-accent2',
    bg: 'bg-accent2/10',
    unread: true
  },
  {
    id: 3,
    type: 'SPENDING',
    title: 'High Burn Alert',
    message: 'Fuel expenditure is 22% higher than last week',
    time: '4h ago',
    icon: TrendingUp,
    color: 'text-accent3',
    bg: 'bg-accent3/10',
    unread: false
  }
]

const NotificationCenter = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-end sm:pt-20 sm:pr-8 pointer-events-none">
          {/* Backdrop (mobile only maybe, or subtle) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto sm:bg-transparent sm:backdrop-blur-none"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20, x: 20 }}
            className="relative w-full max-w-sm glass border border-white/10 rounded-[32px] shadow-[0_32px_128px_rgba(0,0,0,0.4)] overflow-hidden pointer-events-auto m-4 sm:m-0"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                     <Bell className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-black text-lg tracking-tightest leading-none">Notifications</h3>
               </div>
               <button 
                 onClick={onClose}
                 className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-muted transition-colors"
               >
                  <X className="w-4 h-4" />
               </button>
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
               {notifications.length === 0 ? (
                 <div className="py-20 flex flex-col items-center justify-center text-muted gap-4 text-center px-8">
                    <Sparkles className="w-12 h-12 opacity-20" />
                    <p className="font-display font-black text-sm uppercase tracking-widest leading-none">Zen State Achieved</p>
                    <p className="text-[10px] font-mono opacity-40 italic">No pending alerts. Your fleet is operating within optimal parameters.</p>
                 </div>
               ) : (
                 <div className="space-y-1">
                   {notifications.map((n) => (
                     <button
                       key={n.id}
                       className={`w-full text-left p-4 rounded-2xl transition-all duration-300 group relative
                         ${n.unread ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02] opacity-60'}
                       `}
                     >
                        <div className="flex gap-4">
                           <div className={`w-10 h-10 shrink-0 rounded-xl ${n.bg} flex items-center justify-center ${n.color}`}>
                              <n.icon className="w-5 h-5" />
                           </div>
                           <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-start mr-2">
                                 <p className="font-display font-black text-sm tracking-tightest text-text leading-tight">{n.title}</p>
                                 <span className="text-[9px] font-mono text-muted uppercase font-black">{n.time}</span>
                              </div>
                              <p className="text-[11px] text-muted leading-relaxed pr-6">{n.message}</p>
                           </div>
                        </div>
                        {n.unread && (
                          <div className="absolute top-1/2 -translate-y-1/2 right-4">
                             <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(108,99,255,0.8)]" />
                          </div>
                        )}
                        <ChevronRight className="absolute bottom-4 right-4 w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                     </button>
                   ))}
                 </div>
               )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-black/20 flex items-center justify-between">
               <button className="text-[9px] font-mono font-black text-muted uppercase tracking-widest hover:text-accent transition-colors flex items-center gap-2 px-2">
                  <Check className="w-3 h-3" />
                  Mark all as read
               </button>
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                  <AlertCircle className="w-3 h-3 text-accent" />
                  <span className="text-[9px] font-mono font-black text-accent uppercase tracking-tighter">AI Analysis Active</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default NotificationCenter
