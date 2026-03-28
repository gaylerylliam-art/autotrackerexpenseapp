import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Check, AlertCircle, Calendar, ShieldCheck, X } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const NotificationDropdown = ({ isOpen, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 z-[70] overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">
                      {unreadCount} NEW
                    </span>
                  )}
               </div>
               <button 
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
               >
                 Mark all as read
               </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
               {notifications.length === 0 ? (
                 <div className="p-12 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-4">
                       <Bell className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-slate-400 font-medium">No notifications yet</p>
                 </div>
               ) : (
                 <div className="divide-y divide-slate-50">
                   {notifications.map((n) => (
                     <div 
                      key={n.id} 
                      className={cn(
                        "p-5 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer relative group",
                        !n.read && "bg-blue-50/30"
                      )}
                      onClick={() => markAsRead(n.id)}
                     >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                          n.type === 'Alert' ? "bg-red-50 text-red-500" : 
                          n.type === 'Reminder' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                        )}>
                           {n.type === 'Alert' ? <AlertCircle className="w-5 h-5" /> : 
                            n.type === 'Reminder' ? <Calendar className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                        </div>
                        <div className="space-y-1">
                           <div className="flex items-center justify-between">
                              <p className="text-sm font-bold text-slate-900">{n.title}</p>
                              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                           </div>
                           <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{n.message}</p>
                        </div>
                        {!n.read && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                     </div>
                   ))}
                 </div>
               )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
               <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors">
                  View All Notifications
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default NotificationDropdown
