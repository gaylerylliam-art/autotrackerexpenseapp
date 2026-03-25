import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, TrendingUp, Compass, Calendar, AlertCircle, ArrowUpRight, Plus, Scan, Sparkles } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import Scanner from '../components/Scanner'

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

const Dashboard = () => {
  const [activeVehicle, setActiveVehicle] = useState(vehicles[0])
  const [isScannerOpen, setIsScannerOpen] = useState(false)

  const stats = [
    { label: 'This Month', value: 'AED 4,820', sub: 'vs last month +12%', icon: TrendingUp, color: 'text-accent' },
    { label: 'Cost / km', value: 'AED 0.94', sub: 'Avg 0.88', icon: Compass, color: 'text-accent2' },
    { label: 'Odometer', value: '86,370 km', sub: 'Last sync: Today', icon: Car, color: 'text-accent3' },
    { label: 'YTD Total', value: 'AED 18,240', sub: '6 months', icon: Calendar, color: 'text-accent4' },
  ]

  const alerts = [
    { type: 'critical', title: 'Oil Change Overdue', detail: '850 km overdue (Service at 85,500 km)', date: 'Urgent' },
    { type: 'warning', title: 'Insurance Renewal', detail: 'Expiring in 18 days (AED 3,200 est.)', date: 'Apr 12' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <span className="text-muted font-mono text-[11px] uppercase tracking-widest">March 25, 2026</span>
        <h2 className="text-3xl font-display font-extrabold tracking-tightest">Welcome, <span className="gradient-text">Ahmed</span></h2>
      </div>

      {/* Vehicle Switcher */}
      <div className="flex gap-2 p-1 bg-surface2 rounded-xl border border-white/5 w-fit overflow-x-auto">
        {vehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveVehicle(v)}
            className={`
              px-4 py-2 rounded-lg font-display font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap
              ${activeVehicle.id === v.id ? 'bg-accent/15 text-accent shadow-inner' : 'text-muted hover:text-text'}
            `}
          >
            <div className={`w-2 h-2 rounded-full ${v.color}`} />
            {v.name}
          </button>
        ))}
        <Link to="/vehicles" className="px-4 py-2 text-muted hover:text-text transition-colors">
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-5 rounded-2xl border border-white/5 flex flex-col gap-3 card-hover">
            <div className="w-10 h-10 rounded-xl bg-surface/50 border border-white/5 flex items-center justify-center">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-muted text-xs font-mono uppercase tracking-wider">{stat.label}</span>
              <span className="text-lg font-display font-extrabold tracking-tightest mt-1">{stat.value}</span>
              <span className="text-[10px] text-muted mt-1">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* OCR Prompt Banner */}
      <div 
        onClick={() => setIsScannerOpen(true)}
        className="bg-gradient-to-r from-accent/20 via-accent2/10 to-bg p-6 rounded-2xl border border-accent/20 relative overflow-hidden group cursor-pointer transition-all hover:bg-accent/25"
      >
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-all opacity-40"></div>
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-2">
            <h4 className="font-display font-extrabold text-lg flex items-center gap-2">
              <Scan className="w-5 h-5 text-accent" />
              Upload Latest Receipt
            </h4>
            <p className="text-muted text-sm max-w-[200px]">Auto-scan fuel and maintenance records with AI.</p>
            <div className="flex items-center gap-2 mt-4 text-accent font-display font-black text-xs uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              Launch Scanner
            </div>
          </div>
          <motion.div 
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-20 h-20 bg-surface3 border border-white/10 rounded-xl shadow-2xl flex items-center justify-center"
          >
            <Plus className="w-8 h-8 text-accent/50" />
          </motion.div>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        <h3 className="font-display font-extrabold text-xl flex items-center gap-2 tracking-tightest">
          <AlertCircle className="w-5 h-5 text-accent4" />
          Priority Alerts
        </h3>
        <div className="grid gap-3">
          {alerts.map((alert, i) => (
            <div key={i} className={`
              glass p-4 rounded-xl border flex items-center justify-between card-hover
              ${alert.type === 'critical' ? 'border-accent4/30 bg-accent4/[0.03]' : 'border-accent3/20'}
            `}>
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-text">{alert.title}</h5>
                <p className="text-xs text-muted font-body leading-relaxed">{alert.detail}</p>
              </div>
              <div className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest border
                ${alert.type === 'critical' ? 'bg-accent4/10 border-accent4/20 text-accent4' : 'bg-accent3/10 border-accent3/20 text-accent3'}
              `}>
                {alert.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="glass p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-xl tracking-tightest">Spending Trend</h3>
            <p className="text-xs text-muted font-mono uppercase tracking-widest">Last 6 Months (AED)</p>
          </div>
          <button className="p-2 border border-white/10 rounded-lg text-muted hover:text-text transition-colors">
            <BarChart2 className="w-5 h-5" />
          </button>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{ 
                  backgroundColor: '#13151c', 
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#e8e9f0',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
                labelStyle={{ fontFamily: 'Syne', fontWeight: 800, marginBottom: '4px' }}
                itemStyle={{ color: '#6c63ff', fontSize: '12px', fontFamily: 'DM Mono' }}
              />
              <Bar 
                dataKey="total" 
                radius={[6, 6, 0, 0]} 
                barSize={32}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === data.length - 1 ? '#6c63ff' : '#22263a'} 
                    className="hover:fill-accent transition-all duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="glass p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-surface to-accent/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4">
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_rgba(108,99,255,0.8)]"
          />
        </div>
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent mb-4">AI Intelligence Layer</h4>
        <p className="text-muted text-sm leading-relaxed mb-6 font-medium italic">
          "Your fuel cost increased 18% in March vs February. This may be due to higher mileage on Sheikh Zayed Road. We recommend checking your tire pressure for optimal efficiency."
        </p>
        <button className="flex items-center gap-2 text-text text-[11px] font-mono uppercase tracking-widest transition-all hover:gap-3 group">
          View Detail Forecast
          <ArrowUpRight className="w-3 h-3 text-accent group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      {/* Placeholder at bottom for spacing */}
      <div className="h-4" />
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
