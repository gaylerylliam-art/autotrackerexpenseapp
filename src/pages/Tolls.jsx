import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, RefreshCw, AlertCircle, CheckCircle2, ChevronRight, 
  Settings2, History, Plus, Globe, Zap, ShieldCheck, Activity, 
  Compass, Navigation, Radio, Terminal, Server, ShieldAlert, Cpu
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const TollCenter = () => {
  const [isSyncing, setIsSyncing] = useState(false)

  const handleManualSync = () => {
    setIsSyncing(true)
    setTimeout(() => setIsSyncing(false), 2000)
  }

  const tollSystems = [
    { 
      name: 'Salik', 
      region: 'Dubai', 
      status: 'connected', 
      lastSync: '10:42 AM',
      id: 'D-55210'
    },
    { 
      name: 'Darb', 
      region: 'Abu Dhabi', 
      status: 'disconnected', 
      lastSync: 'Never',
      id: null
    },
    { 
      name: 'Aber', 
      region: 'Umm Al Quwain', 
      status: 'disconnected', 
      lastSync: 'Never',
      id: null
    }
  ]

  return (
    <div className="space-y-12 pb-24">
      
      {/* 1. Header & Sync Control (Fina Style) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
         <div className="space-y-2">
            <h2 className="text-4xl font-display font-black tracking-tighter text-white italic uppercase leading-none">Toll <span className="text-primary glow-text">Integration</span></h2>
            <div className="flex items-center gap-4">
               <p className="text-[10px] text-text-muted font-mono font-bold uppercase tracking-widest leading-none opacity-40 italic">Automated Gateway Logic · UAE National Systems</p>
               <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
               <div className="flex items-center gap-2 text-[9px] font-display font-black text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 shadow-glow italic">
                  <ShieldCheck className="w-4 h-4" />
                  Gateway Verified
               </div>
            </div>
         </div>

         <div className="flex gap-6">
            <button 
              onClick={handleManualSync}
              className={cn(
                "h-16 px-10 rounded-[24px] font-display font-black text-[11px] uppercase tracking-widest italic shadow-glow flex items-center justify-center gap-4 transition-all active:scale-95 group/btn",
                isSyncing ? "bg-primary text-white" : "btn-glass border-white/10 text-white hover:bg-white/10"
              )}
            >
               <RefreshCw className={cn("w-5 h-5 stroke-[2.5]", isSyncing && "animate-spin")} />
               <span className="text-white">{isSyncing ? 'Synchronizing Nodes' : 'Refresh Telemetry'}</span>
            </button>
            <button className="btn-glass h-16 w-16 p-0 shadow-premium">
               <Settings2 className="w-7 h-7 stroke-[2]" />
            </button>
         </div>
      </div>

      {/* 2. Global Connectivity Summary (Glass High-Fid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="saas-card p-10 flex items-center justify-between group overflow-hidden relative border border-emerald-500/20 shadow-glow bg-emerald-500/5">
            <div className="absolute right-0 top-0 p-10 opacity-[0.05] scale-150 rotate-12 transition-transform duration-1000 group-hover:scale-125 pointer-events-none">
               <CheckCircle2 className="w-32 h-32 text-emerald-500" />
            </div>
            <div className="flex items-center gap-10 relative z-10 w-full translate-z-0">
               <div className="w-20 h-20 rounded-[28px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-glow group-hover:rotate-12 transition-transform">
                  <Activity className="w-10 h-10 stroke-[2.5]" />
               </div>
               <div className="space-y-3">
                  <h4 className="text-2xl font-display font-black text-white tracking-tighter italic uppercase leading-none">3 Systems <span className="text-emerald-400 glow-text">Active</span></h4>
                  <div className="flex items-center gap-4">
                     <p className="text-[10px] text-emerald-400/60 font-mono font-black uppercase tracking-widest italic leading-none">All National Nodes Functional</p>
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                     <span className="text-[10px] text-white opacity-40 font-mono italic">SYNC_OK</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="saas-card p-10 flex items-center justify-between group overflow-hidden relative border border-red-500/20 shadow-glow bg-red-500/5">
            <div className="absolute right-0 top-0 p-10 opacity-[0.05] scale-150 -rotate-12 transition-transform duration-1000 group-hover:scale-125 pointer-events-none">
               <ShieldAlert className="w-32 h-32 text-red-500" />
            </div>
            <div className="flex items-center gap-10 relative z-10 w-full translate-z-0">
               <div className="w-20 h-20 rounded-[28px] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-glow group-hover:-rotate-12 transition-transform">
                  <Zap className="w-10 h-10 stroke-[2.5]" />
               </div>
               <div className="space-y-3">
                  <h4 className="text-2xl font-display font-black text-white tracking-tighter italic uppercase leading-none">1 Mismatch <span className="text-red-400 glow-text">Detected</span></h4>
                  <div className="flex items-center gap-4">
                     <p className="text-[10px] text-red-400/60 font-mono font-black uppercase tracking-widest italic leading-none">Manual Verification Required</p>
                     <div className="w-1.5 h-1.5 rounded-full bg-red-500/20" />
                     <span className="text-[10px] text-white opacity-40 font-mono italic">UPLINK_INTERRUPT</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 3. Primary Distribution Registry */}
      <div className="space-y-12 pt-12">
         <div className="flex items-center justify-between px-6">
            <h3 className="font-display font-black text-3xl tracking-tighter text-white uppercase italic flex items-center gap-6 leading-none">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-premium">
                  <Globe className="w-6 h-6 stroke-[2.5]" />
               </div>
               Connected <span className="text-primary glow-text">Gateways</span>
            </h3>
            <div className="badge badge-fuel h-6 px-4">UAE-WIDE GRID</div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {tollSystems.map((system) => (
               <motion.div
                 key={system.name}
                 whileHover={{ y: -8 }}
                 className={cn(
                    "saas-card p-12 space-y-10 relative overflow-hidden group border border-white/10 transition-all duration-500",
                    system.status === 'connected' ? "shadow-glow bg-white/5" : "grayscale opacity-40 bg-[#0f172a]"
                 )}
               >
                  {/* Mesh Gradient Back */}
                  {system.status === 'connected' && (
                     <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />
                  )}

                  <div className="flex items-center justify-between relative z-10">
                     <div className={cn("w-20 h-20 rounded-[32px] flex items-center justify-center border shadow-premium transition-transform group-hover:scale-105 group-hover:rotate-12", 
                        system.status === 'connected' ? "bg-primary/20 border-primary/20 text-primary" : "bg-white/5 border-white/10 text-white/10")
                     }>
                        <CreditCard className="w-10 h-10 stroke-[2.5]" />
                     </div>
                     {system.status === 'connected' ? (
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.3em] italic mb-3">Live Sync</span>
                           <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-glow">
                              <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                           </div>
                        </div>
                     ) : (
                        <div className="badge badge-maintenance h-6 px-4 text-[9px]">OFFLINE</div>
                     )}
                  </div>

                  <div className="space-y-4 relative z-10">
                     <h4 className="text-4xl font-display font-black text-white tracking-tighter italic uppercase leading-none">{system.name}</h4>
                     <div className="flex items-center gap-4">
                        <p className="text-[11px] text-text-muted font-mono font-bold uppercase tracking-widest opacity-40 italic leading-none">{system.region} National Matrix</p>
                        {system.id && (
                           <>
                              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                              <span className="text-[11px] font-mono font-black text-primary italic opacity-60">ID #{system.id}</span>
                           </>
                        )}
                     </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                     <div className="space-y-2">
                        <span className="text-[9px] font-mono font-black text-text-muted uppercase tracking-widest leading-none opacity-40">Packet Frequency</span>
                        <p className={cn("text-[11px] font-display font-black italic uppercase leading-none tracking-widest", system.status === 'connected' ? "text-primary glow-text" : "text-white/20")}>{system.lastSync}</p>
                     </div>
                     {system.status !== 'connected' && (
                        <button className="btn-glass h-12 px-8 text-[10px] uppercase font-black tracking-widest italic text-white shadow-premium hover:bg-white/10 group/btn">
                           Provision
                           <Plus className="w-4 h-4 ml-3 group-hover:rotate-90 transition-transform" />
                        </button>
                     )}
                  </div>
               </motion.div>
            ))}
         </div>
      </div>

      {/* 4. Activity Audit Log (Fina List Style) */}
      <div className="space-y-12 pt-12">
         <div className="flex items-center justify-between px-6">
            <h3 className="font-display font-black text-3xl tracking-tighter text-white uppercase italic flex items-center gap-6 leading-none">
               <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-premium">
                  <History className="w-6 h-6 stroke-[2.5]" />
               </div>
               Transaction <span className="text-primary glow-text">Journal</span>
            </h3>
            <div className="flex gap-4">
               <button className="btn-glass h-10 px-6 text-[9px] uppercase font-black tracking-widest italic text-white shadow-premium hover:bg-white/5">Export Ledger</button>
            </div>
         </div>

         <div className="saas-card overflow-hidden divide-y divide-white/5 border border-white/10">
            {[
               { title: 'Gateway Mismatch', sub: 'Salik Error Segment · Automated Rejection Protocol', time: '10:15 AM', status: 'error', icon: AlertCircle },
               { title: 'Packet Synchronized', sub: 'National DB Cluster · 12 Units Verified Sequence', time: '09:30 AM', status: 'success', icon: CheckCircle2 },
               { title: 'Regional Offset', sub: 'Darb Abu Dhabi · Telemetry Adjustment Active', time: '08:45 AM', status: 'pending', icon: RefreshCw },
            ].map((log, i) => (
               <div key={i} className="p-10 flex flex-col md:flex-row items-center justify-between gap-10 hover:bg-white/5 transition-all group cursor-pointer translate-z-0">
                  <div className="flex items-center gap-12 w-full">
                     <div className={cn("w-20 h-20 rounded-[28px] flex items-center justify-center border shadow-glow transition-transform group-hover:scale-105 group-hover:rotate-12", 
                        log.status === 'error' ? "bg-red-500/10 border-red-500/20 text-red-400" : 
                        log.status === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : 
                        "bg-primary/10 border-primary/20 text-primary")
                     }>
                        <log.icon className={cn("w-9 h-9 stroke-[2.5]", log.status === 'pending' && "animate-spin")} />
                     </div>
                     <div className="space-y-3">
                        <div className="flex items-center gap-6">
                           <h5 className="text-2xl font-display font-black text-white tracking-tighter italic uppercase leading-none group-hover:text-primary transition-colors">{log.title}</h5>
                           <div className="badge bg-white/5 text-white/40 border-white/10 h-6 px-4 text-[9px]">{log.time}</div>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-text-muted font-mono font-black uppercase tracking-widest opacity-40 italic leading-none">
                           {log.sub}
                           <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                           <span className="text-primary opacity-60">ID #248-X7</span>
                        </div>
                     </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted group-hover:text-white group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:translate-x-3 transition-all">
                     <ChevronRight className="w-8 h-8 stroke-[2.5]" />
                  </div>
               </div>
            ))}
         </div>
         
         {/* Journal Footer Meta */}
         <div className="p-10 border border-white/5 bg-white/[0.02] rounded-[32px] flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-6 text-[10px] font-mono font-black uppercase tracking-widest italic text-white">
               <Terminal className="w-5 h-5 text-primary" />
               Uplink Protocol: UAE-TGX-99 · Reading from National Central Fabric
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-[9px] font-mono font-black text-white uppercase italic">DB Latency: 12ms</span>
               </div>
            </div>
         </div>
      </div>

      {/* 5. Force Overwrite Control (Premium Action Card) */}
      <div className="saas-card p-14 bg-gradient-to-br from-[#0f172a] to-primary/20 border-white/10 text-white relative overflow-hidden group shadow-glow cursor-pointer hover:scale-[1.01] transition-all" onClick={handleManualSync}>
         <div className="absolute right-0 top-0 p-16 opacity-[0.03] scale-150 group-hover:scale-125 transition-transform duration-1000 pointer-events-none">
            <Navigation className="w-96 h-96 text-primary" />
         </div>
         <div className="flex flex-col items-center text-center space-y-10 relative z-10 w-full translate-z-0">
            <div className="w-24 h-24 rounded-[36px] bg-primary flex items-center justify-center text-white shadow-glow group-hover:scale-110 group-hover:rotate-12 transition-all">
               <RefreshCw className={cn("w-12 h-12 stroke-[2.5]", isSyncing && "animate-spin")} />
            </div>
            <div className="space-y-4">
               <h3 className="text-4xl font-display font-black tracking-tighter italic uppercase leading-none">Execute <span className="text-primary glow-text">Force Sync</span></h3>
               <p className="text-[11px] text-text-muted font-mono font-bold uppercase tracking-[0.4em] italic opacity-60">Synchronize latest regional transaction manifest items from all national nodes</p>
            </div>
            
            {/* Visual Pulse for Action */}
            <div className="flex items-center gap-2">
               {[1,2,3].map(i => (
                  <motion.div 
                     key={i}
                     initial={{ scale: 0.8, opacity: 0.2 }}
                     animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.5, 0.2] }}
                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                     className="w-20 h-1 bg-primary rounded-full"
                  />
               ))}
            </div>
         </div>
      </div>
    </div>
  )
}

export default TollCenter
