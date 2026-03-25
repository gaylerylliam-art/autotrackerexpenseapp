import React from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, CreditCard, ShieldCheck, Mail, Phone, MapPin, ChevronRight, PieChart, Activity, Briefcase, Check } from 'lucide-react'

const Organization = () => {
  const team = [
    { name: 'Sameer Jamil', role: 'Fleet Manager', status: 'Online', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop' },
    { name: 'Sarah Ahmed', role: 'Internal Driver', status: 'On Trip', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop' },
    { name: 'Kevin Durant', role: 'Support Agent', status: 'Offline', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop' },
  ]

  const metrics = [
    { label: 'Active Fleet', value: '18 Units', icon: Briefcase, color: 'text-accent' },
    { label: 'Total Drivers', value: '24', icon: Users, color: 'text-accent2' },
    { label: 'Fleet Health', value: '94.2%', icon: Activity, color: 'text-accent3' },
    { label: 'Monthly ROI', value: '+$4.2k', icon: PieChart, color: 'text-accent4' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <span className="text-muted font-mono text-[11px] uppercase tracking-widest font-bold">Workspace Configuration</span>
        <h2 className="text-3xl font-display font-extrabold tracking-tightest">Aramex <span className="gradient-text">Logistics</span></h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="glass p-5 rounded-2xl border border-white/5 space-y-3">
             <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center border border-white/5">
                <m.icon className={`w-5 h-5 ${m.color}`} />
             </div>
             <div>
                <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-black leading-none mb-1">{m.label}</p>
                <p className="text-xl font-display font-black tracking-tightest">{m.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Subscription Card */}
      <div className="glass rounded-[32px] overflow-hidden border border-accent/20 bg-gradient-to-br from-accent/10 to-transparent p-8 relative group">
        <div className="absolute right-0 top-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
           <ShieldCheck className="w-32 h-32 text-accent" />
        </div>
        <div className="relative z-10 space-y-6">
           <div className="flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-[9px] font-mono uppercase tracking-widest font-black w-fit">Enterprise Plan</span>
              <h3 className="text-2xl font-display font-black tracking-tightest">Active Subscription</h3>
              <p className="text-muted text-sm max-w-sm leading-relaxed">
                Your organization is currently on the <strong>Fleet Enterprise</strong> plan. Next billing on April 14, 2026.
              </p>
           </div>
           <div className="flex items-center gap-4 text-xs font-mono text-muted uppercase tracking-widest">
              <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> **** 9012</span>
              <span className="flex items-center gap-2 text-accent2"><Check className="w-4 h-4" /> Verified Business</span>
           </div>
           <button className="px-8 py-3 bg-accent text-white rounded-xl font-display font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-accent/20">
              Billing Settings
           </button>
        </div>
      </div>

      {/* Team Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="font-display font-black text-xl tracking-tightest">Fleet Personnel</h3>
           <button className="p-2 glass rounded-lg text-muted hover:text-text hover:bg-white/5 transition-all border border-white/10">
              <Users className="w-4 h-4" />
           </button>
        </div>
        <div className="grid gap-3">
           {team.map((member, i) => (
             <div key={i} className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between card-hover group cursor-pointer active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-surface2 overflow-hidden border border-white/10">
                      <img src={member.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                   </div>
                   <div className="space-y-0.5">
                      <h4 className="font-display font-black text-sm tracking-tightest">{member.name}</h4>
                      <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-bold italic">{member.role}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className={`text-[10px] font-mono font-black uppercase tracking-widest px-2 py-1 rounded-full border ${
                     member.status === 'Online' ? 'bg-accent2/10 border-accent2/20 text-accent2 shadow-[0_0_10px_rgba(62,207,142,0.2)]' : 
                     member.status === 'On Trip' ? 'bg-accent/10 border-accent/20 text-accent shadow-[0_0_10px_rgba(108,99,255,0.2)]' : 
                     'bg-white/5 border-white/10 text-muted'
                   }`}>
                      {member.status}
                   </span>
                   <ChevronRight className="w-4 h-4 text-muted group-hover:text-text translate-x-0 group-hover:translate-x-1 transition-all" />
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}

export default Organization
