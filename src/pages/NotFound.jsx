import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertCircle, ChevronLeft, Map, Navigation, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 overflow-hidden relative bg-[#F8FAFC]">
      {/* 1. Background Logic (Tesla Style) */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[160px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-50/60 rounded-full blur-[160px] pointer-events-none delay-1000 animate-pulse" />
      
      {/* Terminal Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #2563EB 0.5px, transparent 0.5px)', backgroundSize: '60px 60px' }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full text-center space-y-12 relative z-10"
      >
        {/* 2. Problem Identifier Card (Stripe Style) */}
        <div className="saas-card p-12 space-y-10 group bg-white/80 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.1)] hover:border-primary/20 transition-all duration-700 overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-[0.02] scale-150 rotate-12 group-hover:scale-125 transition-transform duration-1000">
              <Navigation className="w-80 h-80 text-primary" />
           </div>
           
           <div className="w-24 h-24 rounded-[36px] bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto shadow-sm group-hover:rotate-12 transition-transform duration-500">
              <AlertCircle className="w-12 h-12 text-primary" />
           </div>

           <div className="space-y-4">
              <h1 className="text-8xl font-mono font-black tracking-tighter text-slate-900 italic leading-none">404</h1>
              <div className="space-y-2">
                 <h2 className="text-3xl font-display font-black tracking-tighter text-slate-900 italic uppercase">Segment <span className="text-primary">Mismatch</span></h2>
                 <p className="text-[10px] text-text-secondary font-mono font-bold uppercase tracking-[0.4em] max-w-[320px] mx-auto opacity-40 leading-relaxed italic">
                    The requested operational layer does not reside in this fleet jurisdiction.
                 </p>
              </div>
           </div>

           <div className="pt-6">
              <Link 
                to="/" 
                className="w-full h-18 bg-slate-900 text-white rounded-[24px] font-display font-black text-xs uppercase tracking-widest italic flex items-center justify-center gap-4 shadow-premium hover:bg-primary transition-all active:scale-95"
              >
                 <ChevronLeft className="w-5 h-5" />
                 Synchronize to HQ Node
              </Link>
           </div>
        </div>
        
        {/* 3. Global Coordinates Intel */}
        <div className="flex justify-center gap-12 relative z-10">
           {[
              { label: 'Latitude Segment', value: '25.2048° N', icon: Globe },
              { label: 'Longitude Node', value: '55.2708° E', icon: Navigation },
              { label: 'Link Integrity', value: '99.9%', icon: ShieldCheck },
           ].map((coord, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group cursor-default">
                 <coord.icon className="w-4 h-4 text-slate-200 group-hover:text-primary transition-colors duration-500" />
                 <div className="space-y-0.5">
                    <span className="text-[9px] font-mono font-black text-slate-300 uppercase tracking-widest leading-none block">{coord.label}</span>
                    <span className="text-[10px] font-mono font-black text-slate-900 italic tracking-widest group-hover:text-primary transition-colors opacity-60">{coord.value}</span>
                 </div>
              </div>
           ))}
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound
