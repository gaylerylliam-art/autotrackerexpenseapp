import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PenTool, Calendar, AlertCircle, CheckCircle2, Shield, Battery, 
  TrendingUp, History, Info, MapPin, Sparkles, Building2, 
  ChevronRight, Bookmark, Wrench, Settings as SettingsIcon, 
  Hammer, Zap, Activity, Clock, Server, Terminal, Radio, ShieldAlert,
  Plus, Loader2, Signal, Eye, MoreVertical
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { supabase } from '../utils/supabase'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState('All')
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    overdue: 0,
    health: 100,
    avgCost: 0
  })

  const tabs = ['All', 'Scheduled', 'In Progress', 'Completed', 'Overdue']

  useEffect(() => {
    fetchMaintenance()

    const channel = supabase.channel('maintenance-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'maintenance_tasks' }, () => {
        fetchMaintenance(false)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchMaintenance = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select('*, vehicles(name)')
        .order('due_date', { ascending: true })

      if (error) throw error
      setTasks(data || [])

      const overdue = data?.filter(t => t.status === 'Overdue' || (new Date(t.due_date) < new Date() && t.status !== 'Completed')).length || 0
      const health = data?.length > 0 ? ((data.length - overdue) / data.length) * 100 : 100
      setStats({ overdue, health, avgCost: 840 })

    } catch (err) {
      console.error('Maintenance fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = activeTab === 'All' 
    ? tasks 
    : tasks.filter(t => t.status === activeTab)

  const getStatusConfig = (status, dueDate) => {
    const isOverdue = status === 'Overdue' || (new Date(dueDate) < new Date() && status !== 'Completed')
    if (isOverdue) return { badge: 'bg-red-50 text-red-600 border-red-100', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-500', icon: ShieldAlert, label: 'OVERDUE' }
    
    switch(status) {
      case 'In Progress': return { badge: 'bg-blue-50 text-blue-600 border-blue-100', bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-primary', icon: Clock, label: 'IN PROGRESS' }
      case 'Scheduled': return { badge: 'bg-slate-50 text-slate-500 border-slate-100', bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-400', icon: Calendar, label: 'SCHEDULED' }
      case 'Completed': return { badge: 'bg-emerald-50 text-emerald-600 border-emerald-100', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-500', icon: CheckCircle2, label: 'COMPLETED' }
      default: return { badge: 'bg-slate-50 text-slate-500 border-slate-100', bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-400', icon: Info, label: 'PENDING' }
    }
  }

  const costHistory = [
    { name: 'Major Svc', actual: 1200, estimated: 1400 },
    { name: 'Brakes', actual: 850, estimated: 720 },
    { name: 'Oil & Filter', actual: 450, estimated: 500 },
    { name: 'AC Recharge', actual: 200, estimated: 250 },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Maintenance</h1>
            <p className="text-slate-500 font-medium">Keep your fleet running with proactive service tracking.</p>
         </div>

         <div className="flex gap-3">
            <button className="h-12 px-8 btn-primary group w-full sm:w-auto">
               <Plus className="w-5 h-5 stroke-[2.5]" /> 
               Add Task
            </button>
            <button className="h-12 w-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-primary transition-all">
               <SettingsIcon className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Health Overview Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className="premium-card overflow-hidden bg-primary/5 border-primary/10 relative group"
      >
         <div className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
               <Shield className="w-8 h-8 stroke-[2.5]" />
            </div>
            
            <div className="space-y-2 text-center md:text-left flex-1">
               <div className="flex items-center gap-3 justify-center md:justify-start">
                  <h3 className="font-display font-bold text-2xl text-slate-900 tracking-tight">Fleet Health: {stats.health.toFixed(0)}%</h3>
                  <span className="bg-emerald-100 text-emerald-600 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">Operational</span>
               </div>
               <p className="text-sm text-slate-500 font-medium max-w-2xl">
                  Monitoring {tasks.length} active service cycles. Your overall fleet reliability is currently optimal.
               </p>
            </div>
            
            <button className="h-11 px-6 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 hover:border-primary transition-all flex items-center gap-2 group/btn">
               View Schedule
               <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
            </button>
         </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 translate-z-0">
         <div className="lg:col-span-2 premium-card p-8 space-y-8">
            <div className="flex items-center justify-between">
               <div>
                  <h4 className="text-lg font-bold text-slate-900">Cost Analysis</h4>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Actual vs. estimated service costs</p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary">
                  <TrendingUp className="w-5 h-5" />
               </div>
            </div>
            
            <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costHistory}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} dy={10} />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px' }}
                     />
                     <Bar dataKey="estimated" fill="#f1f5f9" radius={[6, 6, 0, 0]} barSize={40} />
                     <Bar dataKey="actual" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>

            <div className="flex gap-6 pt-6 border-t border-slate-100">
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Actual Cost</span>
               </div>
            </div>
         </div>

         <div className="premium-card p-8 space-y-8">
            <h4 className="text-lg font-bold text-slate-900">Key Metrics</h4>
            
            <div className="space-y-8">
               {[
                  { label: 'Critical Tasks', value: stats.overdue > 0 ? `${stats.overdue}` : 'None', color: stats.overdue > 0 ? 'text-red-500' : 'text-emerald-500', icon: ShieldAlert },
                  { label: 'Avg Task Cost', value: `AED ${stats.avgCost}`, color: 'text-slate-900', icon: Activity },
                  { label: 'Cloud Sync', value: 'Active', color: 'text-emerald-500', icon: Signal },
               ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group/item">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:text-primary transition-colors">
                        <item.icon className="w-5 h-5" />
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{item.label}</p>
                        <p className={cn("text-xl font-bold tracking-tight", item.color)}>{item.value}</p>
                     </div>
                  </div>
               ))}
            </div>
            
            <div className="pt-6 mt-4 border-t border-slate-100 space-y-3">
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <span>Reliability Index</span>
                  <span className="text-primary">{stats.health.toFixed(0)}%</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${stats.health}%` }} className="h-full bg-primary rounded-full transition-all duration-1000" />
               </div>
            </div>
         </div>
      </div>

      <div className="space-y-8 pt-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-4">
               Service Log
               <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold">{filtered.length}</span>
            </h3>
            
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto no-scrollbar scrollbar-hide">
               {tabs.map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                     "px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                     activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  )}
               >
                  {tab}
               </button>
               ))}
            </div>
         </div>

         <div className="grid gap-6">
            {loading ? (
               <div className="h-64 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
               </div>
            ) : (
               <AnimatePresence mode="popLayout">
                  {filtered.map((r) => {
                     const config = getStatusConfig(r.status, r.due_date)
                     return (
                        <motion.div
                          key={r.id}
                          layout
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
                          className="premium-card p-6 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-primary/20 transition-all cursor-pointer"
                        >
                           <div className="flex items-center gap-6 w-full flex-1">
                              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-105", config.bg, config.border, config.text)}>
                                 <config.icon className="w-7 h-7 stroke-[2.5]" />
                              </div>
                              <div className="space-y-1 flex-1">
                                 <div className="flex items-center gap-4 flex-wrap">
                                    <h5 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{r.title}</h5>
                                    <div className={cn("px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-widest border uppercase", config.badge)}>
                                       {config.label}
                                    </div>
                                 </div>
                                 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                                    <span className="text-primary flex items-center gap-1.5"><Car className="w-3.5 h-3.5" /> {r.vehicles?.name}</span>
                                    <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {r.type}</span>
                                    {r.due_date && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Due: {new Date(r.due_date).toLocaleDateString()}</span>}
                                    {r.due_mileage && <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" /> Due: {r.due_mileage.toLocaleString()} KM</span>}
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-4 w-full md:w-auto">
                              <div className="hidden md:block text-right pr-6 border-r border-slate-100 min-w-[100px]">
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Priority</p>
                                 <p className={cn("text-xs font-bold uppercase", r.priority === 'Critical' ? 'text-red-500' : 'text-primary')}>{r.priority}</p>
                              </div>
                              <button className="flex-1 md:w-32 h-11 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all">
                                 Details
                              </button>
                           </div>
                        </motion.div>
                     )
                  })}
                  {filtered.length === 0 && (
                     <div className="premium-card h-64 border-dashed border-2 flex flex-col items-center justify-center gap-4 text-center p-8 bg-slate-50/50" >
                        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                           <Wrench className="w-8 h-8" />
                        </div>
                        <div>
                           <p className="text-lg font-bold text-slate-900">No tasks found</p>
                           <p className="text-xs text-slate-500 font-medium">Relax, everything is running smoothly.</p>
                        </div>
                     </div>
                  )}
               </AnimatePresence>
            )}
            
            <div className="flex items-center justify-center py-4 border-t border-slate-100/60 mt-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
               <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <Terminal className="w-4 h-4 text-primary" />
                  System Monitoring Active · Latency: 4ms · Cloud Synced
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default Maintenance

