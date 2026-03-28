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
import { calculateDepreciation, calculateTCO } from '../utils/depreciationEngine'
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

      const fleetAnalysis = vData.map(v => {
        const dep = calculateDepreciation(v)
        // For TCO, we'd need expense sums per vehicle. For this summary, we aggregate.
        return { ...v, ...dep }
      })

      const { data: eData } = await supabase.from('expenses').select('amount, vehicle_id')
      
      const totalSpend = eData?.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0) || 0
      const totalAssetValue = fleetAnalysis.reduce((s, v) => s + v.currentValue, 0)
      const totalTCO = totalSpend + fleetAnalysis.reduce((s, v) => s + v.accumulatedDepreciation, 0)

      setVehicles(fleetAnalysis)
      setStats({
        totalTCO,
        totalAssetValue,
        avgCPK: totalSpend > 0 ? (totalSpend / 10000).toFixed(2) : 0, // Placeholder dist
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Header & Tab Navigation */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-[22px] bg-white border border-slate-100 shadow-xl shadow-blue-500/5 flex items-center justify-center p-3">
               <img src={logo} alt="AutoTrack" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-1">
               <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Fleet Intelligence</h1>
               <div className="flex items-center gap-4">
                  <p className="text-sm text-slate-500 font-medium italic">Monitoring 48 active assets in the Aramex Fleet.</p>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Live Syncing</span>
               </div>
            </div>
         </div>
         
         <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            {['Overview', 'Performance', 'Comparison'].map(tab => (
               <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={cn("h-10 px-6 rounded-xl text-xs font-bold transition-all", activeTab === tab ? "bg-primary text-white shadow-md shadow-blue-500/20" : "text-slate-500 hover:bg-slate-50")}
               >
                  {tab}
               </button>
            ))}
         </div>
      </div>

      {/* 2. Global Fleet Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Fleet TCO', val: `AED ${(stats.totalTCO / 1000).toFixed(1)}k`, trend: '+2.4%', sub: 'Incl. Depreciation', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Fleet Asset Value', val: `AED ${(stats.totalAssetValue / 1000000).toFixed(2)}M`, trend: '-1.8%', sub: 'Current Valuation', icon: Database, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Avg Cost per KM', val: `AED ${stats.avgCPK}`, trend: '↓ 4%', sub: 'Fleet-wide Average', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Safety Issues', val: `${stats.issues} Items`, trend: 'Urgent', sub: 'Action Required', icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((card, i) => (
            <AppCard 
               key={i} 
               showLogo={true} 
               logoPosition="background" 
               logoOpacity={5}
               className="p-6 flex flex-col justify-between h-44"
            >
               <div className="flex items-center justify-between">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", card.bg)}>
                     <card.icon className={cn("w-6 h-6", card.color)} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-full",
                    card.trend.includes('+') ? "bg-rose-50 text-rose-600" : 
                    card.trend.includes('↓') ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
                  )}>
                    {card.trend}
                  </span>
               </div>
               <div className="space-y-0.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{card.label}</p>
                  <h3 className="text-2xl font-display font-bold text-slate-900">{card.val}</h3>
                  <p className="text-[10px] text-slate-400 font-medium italic">{card.sub}</p>
               </div>
            </AppCard>
         ))}
      </div>

      {/* 3. Performance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         
         {/* Asset Performance Table */}
         <AppCard showLogo={true} logoPosition="top-right" className="lg:col-span-8 p-0 overflow-hidden shadow-premium">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <div>
                  <h3 className="text-lg font-bold text-slate-900">Vehicle Performance Matrix</h3>
                  <p className="text-xs text-slate-500 font-medium">Real-time Comparative Analysis</p>
               </div>
               <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  Export PDF <Download className="w-3.5 h-3.5" />
               </button>
            </div>

            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                     <tr>
                        {['Vehicle & Driver', 'Monthly Cost', 'Cost / KM', 'Depreciation', 'Status'].map((h, i) => (
                           <th key={i} className="px-8 py-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                        ))}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {vehicles.map((v) => (
                        <tr key={v.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-all overflow-hidden p-2">
                                    <img src={logo} alt="" className="w-full h-full object-contain opacity-20 group-hover:opacity-100 transition-opacity" />
                                 </div>
                                 <div className="space-y-0.5">
                                    <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{v.make} {v.model}</span>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{v.plate}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-sm font-bold text-slate-900">AED {(parseFloat(v.purchase_price) || 0).toLocaleString()}</span>
                           </td>
                           <td className="px-8 py-6">
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold">AED 0.15/km</span>
                           </td>
                           <td className="px-8 py-6 text-sm font-medium text-slate-500">
                              AED {v.monthlyDepreciation.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="flex-1 w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={cn("h-full rounded-full transition-all duration-1000", "bg-primary")} style={{ width: '95%' }} />
                                 </div>
                                 <span className={cn("text-[10px] font-bold", "text-slate-400")}>95%</span>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </AppCard>

         {/* Advanced Intelligence & Analysis */}
         <div className="lg:col-span-4 space-y-8">
            {/* Category Breakdown */}
            <AppCard showLogo={true} logoPosition="background" logoOpacity={8} className="p-8 group">
               <h3 className="text-lg font-bold text-slate-900 mb-2">Cost Distribution</h3>
               <p className="text-xs text-slate-500 font-medium mb-8">Fleet-wide categories</p>
               
               <div className="h-48 w-full relative mb-10">
                  <ResponsiveContainer width="100%" height="100%">
                     <RePieChart>
                        <Pie data={[{v: 45}, {v: 25}, {v: 30}]} innerRadius={55} outerRadius={75} paddingAngle={8} dataKey="v" stroke="none">
                           <Cell fill="#2563eb" />
                           <Cell fill="#8b5cf6" />
                           <Cell fill="#f1f5f9" />
                        </Pie>
                     </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                     <span className="text-2xl font-bold text-slate-900 leading-none">88%</span>
                     <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Efficiency</span>
                  </div>
               </div>

               <div className="grid gap-3">
                  {[
                    { label: 'Operational Vehicles', val: '44', color: 'bg-primary' },
                    { label: 'Pending Service', val: '4', color: 'bg-amber-400' },
                  ].map((row, i) => (
                     <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-all">
                        <div className="flex items-center gap-3">
                           <div className={cn("w-2.5 h-2.5 rounded-full", row.color)} />
                           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{row.label}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">{row.val}</span>
                     </div>
                  ))}
               </div>
            </AppCard>

            {/* Premium Gating Comparison */}
            <AppCard showLogo={true} logoPosition="background" logoOpacity={10} className={cn("p-8 relative overflow-hidden", !isPremium && "opacity-60")}>
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm relative z-10">
                     <Layers className="w-6 h-6" />
                  </div>
                  <div className="relative z-10">
                     <h4 className="font-bold text-slate-900">Vehicle Comparison</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cross-Fleet Analytics</p>
                  </div>
               </div>
               <div className="space-y-4 relative z-10">
                  <p className="text-xs text-slate-500 leading-relaxed font-medium capitalize">Analyze and compare vehicle efficiency vs maintenance costs to optimize operations.</p>
                  <div className="h-20 w-full bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
                     <BarChartIcon className="w-7 h-7 text-slate-200" />
                  </div>
                  {!isPremium && (
                     <button className="w-full h-12 btn-primary !bg-amber-500 !shadow-amber-500/20 text-xs">
                        Upgrade To Pro
                     </button>
                  )}
               </div>
            </AppCard>
         </div>
      </div>
      
      {/* 4. Support & Status Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-slate-100 opacity-50">
         <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
               <Signal className="w-3.5 h-3.5 text-emerald-500" />
               Network Protocol Healthy
            </div>
            <div className="flex items-center gap-2">
               <History className="w-3.5 h-3.5 text-blue-500" />
               Last Scan: 2m ago
            </div>
         </div>
         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] italic">AutoTracker Enterprise Node: DXB-774</p>
      </div>
    </div>
  )
}

export default Fleet
