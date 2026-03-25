import React from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, CreditCard, ShieldCheck, Mail, Phone, MapPin, ChevronRight, PieChart, Activity, Briefcase, Check, MoreHorizontal, Sparkles, TrendingUp } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Organization = () => {
  const team = [
    { name: 'John Doe', role: 'Fleet Manager', status: 'Online', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop' },
    { name: 'Sarah Smith', role: 'Driver — X5', status: 'On Trip', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop' },
    { name: 'Michael Chen', role: 'Driver — Land Cruiser', status: 'Offline', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop' },
  ]

  const metrics = [
    { label: 'Active Fleet', value: '6 Units', icon: Briefcase, color: 'text-accent' },
    { label: 'Total Drivers', value: '12', icon: Users, color: 'text-accent2' },
    { label: 'Fleet Health', value: '88%', icon: Activity, color: 'text-accent3' },
    { label: 'ROI (Est.)', value: '+14.2%', icon: TrendingUp, color: 'text-accent4' },
  ]

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <h2 className="text-2xl font-display font-black tracking-tightest">Fleet Management</h2>
             <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-[8px] font-mono font-black text-accent uppercase tracking-widest">ARAMEX</span>
          </div>
          <p className="text-[10px] text-muted font-mono font-black uppercase tracking-widest">6 active vehicles</p>
        </div>
        <button className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-muted hover:text-text active:scale-95 transition-all">
           <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="glass p-5 rounded-[24px] border border-white/5 space-y-4 card-hover">
             <div className="flex items-center justify-between">
                <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60 leading-none">{m.label}</span>
                <m.icon className={cn("w-3.5 h-3.5", m.color)} />
             </div>
             <h3 className="text-xl font-display font-black tracking-tightest text-text leading-tight">{m.value}</h3>
          </div>
        ))}
      </div>

      {/* Subscription Card */}
      <div className="glass rounded-[40px] border border-white/5 bg-gradient-to-br from-indigo-500/10 via-bg to-bg p-8 relative overflow-hidden group active:scale-[0.99] transition-all">
        <div className="absolute top-0 right-0 p-8 text-accent/10 group-hover:text-accent/20 transition-colors">
           <ShieldCheck className="w-24 h-24" />
        </div>
        
        <div className="relative z-10 space-y-6">
           <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <h4 className="font-display font-black text-xl tracking-tightest">Enterprise Plan</h4>
                 <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[8px] font-mono font-black uppercase tracking-widest border border-indigo-500/20 flex items-center gap-1">
                    <Sparkles className="w-2 h-2" />
                    PRO
                 </span>
              </div>
              <p className="text-muted text-[11px] leading-relaxed max-w-[220px]">
                Unlimited vehicles, specialized reports & AI fleet forecasting.
              </p>
           </div>
           
           <button className="px-8 py-3 bg-white text-black rounded-xl font-display font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-white/10">
              Upgrade to Unlimited
           </button>
        </div>
      </div>

      {/* Team Members Section */}
      <div className="space-y-6">
         <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-black text-lg tracking-tightest">Team Members</h3>
            <span className="text-[10px] text-accent font-mono font-black uppercase tracking-widest">Add Member</span>
         </div>

         <div className="space-y-3">
            {team.map((member, i) => (
              <div key={i} className="glass p-4 rounded-[24px] border border-white/5 flex items-center justify-between card-hover group cursor-pointer active:scale-[0.98] transition-all">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[18px] bg-surface2 overflow-hidden border border-white/10 group-hover:scale-105 transition-transform">
                       <img src={member.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="space-y-1">
                       <h4 className="font-display font-black text-[13px] tracking-tight group-hover:text-text transition-colors">{member.name}</h4>
                       <p className="text-[9px] text-muted font-mono font-black uppercase tracking-widest italic opacity-60 underline decoration-accent/20">{member.role}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className={cn("w-1.5 h-1.5 rounded-full", member.status === 'Online' ? "bg-accent2 shadow-[0_0_8px_rgba(62,207,142,0.5)]" : member.status === 'On Trip' ? "bg-accent shadow-[0_0_8px_rgba(108,99,255,0.5)]" : "bg-white/10")} />
                    <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60">{member.status}</span>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  )
}

export default Organization
