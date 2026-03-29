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
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="caption font-semibold">System Operational</span>
            </div>
            <h1>Control Center</h1>
            <p className="body-text max-w-md">Operational fleet status is at 98.4% efficiency. Welcome back, {profile?.full_name?.split(' ')[0]}.</p>
         </div>
         
         <div className="flex items-center gap-3">
            <button 
               onClick={() => setIsExpenseModalOpen(true)}
               className="btn-primary"
            >
               <Plus className="w-5 h-5" />
               Log Event
            </button>
            <button 
               onClick={() => navigate('/trips')}
               className="btn-outline"
            >
               <MapPin className="w-5 h-5 text-primary" />
               Start Trip
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* 🚘 VEHICLE STATUS NODE */}
         <div className="lg:col-span-2 space-y-8">
            <AppCard className="p-8 lg:p-10 relative overflow-hidden group">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                  <div className="space-y-6">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="caption font-bold text-emerald-700 normal-case tracking-normal">Asset Secured</span>
                     </div>
                     <div className="space-y-1">
                        <h2>Nissan Patrol V8</h2>
                        <p className="caption font-medium normal-case mb-0">Hardware ID: {profile?.company?.toUpperCase() || 'AUTO-99'} · DUBAI F-12345</p>
                     </div>
                     <div className="flex items-center gap-10">
                        <div className="space-y-1">
                           <p className="caption normal-case mb-1">Operational Range</p>
                           <p className="price-text">412<span className="text-[14px] ml-1 text-text-secondary font-medium uppercase tracking-widest">km</span></p>
                        </div>
                        <div className="w-[1px] h-10 bg-slate-100" />
                        <div className="space-y-1">
                           <p className="caption normal-case mb-1">Health Index</p>
                           <p className="price-text text-emerald-600">98<span className="text-[14px] ml-1 text-emerald-500 font-medium uppercase tracking-widest">%</span></p>
                        </div>
                     </div>
                  </div>
                  <div className="w-full md:w-56 h-36 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
                     <Car className="w-16 h-16 text-slate-200" strokeWidth={1} />
                  </div>
               </div>
            </AppCard>

            {/* 📍 LIVE TRACKING / LAST TRIP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AppCard className="p-8 space-y-6 group">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                            <Navigation className="w-5 h-5 text-primary" />
                         </div>
                         <h3>Last Telemetry</h3>
                      </div>
                      <span className="caption font-medium italic">24m ago</span>
                   </div>
                   <div className="space-y-4">
                      <div className="flex gap-4">
                         <div className="flex flex-col items-center gap-1">
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-white" />
                            <div className="w-[1.5px] h-6 bg-slate-100" />
                            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                         </div>
                         <div className="flex-1 space-y-4">
                            <div className="space-y-0.5">
                               <p className="caption normal-case mb-0">Origin</p>
                               <p className="text-[14px] font-semibold text-text-primary">Dubai Design District</p>
                            </div>
                            <div className="space-y-0.5">
                               <p className="caption normal-case mb-0">Destination</p>
                               <p className="text-[14px] font-semibold text-text-primary">Mall of the Emirates</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   <button onClick={() => navigate('/trips')} className="btn-outline w-full h-12 text-[13px]">View Full Logs</button>
                </AppCard>

                <AppCard className="p-8 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                            <PieChartIcon className="w-5 h-5 text-purple-600" />
                         </div>
                         <h3>Mobility Spend</h3>
                      </div>
                      <span className="caption font-medium italic">Monthly</span>
                   </div>
                   <div className="space-y-1">
                      <p className="price-text">AED {stats.totalSpend.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                         <TrendingUp className="w-4 h-4 text-emerald-500" />
                         <span className="text-[12px] font-bold text-emerald-600">+12.4% vs LMT</span>
                      </div>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-primary" />
                   </div>
                   <p className="caption normal-case mb-0">AED 1,840 remaining in provisioned budget.</p>
                </AppCard>
            </div>
         </div>

         {/* ⚡ QUICK ACTIONS & UTILITIES */}
         <div className="space-y-8">
            <AppCard className="p-8 space-y-8">
               <h3>Quick Protocols</h3>
               <div className="grid grid-cols-1 gap-4">
                  {[
                     { label: 'Export Tax Logs', icon: Download, action: () => {} },
                     { label: 'Sync GPS Node', icon: RefreshCcw, action: () => fetchDashboardData() },
                     { label: 'View Analytics', icon: BarChartIcon, action: () => navigate('/analytics') },
                     { label: 'Access Vault', icon: Lock, action: () => navigate('/settings') }
                  ].map((btn, i) => (
                     <button 
                        key={i} onClick={btn.action}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-slate-200 transition-all group"
                     >
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-all">
                              <btn.icon className="w-4 h-4 text-primary" />
                           </div>
                           <span className="text-[14px] font-semibold text-text-primary">{btn.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                     </button>
                  ))}
               </div>
            </AppCard>

            <AppCard className="p-8 space-y-4 bg-primary text-white border-none shadow-lg shadow-primary/20">
               <span className="caption text-white/60">System Notification</span>
               <p className="text-[15px] font-semibold">Vehicle maintenance window opens in 3 days for <span className="underline decoration-white/40">Nissan Patrol V8</span></p>
               <button className="w-full h-12 mt-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold text-[13px] transition-all">Configure Service</button>
            </AppCard>
         </div>
      </div>
      
       {/* 🧩 FOOTER STATUS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 px-2">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <Signal className="w-4 h-4 text-emerald-500" />
               <span className="caption font-medium normal-case mb-0">Control Alpha Active</span>
            </div>
            <div className="flex items-center gap-2">
               <Lock className="w-4 h-4 text-text-secondary/40" />
               <span className="caption font-medium normal-case mb-0">End-to-end Encrypted</span>
            </div>
         </div>
         <p className="caption font-bold tracking-[0.2em] mb-0 opacity-40">AutoTracker Precision Systems</p>
      </div>
    </div>
  )
}


export default Dashboard
