import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Fuel, PenTool, Shield, Compass, Wallet, Plus, Filter, MapPin, Receipt, XCircle, TrendingUp } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const initialExpenses = [
  { id: 1, date: 'TODAY', category: 'Fuel', merchant: 'ADNOC — Al Quoz', detail: '87,420 km · Petrol 95', amount: '-AED 180', icon: '⛽', color: 'bg-red-500/10 text-red-500' },
  { id: 2, date: 'YESTERDAY', category: 'Maintenance', merchant: 'Al Futtaim Auto Centre', detail: 'Maintenance · 87,350 km', amount: '-AED 450', icon: '🔧', color: 'bg-blue-600/10 text-blue-400' },
  { id: 3, date: 'YESTERDAY', category: 'Toll', merchant: 'Salik Gate — Al Garhoud', detail: 'Toll · Auto-charged', amount: '-AED 16', icon: '🛣️', color: 'bg-teal-500/10 text-teal-400' },
  { id: 4, date: 'MARCH 18', category: 'Wash', merchant: 'German Express Car Wash', detail: 'Car Wash · JBR', amount: '-AED 60', icon: '🧼', color: 'bg-purple-500/10 text-purple-400' },
  { id: 5, date: 'MARCH 18', category: 'Fine', merchant: 'RTA Fine', detail: 'Fine · Speeding 121 km/h', amount: '-AED 600', icon: '⚠️', color: 'bg-orange-500/10 text-orange-400' },
  { id: 6, date: 'MARCH 15', category: 'Maintenance', merchant: 'Michelin Tyre Replacement', detail: 'Tyres · Emirates Road Tyre', amount: '-AED 1,200', icon: '⚙️', color: 'bg-yellow-500/10 text-yellow-400' },
]

const categories = [
  { name: 'All', icon: Filter },
  { name: 'Fuel', icon: Fuel },
  { name: 'Maintenance', icon: PenTool },
  { name: 'Insurance', icon: Shield },
  { name: 'Toll', icon: Compass },
]

const Expenses = () => {
  const [activeTab, setActiveTab] = useState('All')

  const filteredExpenses = activeTab === 'All' 
    ? initialExpenses 
    : initialExpenses.filter(e => e.category === activeTab)

  const grouped = filteredExpenses.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = []
    acc[curr.date].push(curr)
    return acc
  }, {})

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header Summary Card */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h2 className="text-2xl font-display font-black tracking-tightest">Expenses</h2>
              <p className="text-[10px] text-muted font-mono font-black uppercase tracking-widest">All vehicles · March 2026</p>
           </div>
           <button className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-muted hover:text-text active:scale-95 transition-all">
              <Plus className="w-5 h-5" />
           </button>
        </div>

        <div className="glass rounded-[32px] border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent p-6 flex items-center justify-between">
           <div className="space-y-2">
              <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60">Total Spent</span>
              <div className="flex flex-col gap-1">
                <h3 className="text-4xl font-display font-black tracking-tightest">AED 2.8k</h3>
                <span className="text-[10px] text-accent2 font-mono font-black uppercase tracking-widest flex items-center gap-1">
                   <TrendingUp className="w-3 h-3" />
                   12% vs last month
                </span>
              </div>
           </div>
           <div className="text-right space-y-2">
              <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60">Transactions</span>
              <div className="flex flex-col gap-1 items-end">
                <h3 className="text-4xl font-display font-black tracking-tightest">24</h3>
                <span className="text-[10px] text-muted font-mono font-black uppercase tracking-widest opacity-40">this month</span>
              </div>
           </div>
        </div>

        {/* Filter Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4">
           {categories.map((cat) => (
             <button
               key={cat.name}
               onClick={() => setActiveTab(cat.name)}
               className={`
                 flex items-center gap-2 px-6 py-3 rounded-full font-display font-black text-xs uppercase tracking-widest transition-all border
                 ${activeTab === cat.name 
                   ? 'bg-accent text-white border-accent shadow-xl shadow-accent/20' 
                   : 'glass border-white/5 text-muted hover:text-text'}
               `}
             >
               {cat.name === 'All' ? <cat.icon className="w-3 h-3" /> : (
                 <span className="text-base leading-none">
                    {cat.name === 'Fuel' ? '⛽' : cat.name === 'Maintenance' ? '🔧' : cat.name === 'Insurance' ? '🛡️' : '🛣️'}
                 </span>
               )}
               {cat.name}
             </button>
           ))}
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="space-y-10">
         {Object.entries(grouped).map(([date, items]) => (
           <div key={date} className="space-y-4">
              <h4 className="text-[10px] text-muted font-mono font-black uppercase tracking-[0.2em] px-1">{date}</h4>
              <div className="space-y-3">
                 {items.map((item, i) => (
                   <motion.div
                     key={item.id}
                     whileHover={{ x: 4 }}
                     className="glass p-4 rounded-[24px] border border-white/5 flex items-center justify-between card-hover group cursor-pointer active:scale-[0.98] transition-all"
                   >
                      <div className="flex items-center gap-4">
                         <div className={cn("w-12 h-12 rounded-[18px] flex items-center justify-center text-xl shadow-inner border border-white/5", item.color)}>
                            {item.icon}
                         </div>
                         <div className="space-y-1">
                            <h5 className="font-display font-black text-[13px] tracking-tight group-hover:text-text transition-colors">{item.merchant}</h5>
                            <p className="text-[9px] text-muted font-mono font-black uppercase tracking-widest italic opacity-60 underline decoration-accent/20">{item.detail}</p>
                         </div>
                      </div>
                      <span className="font-display font-black text-[15px] tracking-tightest group-hover:scale-105 transition-transform text-accent4">
                         {item.amount}
                      </span>
                   </motion.div>
                 ))}
              </div>
           </div>
         ))}
      </div>
    </div>
  )
}

export default Expenses
