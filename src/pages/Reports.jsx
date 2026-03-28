import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart as BarChartIcon, PieChart as PieChartIcon, TrendingUp, DollarSign, Activity, 
  ChevronRight, Download, Filter, FileText, Share2, 
  Lock, Sparkles, Navigation, Wallet, Coins, Briefcase,
  User, Calendar, Clock, Terminal, Radio, Eye, Database,
  Search, Plus, Map, Gauge, History, ArrowUpRight, TrendingDown
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, PieChart as RePieChart, Pie,
  LineChart, Line
} from 'recharts'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const ANALYTICS_DATA = [
  { month: 'Jan', business: 1200, personal: 400, cost: 3200 },
  { month: 'Feb', business: 1500, personal: 450, cost: 3800 },
  { month: 'Mar', business: 1800, personal: 300, cost: 4200 },
  { month: 'Apr', business: 2100, personal: 350, cost: 4100 },
  { month: 'May', business: 1900, personal: 400, cost: 3900 },
  { month: 'Jun', business: 2400, personal: 300, cost: 4500 },
]

const CATEGORY_BREAKDOWN = [
  { name: 'Business Usage', value: 72, color: '#2563eb' },
  { name: 'Personal Usage', value: 28, color: '#94a3b8' },
]

const Reports = () => {
  const [activeReport, setActiveReport] = useState('Mileage')
  const isPremium = true 

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
         <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Reports & Analytics</h1>
            <p className="text-slate-500 font-medium">Gain insights into your fleet's performance and costs.</p>
         </div>
         
         <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar scrollbar-hide">
            {['Mileage', 'Costs', 'Efficiency', 'Tax'].map(tab => (
               <button 
                  key={tab} 
                  onClick={() => setActiveReport(tab)}
                  className={cn(
                    "h-10 px-6 rounded-xl text-xs font-bold transition-all whitespace-nowrap", 
                    activeReport === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  )}
               >
                  {tab}
               </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Avg Cost Per Km', val: 'AED 0.14', sub: 'vs 0.16 prev. month', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Total Reimbursements', val: 'AED 4,280', sub: 'Pending approval', icon: Coins, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Fleet Depreciation', val: '2.4%', sub: 'Last 12 months', icon: TrendingDown, color: 'text-amber-600', bg: 'bg-amber-50' },
           { label: 'Tax Deductions', val: 'AED 1,120', sub: 'Estimated Q1', icon: Wallet, color: 'text-purple-600', bg: 'bg-purple-50' },
         ].map((stat, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
               className="premium-card p-6 flex flex-col justify-between group"
            >
               <div className="flex items-start justify-between">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                     <stat.icon className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">↑ 2.1%</span>
               </div>
               <div className="mt-6 space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tight">{stat.val}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">{stat.sub}</p>
               </div>
            </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 premium-card p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                  <h3 className="text-xl font-bold text-slate-900">Usage Analysis</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Business vs. Personal utilization over time</p>
               </div>
               <div className="flex items-center gap-2">
                  <button className="h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2 hover:bg-white transition-all">
                     <Download className="w-4 h-4" /> 
                     Export PDF
                  </button>
                  <button className="h-10 w-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all">
                     <Share2 className="w-4 h-4" />
                  </button>
               </div>
            </div>

            <div className="h-80 w-full pt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ANALYTICS_DATA}>
                     <defs>
                        <linearGradient id="colorBusiness" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} dy={10} />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px' }}
                      />
                     <Area type="monotone" dataKey="business" stroke="#2563eb" fillOpacity={1} fill="url(#colorBusiness)" strokeWidth={3} />
                     <Area type="monotone" dataKey="personal" stroke="#cbd5e1" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>

            <div className="flex gap-6 pt-6 border-t border-slate-100/60">
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Business</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Personal</span>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className="premium-card p-8 space-y-8">
               <h3 className="text-lg font-bold text-slate-900">Mileage Allocation</h3>
               <div className="h-48 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                     <RePieChart>
                        <Pie data={CATEGORY_BREAKDOWN} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                           {CATEGORY_BREAKDOWN.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                     </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-2xl font-bold text-slate-900 leading-none">72%</span>
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Business</span>
                  </div>
               </div>
               <div className="space-y-3">
                  {CATEGORY_BREAKDOWN.map((row, i) => (
                     <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                           <div className={cn("w-2.5 h-2.5 rounded-full", i === 0 ? "bg-primary" : "bg-slate-300")} />
                           <span className="text-xs font-bold text-slate-600">{row.name}</span>
                        </div>
                        <span className="text-xs font-black text-slate-900">{row.value}%</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="premium-card p-8 bg-gradient-to-br from-primary to-blue-700 text-white relative overflow-hidden group">
               <div className="absolute right-0 top-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <Sparkles className="w-24 h-24" />
               </div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                     </div>
                     <span className="text-sm font-bold tracking-tight">AI Insights</span>
                  </div>
                  <div className="space-y-4">
                     <p className="text-xs text-blue-100 font-medium leading-relaxed">
                        Switching to a newer hybrid asset in <span className="font-bold text-white">Zone B</span> could reduce fuel costs by <span className="font-bold text-white">14%</span> annually.
                     </p>
                     <button className="w-full h-11 bg-white text-primary rounded-xl text-xs font-bold hover:bg-blue-50 transition-all">
                        Full Efficiency Audit
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
      
      <div className="flex items-center justify-center py-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
         <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <Database className="w-4 h-4 text-primary" />
            Analytics Engine v2.4 · Data Updated 2m ago · 256-bit Encrypted
         </div>
      </div>
    </div>
  )
}

export default Reports

