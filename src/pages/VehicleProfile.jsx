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
        <Loader2 className="w-10 h-10 text-text-main animate-spin" />
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="text-center p-20">
        <AlertCircle className="w-16 h-16 text-accent mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-text-main uppercase tracking-tighter italic">Unit not found</h2>
        <button onClick={() => navigate('/vehicles')} className="mt-6 text-text-main font-bold uppercase tracking-widest text-xs hover:underline">Back to fleet ledger</button>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Vehicle Identity Card */}
      <div className="saas-card p-10 overflow-hidden relative bg-white">
         <div className="absolute top-0 right-0 w-96 h-96 bg-text-main/5 rounded-full -mr-48 -mt-48 blur-3xl opacity-20" />
         
         <div className="relative flex flex-col lg:flex-row items-center gap-12">
            <div className="relative group">
               <div className="w-48 h-48 rounded-[40px] bg-bg-page overflow-hidden border-4 border-white shadow-2xl relative z-10">
                  <img src={vehicle.image_url || "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=400&fit=crop"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               </div>
               <div className="absolute -inset-4 bg-text-main/10 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="flex-1 space-y-6 text-center lg:text-left">
               <div>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-3">
                     <span className="px-3 py-1 rounded-full bg-text-main text-white text-[9px] font-black uppercase tracking-[0.2em] border border-text-main">Active Asset</span>
                     <span className="px-3 py-1 rounded-full bg-bg-page text-text-helper text-[9px] font-black uppercase tracking-[0.2em] border border-border">Main Fleet</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tight text-text-main uppercase italic">{vehicle.make} <span className="opacity-40">{vehicle.model}</span></h1>
                  <p className="text-text-helper font-bold uppercase tracking-[0.4em] mt-3 flex items-center justify-center lg:justify-start gap-3 text-xs italic">
                     <Hash className="w-4 h-4 text-text-subtle" /> {vehicle.plate}
                  </p>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                  {[
                    { label: 'Asset Value', val: `AED ${vehicle.currentValue.toLocaleString()}`, icon: DollarSign, color: 'text-text-main' },
                    { label: 'Year/Model', val: vehicle.year, icon: Calendar, color: 'text-text-main' },
                    { label: 'Depreciation', val: `-${vehicle.totalDepreciationPercentage}%`, icon: TrendingUp, color: 'text-accent' },
                    { label: 'Fuel Type', val: vehicle.fuel_type || 'Petrol', icon: Fuel, color: 'text-text-main' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                       <div className="flex items-center gap-2 text-[9px] text-text-helper font-black uppercase tracking-[0.2em] leading-none italic">
                          <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
                          {stat.label}
                       </div>
                       <p className="text-lg font-bold text-text-main leading-none italic tracking-tighter">{stat.val}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:w-72 w-full">
               <div className="saas-card p-6 bg-text-main text-white relative overflow-hidden group/tco">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Activity className="w-16 h-16" />
                  </div>
                  <p className="text-[10px] font-bold text-text-subtle uppercase tracking-[0.2em] mb-1 relative z-10 italic">Lifetime TCO</p>
                  <h2 className="text-3xl font-display font-bold mb-4 relative z-10 italic pb-2 tracking-tighter">AED {tco?.totalTCO.toLocaleString()}</h2>
                  <div className="space-y-3 relative z-10">
                     <div className="flex justify-between items-center text-[9px] uppercase font-black text-text-subtle tracking-widest italic">
                        <span>Utilization</span>
                        <span className="text-white">84%</span>
                     </div>
                     <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: '84%' }} />
                     </div>
                  </div>
                  <button className="w-full mt-8 py-4 bg-white text-text-main hover:bg-white/90 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative z-10 flex items-center justify-center gap-2 italic">
                     Generate Audit <ArrowUpRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* 2. Key Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="saas-card p-8 flex items-center justify-between group hover:border-text-main/10 transition-all bg-white">
                  <div className="space-y-4">
                     <div className="w-12 h-12 rounded-2xl bg-bg-secondary/40 flex items-center justify-center text-text-main group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] text-text-helper font-bold uppercase tracking-widest italic">Compliance Status</p>
                        <h3 className="text-xl font-bold text-text-main tracking-tight uppercase italic">Valid until 2025</h3>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-[9px] font-black border border-emerald-100 uppercase tracking-widest italic">Optimal</span>
                  </div>
               </div>
 
               <div className="saas-card p-8 flex items-center justify-between group hover:border-text-main/10 transition-all bg-white">
                  <div className="space-y-4">
                     <div className="w-12 h-12 rounded-2xl bg-bg-secondary/40 flex items-center justify-center text-text-main group-hover:scale-110 transition-transform">
                        <Gauge className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="text-[10px] text-text-helper font-bold uppercase tracking-widest italic">Service Health</p>
                        <h3 className="text-xl font-bold text-text-main tracking-tight uppercase italic">Critical Level</h3>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="px-3 py-1.5 rounded-xl bg-accent/5 text-accent text-[9px] font-black border border-accent/10 uppercase tracking-widest italic">Warning</span>
                  </div>
               </div>
            </div>

            <div className="saas-card p-10 h-[380px] relative bg-white">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-text-main/5 flex items-center justify-center text-text-main">
                        <Database className="w-5 h-5" />
                     </div>
                     <h4 className="font-display font-bold text-xl tracking-tight text-text-main uppercase italic">Asset Valuation <span className="opacity-30">Series</span></h4>
                  </div>
                  <div className="flex gap-2">
                     {['1Y', '2Y', '5Y'].map(t => <button key={t} className={cn("px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all italic", t === '1Y' ? "bg-text-main text-white" : "bg-bg-page text-text-helper border border-border hover:bg-white")}>{t}</button>)}
                  </div>
               </div>
                <div className="h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={valuationTrend}>
                        <defs>
                           <linearGradient id="effGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0F1010" stopOpacity={0.05}/>
                              <stop offset="95%" stopColor="#0F1010" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" hide />
                        <YAxis hide />
                        <Tooltip 
                           contentStyle={{ borderRadius: '16px', backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', fontSize: '11px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#0F1010" fillOpacity={1} fill="url(#effGrad)" strokeWidth={3} />
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
         <div className="saas-card p-10 space-y-8 group bg-white">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-text-main/5 flex items-center justify-center text-text-main">
                  <MapPin className="w-5 h-5" />
               </div>
               <h4 className="font-display font-bold text-xl tracking-tight text-text-main uppercase italic">Usage <span className="opacity-30">Nodes</span></h4>
            </div>
             <div className="space-y-6">
               {[
                 { gate: 'Business District', usage: 'Frequent', percentage: 75, color: 'bg-text-main' },
                 { gate: 'Residential Bay', usage: 'Regular', percentage: 45, color: 'bg-text-helper' },
                 { gate: 'Industrial Zone', usage: 'Occasional', percentage: 15, color: 'bg-text-subtle' },
               ].map((item, i) => (
                 <div key={i} className="space-y-2 group/spot">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest italic">
                       <span className="text-text-helper group-hover/spot:text-text-main transition-colors leading-none">{item.gate}</span>
                       <span className="text-text-main">{item.percentage}%</span>
                    </div>
                    <div className="h-1 w-full bg-bg-page rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${item.percentage}%` }} className={cn("h-full rounded-full transition-all duration-1000", item.color)} />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-2 saas-card p-10 space-y-8 bg-white">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-text-main/5 flex items-center justify-center text-text-main">
                     <History className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-xl tracking-tight text-text-main uppercase italic">Service <span className="opacity-30">Registry</span></h4>
               </div>
               <button className="text-[10px] font-black text-text-main uppercase tracking-[0.2em] italic hover:underline">Full Archive</button>
            </div>
            <div className="grid gap-4">
               {recentServices.length === 0 ? (
                 <div className="p-10 text-center border-2 border-dashed border-border rounded-[32px]">
                   <p className="text-text-helper font-medium italic text-sm">No service history found for this vehicle.</p>
                 </div>
               ) : recentServices.map((service, idx) => (
                 <div key={idx} className="p-6 rounded-[24px] bg-bg-page border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6 group/item hover:bg-white transition-all shadow-sm">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center text-text-main group-hover/item:scale-110 transition-transform">
                          <Wrench className="w-5 h-5" />
                       </div>
                       <div className="space-y-1">
                          <p className="text-lg font-bold text-text-main leading-none italic uppercase tracking-tighter">{service.type}</p>
                          <div className="flex items-center gap-3">
                             <p className="text-[10px] text-text-helper font-black uppercase tracking-[0.2em] leading-none italic">{service.provider}</p>
                             <span className="w-1 h-1 rounded-full bg-border" />
                             <span className="text-[10px] text-text-helper font-bold uppercase tracking-widest italic">{service.date}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-col sm:text-right gap-1">
                       <p className="text-xl font-bold text-text-main leading-none italic tracking-tighter">AED {service.cost}</p>
                       <div className="flex items-center sm:justify-end gap-2 text-text-subtle">
                          <Gauge className="w-3.5 h-3.5" />
                          <p className="text-[10px] font-black uppercase tracking-widest italic">{service.odometer}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between py-10 border-t border-border gap-6">
         <div className="flex items-center gap-6 text-[9px] font-black text-text-helper uppercase tracking-[0.4em] italic">
            <Terminal className="w-4 h-4 text-text-subtle" />
            V-REF: {vehicle.id.slice(0,8).toUpperCase()} · ASSET_SYNC_ACTIVE
         </div>
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-text-helper uppercase tracking-[0.2em] italic">Real-time precision engine active</span>
         </div>
      </div>
    </div>
  )
}

export default VehicleProfile
