import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Calendar, DollarSign, Activity, AlertCircle, 
  ChevronRight, BadgeInfo, FileText, History, Settings,
  Car, ShieldCheck, TrendingUp, MapPin, Gauge, Fuel, User,
  ArrowUpRight, ArrowDownRight, Zap, Info, ShieldAlert,
  Loader2, Globe, Clock, Landmark, Navigation, Wrench, Database,
  Terminal, Signal, Hash, Sparkles
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { supabase } from '../utils/supabase'
import { buildVehicleSummary } from '../modules/depreciation/depreciation.service'
import DepreciationCard from '../components/DepreciationCard'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const VehicleProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tco, setTco] = useState(null)
  const [recentServices, setRecentServices] = useState([])
  const [valuationTrend, setValuationTrend] = useState([])

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: v, error: vErr } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single()
      
      if (vErr) throw vErr

      const { data: exps, error: eErr } = await supabase
        .from('expenses')
        .select('*')
        .eq('vehicle_id', id)
        .order('date', { ascending: false })

      if (eErr) throw eErr

      const totalSpend = exps?.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0) || 0
      const depSummary = buildVehicleSummary(v, totalSpend)
      
      setVehicle({ ...v, ...depSummary })
      setExpenses(exps || [])
      setTco({ totalTCO: depSummary.tcoIncludingDepreciation })
      
      setValuationTrend([
        { name: 'Purchase', value: depSummary.purchasePrice },
        { name: 'Current', value: depSummary.currentValue },
        { name: 'Accumulated', value: depSummary.accumulatedDepreciation }
      ])

      setRecentServices(exps?.filter(e => e.category === 'Service' || e.category === 'Maintenance' || e.category === 'Repair').slice(0, 3).map(e => ({
        type: e.subcategory || e.category,
        provider: e.vendor || 'Unknown Provider',
        date: new Date(e.date).toLocaleDateString(),
        cost: e.amount.toLocaleString(),
        odometer: e.odometer_reading ? `${e.odometer_reading} km` : '---'
      })) || [])

    } catch (err) {
      console.error('Error fetching vehicle data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="text-center p-20">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-slate-900">Vehicle not found</h2>
        <button onClick={() => navigate('/vehicles')} className="mt-6 text-primary font-bold hover:underline">Back to fleet</button>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Vehicle Identity Card */}
      <div className="premium-card p-10 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl" />
         <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mb-32 blur-3xl opacity-50" />
         
         <div className="relative flex flex-col lg:flex-row items-center gap-12">
            <div className="relative group">
               <div className="w-48 h-48 rounded-[40px] bg-slate-100 overflow-hidden border-4 border-white shadow-2xl relative z-10">
                  <img src={vehicle.image_url || "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=400&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               </div>
               <div className="absolute -inset-4 bg-primary/20 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="flex-1 space-y-6 text-center lg:text-left">
               <div>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-3">
                     <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/10">Active Asset</span>
                     <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest border border-slate-200">Main Fleet</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tight text-slate-900">{vehicle.make} <span className="text-primary">{vehicle.model}</span></h1>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 flex items-center justify-center lg:justify-start gap-3 text-sm">
                     <Hash className="w-4 h-4 text-primary" /> {vehicle.plate}
                  </p>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                  {[
                    { label: 'Asset Value', val: `AED ${vehicle.currentValue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600' },
                    { label: 'Year/Model', val: vehicle.year, icon: Calendar, color: 'text-blue-600' },
                    { label: 'Depreciation', val: `-${vehicle.totalDepreciationPercentage}%`, icon: TrendingUp, color: 'text-rose-600' },
                    { label: 'Fuel Type', val: vehicle.fuel_type || 'Petrol', icon: Fuel, color: 'text-amber-600' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                       <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                          <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
                          {stat.label}
                       </div>
                       <p className="text-lg font-bold text-slate-900 leading-none">{stat.val}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:w-72 w-full">
               <div className="premium-card p-6 bg-slate-900 text-white relative overflow-hidden group/tco">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Activity className="w-16 h-16" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">Lifetime TCO</p>
                  <h2 className="text-3xl font-display font-bold mb-4 relative z-10">AED {tco?.totalTCO.toLocaleString()}</h2>
                  <div className="space-y-3 relative z-10">
                     <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                        <span>Utilization</span>
                        <span className="text-blue-400">84%</span>
                     </div>
                     <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '84%' }} />
                     </div>
                  </div>
                  <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all border border-white/5 relative z-10 flex items-center justify-center gap-2">
                     Generate Report <ArrowUpRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* 2. Key Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="premium-card p-8 flex items-center justify-between group hover:border-primary/20 transition-all">
                  <div className="space-y-4">
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Compliance Status</p>
                        <h3 className="text-xl font-bold text-slate-900">Valid until 2025</h3>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">OPTIMAL</span>
                  </div>
               </div>

               <div className="premium-card p-8 flex items-center justify-between group hover:border-amber-400/20 transition-all">
                  <div className="space-y-4">
                     <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                        <Gauge className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Service Health</p>
                        <h3 className="text-xl font-bold text-slate-900">Critical: 1.2k km</h3>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100">WARNING</span>
                  </div>
               </div>
            </div>

            <div className="premium-card p-10 h-[380px] relative">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Database className="w-6 h-6" />
                     </div>
                     <h4 className="font-display font-bold text-xl tracking-tight text-slate-900">Asset Valuation <span className="text-primary">Timeline</span></h4>
                  </div>
                  <div className="flex gap-2">
                     {['1Y', '2Y', '5Y'].map(t => <button key={t} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all", t === '1Y' ? "bg-primary text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100")}>{t}</button>)}
                  </div>
               </div>
               <div className="h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={valuationTrend}>
                        <defs>
                           <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip 
                           contentStyle={{ borderRadius: '16px', backgroundColor: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#3B82F6" fillOpacity={1} fill="url(#effGrad)" strokeWidth={3} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         <div className="lg:col-span-1">
            <DepreciationCard vehicleId={id} />
         </div>
      </div>

      {/* 3. History and Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="premium-card p-10 space-y-8 group">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-6 h-6" />
               </div>
               <h4 className="font-display font-bold text-xl tracking-tight text-slate-900">Usage <span className="text-primary">Spots</span></h4>
            </div>
            <div className="space-y-6">
               {[
                 { gate: 'Business District', usage: 'Frequent', percentage: 75, color: 'bg-primary' },
                 { gate: 'Residential Bay', usage: 'Regular', percentage: 45, color: 'bg-blue-400' },
                 { gate: 'Industrial Zone', usage: 'Occasional', percentage: 15, color: 'bg-slate-300' },
               ].map((item, i) => (
                 <div key={i} className="space-y-2 group/spot">
                    <div className="flex justify-between items-center">
                       <span className="text-xs text-slate-500 font-bold uppercase tracking-widest group-hover/spot:text-slate-900 transition-colors">{item.gate}</span>
                       <span className="text-[10px] font-bold text-primary">{item.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${item.percentage}%` }} className={cn("h-full rounded-full transition-all duration-1000", item.color)} />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-2 premium-card p-10 space-y-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                     <History className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-xl tracking-tight text-slate-900">Service <span className="text-primary">History</span></h4>
               </div>
               <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Full History</button>
            </div>
            <div className="grid gap-4">
               {recentServices.length === 0 ? (
                 <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                   <p className="text-slate-400 font-medium italic text-sm">No service history found for this vehicle.</p>
                 </div>
               ) : recentServices.map((service, idx) => (
                 <div key={idx} className="p-5 rounded-[24px] bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group/item hover:bg-white hover:border-primary/20 transition-all shadow-sm">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform">
                          <Wrench className="w-6 h-6" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-lg font-bold text-slate-900 leading-none">{service.type}</p>
                          <div className="flex items-center gap-2">
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{service.provider}</p>
                             <span className="w-1 h-1 rounded-full bg-slate-300" />
                             <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest italic">{service.date}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col sm:text-right gap-1">
                       <p className="text-xl font-bold text-slate-900 leading-none">AED {service.cost}</p>
                       <div className="flex items-center sm:justify-end gap-2 text-slate-400">
                          <Gauge className="w-3.5 h-3.5" />
                          <p className="text-[10px] font-bold uppercase tracking-widest">{service.odometer}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between py-10 border-t border-slate-100 gap-6">
         <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <Terminal className="w-4 h-4 text-primary" />
            V-REF: {vehicle.id.slice(0,8).toUpperCase()} · Asset synchronized
         </div>
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time valuation active</span>
         </div>
      </div>
    </div>
  )
}

export default VehicleProfile
