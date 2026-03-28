import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Filter, Car, Gauge, Fuel, Calendar, 
  ChevronRight, ArrowUpRight, ShieldCheck, MapPin, 
  Settings, Trash2, Edit2, MoreVertical, Loader2,
  Activity, Zap, AlertCircle, CheckCircle2,
  Database, Radio, Terminal, Eye, Navigation, Signal,
  MoreHorizontal
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import AddVehicleModal from '../components/AddVehicleModal'
import { supabase } from '../utils/supabase'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const VehicleCard = ({ vehicle }) => {
  const isHealthy = vehicle.health === 'Excellent' || vehicle.health === 'Good'
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="saas-card group p-8 hover:border-text-main transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity rotate-12 group-hover:rotate-0 duration-700">
         <Car className="w-56 h-56" />
      </div>

      <div className="flex flex-col h-full relative z-10">
         <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
               <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-display font-bold text-text-main tracking-tight group-hover:text-accent transition-colors">{vehicle.name}</h3>
               </div>
               <p className="text-[10px] font-bold text-text-helper uppercase tracking-widest leading-none italic">{vehicle.plate || 'NO PLATE'}</p>
            </div>
            <div className={cn(
               "px-3 py-1 rounded-full flex items-center gap-2 border text-[10px] font-bold uppercase tracking-widest",
               isHealthy ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-accent/5 text-accent border-accent/10"
            )}>
               <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isHealthy ? "bg-emerald-500" : "bg-accent")} />
               {vehicle.health || 'GOOD'}
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-white/50 rounded-2xl border border-border">
               <p className="text-[10px] font-bold text-text-helper uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Navigation className="w-3 h-3 text-text-main" />
                  Mileage
               </p>
               <p className="text-lg font-bold text-text-main tracking-tight italic">{(vehicle.mileage || 0).toLocaleString()} <span className="text-[10px] text-text-helper">KM</span></p>
            </div>
            <div className="p-4 bg-white/50 rounded-2xl border border-border">
               <p className="text-[10px] font-bold text-text-helper uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Fuel className="w-3 h-3 text-text-main" />
                  Fuel
               </p>
               <p className="text-lg font-bold text-text-main tracking-tight italic">94<span className="text-[10px] text-text-helper">%</span></p>
            </div>
         </div>

         <div className="pt-6 border-t border-border flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 text-text-helper italic">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Insured</span>
            </div>
            <div className="flex items-center gap-2 text-text-main font-bold text-[10px] uppercase tracking-widest group/link italic underline decoration-text-main/10 underline-offset-4">
               Details
               <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </div>
         </div>
      </div>
    </motion.div>
  )
}

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchVehicles()

    const channel = supabase.channel('vehicles-registry-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => {
        fetchVehicles(false)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchVehicles = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      setVehicles(data || [])
    } catch (err) {
      console.error('Error fetching vehicles:', err)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    (v.plate && v.plate.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h1 className="text-3xl font-display font-bold text-text-main tracking-tight">My Vehicles</h1>
            <p className="text-text-secondary font-medium">Manage and monitor {vehicles.length} active units.</p>
         </div>
         
         <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group w-full sm:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle group-focus-within:text-text-main transition-all" />
               <input 
                 placeholder="Search units..." 
                 className="w-full h-12 bg-white border border-border rounded-2xl px-12 text-sm focus:outline-none focus:border-text-main transition-all outline-none italic placeholder:text-text-subtle"
                 value={search}
                 onChange={e => setSearch(e.target.value)}
               />
            </div>
            <button 
               onClick={() => setIsAddModalOpen(true)}
               className="h-12 px-8 btn-primary group w-full sm:w-auto"
            >
               <Plus className="w-5 h-5 stroke-[2.5]" /> 
               Add Vehicle
            </button>
         </div>
      </div>

      {loading ? (
         <div className="h-[40vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
         </div>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
               {filteredVehicles.map(v => (
                 <VehicleCard key={v.id} vehicle={v} />
               ))}
            </AnimatePresence>
            
            {/* Empty State / Add New Placeholder */}
            {filteredVehicles.length < 6 && (
               <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="saas-card flex flex-col items-center justify-center p-8 border-dashed border-2 border-border bg-white/30 hover:bg-white hover:border-text-main/20 transition-all min-h-[280px]"
               >
                  <div className="w-16 h-16 rounded-3xl bg-bg-page border border-border flex items-center justify-center text-text-subtle group-hover:text-text-main transition-all mb-4">
                     <Plus className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-text-main italic mb-1 uppercase tracking-tighter">Add New Unit</h4>
                  <p className="text-xs text-text-helper font-medium">Register a car, bike or fleet unit</p>
               </button>
            )}
         </div>
      )}

      {/* Stats Summary Footer */}
      {!loading && vehicles.length > 0 && (
         <div className="p-8 saas-card flex flex-wrap items-center justify-between gap-8 bg-white/40 backdrop-blur-sm">
            <div className="flex items-center gap-12">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-helper uppercase tracking-[0.2em] leading-none italic">Total Fleet Distance</p>
                  <p className="text-xl font-bold text-text-main leading-none italic">84,209 <span className="text-xs text-text-helper">KM</span></p>
               </div>
               <div className="w-[1px] h-8 bg-border hidden sm:block" />
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-helper uppercase tracking-[0.2em] leading-none italic">Active Categories</p>
                  <div className="flex items-center gap-2">
                     <span className="px-2 py-0.5 bg-bg-secondary/40 text-text-main border border-border rounded-md text-[9px] font-black uppercase tracking-widest italic">SUV</span>
                     <span className="px-2 py-0.5 bg-bg-secondary/40 text-text-main border border-border rounded-md text-[9px] font-black uppercase tracking-widest italic">SEDAN</span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-3 text-text-subtle font-mono font-bold text-[10px] italic uppercase tracking-[0.2em]">
               <Signal className="w-4 h-4 text-emerald-500" />
               Realtime Fleet Monitoring
            </div>
         </div>
      )}

      <AddVehicleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={fetchVehicles} 
      />
    </div>
  )
}

export default Vehicles

