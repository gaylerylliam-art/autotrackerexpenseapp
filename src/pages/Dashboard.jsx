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
import AppCard from '../components/AppCard'
import logo from '../assets/logo.png'

const Dashboard = () => {
  const navigate = useNavigate()
  const { setIsExpenseModalOpen } = useOutletContext()
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
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
        fetchDashboardData(false)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(expensesChannel)
    }
  }, [])

  const fetchDashboardData = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)

      const { data: expenses } = await supabase.from('expenses').select('amount, category, date, vendor, vehicles(name)').order('date', { ascending: false })
      const { data: rawVehicles, count: vehiclesCount } = await supabase.from('vehicles').select('*', { count: 'exact' })
      const { data: trips } = await supabase.from('trips').select('distance, category')
      
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-blue-500/5 flex items-center justify-center p-3 relative group">
               <img src={logo} alt="AutoTrack" className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div>
               <h1 className="text-3xl font-display font-bold text-text-main tracking-tight flex items-center gap-2">
                  Dashboard
               </h1>
               <p className="text-text-secondary font-medium">Monitoring {stats.vehicleCount} vehicles in the {profile?.company || 'Personal'} account.</p>
            </div>
         </div>
         
         <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-border shadow-sm">
            <button 
               onClick={() => setIsFleetMode(false)}
               className={cn(
                 "px-6 h-10 rounded-xl text-xs font-bold transition-all", 
                 !isFleetMode ? "bg-text-main text-white shadow-md shadow-black/10" : "text-text-helper hover:bg-bg-page"
               )}
            >
               Personal View
            </button>
            <button 
               onClick={() => setIsFleetMode(true)}
               className={cn(
                 "px-6 h-10 rounded-xl text-xs font-bold transition-all flex items-center gap-2", 
                 isFleetMode ? "bg-text-main text-white shadow-md shadow-black/10" : "text-text-helper hover:bg-bg-page"
               )}
            >
               Fleet View
               {!isFleetMode && <Lock className="w-3 h-3 text-text-subtle" />}
            </button>
         </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {KPI_CARDS.map((kpi, i) => (
            <AppCard key={i} showLogo={true} logoPosition="top-right" className="p-8 flex flex-col justify-between h-44">
               <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", kpi.bg)}>
                     <kpi.icon className={cn("w-6 h-6", kpi.color)} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-full",
                    kpi.trend.startsWith('+') ? "bg-accent/5 text-accent" : 
                    kpi.trend.startsWith('-') ? "bg-emerald-50 text-emerald-600" : "bg-bg-page text-text-helper"
                  )}>
                    {kpi.trend}
                  </span>
               </div>
               <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-text-helper uppercase tracking-widest">{kpi.label}</p>
                  <h3 className="text-2xl font-display font-bold text-text-main italic tracking-tight">{kpi.value}</h3>
               </div>
            </AppCard>
         ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Expenditure Chart */}
         <AppCard showLogo={true} logoPosition="top-right" className="lg:col-span-2 p-8">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-bold text-text-main">Expense Trends</h3>
                  <p className="text-xs text-text-secondary">Monthly breakdown of mobility costs</p>
               </div>
               <button className="p-2.5 bg-bg-page rounded-xl border border-border text-text-subtle hover:text-text-main transition-all">
                  <RefreshCcw className="w-4 h-4" />
               </button>
            </div>
             <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#0F1010" stopOpacity={0.05}/>
                           <stop offset="95%" stopColor="#0F1010" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#ABADBB', fontSize: 10, fontWeight: 700 }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ABADBB', fontSize: 10, fontWeight: 700 }} />
                     <Tooltip 
                        contentStyle={{ 
                           backgroundColor: '#fff', 
                           borderRadius: '16px', 
                           border: '1px solid rgba(0,0,0,0.05)', 
                           boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                           fontSize: '12px',
                           fontWeight: '700'
                        }} 
                     />
                     <Area type="monotone" dataKey="value" stroke="#0F1010" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </AppCard>

         {/* Category Breakdown */}
         <AppCard showLogo={true} logoPosition="background" logoOpacity={8} className="p-8 flex flex-col">
            <h3 className="text-lg font-bold text-text-main mb-2">Categories</h3>
            <p className="text-xs text-text-secondary mb-8">Cost distribution by type</p>
            <div className="flex-1 flex flex-col justify-center">
               <div className="h-64 h-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                     <RePieChart>
                        <Pie data={categorySpecs} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                           {categorySpecs.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                     </RePieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center pt-2">
                     <span className="text-4xl font-display font-bold text-text-main tracking-tighter italic">{categorySpecs[0]?.value || 0}%</span>
                     <span className="text-[10px] text-text-helper font-mono font-bold uppercase tracking-widest">{categorySpecs[0]?.name || 'N/A'}</span>
                  </div>
               </div>
                <div className="space-y-4 mt-6">
                  {categorySpecs.slice(0, 3).map((cat, i) => (
                     <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                           <span className="font-bold text-text-secondary italic uppercase text-[11px] tracking-wide">{cat.name}</span>
                        </div>
                        <span className="font-bold text-text-main">{cat.value}%</span>
                     </div>
                  ))}
               </div>
            </div>
         </AppCard>
      </div>

      {/* Recent Activity Section */}
      <AppCard showLogo={true} logoPosition="top-right" className="overflow-hidden">
         <div className="p-8 border-b border-border flex items-center justify-between">
            <div>
               <h3 className="text-lg font-bold text-text-main">Recent Activity</h3>
               <p className="text-xs text-text-secondary italic">Your most recent mobility logs</p>
            </div>
            <button onClick={() => navigate('/expenses')} className="text-xs font-bold text-accent uppercase tracking-widest hover:underline">
               View All
            </button>
         </div>
          <div className="divide-y divide-border">
            {recentExpenses.length === 0 ? (
               <div className="p-12 text-center text-text-subtle text-[11px] font-bold uppercase tracking-widest italic">No logs found.</div>
            ) : recentExpenses.map((expense, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-bg-page transition-all group">
                  <div className="flex items-center gap-5">
                     <div className="w-12 h-12 rounded-xl bg-bg-secondary/40 flex items-center justify-center text-text-helper group-hover:bg-text-main group-hover:text-white transition-all overflow-hidden p-2">
                        <img src={logo} alt="" className="w-full h-full object-contain opacity-20 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <div>
                        <h4 className="font-bold text-text-main uppercase text-[13px] tracking-tight">{expense.vendor || 'Unknown Provider'}</h4>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[11px] text-text-helper font-mono font-bold">{new Date(expense.date).toLocaleDateString()}</span>
                           <span className="w-1 h-1 rounded-full bg-text-subtle" />
                           <span className="text-[11px] text-text-helper font-mono font-bold italic">{expense.vehicles?.name}</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="font-display font-bold text-text-main">AED {parseFloat(expense.amount).toLocaleString()}</p>
                     <p className="text-[10px] text-text-helper font-bold uppercase tracking-wider">{expense.category}</p>
                  </div>
               </div>
            ))}
         </div>
          <div className="p-5 bg-white/50 flex justify-center">
            <button 
               onClick={() => setIsExpenseModalOpen(true)}
               className="flex items-center gap-2 text-[10px] font-bold text-text-helper uppercase tracking-widest hover:text-text-main transition-all"
            >
               <PlusCircle className="w-4 h-4" />
               Log New Mobility Expense
            </button>
         </div>
      </AppCard>
      
       {/* Footer Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 px-2 text-text-subtle">
         <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] italic">
            <div className="flex items-center gap-2">
               <Signal className="w-4 h-4 text-emerald-500" />
               Node: Primary Sync
            </div>
            <div className="flex items-center gap-2">
               <Heart className="w-4 h-4 text-accent/40" />
               Mobility OS v6.0
            </div>
         </div>
         <p className="text-[11px] font-bold uppercase tracking-[0.4em]">Secured by AutoTracker Precision</p>
      </div>
    </div>
  )
}


