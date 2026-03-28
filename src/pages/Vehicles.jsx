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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="premium-card group p-8 hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden"
    >
      <div className="absolute -right-8 -top-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity rotate-12 group-hover:rotate-0 duration-700">
         <Car className="w-56 h-56" />
      </div>

      <div className="flex flex-col h-full relative z-10">
         <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
               <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors">{vehicle.name}</h3>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{vehicle.plate || 'NO PLATE'}</p>
            </div>
            <div className={cn(
               "px-3 py-1 rounded-full flex items-center gap-2 border text-[10px] font-bold uppercase tracking-wider",
               isHealthy ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
            )}>
               <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isHealthy ? "bg-emerald-500" : "bg-amber-500")} />
               {vehicle.health || 'GOOD'}
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Navigation className="w-3 h-3 text-primary" />
                  Mileage
               </p>
               <p className="text-lg font-bold text-slate-900 tracking-tight">{(vehicle.mileage || 0).toLocaleString()} <span className="text-[10px] text-slate-400">KM</span></p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Fuel className="w-3 h-3 text-primary" />
                  Fuel
               </p>
               <p className="text-lg font-bold text-slate-900 tracking-tight">94<span className="text-[10px] text-slate-400">%</span></p>
            </div>
         </div>

         <div className="pt-6 border-t border-slate-100 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 text-slate-400">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               <span className="text-[10px] font-bold uppercase tracking-wider">Insured</span>
            </div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs group/link">
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
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">My Vehicles</h1>
            <p className="text-slate-500 font-medium">Manage and monitor {vehicles.length} active vehicles.</p>
         </div>
         
         <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group w-full sm:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all" />
               <input 
                 placeholder="Search vehicles..." 
                 className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-12 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
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
                  className="premium-card flex flex-col items-center justify-center p-8 border-dashed border-2 border-slate-200 bg-slate-50/30 hover:bg-slate-50 hover:border-primary/20 transition-all min-h-[280px]"
               >
                  <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all mb-4">
                     <Plus className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">Add New Vehicle</h4>
                  <p className="text-xs text-slate-500 font-medium">Register a car, bike or truck</p>
               </button>
            )}
         </div>
      )}

      {/* Stats Summary Footer */}
      {!loading && vehicles.length > 0 && (
         <div className="p-8 bg-white rounded-[32px] border border-slate-200/60 shadow-sm flex flex-wrap items-center justify-between gap-8">
            <div className="flex items-center gap-12">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Distance</p>
                  <p className="text-xl font-bold text-slate-900 leading-none">84,209 <span className="text-xs text-slate-400">KM</span></p>
               </div>
               <div className="w-[1px] h-8 bg-slate-100 hidden sm:block" />
               <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Vehicle Types</p>
                  <div className="flex items-center gap-2">
                     <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black">SUV</span>
                     <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md text-[10px] font-black">SEDAN</span>
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
               <Signal className="w-4 h-4 text-emerald-500" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Active Fleet Monitoring</span>
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

