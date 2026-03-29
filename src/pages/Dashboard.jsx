import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, Car, Fuel, Activity, ArrowUpRight, ArrowDownRight, 
  ChevronRight, Calendar, ShieldCheck, Gauge, DollarSign, 
  TrendingUp, Zap, Info, Clock, Wallet, Bell, History,
  Navigation, Target, Sparkles, PieChart as PieChartIcon, BarChart as BarChartIcon, Download,
  MapPin, Search, Plus, AlertCircle, TrendingDown, LayoutDashboard, Briefcase, Lock,
  FileText, Share, HelpCircle, Loader2, Signal, Heart, Workflow,
  PlusCircle, RefreshCcw
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart as RePieChart, Pie, Legend
} from 'recharts'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { useOrganization } from '../context/OrganizationContext'
import AppCard from '../components/AppCard'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const Dashboard = () => {
  const navigate = useNavigate()
  const { currentOrg } = useOrganization()
  const [stats, setStats] = useState({
    totalSpend: 0,
    vehicleCount: 0,
    tripsCount: 0,
    alerts: 0,
    healthIdx: 98,
    distanceLog: 0,
    cpk: 0
  })
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    fetchDashboardData()
    
    const expensesChannel = supabase.channel('dashboard-expenses-sync')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'expenses',
        filter: currentOrg ? `organization_id=eq.${currentOrg.id}` : undefined
      }, () => {
        fetchDashboardData(false)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(expensesChannel)
    }
  }, [currentOrg])

  const fetchDashboardData = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)

      let expensesQuery = supabase.from('expenses').select('amount, category, date, vendor, vehicles(name)').order('date', { ascending: false })
      let vehiclesQuery = supabase.from('vehicles').select('*', { count: 'exact' })
      let tripsQuery = supabase.from('trips').select('distance, classification')

      if (currentOrg) {
        expensesQuery = expensesQuery.eq('organization_id', currentOrg.id)
        vehiclesQuery = vehiclesQuery.eq('organization_id', currentOrg.id)
        tripsQuery = tripsQuery.eq('organization_id', currentOrg.id)
      }

      const { data: expenses } = await expensesQuery
      const { data: rawVehicles, count: vehiclesCount } = await vehiclesQuery
      const { data: trips } = await tripsQuery
      
      const total = expenses?.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0) || 0
      const totalDistance = trips?.reduce((acc, curr) => acc + (parseFloat(curr.distance) || 0), 0) || 0
      
      setStats({
        totalSpend: total,
        vehicleCount: vehiclesCount || 0,
        tripsCount: trips?.length || 0,
        alerts: rawVehicles?.filter(v => v.health === 'Critical').length || 0,
        healthIdx: 98,
        distanceLog: totalDistance,
        cpk: totalDistance > 0 ? (total / totalDistance).toFixed(2) : 0
      })

    } catch (err) {
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const KPI_CARDS = [
    { label: 'Total spending', value: `AED ${stats.totalSpend.toLocaleString()}`, trend: '+12%', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active vehicles', value: stats.vehicleCount, trend: 'Stable', icon: Car, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Cost per km', value: `AED ${stats.cpk}`, trend: '-5%', icon: Gauge, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Operational status', value: `${stats.healthIdx}%`, trend: 'Healthy', icon: Activity, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ]

  if (loading) {
     return (
        <div className="h-[60vh] flex items-center justify-center">
           <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
     )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 lg:pb-12">
      
      {/* 🚀 DASHBOARD HEADER */}
      <div className="flex flex-col gap-1.5 pb-2 border-b border-slate-100">
         <h1>Dashboard</h1>
         <p className="caption text-text-secondary font-normal mb-0">All systems synchronized · Node: Alpha-7</p>
      </div>

      {/* 📊 KPI GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
         {KPI_CARDS.map((card, i) => (
            <AppCard key={i} showLogo={true} logoPosition="background" logoOpacity={5} className="p-4 lg:p-5 flex flex-col justify-between h-32 lg:h-36">
               <div className="flex items-center gap-2 lg:gap-2.5">
                  <div className={cn("w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center", card.bg)}>
                     <card.icon className={cn("w-4 h-4 lg:w-4.5 lg:h-4.5", card.color)} />
                  </div>
                  <span className="card-label truncate">{card.label}</span>
               </div>
               
               <div className="flex flex-col gap-1 lg:gap-0 lg:flex-row lg:items-end lg:justify-between">
                  <span className="metric-value">{card.value}</span>
                  <div className="flex lg:block">
                    <div className={cn(
                       "status-label",
                       card.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : 
                       card.trend.startsWith('-') ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-600"
                    )}>
                       {card.trend}
                    </div>
                  </div>
               </div>
            </AppCard>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
         {/* 🚘 VEHICLE NODE */}
         <div className="lg:col-span-2 space-y-6">
            <AppCard showLogo={true} logoPosition="background" logoOpacity={4} className="p-5 lg:p-8 overflow-hidden">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-8">
                  <div className="space-y-5 lg:space-y-6 flex-1">
                     <div className="flex items-center gap-2">
                        <div className="status-label bg-emerald-50 text-emerald-700 flex items-center gap-1.5 py-1 px-3">
                           <ShieldCheck className="w-3.5 h-3.5" />
                           Asset secured
                        </div>
                     </div>
                     <div className="space-y-1">
                        <h1 className="text-[20px] lg:text-[24px]">Nissan Patrol V8</h1>
                        <p className="caption font-medium">Dubai F-12345 · Auto-99</p>
                     </div>
                     <div className="grid grid-cols-2 gap-8 lg:flex lg:items-center lg:gap-12">
                        <div className="space-y-1">
                           <p className="card-label mb-1">Operational range</p>
                           <p className="metric-value">412<span className="text-xs lg:text-sm ml-1 text-text-secondary font-normal">km</span></p>
                        </div>
                        <div className="space-y-1">
                           <p className="card-label mb-1">Health index</p>
                           <p className="metric-value text-emerald-600">98<span className="text-xs lg:text-sm ml-1 text-emerald-500 font-normal">%</span></p>
                        </div>
                     </div>
                  </div>
                  <div className="w-full md:w-48 h-28 lg:h-32 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                     <Car className="w-10 h-10 lg:w-12 lg:h-12 text-slate-200" strokeWidth={1} />
                  </div>
               </div>
            </AppCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <AppCard className="p-5 lg:p-6 space-y-4 lg:space-y-5">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                         <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-slate-50 flex items-center justify-center text-primary">
                            <Navigation className="w-4 h-4" />
                         </div>
                         <span className="card-label">Last telemetry</span>
                      </div>
                      <span className="caption italic">24m ago</span>
                   </div>
                   <div className="space-y-3 lg:space-y-4">
                      <div className="flex gap-3">
                         <div className="flex flex-col items-center gap-1 pt-1">
                            <div className="w-2 h-2 rounded-full border-2 border-primary bg-white" />
                            <div className="w-[1.5px] h-4 lg:h-5 bg-slate-100" />
                            <div className="w-2 h-2 rounded-full bg-accent" />
                         </div>
                         <div className="flex-1 space-y-2 lg:space-y-3">
                            <div className="space-y-0.5">
                               <p className="caption mb-0">Origin</p>
                               <p className="text-[13px] lg:text-[14px] font-medium text-text-primary">Dubai Design District</p>
                            </div>
                            <div className="space-y-0.5">
                               <p className="caption mb-0">Destination</p>
                               <p className="text-[13px] lg:text-[14px] font-medium text-text-primary">Mall of the Emirates</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   <button onClick={() => navigate('/trips')} className="btn-outline w-full h-8 lg:h-9 text-[12px] lg:text-[13px]">Explore logs</button>
                </AppCard>

                <AppCard className="p-5 lg:p-6 space-y-4 lg:space-y-5">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                         <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-lg bg-slate-50 flex items-center justify-center text-purple-600">
                            <PieChartIcon className="w-4 h-4" />
                         </div>
                         <span className="card-label">Mobility spend</span>
                      </div>
                      <span className="caption italic">Monthly</span>
                   </div>
                   <div className="space-y-2">
                      <p className="metric-value">AED {stats.totalSpend.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                         <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                         <span className="text-[11px] lg:text-[12px] font-semibold text-emerald-600">+12.4% vs LMT</span>
                      </div>
                   </div>
                   <div className="h-1 lg:h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3 lg:mt-4">
                      <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-primary" />
                   </div>
                   <p className="caption mb-0">AED 1,840 remaining in budget</p>
                </AppCard>
            </div>
         </div>

         {/* ⚡ QUICK ACTIONS & UTILITIES */}
         <div className="space-y-6">
            <AppCard className="p-5 lg:p-6 space-y-5 lg:space-y-6">
               <span className="card-label">Quick protocols</span>
               <div className="grid grid-cols-1 gap-3">
                  {[
                     { label: 'Export tax logs', icon: Download, action: () => {} },
                     { label: 'Sync GPS node', icon: RefreshCcw, action: () => fetchDashboardData() },
                     { label: 'View analytics', icon: BarChartIcon, action: () => navigate('/analytics') },
                     { label: 'Access vault', icon: Lock, action: () => navigate('/settings') }
                  ].map((btn, i) => (
                     <button 
                        key={i} onClick={btn.action}
                        className="flex items-center justify-between p-3 lg:p-3.5 rounded-xl border border-slate-50 bg-slate-50/40 hover:bg-white hover:border-slate-200 transition-all group"
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-all">
                              <btn.icon className="w-4 h-4 text-primary" />
                           </div>
                           <span className="text-[13px] lg:text-[14px] font-medium text-text-primary">{btn.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                     </button>
                  ))}
               </div>
            </AppCard>

            <AppCard className="p-5 lg:p-6 space-y-4 bg-text-primary text-white border-none shadow-lg shadow-slate-900/10">
               <span className="text-[10px] lg:text-[11px] font-medium text-white/50 uppercase tracking-wider">System notification</span>
               <p className="text-[13px] lg:text-[14px] font-medium leading-relaxed">Vehicle maintenance window opens in 3 days for <span className="text-white font-semibold">Nissan Patrol V8</span></p>
               <button className="w-full h-8 lg:h-9 mt-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 font-medium text-[12px] transition-all">Configure service</button>
            </AppCard>
         </div>
      </div>
      
      {/* 🧩 FOOTER STATUS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 px-2 border-t border-slate-100">
         <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-2">
               <Signal className="w-4 h-4 text-emerald-500" />
               <span className="caption font-medium">Control alpha active</span>
            </div>
            <div className="flex items-center gap-2">
               <Lock className="w-4 h-4 text-text-secondary/30" />
               <span className="caption font-medium">End-to-end encrypted</span>
            </div>
         </div>
         <p className="caption font-medium opacity-40">AutoTracker Precision Systems</p>
      </div>
    </div>
  )
}

export default Dashboard
