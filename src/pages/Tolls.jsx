import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, RefreshCw, AlertCircle, CheckCircle2, ChevronRight, Settings2, History, Plus } from 'lucide-react'

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-display font-black tracking-tightest">Toll Integration</h1>
          <p className="text-[10px] text-muted font-mono uppercase tracking-[0.3em] font-black opacity-40">Automated Sync · UAE National Systems</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleManualSync}
          className="p-3 bg-accent/20 border border-accent/20 rounded-2xl text-accent hover:bg-accent/30 transition-all group"
        >
          <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
        </motion.button>
      </div>

      {/* Connectivity Status Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-5 rounded-[28px] border border-white/5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent2 shadow-[0_0_8px_rgba(62,207,142,0.6)]" />
            <span className="text-[8px] text-muted font-mono uppercase tracking-widest font-black opacity-60">Status</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-display font-black tracking-tightest">3 Systems Active</p>
            <p className="text-[8px] text-accent2/60 font-mono uppercase tracking-widest font-black">All Systems Functional</p>
          </div>
        </div>

        <div className="glass p-5 rounded-[28px] border border-white/5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent4 shadow-[0_0_8px_rgba(255,107,107,0.6)]" />
            <span className="text-[8px] text-muted font-mono uppercase tracking-widest font-black opacity-60">Errors</span>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-display font-black tracking-tightest">1 Logic Error</p>
            <p className="text-[8px] text-accent4/60 font-mono uppercase tracking-widest font-black">Requires Manual Input</p>
          </div>
        </div>
      </div>

      {/* Major Systems */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-accent" />
            <h3 className="font-display font-black text-lg tracking-tightest">Connected Systems</h3>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {tollSystems.map((system) => (
            <motion.div
              key={system.name}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="glass p-6 rounded-[32px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                    system.status === 'connected' 
                    ? 'bg-accent/10 border-accent/20 text-accent group-hover:bg-accent/20' 
                    : 'bg-white/5 border-white/5 text-muted group-hover:bg-white/10'
                  }`}>
                    <CreditCard className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-black text-lg text-text">{system.name}</h4>
                      {system.status === 'connected' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent2" />
                      )}
                    </div>
                    <p className="text-[9px] text-muted font-mono uppercase tracking-widest font-black opacity-40">
                      {system.region} National Center
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {system.status === 'connected' ? (
                    <div className="space-y-1">
                       <p className="text-xs font-display font-black text-text">Connected</p>
                       <p className="text-[9px] text-accent2 font-mono uppercase tracking-widest font-black">Sync: {system.lastSync}</p>
                    </div>
                  ) : (
                    <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-mono font-black uppercase tracking-widest text-muted group-hover:text-text transition-all">
                      Connect Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Error & Activity Logs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
           <History className="w-4 h-4 text-accent" />
           <h3 className="font-display font-black text-lg tracking-tightest">Activity Logs</h3>
        </div>
        
        <div className="glass rounded-[32px] border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-accent4/5 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent4/20 flex items-center justify-center text-accent4">
                   <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-sm font-display font-black">System Mismatch</p>
                   <p className="text-[9px] text-accent4 font-mono font-black uppercase tracking-widest">Salik Error · 10:15 AM</p>
                </div>
             </div>
             <ChevronRight className="w-5 h-5 text-muted opacity-40" />
          </div>
          
          <div className="p-6 flex items-center justify-between opacity-50">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                   <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-sm font-display font-black">Sync Completed</p>
                   <p className="text-[9px] text-muted font-mono font-black uppercase tracking-widest">National DB · 09:30 AM</p>
                </div>
             </div>
             <ChevronRight className="w-5 h-5 text-muted opacity-40" />
          </div>
        </div>
      </div>

      {/* Manual Action Banner */}
      <div className="p-8 rounded-[40px] bg-gradient-to-br from-accent to-accent2 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer shadow-[0_20px_40px_rgba(108,99,255,0.3)]">
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
             <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-110 group-hover:scale-125 transition-transform">
                <RefreshCw className={`w-8 h-8 ${isSyncing ? 'animate-spin' : ''}`} />
             </div>
             <div className="space-y-1">
                <h3 className="text-2xl font-display font-black text-white leading-tight">Force System Sync</h3>
                <p className="text-[10px] text-white/70 font-mono uppercase tracking-[0.2em] font-black">Fetch latest transactions from all systems</p>
             </div>
          </div>
          {/* Decorative stuff */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent2/40 rounded-full -ml-16 -mb-16 blur-3xl group-hover:bg-accent2/60 transition-all" />
      </div>
    </div>
  )
}

export default TollCenter
