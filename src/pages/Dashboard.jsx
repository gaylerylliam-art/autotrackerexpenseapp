import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Car, TrendingUp, Compass, Calendar, AlertCircle, 
  ArrowUpRight, Plus, Scan, Sparkles, Bell, Folder, 
  Receipt, BarChart2, Activity, Fuel, ChevronRight 
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Scanner from '../components/Scanner'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const data = [
  { name: 'Jan', total: 4200 },
  { name: 'Feb', total: 5100 },
  { name: 'Mar', total: 3800 },
  { name: 'Apr', total: 6200 },
  { name: 'May', total: 4800 },
  { name: 'Jun', total: 5400 },
]

const vehicles = [
  { id: 1, name: 'BMW X5', plate: 'P 12345', color: 'bg-accent' },
  { id: 2, name: 'Toyota LC', plate: 'K 67890', color: 'bg-accent2' },
]

const categories = [
  { name: 'Fuel', icon: '⛽', value: '1.2k', progress: 65, color: '#f7c948' },
  { name: 'Maintenance', icon: '🔧', value: '760', progress: 45, color: '#ff6b6b' },
  { name: 'Insurance', icon: '🛡️', value: '480', progress: 30, color: '#6c63ff' },
  { name: 'Toll', icon: '🛣️', value: '240', progress: 55, color: '#3ecf8e' },
  { name: 'Other', icon: '📦', value: '127', progress: 20, color: '#8890a8' },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const [activeVehicle, setActiveVehicle] = useState(vehicles[0])
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  useEffect(() => {
    const isComplete = localStorage.getItem('autotrack_setup_complete')
    if (!isComplete) {
       navigate('/onboarding')
    }
  }, [navigate])

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-display font-black tracking-tightest">
            Good morning, <span className="text-text">Tarik Niche</span> 👋
          </h2>
          <span className="text-muted font-mono text-[10px] uppercase tracking-widest font-bold">Friday, March 20, 2026</span>
        </div>
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/10 text-muted hover:text-text hover:bg-white/5 transition-all outline-none">
           <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Auto-Tracking Status Widget (NEW) */}
      <div className="grid grid-cols-2 gap-4">
         <div className="glass p-5 rounded-[28px] border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent2 shadow-[0_0_8px_rgba(62,207,142,0.6)] animate-pulse" />
                  <span className="text-[8px] text-muted font-mono uppercase tracking-widest font-black leading-none opacity-60">Toll Sync</span>
               </div>
               <Activity className="w-3 h-3 text-accent2" />
            </div>
            <div className="space-y-0.5">
               <p className="text-xs font-display font-black tracking-tightest text-text">Salik Synced</p>
               <p className="text-[8px] text-muted font-mono uppercase tracking-widest font-black opacity-40 leading-none">All gates verified</p>
            </div>
         </div>

         <div className="glass p-5 rounded-[28px] border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent3 shadow-[0_0_8px_rgba(247,201,72,0.6)]" />
                  <span className="text-[8px] text-muted font-mono uppercase tracking-widest font-black leading-none opacity-60">Fuel Scan</span>
               </div>
               <Fuel className="w-3 h-3 text-accent3" />
            </div>
            <div className="space-y-0.5">
               <p className="text-xs font-display font-black tracking-tightest text-text">Fuel Detected</p>
               <p className="text-[8px] text-muted font-mono uppercase tracking-widest font-black opacity-40 leading-none">Mar 19 · ADNOC</p>
            </div>
         </div>

         <div className="glass p-5 rounded-[28px] border border-accent4/20 bg-accent4/5 space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent4 shadow-[0_0_8px_rgba(255,107,107,0.6)]" />
                  <span className="text-[8px] text-accent4 font-mono uppercase tracking-widest font-black leading-none">Receipts</span>
               </div>
               <AlertCircle className="w-3 h-3 text-accent4" />
            </div>
            <div className="space-y-0.5">
               <p className="text-xs font-display font-black tracking-tightest text-text">Missing Receipts</p>
               <p className="text-[8px] text-accent4/60 font-mono uppercase tracking-widest font-black leading-none">3 Pending Actions</p>
            </div>
         </div>

         <div className="glass p-5 rounded-[28px] border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent space-y-4 relative overflow-hidden group">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(108,99,255,0.6)]" />
                  <span className="text-[8px] text-muted font-mono uppercase tracking-widest font-black leading-none opacity-60">Last Sync</span>
               </div>
               <TrendingUp className="w-3 h-3 text-accent" />
            </div>
            <div className="space-y-0.5">
               <p className="text-xs font-display font-black tracking-tightest text-text">Just Now</p>
               <p className="text-[8px] text-muted font-mono uppercase tracking-widest font-black opacity-40 leading-none">Automated Refreshed</p>
            </div>
         </div>
      </div>

      {/* AI Intelligence Insights (NEW: The "WHY") */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
           <Sparkles className="w-4 h-4 text-accent" />
           <h3 className="font-display font-black text-lg tracking-tightest">AI Intelligence</h3>
           <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent ml-2" />
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x">
          <div className="min-w-[280px] snap-center glass p-6 rounded-[32px] border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent space-y-4">
             <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[8px] font-mono font-black uppercase tracking-widest">Efficiency</span>
                <Fuel className="w-4 h-4 text-accent" />
             </div>
             <div className="space-y-1">
                <h4 className="font-display font-black text-base text-text">Fuel cost ↑ 18%</h4>
                <p className="text-[10px] text-muted leading-relaxed font-mono uppercase tracking-widest opacity-60">High speed highway driving patterns detected on E11 this week.</p>
             </div>
          </div>

          <div className="min-w-[280px] snap-center glass p-6 rounded-[32px] border border-accent2/20 bg-gradient-to-br from-accent2/5 to-transparent space-y-4">
             <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-accent2/20 text-accent2 text-[8px] font-mono font-black uppercase tracking-widest">Toll Usage</span>
                <TrendingUp className="w-4 h-4 text-accent2" />
             </div>
             <div className="space-y-1">
                <h4 className="font-display font-black text-base text-text">Tolls increased 22%</h4>
                <p className="text-[10px] text-muted leading-relaxed font-mono uppercase tracking-widest opacity-60">High Salik usage during peak hours. Potential AED 140/mo savings if optimized.</p>
             </div>
          </div>

          <div className="min-w-[280px] snap-center glass p-6 rounded-[32px] border border-accent3/20 bg-gradient-to-br from-accent3/5 to-transparent space-y-4">
             <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-accent3/20 text-accent3 text-[8px] font-mono font-black uppercase tracking-widest">Fleet ROI</span>
                <Compass className="w-4 h-4 text-accent3" />
             </div>
             <div className="space-y-1">
                <h4 className="font-display font-black text-base text-text">Vehicle Cost 2x</h4>
                <p className="text-[10px] text-muted leading-relaxed font-mono uppercase tracking-widest opacity-60">Toyota LC is costing 2.4x more per km than BMW X5. Check service logs.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Expense Chart */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="space-y-1">
            <h3 className="font-display font-black text-xl tracking-tightest">Expense Trend</h3>
            <p className="text-[9px] text-muted font-mono uppercase tracking-widest font-black opacity-40">Monthly Breakdown · AED</p>
          </div>
          <div className="flex gap-2">
             <button className="px-3 py-1 rounded-lg glass border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest text-muted hover:text-text active:scale-95 transition-all">6M</button>
             <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest text-text active:scale-95 transition-all">1Y</button>
          </div>
        </div>
        <div className="h-64 glass rounded-[32px] border border-white/5 bg-white/[0.01] p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8890a8', fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono' }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8890a8', fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono' }}
              />
              <Tooltip 
                cursor={{ fill: '#ffffff05' }}
                contentStyle={{ 
                  backgroundColor: '#13151c', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  fontFamily: 'Syne',
                  fontWeight: 800
                }}
              />
              <Bar dataKey="total" radius={[6, 6, 6, 6]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#6c63ff' : '#6c63ff20'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Progress Section */}
      <div className="space-y-6">
        <h3 className="font-display font-black text-lg tracking-tightest">Budget Insights</h3>
        <div className="space-y-5 glass p-6 rounded-[32px] border border-white/5 bg-white/[0.02]">
           {categories.map((cat, i) => (
             <div key={i} className="flex items-center gap-4 group">
                <div className="w-8 flex flex-col items-center gap-1">
                   <span className="text-lg leading-none">{cat.icon}</span>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted font-mono uppercase tracking-widest font-black">{cat.name}</span>
                    <span className="font-display font-black text-xs text-text">{cat.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${cat.progress}%` }}
                       transition={{ duration: 1, delay: i * 0.1 }}
                       style={{ backgroundColor: cat.color }}
                       className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                     />
                  </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Upload Receipt Banner */}
      <div 
        onClick={() => setIsScannerOpen(true)}
        className="glass rounded-[40px] border border-white/5 bg-gradient-to-br from-accent/20 via-surface to-surface p-10 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
      >
        <div className="absolute top-0 right-0 p-10 text-accent/10 group-hover:text-accent/20 transition-all duration-700 rotate-12 group-hover:rotate-0 group-hover:scale-125">
           <Receipt className="w-24 h-24" />
        </div>
        
        <div className="relative z-10 space-y-6">
           <div className="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/20">
              <Plus className="w-8 h-8" />
           </div>
           
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <h4 className="font-display font-black text-2xl tracking-tightest">Auto-Scan</h4>
                 <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-mono font-black uppercase tracking-widest">AI Enabled</span>
              </div>
              <p className="text-muted text-sm leading-relaxed max-w-[240px]">
                Snap a photo of your ADNOC or ENOC receipt to automatically log the expense.
              </p>
           </div>

           <div className="flex items-center gap-2 group-hover:gap-4 transition-all text-accent font-display font-black text-xs uppercase tracking-widest">
              <span>Start Scanning</span>
              <ChevronRight className="w-4 h-4" />
           </div>
        </div>
      </div>

      <Scanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  )
}

export default Dashboard
