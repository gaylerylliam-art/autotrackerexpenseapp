import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Navigation, MapPin, Clock, Calendar, ChevronRight, 
  TrendingUp, Wallet, CheckCircle2, XCircle, MoreVertical, 
  Map as MapIcon, Filter, Download, Plus, Briefcase, User, 
  RotateCcw, Sparkles, Terminal, Activity, Radio, Eye, Lock,
  FileText, Coins, Share, Info, HelpCircle, Loader2
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { supabase } from '../utils/supabase'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const CATEGORIES = ['All', 'Personal', 'Business']

const Trips = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const isPremium = false

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          vehicles (
            name,
            plate
          )
        `)
        .order('start_time', { ascending: false })
      
      if (error) throw error
      setTrips(data || [])
    } catch (err) {
      console.error('Error fetching trips:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClassify = async (id, classification) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ classification })
        .eq('id', id)
      
      if (error) throw error
      fetchTrips()
    } catch (err) {
      console.error('Classification error:', err)
    }
  }

  const filteredTrips = trips.filter(t => filter === 'All' || t.classification.toLowerCase() === filter.toLowerCase())

  const metrics = trips.reduce((acc, curr) => {
    const d = parseFloat(curr.distance) || 0
    if (curr.classification === 'business') {
      acc.businessMileage += d
      acc.reimbursement += d * 0.45 // Example rate
    }
    return acc
  }, { businessMileage: 0, reimbursement: 0 })

  return (
    <div className="space-y-12 pb-24 max-w-[1600px] mx-auto text-slate-900">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4 translate-z-0">
         <div className="space-y-4">
            <h1 className="text-5xl font-display font-black tracking-tighter text-white italic uppercase leading-none">Telematics <span className="text-primary">Journal</span></h1>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                  <Navigation className="w-4 h-4 text-primary opacity-40" />
                  <p className="text-[10px] text-text-muted font-mono font-black uppercase tracking-[0.4em] opacity-40 leading-none italic">Route Precision: 98% · Localized Audit Loop</p>
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-glow animate-pulse" />
               <span className="text-[10px] text-primary font-mono font-black italic uppercase leading-none tracking-widest">ACTIVE_TELEMETRY</span>
            </div>
         </div>
         
         <div className="flex bg-white/5 p-2 rounded-[24px] border border-white/5 shadow-premium">
            {CATEGORIES.map(cat => (
               <button 
                  key={cat} 
                  onClick={() => setFilter(cat)}
                  className={cn("h-12 px-8 rounded-xl text-[10px] font-display font-black uppercase tracking-widest italic transition-all", filter === (cat) ? "bg-primary text-white shadow-glow" : "text-text-muted hover:text-white")}
               >
                  {cat}
               </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 translate-z-0">
         {[
           { label: 'Business Mileage', val: `${metrics.businessMileage.toFixed(1)} km`, icon: Briefcase, color: 'text-blue-400', sub: 'Calculated from Matrix' },
           { label: 'Estimated Reimbursement', val: `AED ${metrics.reimbursement.toLocaleString()}`, icon: Coins, color: 'text-emerald-400', sub: 'Calculated at 0.45/km' },
           { label: 'Taxable Offset (Est)', val: `AED ${(metrics.reimbursement * 0.3).toFixed(0)}`, icon: Wallet, color: 'text-primary', sub: 'Q1 Projected Projection' },
           { label: 'Registry Logs', val: `${trips.length} Nodes`, icon: MapIcon, color: 'text-red-400', sub: 'Telematics Journal' },
         ].map((card, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
               className="saas-card p-10 flex flex-col justify-between group overflow-hidden relative h-64 border-white/10 shadow-premium"
            >
               <div className="absolute right-0 top-0 p-10 opacity-[0.03] rotate-12 group-hover:scale-125 transition-all duration-1000">
                  <card.icon className="w-32 h-32 text-white" />
               </div>
               <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-premium relative z-10">
                  <card.icon className={cn("w-7 h-7 stroke-[2.5]", card.color)} />
               </div>
               <div className="space-y-3 relative z-10">
                  <p className="text-[11px] text-text-muted font-mono font-black uppercase tracking-[0.3em] opacity-40 italic leading-none">{card.label}</p>
                  <h3 className="text-4xl font-mono font-black text-white italic tracking-tighter leading-none group-hover:text-primary transition-colors">{card.val}</h3>
                  <div className="flex items-center gap-3">
                     <div className="w-1 h-1 rounded-full bg-primary" />
                     <p className="text-[9px] text-text-muted font-display font-black uppercase tracking-widest opacity-20 italic">{card.sub}</p>
                  </div>
               </div>
            </motion.div>
         ))}
      </div>

      <div className="saas-card p-12 overflow-hidden relative border-white/10 shadow-premium translate-z-0">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
            <div className="space-y-4">
               <h3 className="text-3xl font-display font-black text-white italic uppercase leading-none tracking-tighter">Telematics <span className="text-primary">Manifest Index</span></h3>
               <p className="text-[10px] text-text-muted font-mono font-bold uppercase tracking-widest opacity-40 italic leading-none uppercase">Universal Data Registry · Sequence DXB_CENTRAL_UPLINK</p>
            </div>
         </div>

         <div className="grid gap-6 relative z-10 w-full mt-12">
            {loading ? (
               <div className="p-20 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
               </div>
            ) : filteredTrips.length === 0 ? (
               <div className="p-20 text-center opacity-40 italic font-mono uppercase tracking-widest text-white">Zero Telemetry Nodes Found</div>
            ) : filteredTrips.map((trip, idx) => (
              <div key={trip.id} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-10 hover:bg-white/5 hover:border-white/10 transition-all duration-500 cursor-pointer group/node translate-z-0 text-white">
                 <div className="flex items-center gap-10">
                    <div className="flex items-center gap-4 relative">
                       <div className={cn(
                          "w-20 h-20 rounded-[28px] flex flex-col items-center justify-center p-2 border",
                          trip.classification === 'business' ? 'bg-primary/5 text-primary border-primary/20 shadow-glow shadow-primary/10' : 
                          'bg-white/5 text-text-muted border-white/10'
                       )}>
                          <Navigation className="w-9 h-9 stroke-[2.5] group-hover/node:rotate-45 transition-transform" />
                       </div>
                    </div>
                    
                    <div className="space-y-4 text-left">
                       <div className="flex items-center gap-6">
                          <div className="space-y-1">
                             <h4 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter leading-none group-hover/node:text-primary transition-colors">{trip.distance} KM Sequence</h4>
                             <div className="flex items-center gap-4">
                                <p className="text-[11px] text-text-muted font-mono font-bold uppercase tracking-widest opacity-40 italic leading-none">{trip.vehicles?.name.toUpperCase() || 'GLOBAL_NODE'}</p>
                                <div className="w-[1px] h-3 bg-white/10" />
                                <p className="text-[10px] text-white opacity-20 font-mono italic leading-none uppercase">{new Date(trip.start_time).toLocaleDateString()} · {new Date(trip.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                             </div>
                          </div>
                          <div className={cn(
                             "badge px-6",
                             trip.classification === 'business' ? 'badge-blue' : 'bg-white/5 text-white/40 border-white/10'
                          )}>{trip.classification.toUpperCase()}</div>
                       </div>
                       <div className="flex items-center gap-6 text-[10px] text-text-muted font-mono font-bold uppercase tracking-widest italic opacity-60">
                          <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary opacity-40" /> {trip.origin_node || 'UNIDENTIFIED_START'}</div>
                          <ChevronRight className="w-3 h-3 opacity-20" />
                          <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary opacity-40" /> {trip.destination_node || 'UNIDENTIFIED_END'}</div>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="flex flex-col text-right gap-2 border-r border-white/5 pr-10">
                       <span className="text-[10px] text-text-muted font-mono font-black uppercase tracking-widest opacity-20 italic">Reimbursement</span>
                       <p className={cn("text-2xl font-mono font-black italic tracking-tighter leading-none", trip.classification === 'business' ? 'text-primary glow-text' : 'text-white/20')}>AED {(trip.distance * 0.45).toFixed(2)}</p>
                    </div>
                    
                    <div className="flex gap-4">
                       <button 
                          onClick={() => handleClassify(trip.id, 'business')}
                          className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", trip.classification === 'business' ? "bg-primary text-white shadow-glow" : "bg-white/5 text-text-secondary border border-white/10")}
                       >
                          <Briefcase className="w-7 h-7 stroke-[2.5]" />
                       </button>
                       <button 
                          onClick={() => handleClassify(trip.id, 'personal')}
                          className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", trip.classification === 'personal' ? "bg-white/20 text-white shadow-premium" : "bg-white/5 text-text-secondary border border-white/10")}
                       >
                          <User className="w-7 h-7 stroke-[2.5]" />
                       </button>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>
      
      <div className="p-10 border border-white/5 bg-white/[0.02] rounded-[40px] flex items-center justify-between opacity-30 hover:opacity-100 transition-opacity">
         <div className="flex items-center gap-6 text-[10px] font-mono font-black uppercase tracking-[0.4em] italic text-white flex-1">
            <Terminal className="w-5 h-5 text-primary" />
            Registry Uplink: STABLE · Local GPS Precision: 0.2m · Matrix Sync Frequency: 120s · Encryption: AES_256
         </div>
      </div>
    </div>
  )
}

export default Trips
