import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, Building2, User, Plus, ShieldCheck, Globe, Settings, ExternalLink } from 'lucide-react'

const workspaces = [
  { id: 'personal', name: 'Personal Garage', icon: User, type: 'Individual', status: 'Active' },
  { id: 'aramex', name: 'Aramex Logistics', icon: Building2, type: 'Business', status: 'Fleet' },
]

const WorkspaceSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0])

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/[0.04] transition-all group border border-transparent hover:border-white/5 pr-4"
      >
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activeWorkspace.id === 'personal' ? 'from-accent to-accent2' : 'from-accent3 to-accent4'} flex items-center justify-center font-display font-extrabold text-white shadow-lg`}>
          <activeWorkspace.icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-display font-black text-xs tracking-tighter uppercase group-hover:text-accent transition-colors">
            {activeWorkspace.name}
          </h1>
          <span className="text-[9px] text-muted font-mono uppercase tracking-widest flex items-center gap-1 font-bold">
            {activeWorkspace.type}
            {activeWorkspace.status === 'Fleet' && <ShieldCheck className="w-2.5 h-2.5 text-accent2" />}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted group-hover:text-text transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full left-0 mt-3 w-64 bg-[#161D33] border border-white/10 rounded-2xl shadow-[0_32px_128px_rgba(0,0,0,0.8)] z-[100] overflow-hidden backdrop-blur-2xl"
            >
              <div className="p-2 space-y-1">
                <p className="px-3 py-2 text-[10px] text-muted font-mono uppercase tracking-widest font-black">Switch Workspace</p>
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspace(ws)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                      activeWorkspace.id === ws.id ? 'bg-accent/10 border border-accent/20' : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center border border-white/5 transition-colors ${activeWorkspace.id === ws.id ? 'text-accent' : 'text-muted'}`}>
                        <ws.icon className="w-4 h-4" />
                      </div>
                      <div className="text-left space-y-0.5">
                        <span className={`text-[11px] font-display font-black tracking-widest block ${activeWorkspace.id === ws.id ? 'text-text' : 'text-muted text-medium'}`}>{ws.name}</span>
                        <span className="text-[9px] text-muted font-mono uppercase tracking-tighter italic">{ws.type}</span>
                      </div>
                    </div>
                    {activeWorkspace.id === ws.id && <Check className="w-3.5 h-3.5 text-accent" />}
                  </button>
                ))}
              </div>

              <div className="p-1 mt-1 border-t border-white/5 bg-white/[0.02]">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] transition-all text-muted hover:text-text group">
                   <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-white/5">
                      <Plus className="w-4 h-4" />
                   </div>
                   <span className="text-[10px] font-mono uppercase tracking-widest font-black">Create New Fleet</span>
                </button>
                <Link 
                  to="/organization" 
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] transition-all text-muted hover:text-text group"
                >
                   <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-white/5">
                      <Settings className="w-4 h-4" />
                   </div>
                   <span className="text-[10px] font-mono uppercase tracking-widest font-black">Fleet Settings</span>
                   <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default WorkspaceSwitcher
