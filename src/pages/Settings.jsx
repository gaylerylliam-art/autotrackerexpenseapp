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
           <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
     )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="premium-card p-8 lg:p-10 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 z-20">
            <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm">
               <MoreVertical className="w-5 h-5" />
            </button>
         </div>
         
         <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 w-full">
            <div className="relative group/avatar">
               <div className="w-32 h-32 rounded-3xl bg-slate-50 p-1 border border-slate-200 shadow-sm transition-transform group-hover/avatar:scale-105 duration-500 overflow-hidden">
                  <img 
                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=3b82f6&color=fff&size=400`}
                    alt="User" 
                    className="w-full h-full object-cover rounded-2xl"
                  />
               </div>
               <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary flex items-center justify-center border-4 border-white shadow-lg text-white">
                  <Zap className="w-5 h-5" />
               </div>
            </div>

            <div className="space-y-4 text-center md:text-left flex-1">
               <div className="flex flex-col md:flex-row md:items-center gap-4 justify-center md:justify-start">
                  <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight leading-none">
                    {profile?.full_name || 'Guest User'}
                  </h2>
                  <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-primary text-[10px] font-bold uppercase tracking-wider">Verified User</div>
               </div>
               <div className="flex items-center gap-3 justify-center md:justify-start">
                  <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider leading-none">Verified Identity</span>
               </div>
               
               <div className="flex flex-wrap justify-center md:justify-start gap-10 mt-6 pt-6 border-t border-slate-100 w-full">
                  <div className="space-y-1">
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Vehicles Managed</span>
                     <p className="text-xl font-bold text-slate-900 leading-none">{stats.vehicles} Vehicles</p>
                  </div>
                  <div className="space-y-1">
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Account Type</span>
                     <p className="text-xl font-bold text-slate-900 leading-none">Personal Account</p>
                  </div>
                  <div className="space-y-1">
                     <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Server Status</span>
                     <p className="text-xl font-bold text-emerald-500 leading-none">99.9% Uptime</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="premium-card p-8 lg:p-10 bg-slate-900 text-white relative overflow-hidden group">
         <div className="absolute -right-20 top-0 opacity-[0.05] scale-150 group-hover:scale-125 transition-transform duration-1000 pointer-events-none">
            <Zap className="w-96 h-96 text-primary" />
         </div>
         <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10 w-full">
            <div className="space-y-6 text-center lg:text-left">
               <div className="flex items-center justify-center lg:justify-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                     <Shield className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-2xl font-display font-bold text-white tracking-tight leading-none">Premium <span className="text-primary">Plan</span></h3>
                     <p className="text-[10px] text-primary font-bold uppercase tracking-wider opacity-80 leading-none">Advanced Fleet Management</p>
                  </div>
               </div>
               <p className="text-xs text-slate-400 max-w-xl font-medium leading-relaxed">
                  Unlock advanced features including automated expense reports, fleet-wide maintenance forecasting, and priority support. Manage multiple vehicles with professional-grade tools.
               </p>
            </div>
            <button 
              onClick={() => navigate('/pricing')}
              className="h-14 px-10 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all w-full lg:w-auto"
            >
               Upgrade Account
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
         <div className="space-y-8">
            <h4 className="font-display font-bold text-xl tracking-tight text-slate-900 px-4 flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shadow-sm">
                  <BellRing className="w-5 h-5" />
               </div>
                Notification Preferences
            </h4>
            <div className="premium-card overflow-hidden divide-y divide-slate-100 border border-slate-200">
               {[
                 { key: 'email', label: 'Email Reports', sub: 'Receive weekly fleet summaries', icon: Mail },
                 { key: 'push', label: 'Push Notifications', sub: 'Instant maintenance alerts', icon: Bell },
                 { key: 'sms', label: 'SMS Updates', sub: 'Critical emergency notifications', icon: MessageSquare },
                 { key: 'inApp', label: 'In-App Alerts', sub: 'Account activity & security', icon: Info },
               ].map((pref) => (
                  <div key={pref.key} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => toggleNotification(pref.key)}>
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                           <pref.icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                           <span className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">{pref.label}</span>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{pref.sub}</p>
                        </div>
                     </div>
                     <div className={cn(
                        "w-12 h-6 rounded-full p-1 transition-all",
                        notifications[pref.key] ? 'bg-primary shadow-lg shadow-blue-500/20' : 'bg-slate-200'
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
            <h4 className="font-display font-bold text-xl tracking-tight text-slate-900 px-4 flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shadow-sm">
                  <Key className="w-5 h-5" />
               </div>
               Security & Privacy
            </h4>
            <div className="premium-card overflow-hidden divide-y divide-slate-100 border border-slate-200">
               {[
                  { label: 'Cloud Sync', sub: 'Automatically sync your data to the cloud', icon: Database, value: true, key: 'storage' },
                  { label: 'Two-Factor Auth', sub: 'Biometric or hardware verification', icon: Cpu, value: privacy.mfa, key: 'mfa' },
                  { label: 'GPS Tracking', sub: 'Real-time location and geofencing', icon: Globe, value: privacy.location, key: 'location' },
                  { label: 'Private Mode', sub: 'Hide sensitive vehicle information', icon: Eye, value: false, key: 'privacy' },
               ].map((item, i) => (
                  <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                           <item.icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-1 text-left">
                           <span className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">{item.label}</span>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.sub}</p>
                        </div>
                     </div>
                     <div 
                        onClick={() => togglePrivacy(item.key)}
                        className={cn(
                           "w-12 h-6 rounded-full p-1 transition-all",
                           item.value ? 'bg-primary shadow-lg shadow-blue-500/20' : 'bg-slate-200'
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
         <h4 className="font-display font-bold text-xl tracking-tight text-slate-900 px-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-primary shadow-sm">
               <Scale className="w-5 h-5" />
            </div>
            Legal & Compliance
         </h4>
         <div className="premium-card overflow-hidden lg:grid lg:grid-cols-2 border border-slate-200 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="p-10 space-y-8">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 pb-4">General Policies</p>
               <div className="space-y-4">
                  <button onClick={() => setActiveModal('Terms of Service')} className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-white transition-all group">
                     <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform shadow-sm">
                           <FileText className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">Terms of Service</span>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                  <button onClick={() => setActiveModal('Privacy Policy')} className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-white transition-all group">
                     <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform shadow-sm">
                           <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-primary transition-colors">Privacy Policy</span>
                     </div>
                     <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
               </div>
            </div>

            <div className="p-10 space-y-8">
               <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider border-b border-slate-100 pb-4">Danger Zone</p>
               <div className="space-y-4">
                  <button onClick={handleLogout} className="w-full h-20 bg-red-50/50 hover:bg-red-50 flex items-center justify-between px-8 rounded-3xl border border-red-100 group transition-all text-red-500">
                     <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-xl bg-white border border-red-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-transform shadow-sm">
                           <LogOut className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                           <span className="text-base font-bold leading-none block">Sign Out</span>
                           <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mt-1">End current session</p>
                        </div>
                     </div>
                     <ShieldAlert className="w-6 h-6 opacity-20 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button className="w-full h-20 bg-slate-50 hover:bg-red-50 flex items-center justify-between px-8 rounded-3xl border border-slate-100 hover:border-red-100 group transition-all text-slate-400 hover:text-red-500">
                     <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:scale-110 group-hover:-rotate-12 transition-transform flex items-center justify-center shadow-sm">
                           <Trash2 className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                           <span className="text-base font-bold leading-none block">Delete Account</span>
                           <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mt-1">Permanent data removal</p>
                        </div>
                     </div>
                     <X className="w-6 h-6 opacity-20 group-hover:opacity-100 transition-opacity" />
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="flex flex-col items-center justify-center py-16 opacity-30 pointer-events-none">
         <Logo type="full" className="h-10 opacity-50" />
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mt-6">Version 6.2.0 Stable</p>
      </div>

      <AnimatePresence>
         {activeModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-10">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                 animate={{ opacity: 1, scale: 1, y: 0 }} 
                 exit={{ opacity: 0, scale: 0.95, y: 20 }} 
                 className="relative w-full max-w-2xl bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar flex flex-col text-slate-900"
               >
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/80">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary border border-blue-100 shadow-sm">
                           <Scale className="w-6 h-6" />
                        </div>
                        <h3 className="font-display font-bold text-2xl text-slate-900 tracking-tight">{activeModal}</h3>
                     </div>
                     <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary transition-all"><X className="w-6 h-6" /></button>
                  </div>
                  
                  <div className="p-8 space-y-10 text-slate-600 text-sm leading-relaxed font-medium">
                     <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Official Policy v4.5 · Last updated March 2026</p>
                     </div>
                     <div className="space-y-6">
                        <h4 className="font-display font-bold text-slate-900 text-lg">1. Terms of Service</h4>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
                           <p className="opacity-80">By using the AutoTracker platform, you agree to our data handling and privacy protocols. We processed your vehicle information to provide financial insights and maintenance schedules. Your data is secured using industry-standard encryption and will not be shared with third parties without your explicit consent.</p>
                        </div>
                        <h4 className="font-display font-bold text-slate-900 text-lg">2. Data Privacy</h4>
                        <p className="opacity-80">We adhere to global data protection regulations to ensure your privacy. All location data and financial logs are stored securely and are accessible only to authorized account holders.</p>
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
