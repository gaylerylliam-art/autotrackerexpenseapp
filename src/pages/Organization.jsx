import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, Users, CreditCard, ShieldCheck, Mail, Phone, MapPin, 
  ChevronRight, PieChart, Activity, Briefcase, Check, MoreHorizontal, 
  Sparkles, TrendingUp, Zap, Globe, Layers, UserPlus, Database,
  Shield, Server, HardDrive, Cpu, Terminal, RefreshCcw, LayoutDashboard, Loader2
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { supabase } from '../utils/supabase'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const Organization = () => {
  const [members, setMembers] = useState([])
  const [org, setOrg] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrgData()
  }, [])

  const fetchOrgData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: memberInfo } = await supabase
        .from('organization_members')
        .select('*, organizations(*)')
        .eq('user_id', user.id)
        .single()

      if (memberInfo) {
        setOrg(memberInfo.organizations)
        
        const { data: allMembers } = await supabase
          .from('organization_members')
          .select('*, profiles(*)')
          .eq('organization_id', memberInfo.organization_id)
        
        setMembers(allMembers || [])
      }
    } catch (err) {
      console.error('Org fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const metrics = [
    { label: 'Vehicle Groups', value: '12 Classes', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Personnel', value: `${members.length} Members`, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Safety Compliance', value: '98.2%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Fleet ROI', value: '+14.2%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  ]

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Header & Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="space-y-1">
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Enterprise Workspace</h1>
            <div className="flex items-center gap-4">
               <p className="text-sm text-slate-500 font-medium italic">Managed by {org?.name || 'Loading organization...'} · Enterprise Tier</p>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
               <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  <Globe className="w-3.5 h-3.5" />
                  International Profile
               </div>
            </div>
         </div>

         <div className="flex gap-4">
            <button className="h-12 px-6 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
               <Database className="w-5 h-5" />
               Audit Report
            </button>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
               <MoreHorizontal className="w-6 h-6 text-slate-400" />
            </button>
         </div>
      </div>

      {/* 2. Resource Allocation Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {metrics.map((stat, i) => (
            <motion.div 
               key={i} 
               whileHover={{ y: -4 }}
               className="premium-card p-6 flex flex-col justify-between h-40"
            >
               <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("w-6 h-6", stat.color)} />
               </div>
               <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                  <h3 className="text-2xl font-display font-bold text-slate-900">{stat.value}</h3>
               </div>
            </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         
         {/* 3. Team Management (Drivers/Staff) */}
         <div className="xl:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-slate-900">Personnel Directory</h3>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">{members.length} Total</span>
               </div>
               <button className="h-10 px-5 bg-primary text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  <UserPlus className="w-4 h-4" /> 
                  Invite Member
               </button>
            </div>

            <div className="premium-card p-0 overflow-hidden">
               <div className="divide-y divide-slate-100">
                  {members.map((member, i) => (
                    <motion.div 
                       key={i} 
                       className="p-6 hover:bg-slate-50 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-100 flex items-center justify-center text-slate-300">
                             {member.profiles?.avatar_url ? <img src={member.profiles.avatar_url} alt="" className="w-full h-full object-cover" /> : <Users className="w-8 h-8" />}
                          </div>
                          <div className="space-y-1">
                             <h4 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{member.profiles?.full_name || 'Anonymous User'}</h4>
                             <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500 font-medium">{member.role}</span>
                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">UID: {member.user_id.slice(0,8)}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex flex-col items-start md:items-end gap-2 text-right">
                          <span className={cn(
                             "badge text-[9px]",
                             "badge-emerald"
                          )}>
                             Active
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">Joined {new Date(member.created_at).toLocaleDateString()}</span>
                       </div>
                    </motion.div>
                  ))}
               </div>
               
               <div className="p-4 bg-slate-50/50 flex items-center justify-between border-t border-slate-100 px-8">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <Terminal className="w-4 h-4 text-primary" />
                     Viewing Page 01 — Drivers 1-{members.length}
                  </div>
                  <button className="text-xs font-bold text-primary hover:underline">Export CSV</button>
               </div>
            </div>
         </div>

         {/* 4. Plan & Infrastructure Hub */}
         <div className="xl:col-span-4 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 px-2">Subscription Hub</h3>
            <div className="premium-card p-10 space-y-8 relative overflow-hidden group border-primary/20 shadow-xl shadow-blue-500/5 min-h-[500px] flex flex-col justify-between bg-gradient-to-br from-white to-blue-50/30">
               
               <div className="space-y-8 relative z-10">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-[22px] bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                        <Shield className="w-8 h-8" />
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-2xl font-display font-bold tracking-tight text-slate-900 leading-none">Enterprise Plan</h4>
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest opacity-80">Full Fleet Access</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     {[
                       { icon: Cpu, label: 'Automated Financial Audits' },
                       { icon: Server, label: 'Unlimited Vehicles & Groups' },
                       { icon: HardDrive, label: 'Full Asset Depreciation' },
                       { icon: Zap, label: 'Real-time GPS Syncing' },
                     ].map((feat, idx) => (
                       <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/20 transition-all shadow-sm">
                          <feat.icon className="w-5 h-5 text-primary" />
                          <span className="text-xs font-bold text-slate-700">{feat.label}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-8 relative z-10">
                  <div className="space-y-3">
                     <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                        <span className="text-slate-400">Fleet Utilization</span>
                        <div className="flex items-baseline gap-1">
                           <span className="text-primary font-display font-black">48</span>
                           <span className="text-slate-300">/ ∞</span>
                        </div>
                     </div>
                     <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                        <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-primary rounded-full shadow-md" />
                     </div>
                  </div>
                  
                  <button onClick={fetchOrgData} className="w-full h-14 bg-slate-900 rounded-[18px] text-white font-bold text-xs flex items-center justify-center gap-3 hover:bg-primary transition-all">
                     <RefreshCcw className="w-5 h-5" />
                     Sync All Records
                  </button>
               </div>

               {/* Abstract Background Design */}
               <div className="absolute right-0 bottom-0 p-8 opacity-5 pointer-events-none grayscale brightness-125 translate-x-10 translate-y-10">
                  <LayoutDashboard className="w-48 h-48" />
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default Organization
