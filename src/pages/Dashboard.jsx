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
import logo from '../assets/logo.png'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const Dashboard = () => {
  const navigate = useNavigate()
  const { setIsExpenseModalOpen } = useOutletContext()
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
  const [recentExpenses, setRecentExpenses] = useState([])
  const [chartData, setChartData] = useState([])
  const [categorySpecs, setCategorySpecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFleetMode, setIsFleetMode] = useState(false)
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

      setRecentExpenses(expenses?.slice(0, 5) || [])

      const cats = {}
      expenses?.forEach(e => {
        cats[e.category] = (cats[e.category] || 0) + (parseFloat(e.amount) || 0)
      })
      const catArray = Object.keys(cats).map((name, i) => ({
        name,
        value: total > 0 ? Math.round((cats[name] / total) * 100) : 0,
        color: ['#2563eb', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][i % 5]
      }))
      setCategorySpecs(catArray)

      const monthlyData = {}
      expenses?.forEach(e => {
        const month = new Date(e.date).toLocaleDateString('en-US', { month: 'short' })
        monthlyData[month] = (monthlyData[month] || 0) + (parseFloat(e.amount) || 0)
      })
      const chartPoints = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => ({
        month: m,
        value: monthlyData[m] || 0
      }))
      setChartData(chartPoints)

    } catch (err) {
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const KPI_CARDS = [
    { label: 'Total Spending', value: `AED ${stats.totalSpend.toLocaleString()}`, trend: '+12%', subtext: 'This month', icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Vehicles', value: stats.vehicleCount, trend: 'Stable', subtext: 'Total active', icon: Car, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Cost per KM', value: `AED ${stats.cpk}`, trend: '-5%', subtext: 'vs last month', icon: Gauge, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Operational Status', value: `${stats.healthIdx}%`, trend: 'Healthy', subtext: 'All systems online', icon: Activity, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ]

  if (loading) {
     return (
        <div className="h-[60vh] flex items-center justify-center">
           <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
     )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* 🚀 COMMAND HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div className="space-y-2">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="caption-text font-black uppercase tracking-[0.3em] text-emerald-600">Manual Uplink Active</span>
            </div>
            <h1 className="text-text-main">Control <span className="text-primary italic font-black">Center</span></h1>
            <p className="body-text text-text-helper max-w-md">Welcome back, {profile?.full_name?.split(' ')[0] || 'Commander'}. Operational fleet status is at 98.4% efficiency.</p>
         </div>
         
         <div className="flex items-center gap-3">
            <button 
               onClick={() => setIsExpenseModalOpen(true)}
               className="btn-primary"
            >
               <Plus className="w-5 h-5" />
               LOG EVENT
            </button>
            <button 
               onClick={() => navigate('/trips')}
               className="btn-outline"
            >
               <MapPin className="w-5 h-5 text-primary" />
               START TRIP
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* 🚘 VEHICLE STATUS NODE */}
         <div className="lg:col-span-2 space-y-8">
            <AppCard showLogo={true} logoPosition="top-right" className="p-8 lg:p-12 bg-gradient-to-br from-white to-slate-50 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="space-y-6">
                     <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="caption-text font-black text-emerald-600 uppercase tracking-widest italic">Asset Secured</span>
                     </div>
                     <div className="space-y-1">
                        <h2 className="text-text-main text-4xl italic">Nissan Patrol <span className="text-primary font-black">V8</span></h2>
                        <p className="caption-text font-black text-text-helper uppercase tracking-[0.4em]">Hardware ID: {profile?.company || 'AUTO-99'} · DUBAI F-12345</p>
                     </div>
                     <div className="flex items-center gap-10">
                        <div className="space-y-1">
                           <p className="caption-text uppercase font-black opacity-40 italic mt-1">Operational Range</p>
                           <p className="price-header text-text-main">412<span className="text-sm ml-1 text-primary">KM</span></p>
                        </div>
                        <div className="w-[1px] h-12 bg-slate-200" />
                        <div className="space-y-1">
                           <p className="caption-text uppercase font-black opacity-40 italic mt-1">Health Index</p>
                           <p className="price-header text-emerald-500">98<span className="text-sm ml-1">%</span></p>
                        </div>
                     </div>
                  </div>
                  <div className="w-full md:w-64 h-40 bg-white/40 rounded-3xl border border-white/60 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                     <Car className="w-20 h-20 text-slate-200 group-hover:text-primary/20 transition-colors" strokeWidth={1} />
                  </div>
               </div>
            </AppCard>

            {/* 📍 LIVE TRACKING / LAST TRIP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AppCard className="p-8 space-y-6 group">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Navigation className="w-5 h-5 text-primary" />
                         </div>
                         <h3 className="text-sm font-black uppercase tracking-widest italic">Last Telemetry</h3>
                      </div>
                      <span className="caption-text font-bold text-text-helper italic">24m ago</span>
                   </div>
                   <div className="space-y-4">
                      <div className="flex gap-4">
                         <div className="flex flex-col items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white" />
                            <div className="w-[2px] h-6 bg-slate-100" />
                            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                         </div>
                         <div className="flex-1 space-y-4">
                            <div className="space-y-0.5">
                               <p className="text-[10px] uppercase font-black opacity-40 tracking-widest">Origin</p>
                               <p className="text-[12px] font-bold text-text-main italic">Dubai Design District</p>
                            </div>
                            <div className="space-y-0.5">
                               <p className="text-[10px] uppercase font-black opacity-40 tracking-widest">Destination</p>
                               <p className="text-[12px] font-bold text-text-main italic">Mall of the Emirates</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   <button onClick={() => navigate('/trips')} className="w-full py-4 rounded-2xl bg-slate-50 border border-slate-100 font-display font-black text-[10px] uppercase tracking-[0.3em] italic hover:bg-white hover:border-primary/20 transition-all">View Details</button>
                </AppCard>

                <AppCard className="p-8 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                            <PieChartIcon className="w-5 h-5 text-purple-600" />
                         </div>
                         <h3 className="text-sm font-black uppercase tracking-widest italic">Mobility Spend</h3>
                      </div>
                      <span className="caption-text font-bold text-text-helper italic">Monthly Cycle</span>
                   </div>
                   <div className="space-y-1">
                      <p className="text-4xl price-header text-text-main">AED {stats.totalSpend.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                         <TrendingUp className="w-4 h-4 text-emerald-500" />
                         <span className="text-[11px] font-black text-emerald-600 uppercase italic">+12.4% vs LMT</span>
                      </div>
                   </div>
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-primary" />
                   </div>
                   <p className="caption-text italic font-bold">AED 1,840 remaining in provisioned budget.</p>
                </AppCard>
            </div>
         </div>

         {/* ⚡ QUICK ACTIONS & UTILITIES */}
         <div className="space-y-8">
            <div className="saas-card p-8 space-y-8 bg-white">
               <h3 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  Quick Protocols
               </h3>
               <div className="grid grid-cols-1 gap-4">
                  {[
                     { label: 'Export Tax Logs', icon: Download, action: () => {} },
                     { label: 'Sync GPS Node', icon: RefreshCcw, action: () => fetchDashboardData() },
                     { label: 'View Analytics', icon: BarChartIcon, action: () => navigate('/analytics') },
                     { label: 'Access Vault', icon: Lock, action: () => navigate('/settings') }
                  ].map((btn, i) => (
                     <button 
                        key={i} onClick={btn.action}
                        className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-all">
                              <btn.icon className="w-5 h-5 text-primary" />
                           </div>
                           <span className="text-[11px] font-black uppercase tracking-widest italic text-text-main">{btn.label}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                     </button>
                  ))}
               </div>
            </div>

            <AppCard className="p-8 space-y-4 bg-primary text-white border-none shadow-xl shadow-primary/30">
               <h3 className="text-sm font-black uppercase tracking-widest italic opacity-60">System Notification</h3>
               <p className="body-text font-bold">Vehicle maintenance window opens in 3 days for <span className="underline decoration-white/20">Nissan Patrol V8</span></p>
               <button className="w-full py-4 mt-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-black text-[10px] uppercase tracking-widest italic transition-all">Configure Service</button>
            </AppCard>
         </div>
      </div>
      
       {/* 🧩 FOOTER STATUS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 px-2 text-text-subtle">
         <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] italic">
            <div className="flex items-center gap-2">
               <Signal className="w-4 h-4 text-emerald-500" />
               Node: Control-Alpha
            </div>
            <div className="flex items-center gap-2">
               <Lock className="w-4 h-4 text-primary/40" />
               AES-256 Provisioned
            </div>
         </div>
         <p className="text-[11px] font-bold uppercase tracking-[0.4em]">AutoTracker Precision Architecture</p>
      </div>
    </div>
  )
}


export default Dashboard
