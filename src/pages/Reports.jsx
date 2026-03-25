import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line, AreaChart, Area } from 'recharts'
import { Download, FileText, TrendingUp, Compass, Calendar, Wallet, ArrowUpRight, ArrowDownRight, Fuel, Shield, PenTool, Compass as Toll, XCircle as Fine, MoreHorizontal } from 'lucide-react'

const data = [
  { name: 'Jan', total: 4200, fuel: 1800, maintenance: 800, other: 1600 },
  { name: 'Feb', total: 5100, fuel: 2100, maintenance: 1200, other: 1800 },
  { name: 'Mar', total: 3800, fuel: 1600, maintenance: 600, other: 1600 },
  { name: 'Apr', total: 6200, fuel: 2400, maintenance: 2000, other: 1800 },
  { name: 'May', total: 4800, fuel: 1900, maintenance: 1100, other: 1800 },
  { name: 'Jun', total: 5400, fuel: 2200, maintenance: 1400, other: 1800 },
]

const categoryData = [
  { name: 'Fuel', value: 43, color: '#3ecf8e', icon: Fuel },
  { name: 'Service', value: 27, color: '#6c63ff', icon: PenTool },
  { name: 'Insurance', value: 17, color: '#f7c948', icon: Shield },
  { name: 'Tolls', value: 8, color: '#38bdf8', icon: Toll },
  { name: 'Other', value: 5, color: '#8890a8', icon: MoreHorizontal },
]

const Reports = () => {
  const [period, setPeriod] = useState('Monthly')

  const stats = [
    { label: 'Total YTD', value: 'AED 18,240', change: '+12%', up: true },
    { label: 'Avg / Mo', value: 'AED 6,080', change: '-5%', up: false },
    { label: 'Cost / km', value: 'AED 0.94', change: '+2%', up: true },
    { label: 'Depreciation', value: 'AED 3,300', change: 'Est.', up: null },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
       {/* Header with Export */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-muted font-mono text-[11px] uppercase tracking-widest">Financial Intelligence</span>
          <h2 className="text-3xl font-display font-extrabold tracking-tightest">Expense <span className="gradient-text">Reports</span></h2>
        </div>
        <div className="flex gap-2">
          <button className="p-3 glass rounded-2xl border border-white/10 hover:bg-white/[0.05] transition-all group">
            <Download className="w-5 h-5 text-muted group-hover:text-text" />
          </button>
          <button className="flex items-center gap-2 px-4 py-3 bg-accent text-white rounded-2xl font-display font-bold text-xs uppercase tracking-widest active:scale-95 transition-all shadow-lg hover:bg-opacity-90">
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Period Tabs */}
      <div className="flex gap-2 p-1 bg-surface2 rounded-xl border border-white/5 w-fit overflow-x-auto">
        {['Daily', 'Monthly', 'Quarterly', 'Yearly', 'Custom'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`
              px-4 py-2 rounded-lg font-display font-bold text-sm transition-all whitespace-nowrap
              ${period === p ? 'bg-accent/15 text-accent shadow-inner' : 'text-muted hover:text-text'}
            `}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-5 rounded-2xl border border-white/5 space-y-3 card-hover">
            <span className="text-muted text-[10px] font-mono uppercase tracking-widest leading-none block">{stat.label}</span>
            <div className="flex flex-col gap-1">
              <span className="text-xl font-display font-black tracking-tightest text-text">{stat.value}</span>
              {stat.up !== null && (
                <div className={`flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider ${stat.up ? 'text-accent4' : 'text-accent2'}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              )}
              {stat.up === null && (
                 <span className="text-[10px] text-muted font-mono uppercase tracking-widest">Estimated</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="glass p-6 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-xl tracking-tightest">Spend Trend</h3>
            <p className="text-xs text-muted font-mono uppercase tracking-widest">January - June 2026</p>
          </div>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#8890a8', fontSize: 10, fontFamily: 'DM Mono' }} 
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#13151c', 
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#e8e9f0',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#6c63ff" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorTotal)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Pie Chart Corner */}
        <div className="glass p-6 rounded-3xl border border-white/5 space-y-6">
          <h3 className="font-display font-extrabold text-lg tracking-tightest text-center">Breakdown</h3>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={500}
                  animationDuration={1500}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categoryData.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{cat.name}</span>
                <span className="text-[11px] font-display font-black ml-auto">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fuel Efficiency block */}
        <div className="glass p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-accent2/10 to-transparent space-y-6">
           <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-accent2/10 border border-accent2/20">
               <Fuel className="w-6 h-6 text-accent2" />
             </div>
             <div className="space-y-0.5">
               <h4 className="font-display font-extrabold text-sm uppercase tracking-widest">Efficiency</h4>
               <p className="text-muted text-[10px] font-mono font-bold leading-none">Vehicle: BMW X5</p>
             </div>
           </div>
           <div className="space-y-6 py-2">
             <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <span className="text-muted font-mono text-[10px] uppercase tracking-widest">Avg L / 100km</span>
                  <div className="text-3xl font-display font-black tracking-tightest">11.2</div>
                </div>
                <div className="text-right">
                <span className="text-muted font-mono text-[10px] uppercase tracking-widest">Cost/km</span>
                  <div className="text-lg font-display font-bold tracking-tightest text-accent2">AED 0.38</div>
                </div>
             </div>
             <div className="space-y-1">
               <div className="flex items-center justify-between text-[11px] font-mono text-muted mb-1">
                 <span>Efficiency Target (9.5)</span>
                 <span>72%</span>
               </div>
               <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: '72%' }} 
                   className="h-full bg-accent2 shadow-[0_0_10px_rgba(62,207,142,0.4)]"
                 />
               </div>
             </div>
           </div>
        </div>
      </div>

       {/* AI Insights Card (Repeat on Reports for consistency) */}
       <div className="glass p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-surface to-accent/5 overflow-hidden relative">
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-4">Report AI Sentiment</h4>
        <p className="text-muted text-sm leading-relaxed mb-6 font-medium italic">
          "Monthly spend is down 5.4% compared to February. Reduced toll usage in the second week of March saved AED 140. Maintenance for April is forecast to be AED 6,800 due to brake wear detection."
        </p>
        <div className="flex gap-4">
           <div className="flex flex-col gap-1 pr-4 border-r border-white/5">
              <span className="text-[9px] text-muted font-mono uppercase tracking-widest font-bold">Health Score</span>
              <span className="text-lg font-display font-black text-accent2">92%</span>
           </div>
           <div className="flex flex-col gap-1">
              <span className="text-[9px] text-muted font-mono uppercase tracking-widest font-bold">Reliability</span>
              <span className="text-lg font-display font-black text-accent3">Stable</span>
           </div>
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}

export default Reports
