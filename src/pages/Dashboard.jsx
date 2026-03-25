import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, TrendingUp, Compass, Calendar, AlertCircle, ArrowUpRight, Plus, Scan, Sparkles, Bell, Folder, Receipt, BarChart2 as BarChart } from 'lucide-react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
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

const quickActions = [
  { name: 'Add Expense', icon: Plus, color: 'text-accent' },
  { name: 'View Reports', icon: BarChart, color: 'text-accent2' },
  { name: 'Reminders', icon: Bell, color: 'text-accent3' },
  { name: 'Document Vault', icon: Folder, color: 'text-accent4' },
]

const Dashboard = () => {
  const [activeVehicle, setActiveVehicle] = useState(vehicles[0])
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-display font-black tracking-tightest">
            Good morning, <span className="text-text">Tarik Niche</span> 👋
          </h2>
          <span className="text-muted font-mono text-[10px] uppercase tracking-widest font-bold">Friday, March 20, 2026</span>
        </div>
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center border border-white/10 text-muted hover:text-text hover:bg-white/5 transition-all">
           <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* By Category Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-lg tracking-tightest">By Category</h3>
          <span className="text-[10px] text-muted font-mono uppercase tracking-widest font-bold">AED · this month</span>
        </div>
        <div className="space-y-5 glass p-6 rounded-[32px] border border-white/5 bg-white/[0.02]">
           {categories.map((cat, i) => (
             <div key={i} className="flex items-center gap-4 group">
                <div className="w-8 flex flex-col items-center gap-1">
                   <span className="text-lg leading-none">{cat.icon}</span>
                   <span className="text-[8px] text-muted font-mono uppercase tracking-tighter whitespace-nowrap">{cat.name}</span>
                </div>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden relative">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${cat.progress}%` }}
                     transition={{ duration: 1, delay: i * 0.1 }}
                     style={{ backgroundColor: cat.color }}
                     className="h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                   />
                </div>
                <div className="w-12 text-right">
                   <span className="font-display font-black text-sm tracking-tightest">{cat.value}</span>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h3 className="font-display font-black text-lg tracking-tightest px-1">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, i) => (
            <button key={i} className="glass p-8 rounded-[32px] border border-white/5 bg-white/[0.01] flex flex-col items-center gap-4 card-hover group active:scale-95 transition-all outline-none border-b-2 border-b-transparent hover:border-b-accent/40">
               <div className={cn("p-4 rounded-2xl bg-surface transition-all group-hover:scale-110", action.color)}>
                  <action.icon className="w-6 h-6" />
               </div>
               <span className="font-display font-black text-xs tracking-tightest uppercase text-muted group-hover:text-text transition-colors">{action.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Receipt Banner - Refined */}
      <div 
        onClick={() => setIsScannerOpen(true)}
        className="glass rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-500/10 via-bg to-bg p-8 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
      >
        <div className="absolute top-0 right-0 p-8 text-accent/20 group-hover:text-accent/40 transition-colors">
           <ArrowUpRight className="w-12 h-12" />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
           <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-2xl">
              <div className="relative">
                <Receipt className="w-8 h-8" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent2 rounded-full border-2 border-bg" />
              </div>
           </div>
           
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <h4 className="font-display font-black text-xl tracking-tightest">Upload Receipt</h4>
                 <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[8px] font-mono font-black uppercase tracking-widest border border-indigo-500/20 flex items-center gap-1">
                    <Sparkles className="w-2 h-2" />
                    AI OCR
                 </span>
              </div>
              <p className="text-muted text-[11px] leading-relaxed max-w-[220px]">
                Auto-extract supplier, amount, date & VAT from any receipt
              </p>
           </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
           <div className="flex gap-4">
              {[
                { label: 'WhatsApp', dot: 'bg-green-500' },
                { label: 'Camera', dot: 'bg-orange-400' },
                { label: 'Files / PDF', dot: 'bg-yellow-400' },
              ].map((pill, i) => (
                <div key={i} className="flex items-center gap-2">
                   <div className={cn("w-1.5 h-1.5 rounded-full", pill.dot)} />
                   <span className="text-[10px] text-muted font-mono uppercase tracking-widest font-black">{pill.label}</span>
                </div>
              ))}
           </div>
           <span className="text-[9px] text-accent/60 font-mono font-black tracking-widest uppercase">JPG · PNG · PDF</span>
        </div>
      </div>

      <Scanner isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
    </div>
  )
}

const BarChart2 = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

export default Dashboard
