import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line, AreaChart, Area } from 'recharts'
import { Download, FileText, TrendingUp, Compass, Calendar, Wallet, ArrowUpRight, ArrowDownRight, Fuel, Shield, PenTool, Compass as Toll, XCircle as Fine, MoreHorizontal, Sparkles } from 'lucide-react'
import { EXPENSE_CATEGORIES } from '../constants/expenseCategories'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const lineData = [
  { name: 'Jan', value: 6500 },
  { name: 'Feb', value: 7200 },
  { name: 'Mar', value: 8000 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 0 },
]

const categoryData = EXPENSE_CATEGORIES
  .filter(c => c.key !== 'Depreciation')
  .map((c, i) => ({
    name: c.label,
    value: [43, 27, 8, 9, 6, 7][i] ?? 5,
    color: c.chartColor,
  }))

const Reports = () => {
  const [period, setPeriod] = useState('Monthly')

  const stats = [
    { label: 'TOTAL SPENT', value: 'AED 18.2k', sub: 'YTD 2026' },
    { label: 'AVG / MONTH', value: 'AED 6.1k', sub: 'Jan-Mar 2026' },
    { label: 'COST PER KM', value: 'AED 0.94', sub: 'Total distance' },
    { label: 'DEPRECIATION', value: 'AED 3.3k', sub: 'Monthly est.' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-black tracking-tightest text-text truncate max-w-[200px]">Reports & Insights</h2>
          <p className="text-[10px] text-muted font-mono font-black uppercase tracking-widest">BMW X5 · All time</p>
        </div>
        <button className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-muted hover:text-text active:scale-95 transition-all">
           <Download className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4">
         {['Daily', 'Monthly', 'Quarterly', 'Yearly', 'Custom'].map((t) => (
           <button
             key={t}
             onClick={() => setPeriod(t)}
             className={cn(
               "px-6 py-2.5 rounded-full font-display font-black text-xs uppercase tracking-widest transition-all border shrink-0",
               period === t ? "bg-accent text-white border-accent shadow-xl shadow-accent/20" : "glass border-white/5 text-muted hover:text-text"
             )}
           >
             {t}
           </button>
         ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
         {stats.map((stat, i) => (
           <div key={i} className="glass p-5 rounded-[24px] border border-white/5 space-y-4 card-hover">
              <div className="space-y-1">
                 <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60 leading-none">{stat.label}</span>
                 <h3 className="text-xl font-display font-black tracking-tightest text-text leading-tight">{stat.value}</h3>
              </div>
              <p className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-40">{stat.sub}</p>
           </div>
         ))}
      </div>

      {/* Monthly Trend */}
      <div className="space-y-6">
         <h3 className="font-display font-black text-lg tracking-tightest px-1">Monthly Trend</h3>
         <div className="glass p-6 rounded-[32px] border border-white/5 h-[300px] w-full bg-white/[0.01]">
            <ResponsiveContainer width="100%" height="100%">
               <LineChart data={lineData}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8890a8', fontSize: 10, fontFamily: 'DM Mono' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#8890a8', fontSize: 10, fontFamily: 'DM Mono' }}
                    tickFormatter={(v) => `AED ${v/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#13151c', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    itemStyle={{ color: '#3ecf8e' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3ecf8e" 
                    strokeWidth={4} 
                    dot={{ fill: '#3ecf8e', stroke: '#13151c', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
               </LineChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Spend by Category */}
      <div className="space-y-6">
         <h3 className="font-display font-black text-lg tracking-tightest px-1">Spend by Category</h3>
         <div className="glass p-8 rounded-[32px] border border-white/5 flex flex-col items-center gap-8 bg-white/[0.01]">
            <div className="h-[200px] w-full relative">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={categoryData}
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1500}
                     >
                        {categoryData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-muted font-mono uppercase tracking-widest font-black opacity-60">Total</span>
                  <span className="text-xl font-display font-black tracking-tightest text-text">100%</span>
               </div>
            </div>
            
            <div className="grid grid-cols-1 w-full gap-4">
               {categoryData.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between group">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-[11px] text-muted font-mono uppercase tracking-widest font-black group-hover:text-text transition-colors">{cat.name}</span>
                     </div>
                     <span className="text-[11px] font-display font-black text-text">{cat.value}%</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* AI Insights Banner */}
      <div className="p-6 rounded-[32px] bg-gradient-to-br from-indigo-500/10 via-bg to-bg border border-white/5 flex items-center justify-between group cursor-pointer active:scale-95 transition-all">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
               <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-display font-black text-lg tracking-tightest">AI Insights</h4>
         </div>
         <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-text group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
      </div>
    </div>
  )
}

export default Reports
