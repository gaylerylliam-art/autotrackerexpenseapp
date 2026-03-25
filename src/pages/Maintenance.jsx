import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenTool, Calendar, AlertCircle, CheckCircle2, Shield, Battery, TrendingUp, History, Info, MapPin } from 'lucide-react'

const initialReminders = [
  { id: 1, type: 'Service', status: 'overdue', title: 'Engine Oil Change', detail: '850 km overdue', last: '86,370 km', interval: '5,000 km', cost: 'AED 450' },
  { id: 2, type: 'Insurance', status: 'due_soon', title: 'Insurance Renewal', detail: '18 days remaining', estimate: 'AED 3,200', date: 'Apr 12' },
  { id: 3, type: 'Tyre', status: 'upcoming', title: 'Tyre Rotation', detail: 'In 1,200 km', date: 'May 2026' },
  { id: 4, type: 'Registration', status: 'upcoming', title: 'Mulkiya Renewal', detail: '45 days remaining', estimate: 'AED 370', date: 'May 10' },
  { id: 5, type: 'Brake', status: 'completed', title: 'Brake Pad Replacement', detail: 'Done at 82,100 km', date: 'Feb 15, 2026', cost: 'AED 850' },
]

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState('All')

  const tabs = ['All', 'Overdue', 'Due Soon', 'Upcoming', 'Completed']

  const filtered = activeTab === 'All' 
    ? initialReminders 
    : initialReminders.filter(r => r.status.replace('_', ' ') === activeTab.toLowerCase())

  const getStatusConfig = (status) => {
    switch(status) {
      case 'overdue': return { border: 'border-accent4/30', bg: 'bg-accent4/[0.03]', text: 'text-accent4', icon: AlertCircle, color: 'text-accent4' }
      case 'due_soon': return { border: 'border-accent3/20', bg: 'bg-accent3/[0.03]', text: 'text-accent3', icon: History, color: 'text-accent3' }
      case 'upcoming': return { border: 'border-white/5', bg: 'bg-surface/50', text: 'text-muted', icon: Calendar, color: 'text-accent' }
      case 'completed': return { border: 'border-accent2/20', bg: 'bg-accent2/[0.03]', text: 'text-accent2', icon: CheckCircle2, color: 'text-accent2' }
      default: return { border: 'border-white/5', bg: 'bg-surface', text: 'text-muted', icon: Info, color: 'text-muted' }
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-muted font-mono text-[11px] uppercase tracking-widest">Preventative Care</span>
        <h2 className="text-3xl font-display font-extrabold tracking-tightest">Service <span className="gradient-text">Planner</span></h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface2 rounded-xl border border-white/5 w-fit overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-4 py-2 rounded-lg font-display font-bold text-sm transition-all whitespace-nowrap
              ${activeTab === tab ? 'bg-accent/15 text-accent shadow-inner' : 'text-muted hover:text-text'}
            `}
          >
            {tab}
            {(tab === 'Overdue' && initialReminders.some(r => r.status === 'overdue')) && (
               <span className="ml-2 w-2 h-2 rounded-full bg-accent4 inline-block shadow-[0_0_8px_rgba(255,107,107,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-12 pb-12">
        {/* Urgent Section */}
        {activeTab === 'All' && initialReminders.some(r => r.status === 'overdue') && (
           <div className="space-y-4">
             <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent4">Action Required</h4>
             {initialReminders.filter(r => r.status === 'overdue').map(r => {
               const config = getStatusConfig(r.status)
               return (
                 <div key={r.id} className={`glass p-6 rounded-3xl border-2 ${config.border} ${config.bg} relative overflow-hidden group`}>
                   <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent4/10 rounded-full blur-3xl" />
                   <div className="flex items-start justify-between relative z-10">
                     <div className="space-y-4 flex-1">
                       <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-xl bg-accent4/10 border border-accent4/20`}>
                           <AlertCircle className="w-6 h-6 text-accent4" />
                         </div>
                         <div className="space-y-0.5">
                           <h5 className="font-display font-extrabold text-lg tracking-tightest leading-none">{r.title}</h5>
                           <span className="text-accent4 font-mono text-[11px] uppercase tracking-widest font-bold">{r.detail}</span>
                         </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4 p-4 bg-bg/40 rounded-2xl border border-white/5">
                         <div>
                           <span className="text-muted text-[10px] font-mono uppercase tracking-widest">Last Service</span>
                           <p className="font-display font-bold text-sm text-text mt-0.5">{r.last}</p>
                         </div>
                         <div>
                           <span className="text-muted text-[10px] font-mono uppercase tracking-widest">Interval</span>
                           <p className="font-display font-bold text-sm text-text mt-0.5">{r.interval}</p>
                         </div>
                       </div>
                       <div className="flex gap-2">
                         <button className="flex-1 px-4 py-3 bg-accent4 text-white rounded-xl font-display font-bold text-xs uppercase tracking-widest active:scale-95 transition-all shadow-[0_4px_12px_rgba(255,107,107,0.4)]">
                           Schedule Now
                         </button>
                         <button className="px-4 py-3 glass rounded-xl text-muted text-xs hover:text-text transition-colors">
                           Ignore
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               )
             })}
           </div>
        )}

        {/* Regular Sections */}
        {['Due Soon', 'Upcoming', 'Completed'].filter(s => activeTab === 'All' || activeTab === s).map(section => {
          const items = initialReminders.filter(r => r.status === section.toLowerCase().replace(' ', '_'))
          if (items.length === 0) return null
          
          return (
            <div key={section} className="space-y-4 font-body">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted">{section}</h4>
              <div className="grid gap-3">
                {items.map(r => {
                  const config = getStatusConfig(r.status)
                  return (
                    <div key={r.id} className={`glass p-4 rounded-2xl border ${config.border} flex items-center justify-between card-hover group cursor-pointer`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-surface2 flex items-center justify-center border border-white/5 transition-colors group-hover:bg-surface3`}>
                           <config.icon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-display font-extrabold text-sm tracking-tightest group-hover:text-accent transition-colors">{r.title}</h5>
                          <p className="text-[10px] text-muted font-mono uppercase tracking-widest leading-none">
                            {r.detail} • <span className="text-text/60 italic">{r.date}</span>
                          </p>
                        </div>
                      </div>
                      {r.cost && (
                        <div className="px-3 py-1.5 rounded-lg bg-surface2 border border-white/5 text-[11px] font-display font-black text-white/80 tracking-tighter shadow-sm">
                          {r.cost}
                        </div>
                      )}
                      {!r.cost && r.estimate && (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-accent text-[9px] font-mono uppercase tracking-widest font-bold">Estimate</span>
                          <span className="text-text text-[11px] font-display font-black tracking-tightest">{r.estimate}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom spacing for safety */}
      <div className="h-4" />
    </div>
  )
}

export default Maintenance
