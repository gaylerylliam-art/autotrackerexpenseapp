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
import { useOrganization } from '../context/OrganizationContext'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const CATEGORIES = ['All', 'Personal', 'Business']

const Trips = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const { currentOrg } = useOrganization()

  useEffect(() => {
    fetchTrips()
  }, [currentOrg])

  const fetchTrips = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('trips')
        .select(`
          *,
          vehicles (
            name,
            plate
          )
        `)
        .order('start_time', { ascending: false })
      
      if (currentOrg) {
        query = query.eq('organization_id', currentOrg.id)
      }

      const { data, error } = await query
      
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

  const filteredTrips = trips.filter(t => filter === 'All' || t.classification?.toLowerCase() === filter.toLowerCase())

  const metrics = trips.reduce((acc, curr) => {
    const d = parseFloat(curr.distance) || 0
    if (curr.classification === 'business') {
      acc.businessMileage += d
      acc.reimbursement += d * 0.45 // Example rate
    }
    return acc
  }, { businessMileage: 0, reimbursement: 0 })

  return (
    <div className="space-y-12 pb-24 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
         <div className="space-y-3">
            <h1 className="text-4xl font-display font-black tracking-tighter text-text-main italic uppercase leading-none">Movement <span className="text-primary tracking-normal">Log</span></h1>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                  <Navigation className="w-4 h-4 text-primary opacity-40" />
                  <p className="text-[10px] text-text-helper font-black uppercase tracking-[0.4em] leading-none italic">Automatic Telemetry Engine ACTIVE</p>
               </div>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow animate-pulse" />
               <span className="text-[10px] text-emerald-600 font-black italic uppercase leading-none tracking-widest">Global Sync: Stable</span>
            </div>
         </div>
         
         <div className="flex bg-white p-2 rounded-2xl border border-blue-50 shadow-premium">
            {CATEGORIES.map(cat => (
               <button 
                  key={cat} 
                  onClick={() => setFilter(cat)}
                  className={cn("h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all", filter === (cat) ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-text-helper hover:text-primary")}
               >
                  {cat}
               </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Business Mileage', val: `${metrics.businessMileage.toFixed(1)} km`, icon: Briefcase, color: 'text-primary', bg: 'bg-blue-50', sub: 'Calculated from Manifest' },
           { label: 'Estimated Credits', val: `AED ${metrics.reimbursement.toLocaleString()}`, icon: Coins, color: 'text-emerald-500', bg: 'bg-emerald-50', sub: 'at 0.45 AED/km' },
           { label: 'Tax Projection', val: `AED ${(metrics.reimbursement * 0.3).toFixed(0)}`, icon: Wallet, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Q3 Projected Refund' },
           { label: 'Active Logs', val: `${trips.length} Nodes`, icon: Navigation, color: 'text-amber-500', bg: 'bg-amber-50', sub: 'Journal Sequence' },
         ].map((card, i) => (
            <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
               className="saas-card p-8 flex flex-col justify-between group overflow-hidden relative h-56"
            >
               <div className="w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 transition-transform group-hover:scale-110" style={{ backgroundColor: card.bg.replace('bg-', '') }}>
                  <div className={cn("w-full h-full rounded-2xl flex items-center justify-center", card.bg)}>
                    <card.icon className={cn("w-6 h-6 stroke-[2.5]", card.color)} />
                  </div>
               </div>
               <div className="space-y-1 relative z-10">
                  <p className="text-[9px] text-text-helper font-black uppercase tracking-[0.2em] italic leading-none">{card.label}</p>
                  <h3 className="text-2xl font-display font-black text-text-main italic tracking-tighter leading-none group-hover:text-primary transition-colors">{card.val}</h3>
                  <p className="text-[9px] text-text-subtle font-bold uppercase tracking-widest italic opacity-60">{card.sub}</p>
               </div>
            </motion.div>
         ))}
      </div>

      <div className="saas-card p-10 overflow-hidden relative">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10 mb-12">
            <div className="space-y-2">
               <h3 className="text-2xl font-display font-black text-text-main italic uppercase leading-none tracking-tighter">Telematics <span className="text-primary italic">Index</span></h3>
               <p className="text-[10px] text-text-helper font-bold uppercase tracking-widest italic leading-none">Global Distributed Asset Manifest</p>
            </div>
         </div>

         <div className="grid gap-4 relative z-10 w-full">
            {loading ? (
               <div className="p-20 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
               </div>
            ) : filteredTrips.length === 0 ? (
               <div className="p-20 text-center text-text-subtle italic font-bold uppercase tracking-widest">Zero Telemetry Nodes Found</div>
            ) : filteredTrips.map((trip, idx) => (
               <div key={trip.id} className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-8 hover:bg-white hover:border-primary/20 transition-all duration-300 cursor-pointer group/node">
                  <div className="flex items-center gap-8">
                     <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center border transition-all",
                        trip.classification === 'business' ? 'bg-primary/5 text-primary border-primary/10' : 'bg-white text-text-helper border-slate-100'
                     )}>
                        <Navigation className="w-7 h-7 stroke-[2.5] group-hover/node:rotate-45 transition-transform" />
                     </div>
                     
                     <div className="space-y-2 text-left">
                        <div className="flex items-center gap-4">
                           <h4 className="text-2xl font-display font-black text-text-main italic uppercase tracking-tighter leading-none group-hover/node:text-primary transition-colors">{trip.distance} KM</h4>
                           <div className={cn(
                              "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border italic",
                              trip.classification === 'business' ? 'bg-blue-50 text-primary border-primary/10' : 'bg-slate-100 text-text-subtle border-slate-200'
                           )}>{trip.classification?.toUpperCase() || 'UNCATEGORIZED'}</div>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-text-helper font-bold uppercase tracking-widest italic opacity-60">
                           <span>{trip.vehicles?.name.toUpperCase() || 'GLOBAL_NODE'}</span>
                           <div className="w-1 h-1 rounded-full bg-slate-200" />
                           <span>{new Date(trip.start_time).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-text-subtle font-bold uppercase tracking-widest italic">
                           <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /> {trip.origin_node || 'DXB_PORT_01'}</div>
                           <ChevronRight className="w-3 h-3 text-slate-200" />
                           <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /> {trip.destination_node || 'DXB_SOUTH_04'}</div>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-8">
                     <div className="flex flex-col text-right gap-1 pr-8 border-r border-slate-100">
                        <span className="text-[9px] text-text-subtle font-black uppercase tracking-widest italic opacity-60">Credit Val</span>
                        <p className={cn("text-xl font-display font-black italic tracking-tighter leading-none", trip.classification === 'business' ? 'text-primary' : 'text-slate-300')}>AED {(trip.distance * 0.45).toFixed(2)}</p>
                     </div>
                     
                     <div className="flex gap-2">
                        <button 
                           onClick={() => handleClassify(trip.id, 'business')}
                           className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all", trip.classification === 'business' ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-text-helper border border-slate-100 hover:border-primary/20")}
                        >
                           <Briefcase className="w-5 h-5 stroke-[2.5]" />
                        </button>
                        <button 
                           onClick={() => handleClassify(trip.id, 'personal')}
                           className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all", trip.classification === 'personal' ? "bg-text-main text-white shadow-lg shadow-black/10" : "bg-white text-text-helper border border-slate-100 hover:border-primary/20")}
                        >
                           <User className="w-5 h-5 stroke-[2.5]" />
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
      
      <div className="p-8 border border-blue-50 bg-white rounded-3xl flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
         <div className="flex items-center gap-6 text-[9px] font-bold uppercase tracking-[0.4em] italic text-text-helper flex-1">
            <Terminal className="w-5 h-5 text-primary" />
            Registry Uplink: STABLE · Local GPS Precision: 0.2m · Sync Frequency: 120s · Encryption: AES_256_GCM
         </div>
      </div>
    </div>
  )
}

export default Trips
