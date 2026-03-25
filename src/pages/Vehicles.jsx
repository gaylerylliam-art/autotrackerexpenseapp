import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Plus, Shield, Calendar, CreditCard, PenTool, Trash2, Camera, Palette, ChevronRight, Check, AlertCircle, Fuel, TrendingUp } from 'lucide-react'

const initialVehicles = [
  { 
    id: 1, 
    make: 'BMW', 
    model: 'X5 M50i', 
    year: 2023, 
    plate: 'P 12345', 
    color: '#6c63ff', 
    odometer: '86,370 km', 
    status: 'Maintenance Due',
    health: 92,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60'
  },
  { 
    id: 2, 
    make: 'Toyota', 
    model: 'Land Cruiser', 
    year: 2024, 
    plate: 'K 67890', 
    color: '#3ecf8e', 
    odometer: '12,450 km', 
    status: 'Good Health',
    health: 98,
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&auto=format&fit=crop&q=60'
  }
]

const Vehicles = () => {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-muted font-mono text-[11px] uppercase tracking-widest font-bold">Garage Management</span>
          <h2 className="text-3xl font-display font-extrabold tracking-tightest">Your <span className="gradient-text">Fleet</span></h2>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center shadow-[0_8px_20px_rgba(108,99,255,0.4)] active:scale-90 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-5 rounded-3xl border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold block">Active Vehicles</span>
          <span className="text-2xl font-display font-black tracking-tightest">{vehicles.length}</span>
        </div>
        <div className="glass p-5 rounded-3xl border border-white/5 space-y-1">
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold block">Total Value Est.</span>
          <span className="text-2xl font-display font-black tracking-tightest">AED 420k</span>
        </div>
      </div>

      {/* Vehicle Cards */}
      <div className="grid gap-6 pb-12">
        {vehicles.map((v) => (
          <motion.div
            key={v.id}
            layoutId={`v-${v.id}`}
            className="glass rounded-[32px] border border-white/10 overflow-hidden relative group cursor-pointer"
          >
            {/* Background Image with Gradient Overlay */}
            <div className="h-48 relative overflow-hidden">
               <img src={v.image} alt={v.model} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
               <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
               <div className="absolute top-4 right-4 px-3 py-1.5 glass rounded-xl border border-white/20 text-[10px] font-mono font-bold uppercase tracking-widest backdrop-blur-md">
                 {v.year}
               </div>
               <div className="absolute bottom-4 left-6">
                 <h3 className="text-2xl font-display font-black tracking-tightest text-white leading-none drop-shadow-lg">{v.make} <span className="text-accent">{v.model}</span></h3>
                 <p className="text-white/60 font-mono text-xs uppercase tracking-[0.2em] mt-2 drop-shadow-md">{v.plate}</p>
               </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="p-6 grid grid-cols-3 gap-4 border-t border-white/5">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-muted uppercase tracking-widest font-bold">Odometer</span>
                <div className="flex items-center gap-2">
                  <Car className="w-3 h-3 text-accent" />
                  <span className="text-xs font-display font-bold tracking-tightest text-text">{v.odometer}</span>
                </div>
              </div>
              <div className="space-y-1 border-x border-white/5 px-4 text-center">
                <span className="text-[9px] font-mono text-muted uppercase tracking-widest font-bold">Health</span>
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className={`w-3 h-3 ${v.health > 95 ? 'text-accent2' : 'text-accent3'}`} />
                  <span className={`text-xs font-display font-black tracking-tightest ${v.health > 95 ? 'text-accent2' : 'text-accent3'}`}>{v.health}%</span>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[9px] font-mono text-muted uppercase tracking-widest font-bold">Next Service</span>
                <div className="flex items-center justify-end gap-2">
                   <PenTool className="w-3 h-3 text-accent4" />
                   <span className="text-[10px] font-mono text-white/80">1,200 km</span>
                </div>
              </div>
            </div>

            {/* Status Footer */}
            <div className="px-6 py-4 bg-white/[0.02] flex items-center justify-between border-t border-white/5">
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${v.health > 95 ? 'bg-accent2' : 'bg-accent4'} animate-pulse shadow-[0_0_8px_rgba(62,207,142,0.4)]`} />
                  <span className="text-[11px] font-mono uppercase tracking-widest text-muted">{v.status}</span>
               </div>
               <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Vehicle Modal (Simulation) */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-bg/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg glass rounded-[40px] border border-white/10 p-8 space-y-8 relative z-10"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                   <h2 className="text-2xl font-display font-black tracking-tightest">Add <span className="gradient-text">New Vehicle</span></h2>
                   <p className="text-muted text-xs font-mono uppercase tracking-widest">Provide Mulkiya Details</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-2 glass rounded-full border border-white/10 group">
                  <Plus className="w-5 h-5 text-muted rotate-45 group-hover:text-text transition-all" />
                </button>
              </div>

              {/* Form Grid */}
              <div className="space-y-6">
                 {/* Make & Model */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-bold">Make</label>
                       <input type="text" placeholder="e.g. BMW" className="w-full bg-surface2 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all placeholder:text-muted/30" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-bold">Model</label>
                       <input type="text" placeholder="e.g. X5" className="w-full bg-surface2 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all placeholder:text-muted/30" />
                    </div>
                 </div>

                 {/* Plate Number */}
                 <div className="space-y-2">
                    <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-bold">Plate Number (Dubai Format)</label>
                    <div className="relative">
                      <input type="text" placeholder="P 12345" className="w-full bg-surface/50 border border-white/10 rounded-2xl px-4 py-4 text-base font-display font-black tracking-widest focus:outline-none focus:border-accent transition-all placeholder:text-muted/20 text-center uppercase" />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/40 font-mono text-[10px] italic">UAE</div>
                    </div>
                 </div>

                 {/* Odometer & Year */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 text-center">
                       <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-bold">Current Odometer</label>
                       <div className="flex items-center gap-3">
                          <input type="number" placeholder="86370" className="w-full bg-surface2 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all text-right" />
                          <span className="text-muted text-xs font-mono">km</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-bold">Initial Color</label>
                       <div className="flex gap-2">
                          {['#6c63ff', '#3ecf8e', '#f7c948', '#ff6b6b', '#38bdf8'].map(c => (
                            <div key={c} className="w-8 h-8 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all border border-white/10" style={{ backgroundColor: c }} />
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button className="flex-1 py-4 bg-accent text-white rounded-2xl font-display font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                   Save Vehicle
                 </button>
                 <button className="p-4 glass rounded-2xl border border-white/10">
                   <Camera className="w-5 h-5 text-muted" />
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="h-4" />
    </div>
  )
}

export default Vehicles
