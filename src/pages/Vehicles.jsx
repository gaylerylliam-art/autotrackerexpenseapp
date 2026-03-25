import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Plus, Shield, Calendar, CreditCard, PenTool, Trash2, Camera, Palette, ChevronRight, Check, AlertCircle, Fuel, TrendingUp, TrendingDown, ArrowDownUp, MoreHorizontal, Activity, Compass, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const initialVehicles = [
  { 
    id: 1, 
    make: 'BMW', 
    model: 'X5', 
    variant: 'M Sport 2024',
    plate: 'P 12345', 
    odometer: '87,420 km', 
    nextService: '4,580 km',
    health: 98,
    efficiency: '11.2',
    spent: '12.4k',
    status: 'OPTIMAL',
    color: 'bg-accent',
    totalDepreciation: 119000,
    costPerKm: 2.14,
  },
  { 
    id: 2, 
    make: 'Toyota', 
    model: 'Land Cruiser', 
    variant: 'V6 2025',
    plate: 'K 67890', 
    odometer: '12,350 km', 
    nextService: '7,650 km',
    health: 94,
    efficiency: '14.8',
    spent: '4.2k',
    status: 'GOOD',
    color: 'bg-accent2',
    totalDepreciation: 35000,
    costPerKm: 3.42,
  }
]

const Vehicles = () => {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [sortBy, setSortBy] = useState('Default')
  const [showSort, setShowSort] = useState(false)
  const navigate = useNavigate()

  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (sortBy === 'Total Depreciation') return b.totalDepreciation - a.totalDepreciation
    if (sortBy === 'Cost per KM') return b.costPerKm - a.costPerKm
    return 0
  })

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
           <div className="flex flex-col">
             <h2 className="text-2xl font-display font-black tracking-tightest">Fleet Vehicles</h2>
             <p className="text-[10px] text-muted font-mono font-black uppercase tracking-widest">{vehicles.length} active assets</p>
           </div>
        </div>
        
        <div className="relative z-50">
           <button 
             onClick={() => setShowSort(!showSort)}
             className="px-4 py-2 rounded-xl glass border border-white/10 flex items-center gap-2 text-[10px] font-mono font-black text-muted uppercase tracking-widest hover:text-text transition-colors"
           >
              <ArrowDownUp className="w-3 h-3" />
              Rank: {sortBy}
              <ChevronDown className="w-3 h-3" />
           </button>
           <AnimatePresence>
             {showSort && (
               <motion.div 
                 initial={{ opacity: 0, y: -10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: -10, scale: 0.95 }}
                 className="absolute right-0 top-12 w-48 bg-surface2/90 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
               >
                 {['Default', 'Total Depreciation', 'Cost per KM'].map(opt => (
                   <button
                     key={opt}
                     onClick={() => { setSortBy(opt); setShowSort(false) }}
                     className={cn(
                       "w-full text-left px-4 py-3 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all",
                       sortBy === opt ? "bg-accent/20 text-accent border border-accent/20" : "text-muted hover:bg-white/5 hover:text-text"
                     )}
                   >
                     {opt}
                   </button>
                 ))}
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Add Vehicle Button Card */}
        <button className="w-full h-32 rounded-[32px] border-2 border-dashed border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-accent/40 transition-all flex flex-col items-center justify-center gap-3 group active:scale-[0.98]">
           <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-muted group-hover:text-accent transition-colors">
              <Plus className="w-6 h-6" />
           </div>
           <span className="text-[10px] text-muted font-mono font-black uppercase tracking-widest">Add new vehicle</span>
        </button>

        {/* Vehicle Cards */}
        {sortedVehicles.map((v, i) => (
          <motion.div
            key={v.id}
            onClick={() => navigate(`/vehicles/${v.id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-[40px] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden group cursor-pointer active:scale-[0.99] transition-all hover:border-accent/20 relative"
          >
             {/* Rank Badge */}
             {(sortBy === 'Total Depreciation' || sortBy === 'Cost per KM') && (
                <div className="absolute top-8 left-0 pl-8 flex items-center gap-2 opacity-60">
                   <div className="w-6 h-6 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-xs font-display font-black text-white">
                      #{i + 1}
                   </div>
                   <span className="text-[8px] font-mono font-black uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">Ranked by {sortBy}</span>
                </div>
             )}

             <div className="p-8 space-y-8 mt-6">
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3">
                         <h3 className="text-3xl font-display font-black tracking-tightest">{v.make} <span className="text-text/60">{v.model}</span></h3>
                         <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-mono font-black text-muted uppercase tracking-widest">{v.variant}</span>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-sm font-display font-black tracking-tightest text-accent italic uppercase">{v.plate}</span>
                         <div className="flex items-center gap-1.5">
                            <div className={cn("w-1.5 h-1.5 rounded-full", v.health > 95 ? "bg-accent2" : "bg-accent3")} />
                            <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest">{v.status}</span>
                         </div>
                      </div>
                   </div>
                   <div className="w-14 h-14 rounded-2xl bg-surface border border-white/5 flex items-center justify-center text-accent/40 group-hover:text-accent transition-colors">
                      <Car className="w-8 h-8" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="glass p-5 rounded-[24px] border border-white/5 space-y-4">
                      <div className="space-y-1">
                         <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60">Total Deprec.</span>
                         <p className="text-lg font-display font-black tracking-tightest text-text">AED {(v.totalDepreciation/1000).toFixed(1)}k</p>
                      </div>
                   </div>
                   <div className="glass p-5 rounded-[24px] border border-white/5 space-y-4">
                      <div className="space-y-1 text-right">
                         <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60">True Cost/km</span>
                         <p className="text-lg font-display font-black tracking-tightest text-accent3">AED {v.costPerKm}</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-4 gap-4 px-2">
                   {[
                     { label: 'Health', value: `${v.health}%`, icon: Activity, color: 'text-accent2' },
                     { label: 'L/100km', value: v.efficiency, icon: Fuel, color: 'text-accent3' },
                     { label: 'Odometer', value: v.odometer, icon: Compass, color: 'text-accent' },
                     { label: 'Op. Spent', value: v.spent, icon: CreditCard, color: 'text-accent4' },
                   ].map((stat, idx) => (
                     <div key={idx} className="space-y-2">
                        <span className="text-[8px] text-muted font-mono font-black uppercase tracking-widest opacity-40 block">{stat.label}</span>
                        <div className="flex items-center gap-1.5">
                           <stat.icon className={cn("w-3 h-3", stat.color)} />
                           <span className="text-xs font-display font-black tracking-tightest">{stat.value}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             
             {/* Progress Bar for Service */}
             <div className="h-2 w-full bg-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  className="h-full bg-accent shadow-[0_0_10px_rgba(108,99,255,0.4)]"
                />
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Vehicles
