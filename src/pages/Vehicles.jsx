import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Plus, Shield, Calendar, CreditCard, PenTool, Trash2, Camera, Palette, ChevronRight, Check, AlertCircle, Fuel, TrendingUp, MoreHorizontal, Activity } from 'lucide-react'
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
    color: 'bg-accent'
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
    color: 'bg-accent2'
  }
]

const Vehicles = () => {
  const [vehicles, setVehicles] = useState(initialVehicles)

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <h2 className="text-2xl font-display font-black tracking-tightest">My Garage</h2>
             <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          <p className="text-[10px] text-muted font-mono font-black uppercase tracking-widest">{vehicles.length} active vehicles</p>
        </div>
        <button className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-muted hover:text-text active:scale-95 transition-all">
           <MoreHorizontal className="w-5 h-5" />
        </button>
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
        {vehicles.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-[40px] border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden group cursor-pointer active:scale-[0.99] transition-all"
          >
             <div className="p-8 space-y-8">
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
                         <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60">Odometer</span>
                         <p className="text-lg font-display font-black tracking-tightest text-text">{v.odometer}</p>
                      </div>
                   </div>
                   <div className="glass p-5 rounded-[24px] border border-white/5 space-y-4">
                      <div className="space-y-1 text-right">
                         <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60">Next Service</span>
                         <p className="text-lg font-display font-black tracking-tightest text-text">{v.nextService}</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-4 gap-4 px-2">
                   {[
                     { label: 'Health', value: `${v.health}%`, icon: Activity, color: 'text-accent2' },
                     { label: 'L/100km', value: v.efficiency, icon: Fuel, color: 'text-accent3' },
                     { label: 'Total km', value: '4.2k', icon: Compass, color: 'text-accent' },
                     { label: 'Spent', value: v.spent, icon: CreditCard, color: 'text-accent4' },
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
