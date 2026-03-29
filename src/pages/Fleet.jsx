import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Car, TrendingUp, DollarSign, Activity, ArrowUpRight, 
  ArrowDownRight, ChevronRight, ShieldCheck, Gauge, Zap, 
  Search, Filter, Plus, UserPlus, Info, Clock, Terminal, 
  Radio, Eye, Lock, Layers, Target, BarChart as BarChartIcon, PieChart as PieChartIcon,
  Navigation, CheckCircle2, AlertCircle, Sparkles, Database,
  Cpu, LayoutDashboard, Briefcase, User, Download, Signal, History, Loader2
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart as RePieChart, Pie
} from 'recharts'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { supabase } from '../utils/supabase'
import { calculateFleetDepreciationSummary, buildVehicleSummary } from '../modules/depreciation/depreciation.service'
import AppCard from '../components/AppCard'
import logo from '../assets/logo.png'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const Fleet = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')
  const [stats, setStats] = useState({
    totalTCO: 0,
    totalAssetValue: 0,
    avgCPK: 0,
    issues: 0
  })

  useEffect(() => {
    fetchFleetData()
  }, [])

  const fetchFleetData = async () => {
    setLoading(true)
    try {
      const { data: vData, error: vErr } = await supabase.from('vehicles').select('*')
      if (vErr) throw vErr

      const { data: eData } = await supabase.from('expenses').select('amount, vehicle_id')
      
      // Group expenses by vehicle
      const expenseMap = (eData || []).reduce((acc, curr) => {
        acc[curr.vehicle_id] = (acc[curr.vehicle_id] || 0) + parseFloat(curr.amount || 0);
        return acc;
      }, {});

      const vehiclesWithExpenses = vData.map(v => ({
        ...v,
        total_expenses: expenseMap[v.id] || 0
      }));

      const fleetSummary = calculateFleetDepreciationSummary(vehiclesWithExpenses);
      const fleetAnalysis = vehiclesWithExpenses.map(v => buildVehicleSummary(v, v.total_expenses));

      setVehicles(fleetAnalysis.filter(s => s.status === 'ok'))
      setStats({
        totalTCO: fleetSummary.fleetWideTCO,
        totalAssetValue: fleetSummary.totalFleetAssetValue,
        avgCPK: fleetSummary.fleetWideTCO > 0 ? (fleetSummary.fleetWideTCO / 10000).toFixed(2) : 0, 
        issues: vData.filter(v => v.health === 'Critical').length
      })
    } catch (err) {
      console.error('Fleet analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  const isPremium = true

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 lg:pb-12">
      
      {/* 🚀 MOBILE-OPTIMIZED HEADER */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center justify-between pb-2 border-b border-slate-100">
         <div className="flex items-center gap-4">
            <Logo type="icon" variant="dark" />
            <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Live</span>
               </div>
               <h1>Fleet Intelligence</h1>
               <p className="caption text-text-secondary font-medium">Monitoring 48 active assets</p>
            </div>
         </div>
         
         {/* Segmented Control Tabs */}
         <div className="flex bg-slate-100/50 p-1 rounded-xl border border-slate-200/50 overflow-x-auto no-scrollbar">
            {['Overview', 'Performance', 'Comparison'].map(tab => (
               <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "h-9 px-5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap", 
                    activeTab === tab ? "bg-white text-text-primary shadow-sm border border-slate-200" : "text-text-secondary hover:text-text-primary"
                  )}
               >
                  {tab}
               </button>
            ))}
         </div>
      </div>

      {/* 📊 KPI GRID (Mobile: 2 cols, Desktop: 4 cols) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { label: 'Total fleet value', val: `AED ${(stats.totalAssetValue / 1000000).toFixed(2)}m`, trend: '-1.8%', icon: Database, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Active vehicles', val: '48', trend: 'Stable', icon: Car, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Cost per km', val: `AED ${stats.avgCPK}`, trend: '↓ 4%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Safety issues', val: stats.issues, trend: 'Urgent', icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((card, i) => (
            <AppCard key={i} showLogo={true} logoPosition="background" logoOpacity={5} className="p-4 lg:p-5 flex flex-col justify-between h-32 lg:h-36">
               <div className="flex items-center gap-2 lg:gap-2.5">
                  <div className={cn("w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center", card.bg)}>
                     <card.icon className={cn("w-4 h-4 lg:w-4.5 lg:h-4.5", card.color)} />
                  </div>
                  <span className="card-label truncate">{card.label}</span>
               </div>
               
               <div className="flex flex-col gap-1 lg:gap-0 lg:flex-row lg:items-end lg:justify-between">
                  <span className="metric-value">{card.val}</span>
                  <div className="flex lg:block">
                    <div className={cn(
                       "status-label",
                       card.trend.includes('↓') || card.trend === 'Stable' ? "bg-emerald-50 text-emerald-600" : 
                       card.trend === 'Urgent' ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"
                    )}>
                       {card.trend}
                    </div>
                  </div>
               </div>
            </AppCard>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
         
         {/* 🚘 ASSET PERFORMANCE LIST (Mobile) / TABLE (Desktop) */}
         <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-2">
               <div>
                  <h2 className="text-[18px]">Asset Performance</h2>
                  <p className="caption">Real-time comparative analysis</p>
               </div>
               <button className="p-2 rounded-lg bg-white border border-slate-200">
                  <Download className="w-4 h-4 text-slate-400" />
               </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {vehicles.map((v) => (
                  <AppCard key={v.id} className="p-4 lg:p-6 hover:border-primary transition-all group">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 group-hover:bg-primary/5 transition-colors">
                              <Car className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                           </div>
                           <div className="space-y-0.5">
                              <p className="text-[14px] font-semibold text-text-primary group-hover:text-primary transition-colors">{v.make} {v.model}</p>
                              <p className="text-[11px] text-text-secondary font-medium tracking-wider">{v.plate}</p>
                           </div>
                        </div>
                        <div className={cn(
                           "px-2 py-0.5 rounded-md text-[11px] font-semibold",
                           v.health === 'Critical' ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                           {v.health === 'Critical' ? 'Urgent' : 'Active'}
                        </div>
                     </div>

                     <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-50 pt-4">
                        <div className="space-y-1">
                           <p className="card-label">Monthly</p>
                           <p className="text-[13px] font-bold text-text-primary">AED {v.monthlyDepreciation.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="card-label">Cost/KM</p>
                           <p className="text-[13px] font-bold text-emerald-600">AED 0.15</p>
                        </div>
                        <div className="space-y-1">
                           <p className="card-label">TCO</p>
                           <p className="text-[13px] font-bold text-text-primary">AED {v.purchase_price.toLocaleString()}</p>
                        </div>
                     </div>
                  </AppCard>
               ))}
            </div>
         </div>

         {/* 🧠 INTELLIGENCE & ANALYSIS */}
         <div className="lg:col-span-4 space-y-6">
            {/* Cost Distribution Chart */}
            <AppCard showLogo={true} logoPosition="background" logoOpacity={6} className="p-5 lg:p-8 space-y-6">
               <div className="space-y-1">
                  <h2 className="text-[18px]">Cost Distribution</h2>
                  <p className="caption">Fleet-wide efficiency matrix</p>
               </div>
               
               <div className="h-44 lg:h-48 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                     <RePieChart>
                        <Pie data={[{v: 45}, {v: 25}, {v: 30}]} innerRadius={55} outerRadius={75} paddingAngle={8} dataKey="v" stroke="none">
                           <Cell fill="#0A66C2" />
                           <Cell fill="#00C6FF" />
                           <Cell fill="#E2E8F0" />
                        </Pie>
                     </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                     <span className="metric-value">88%</span>
                     <span className="caption font-semibold uppercase tracking-widest mt-0.5">Efficiency</span>
                  </div>
               </div>

               <div className="space-y-3">
                  {[
                    { label: 'Operational assets', val: '44', color: 'bg-primary' },
                    { label: 'Maintenance queue', val: '4', color: 'bg-accent' },
                  ].map((row, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                           <div className={cn("w-2.5 h-2.5 rounded-full", row.color)} />
                           <span className="card-label">{row.label}</span>
                        </div>
                        <span className="text-[13px] font-bold text-text-primary">{row.val}</span>
                     </div>
                  ))}
               </div>
            </AppCard>

            {/* Premium Upgrade CTA */}
            <AppCard className="p-6 bg-text-primary text-white border-none shadow-lg shadow-slate-900/10">
               <div className="flex items-center gap-4 mb-4">
                  <Logo type="icon" variant="light" />
                  <div>
                     <p className="text-[14px] font-semibold text-white">Cross-Fleet Analytics</p>
                     <p className="text-[11px] text-white/50 font-medium">SaaS Pro Feature</p>
                  </div>
               </div>
               <p className="text-[13px] leading-relaxed text-white/70 mb-5">Analyze and compare vehicle efficiency vs maintenance costs to optimize operations.</p>
               <button className="w-full h-10 rounded-lg bg-white text-text-primary font-bold text-[12px] transition-all hover:bg-slate-50">Upgrade To Premium</button>
            </AppCard>
         </div>
      </div>
      
      {/* 🧩 FOOTER STATUS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 px-2 border-t border-slate-100">
         <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-2">
               <Signal className="w-4 h-4 text-emerald-500" />
               <span className="caption font-medium">Protocol healthy</span>
            </div>
            <div className="flex items-center gap-2">
               <Clock className="w-4 h-4 text-text-secondary/30" />
               <span className="caption font-medium">Synced 2m ago</span>
            </div>
         </div>
         <p className="caption font-medium opacity-40 italic">AutoTracker Enterprise Node: DXB-774</p>
      </div>

       {/* Circular FAB for quick actions on mobile */}
       <button className="fixed lg:hidden bottom-20 right-6 w-14 h-14 rounded-full bg-text-primary text-white shadow-xl shadow-slate-900/20 flex items-center justify-center z-50 active:scale-95 transition-all">
          <Plus className="w-8 h-8 stroke-[2.5]" />
       </button>
    </div>
  )
}

export default Fleet
