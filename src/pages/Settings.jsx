import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Bell, ShieldCheck, Lock, CreditCard, HelpCircle, LogOut, 
  ChevronRight, Globe, Moon, Eye, Smartphone, MoreVertical, 
  Share, Download, X, Scale, FileText, Trash2, Zap, TrendingUp, 
  User, Shield, Key, BellRing, Settings as SettingsIcon, Database, 
  Cpu, Activity, ArrowRight, Info, Check, Radio, Terminal, 
  ShieldAlert, Server, Loader2, Mail, MessageSquare, Smartphone as Mobile
} from 'lucide-react'
import Logo from '../components/Logo'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { supabase } from '../utils/supabase'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const Settings = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState({ vehicles: 0 })
  const [loading, setLoading] = useState(true)
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    inApp: true,
  })

  const [privacy, setPrivacy] = useState({
    mfa: true,
    location: true,
    storage: false,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(prof)

      const { count } = await supabase.from('vehicles').select('*', { count: 'exact', head: true })
      setStats({ vehicles: count || 0 })
    } catch (err) {
      console.error('Profile fetch failure:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/auth')
  }

  const toggleNotification = (key) => setNotifications(n => ({ ...n, [key]: !n[key] }))
  const togglePrivacy = (key) => setPrivacy(p => ({ ...p, [key]: !p[key] }))

  const [activeModal, setActiveModal] = useState(null)

  if (loading) {
     return (
        <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in duration-700">
           <Loader2 className="w-10 h-10 text-text-main animate-spin" />
        </div>
     )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="saas-card p-8 lg:p-10 relative overflow-hidden group bg-white">
         <div className="absolute top-0 right-0 p-8 z-20">
            <button className="w-10 h-10 rounded-xl bg-bg-page border border-border flex items-center justify-center text-text-subtle hover:text-text-main transition-all shadow-sm">
               <MoreVertical className="w-5 h-5" />
            </button>
         </div>
         
         <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 w-full">
            <div className="relative group/avatar">
               <div className="w-32 h-32 rounded-3xl bg-bg-page p-1 border border-border shadow-sm transition-transform group-hover/avatar:scale-105 duration-500 overflow-hidden">
                  <img 
                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=0F1010&color=fff&size=400`}
                    alt="User" 
                    className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
                  />
               </div>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-text-main flex items-center justify-center border-4 border-white shadow-lg text-white">
                  <Zap className="w-5 h-5" />
               </div>
            </div>

            <div className="space-y-4 text-center md:text-left flex-1">
               <div className="flex flex-col md:flex-row md:items-center gap-4 justify-center md:justify-start">
                  <h2 className="text-3xl font-display font-bold text-text-main tracking-tighter leading-none italic uppercase">
                    {profile?.full_name || 'Guest User'}
                  </h2>
                  <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black uppercase tracking-widest italic leading-none">Verified Identity</div>
               </div>
               <div className="flex items-center gap-3 justify-center md:justify-start">
                  <p className="text-[11px] text-text-secondary font-bold font-mono tracking-tight">{user?.email}</p>
                  <div className="w-1 h-1 rounded-full bg-border" />
                  <span className="text-[9px] text-text-helper font-black uppercase tracking-[0.2em] leading-none italic">Secure Data Node</span>
               </div>
               
               <div className="flex flex-wrap justify-center md:justify-start gap-10 mt-6 pt-6 border-t border-border w-full">
                  <div className="space-y-1">
                     <span className="text-[9px] text-text-helper font-black uppercase tracking-[0.2em] leading-none italic">Units Linked</span>
                     <p className="text-xl font-bold text-text-main leading-none italic tracking-tighter">{stats.vehicles} UNITS</p>
                  </div>
                  <div className="space-y-1">
                     <span className="text-[9px] text-text-helper font-black uppercase tracking-[0.2em] leading-none italic">Service Level</span>
                     <p className="text-xl font-bold text-text-main leading-none italic tracking-tighter">PRIMARY ACCOUNT</p>
                  </div>
                  <div className="space-y-1">
                     <span className="text-[9px] text-text-helper font-black uppercase tracking-[0.2em] leading-none italic">System Uptime</span>
                     <p className="text-xl font-bold text-emerald-500 leading-none italic tracking-tighter">99.9% ACTIVE</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="saas-card p-8 lg:p-10 bg-text-main text-white relative overflow-hidden group">
         <div className="absolute -right-20 top-0 opacity-[0.03] scale-150 group-hover:scale-125 transition-transform duration-1000 pointer-events-none">
            <Zap className="w-96 h-96 text-white" />
         </div>
         <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10 w-full">
            <div className="space-y-6 text-center lg:text-left">
               <div className="flex items-center justify-center lg:justify-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-text-main shadow-lg group-hover:rotate-12 transition-transform duration-500">
                     <Shield className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-2xl font-display font-bold text-white tracking-tighter uppercase italic leading-none">Mobility <span className="opacity-40">Pro</span></h3>
                     <p className="text-[9px] text-white/60 font-black uppercase tracking-[0.2em] leading-none">Tier 2 Enterprise Access</p>
                  </div>
               </div>
               <p className="text-[11px] text-white/60 max-w-xl font-bold uppercase tracking-widest leading-relaxed italic">
                  Advanced fleet intelligence, automated expenditure audits, and priority node access. Professional-grade infrastructure for high-scale mobility management.
               </p>
            </div>
            <button 
              onClick={() => navigate('/pricing')}
              className="h-14 px-10 bg-white text-text-main rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all w-full lg:w-auto italic"
            >
               Upgrade Registry
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
         <div className="space-y-8">
            <h4 className="font-display font-bold text-xl tracking-tight text-text-main px-4 flex items-center gap-4 uppercase italic">
               <div className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-main shadow-sm">
                  <BellRing className="w-5 h-5" />
               </div>
                Notification Hub
            </h4>
            <div className="saas-card overflow-hidden divide-y divide-border border border-border bg-white">
               {[
                 { key: 'email', label: 'Email Ledger', sub: 'Weekly expenditure summary', icon: Mail },
                 { key: 'push', label: 'Node Alerts', sub: 'Realtime maintenance sync', icon: Bell },
                 { key: 'sms', label: 'Priority SMS', sub: 'Critical system overrides', icon: MessageSquare },
                 { key: 'inApp', label: 'Direct Feed', sub: 'System security & logs', icon: Info },
               ].map((pref) => (
                  <div key={pref.key} className="p-8 flex items-center justify-between hover:bg-bg-page transition-all cursor-pointer group" onClick={() => toggleNotification(pref.key)}>
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-bg-page border border-border flex items-center justify-center text-text-subtle group-hover:text-text-main transition-colors">
                           <pref.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                           <span className="text-base font-bold text-text-main group-hover:text-accent transition-colors italic uppercase tracking-tighter">{pref.label}</span>
                           <p className="text-[10px] text-text-helper font-black uppercase tracking-[0.2em] italic">{pref.sub}</p>
                        </div>
                     </div>
                     <div className={cn(
                        "w-12 h-6 rounded-full p-1 transition-all",
                        notifications[pref.key] ? 'bg-text-main shadow-lg shadow-black/10' : 'bg-border'
                     )}>
                        <motion.div 
                           animate={{ x: notifications[pref.key] ? 24 : 0 }}
                           className="w-4 h-4 rounded-full bg-white shadow-sm"
                        />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="space-y-8">
            <h4 className="font-display font-bold text-xl tracking-tight text-text-main px-4 flex items-center gap-4 uppercase italic">
               <div className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-main shadow-sm">
                  <Key className="w-5 h-5" />
               </div>
               Enclave Security
            </h4>
            <div className="saas-card overflow-hidden divide-y divide-border border border-border bg-white">
               {[
                  { label: 'Cloud Buffer', sub: 'Asynchronous data synchronization', icon: Database, value: true, key: 'storage' },
                  { label: 'MFA Enforced', sub: 'Precision hardware verification', icon: Cpu, value: privacy.mfa, key: 'mfa' },
                  { label: 'GEO Logic', sub: 'Asymmetric location tracking', icon: Globe, value: privacy.location, key: 'location' },
                  { label: 'Stealth Sync', sub: 'Obfuscate sensitive logs', icon: Eye, value: false, key: 'privacy' },
               ].map((item, i) => (
                  <div key={i} className="p-8 flex items-center justify-between hover:bg-bg-page transition-all cursor-pointer group">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-bg-page border border-border flex items-center justify-center text-text-subtle group-hover:text-text-main transition-colors">
                           <item.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1 text-left">
                           <span className="text-base font-bold text-text-main group-hover:text-accent transition-colors italic uppercase tracking-tighter">{item.label}</span>
                           <p className="text-[10px] text-text-helper font-black uppercase tracking-[0.2em] italic">{item.sub}</p>
                        </div>
                     </div>
                     <div 
                        onClick={() => togglePrivacy(item.key)}
                        className={cn(
                           "w-12 h-6 rounded-full p-1 transition-all",
                           item.value ? 'bg-text-main shadow-lg shadow-black/10' : 'bg-border'
                        )}
                     >
                        <motion.div animate={{ x: item.value ? 24 : 0 }} className="w-4 h-4 rounded-full bg-white shadow-sm" />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <div className="space-y-8 pt-4">
         <h4 className="font-display font-bold text-xl tracking-tight text-text-main px-4 flex items-center gap-4 uppercase italic">
            <div className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-main shadow-sm">
               <Scale className="w-5 h-5" />
            </div>
            Compliance Directives
         </h4>
         <div className="saas-card overflow-hidden lg:grid lg:grid-cols-2 border border-border divide-y lg:divide-y-0 lg:divide-x divide-border bg-white">
            <div className="p-10 space-y-8">
               <p className="text-[9px] text-text-helper font-black uppercase tracking-[0.2em] border-b border-border pb-4 italic">General Directives</p>
               <div className="space-y-4">
                  <button onClick={() => setActiveModal('Terms of Service')} className="w-full flex items-center justify-between p-6 bg-bg-page rounded-2xl border border-border hover:border-text-main/20 hover:bg-white transition-all group">
                     <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-text-main group-hover:rotate-12 transition-transform shadow-sm">
                           <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-text-secondary uppercase tracking-widest group-hover:text-text-main transition-colors italic">Terms of Service</span>
                     </div>
                     <ChevronRight className="w-5 h-5 text-text-subtle group-hover:text-text-main group-hover:translate-x-1 transition-all" />
                  </button>
                  <button onClick={() => setActiveModal('Privacy Policy')} className="w-full flex items-center justify-between p-6 bg-bg-page rounded-2xl border border-border hover:border-text-main/20 hover:bg-white transition-all group">
                     <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-text-main group-hover:rotate-12 transition-transform shadow-sm">
                           <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-text-secondary uppercase tracking-widest group-hover:text-text-main transition-colors italic">Privacy Policy</span>
                     </div>
                     <ChevronRight className="w-5 h-5 text-text-subtle group-hover:text-text-main group-hover:translate-x-1 transition-all" />
                  </button>
               </div>
            </div>

            <div className="p-10 space-y-8">
               <p className="text-[9px] text-accent font-black uppercase tracking-[0.2em] border-b border-border pb-4 italic">Danger Enclave</p>
               <div className="space-y-4">
                  <button onClick={handleLogout} className="w-full h-20 bg-accent/5 hover:bg-accent/10 flex items-center justify-between px-8 rounded-3xl border border-accent/10 group transition-all text-accent">
                     <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-xl bg-white border border-accent/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-transform shadow-sm">
                           <LogOut className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                           <span className="text-sm font-black uppercase tracking-widest leading-none block italic">Sign Out</span>
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mt-1 italic">Terminate Session</p>
                        </div>
                     </div>
                     <ShieldAlert className="w-6 h-6 opacity-20 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button className="w-full h-20 bg-bg-page hover:bg-accent/5 flex items-center justify-between px-8 rounded-3xl border border-border hover:border-accent/10 group transition-all text-text-subtle hover:text-accent">
                     <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-xl bg-white border border-border group-hover:scale-110 group-hover:-rotate-12 transition-transform flex items-center justify-center shadow-sm">
                           <Trash2 className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                           <span className="text-sm font-black uppercase tracking-widest leading-none block italic">Purge Account</span>
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mt-1 italic">Permanent Node Removal</p>
                        </div>
                     </div>
                     <X className="w-6 h-6 opacity-20 group-hover:opacity-100 transition-opacity" />
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="flex flex-col items-center justify-center py-16 opacity-30 pointer-events-none">
         <Logo type="full" className="h-10 opacity-50 grayscale" />
         <p className="text-[9px] font-black text-text-helper uppercase tracking-[0.6em] mt-6 italic">Version 6.2.0 Stable Build</p>
      </div>

      <AnimatePresence>
         {activeModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-10">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                 animate={{ opacity: 1, scale: 1, y: 0 }} 
                 exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                 className="relative w-full max-w-2xl bg-white rounded-[32px] border border-border overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar flex flex-col text-text-main"
               >
                  <div className="p-8 border-b border-border flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/80">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-bg-page flex items-center justify-center text-text-main border border-border shadow-sm">
                           <Scale className="w-6 h-6" />
                        </div>
                        <h3 className="font-display font-bold text-2xl text-text-main tracking-tighter uppercase italic">{activeModal}</h3>
                     </div>
                     <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl bg-bg-page border border-border flex items-center justify-center text-text-subtle hover:text-text-main transition-all"><X className="w-6 h-6" /></button>
                  </div>
                  
                  <div className="p-8 space-y-10 text-text-secondary text-sm leading-relaxed font-bold italic">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-text-main animate-pulse" />
                        <p className="text-[9px] font-black text-text-main uppercase tracking-[0.2em]">DIRECTIVE v4.5 · UPDATED MAR 2026</p>
                     </div>
                     <div className="space-y-6">
                        <h4 className="font-display font-bold text-text-main text-lg uppercase tracking-tighter italic">1. Operational Protocols</h4>
                        <div className="p-8 rounded-3xl bg-bg-page border border-border">
                           <p className="opacity-80 leading-relaxed">By activating the AutoTracker mobility node, you authorize direct telemetry and expenditure audit protocols. All data is processed via zero-trust architecture, ensuring high-integrity financial insights. Your mobility footprint is obfuscated and encrypted using industry-grade standards.</p>
                        </div>
                        <h4 className="font-display font-bold text-text-main text-lg uppercase tracking-tighter italic">2. Data Sovereignty</h4>
                        <p className="opacity-80 leading-relaxed font-medium">We maintain a strict decentralized-first data policy. Your financial logs and fleet telemetry remain your property, stored in secure local-first buffers before cloud reconciliation.</p>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  )
}

export default Settings
