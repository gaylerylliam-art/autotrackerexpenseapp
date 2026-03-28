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

function cn(...inputs) { return twMerge(clsx(inputs)) }

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
         <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 font-medium">Monitoring {stats.vehicleCount} vehicles in the {profile?.company || 'Personal'} account.</p>
         </div>
         
         <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button 
               onClick={() => setIsFleetMode(false)}
               className={cn(
                 "px-6 h-10 rounded-xl text-xs font-bold transition-all", 
                 !isFleetMode ? "bg-primary text-white shadow-md shadow-blue-500/20" : "text-slate-500 hover:bg-slate-50"
               )}
            >
               Personal View
            </button>
            <button 
               onClick={() => setIsFleetMode(true)}
               className={cn(
                 "px-6 h-10 rounded-xl text-xs font-bold transition-all flex items-center gap-2", 
                 isFleetMode ? "bg-primary text-white shadow-md shadow-blue-500/20" : "text-slate-500 hover:bg-slate-50"
               )}
            >
               Fleet View
               {!isFleetMode && <Lock className="w-3 h-3 text-slate-300" />}
            </button>
         </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {KPI_CARDS.map((kpi, i) => (
            <div key={i} className="premium-card p-6 flex flex-col justify-between h-40">
               <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", kpi.bg)}>
                     <kpi.icon className={cn("w-6 h-6", kpi.color)} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-full",
                    kpi.trend.startsWith('+') ? "bg-red-50 text-red-600" : 
                    kpi.trend.startsWith('-') ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
                  )}>
                    {kpi.trend}
                  </span>
               </div>
               <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                  <h3 className="text-2xl font-display font-bold text-slate-900">{kpi.value}</h3>
               </div>
            </div>
         ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Expenditure Chart */}
         <div className="lg:col-span-2 premium-card p-8">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h3 className="text-lg font-bold text-slate-900">Expense Trends</h3>
                  <p className="text-xs text-slate-500">Monthly breakdown of all vehicle costs</p>
               </div>
               <button className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 hover:text-primary transition-all">
                  <RefreshCcw className="w-4 h-4" />
               </button>
            </div>
            <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                     <Tooltip 
                        contentStyle={{ 
                           backgroundColor: '#fff', 
                           borderRadius: '16px', 
                           border: '1px solid #e2e8f0', 
                           boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                           fontSize: '12px'
                        }} 
                     />
                     <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Category Breakdown */}
         <div className="premium-card p-8 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Categories</h3>
            <p className="text-xs text-slate-500 mb-8">Cost distribution by type</p>
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-3xl font-display font-bold text-slate-900">{categorySpecs[0]?.value || 0}%</span>
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{categorySpecs[0]?.name || 'N/A'}</span>
                  </div>
               </div>
               <div className="space-y-3 mt-6">
                  {categorySpecs.slice(0, 3).map((cat, i) => (
                     <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                           <span className="font-semibold text-slate-600">{cat.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">{cat.value}%</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Recent Activity Section */}
      <div className="premium-card overflow-hidden">
         <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
               <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
               <p className="text-xs text-slate-500">Your most recent expense entries</p>
            </div>
            <button onClick={() => navigate('/expenses')} className="text-sm font-bold text-primary hover:underline">
               View All
            </button>
         </div>
         <div className="divide-y divide-slate-100">
            {recentExpenses.length === 0 ? (
               <div className="p-12 text-center text-slate-400 text-sm italic">No recent activity found.</div>
            ) : recentExpenses.map((expense, i) => (
               <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-all">
                        {expense.category === 'Fuel' ? <Fuel className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-900">{expense.vendor || 'Unknown Provider'}</h4>
                        <div className="flex items-center gap-3 mt-0.5">
                           <span className="text-xs text-slate-500 font-medium">{new Date(expense.date).toLocaleDateString()}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-300" />
                           <span className="text-xs text-slate-500 font-medium">{expense.vehicles?.name}</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="font-display font-bold text-slate-900">AED {parseFloat(expense.amount).toLocaleString()}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{expense.category}</p>
                  </div>
               </div>
            ))}
         </div>
         <div className="p-4 bg-slate-50/50 flex justify-center">
            <button 
               onClick={() => setIsExpenseModalOpen(true)}
               className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-all"
            >
               <PlusCircle className="w-4 h-4" />
               Add New Transaction
            </button>
         </div>
      </div>
      
      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-slate-400">
         <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
               <Signal className="w-3.5 h-3.5 text-emerald-500" />
               All data synced
            </div>
            <div className="flex items-center gap-2">
               <Heart className="w-3.5 h-3.5 text-red-400" />
               System Version 6.0
            </div>
         </div>
         <p className="text-[11px] font-bold uppercase tracking-widest italic">Secured by AutoTracker</p>
      </div>
    </div>
  )
}

export default Dashboard

