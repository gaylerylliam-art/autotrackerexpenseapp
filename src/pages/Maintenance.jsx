import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenTool, Calendar, AlertCircle, CheckCircle2, Shield, Battery, TrendingUp, History, Info, MapPin, Sparkles, Building2, ChevronRight, Bookmark } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'

const initialReminders = [
  { id: 1, type: 'Service', status: 'overdue', title: 'Engine Oil Change', detail: '850 km overdue', last: '86,370 km', interval: '5,000 km', cost: 'AED 450' },
  { id: 2, type: 'Insurance', status: 'due_soon', title: 'Insurance Renewal', detail: '18 days remaining', estimate: 'AED 3,200', date: 'Apr 12' },
  { id: 3, type: 'Tyre', status: 'upcoming', title: 'Tyre Rotation', detail: 'In 1,200 km', date: 'May 2026' },
  { id: 4, type: 'Registration', status: 'upcoming', title: 'Mulkiya Renewal', detail: '45 days remaining', estimate: 'AED 370', date: 'May 10' },
  { id: 5, type: 'Brake', status: 'completed', title: 'Brake Pad Replacement', detail: 'Done at 82,100 km', date: 'Feb 15, 2026', actual_cost: 850, estimated_cost: 720 },
]

const costHistory = [
  { name: 'Major Svc', actual: 1200, estimated: 1400 },
  { name: 'Brakes', actual: 850, estimated: 720 },
  { name: 'Oil & Filter', actual: 450, estimated: 500 },
  { name: 'AC Recharge', actual: 200, estimated: 250 },
]

const providers = [
  { name: 'Al Futtaim', services: 12, rating: 4.8, type: 'Main Dealer' },
  { name: 'Dynatrade', services: 4, rating: 4.5, type: 'Independent' },
  { name: 'Orange Auto', services: 2, rating: 4.2, type: 'Quick Service' },
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-muted font-mono text-[11px] uppercase tracking-widest leading-none">Preventative Care</span>
          <h2 className="text-3xl font-display font-black tracking-tightest leading-tight">Service <span className="gradient-text">Planner</span></h2>
        </div>
        <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-accent shadow-lg shadow-accent/10">
           <Bookmark className="w-5 h-5" />
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-6 rounded-[36px] border border-accent/20 bg-gradient-to-br from-accent/10 to-transparent relative overflow-hidden group shadow-[0_12px_40px_rgba(108,99,255,0.15)]"
      >
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
             <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
             <p className="text-[9px] text-accent font-mono font-black uppercase tracking-widest leading-none">AutoTracker Intelligence</p>
             <h4 className="font-display font-black text-sm text-text leading-tight group-hover:text-accent transition-colors">You usually service at Al Futtaim Auto Centre</h4>
             <p className="text-[10px] text-muted font-black tracking-tight leading-tight italic">Recommended based on 12 past visits since July 2025.</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16 blur-3xl" />
      </motion.div>

      {/* Primary Booking CTA */}
      <div className="flex gap-3">
         <button className="flex-1 px-6 py-4 rounded-3xl bg-accent text-white font-display font-black text-xs uppercase tracking-widest shadow-[0_15px_30px_rgba(108,99,255,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group">
            <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Book Service
         </button>
         <button className="px-6 py-4 rounded-3xl glass border border-white/10 text-text font-display font-black text-xs uppercase tracking-widest hover:bg-white/5 shadow-sm">
            Providers
         </button>
      </div>

      {/* Cost History Summary */}
      <div className="glass p-8 rounded-[40px] border border-white/5 space-y-6">
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h3 className="font-display font-black text-lg tracking-tightest leading-none text-text">Cost Estimation History</h3>
               <p className="text-[10px] text-muted font-mono font-black uppercase tracking-widest opacity-40 italic underline decoration-accent/20">Actual Spend vs Initial Quote</p>
            </div>
            <TrendingUp className="w-5 h-5 text-accent opacity-50" />
         </div>
         
         <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={costHistory}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.02)'}}
                    contentStyle={{ borderRadius: '20px', backgroundColor: '#0A0A0B', border: '1px solid #1A1A1E' }}
                  />
                  <Bar dataKey="estimated" fill="rgba(108, 99, 255, 0.2)" radius={[8, 8, 8, 8]} barSize={12} />
                  <Bar dataKey="actual" fill="#6C63FF" radius={[8, 8, 8, 8]} barSize={12} />
               </BarChart>
            </ResponsiveContainer>
         </div>
         
         <div className="flex gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-accent/20" />
               <span className="text-[9px] font-mono text-muted uppercase tracking-widest font-black leading-none">Estimate</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-accent" />
               <span className="text-[9px] font-mono text-text uppercase tracking-widest font-black leading-none">Actual</span>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-surface2/50 backdrop-blur-md rounded-2xl border border-white/5 w-fit overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-6 py-2.5 rounded-xl font-display font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap
              ${activeTab === tab ? 'bg-accent text-white shadow-[0_4px_12px_rgba(108,99,255,0.3)]' : 'text-muted hover:text-text'}
            `}
          >
            {tab}
            {(tab === 'Overdue' && initialReminders.some(r => r.status === 'overdue')) && (
               <span className="ml-2 w-2 h-2 rounded-full bg-accent4 inline-block shadow-[0_0_8px_rgba(255,107,107,0.5)]" />
            )}
          </button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8">
        {/* Urgent Section */}
        {activeTab === 'All' && initialReminders.some(r => r.status === 'overdue') && (
           <div className="space-y-4">
             <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent4 font-black">Mandatory Attention</h4>
             {initialReminders.filter(r => r.status === 'overdue').map(r => {
               const config = getStatusConfig(r.status)
               return (
                 <div key={r.id} className={`glass p-6 rounded-[36px] border ${config.border} border-2 ${config.bg} relative overflow-hidden group`}>
                   <div className="flex items-start justify-between relative z-10">
                     <div className="space-y-4 flex-1">
                       <div className="flex items-center gap-4">
                         <div className={`p-4 rounded-2xl bg-accent4/10 border border-accent4/20 text-accent4 shadow-inner`}>
                           <AlertCircle className="w-7 h-7" />
                         </div>
                         <div className="space-y-0.5">
                           <h5 className="font-display font-black text-xl tracking-tightest leading-none">{r.title}</h5>
                           <span className="text-accent4 font-mono text-[11px] uppercase tracking-widest font-black">{r.detail}</span>
                         </div>
                       </div>
                       
                       <div className="flex gap-2">
                         <button className="flex-1 px-4 py-4 bg-accent4 text-white rounded-2xl font-display font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-[0_8px_20px_rgba(255,107,107,0.4)] hover:brightness-110">
                           Optimize Svc
                         </button>
                         <button className="px-6 py-4 glass rounded-2xl text-muted text-xs hover:text-text transition-colors border border-white/5">
                           Details
                         </button>
                       </div>
                     </div>
                   </div>
                   <div className="absolute right-0 bottom-0 opacity-10 -mr-6 -mb-6 group-hover:scale-125 transition-transform duration-700">
                      <History className="w-24 h-24 text-accent4" />
                   </div>
                 </div>
               )
             })}
           </div>
        )}

        {/* Top Provider Tracking */}
        <div className="space-y-4">
           <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted font-black px-1">Top Providers Frequency</h4>
           <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {providers.map((provider) => (
                <div key={provider.name} className="glass p-5 rounded-[32px] border border-white/5 bg-white/[0.02] min-w-[160px] space-y-3 hover:bg-white/[0.05] transition-all cursor-pointer group">
                   <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform shadow-inner">
                      <Building2 className="w-5 h-5" />
                   </div>
                   <div className="space-y-0.5">
                      <p className="font-display font-black text-xs text-text">{provider.name}</p>
                      <p className="text-[9px] text-muted font-mono uppercase tracking-widest font-black">{provider.services} Visits</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Regular Sections */}
        {['Due Soon', 'Upcoming', 'Completed'].filter(s => activeTab === 'All' || activeTab === s).map(section => {
          const items = initialReminders.filter(r => r.status === section.toLowerCase().replace(' ', '_'))
          if (items.length === 0) return null
          
          return (
            <div key={section} className="space-y-4">
              <h4 className="font-mono text-[10px] uppercase tracking-widest text-muted font-black px-1 italic opacity-60 underline decoration-white/5">{section} Transactions</h4>
              <div className="grid gap-4">
                {items.map(r => {
                  const config = getStatusConfig(r.status)
                  return (
                    <div key={r.id} className={`glass p-5 rounded-[32px] border ${config.border} flex items-center justify-between card-hover group cursor-pointer active:scale-[0.99]`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-surface2 flex items-center justify-center border border-white/5 transition-all group-hover:bg-accent group-hover:text-white`}>
                           <config.icon className={`w-6 h-6 ${activeTab === r.status ? 'text-white' : config.color} group-hover:text-white transition-colors`} />
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-display font-black text-sm tracking-tightest group-hover:text-text transition-colors">{r.title}</h5>
                          <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] leading-none font-black flex items-center gap-2">
                             {r.detail} 
                             <span className="opacity-40">•</span>
                             <span className="text-accent italic">{r.date || 'TBD'}</span>
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted opacity-40 group-hover:translate-x-1 group-hover:text-accent transition-all" />
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div className="h-4" />
    </div>
  )
}

export default Maintenance
