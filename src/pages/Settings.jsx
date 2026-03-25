import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ShieldCheck, Lock, CreditCard, HelpCircle, LogOut, ChevronRight, Globe, Moon, Eye, Smartphone, MoreVertical, CreditCard as Card, Share, Download } from 'lucide-react'

const Settings = () => {
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

  const toggleNotification = (key) => setNotifications(n => ({ ...n, [key]: !n[key] }))
  const togglePrivacy = (key) => setPrivacy(p => ({ ...p, [key]: !p[key] }))

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Card */}
      <div className="flex items-center gap-6 p-6 glass rounded-3xl border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <button className="p-2 glass rounded-xl border border-white/10 hover:bg-white/[0.05]">
            <MoreVertical className="w-5 h-5 text-muted hover:text-text transition-colors" />
          </button>
        </div>
        <div className="w-20 h-20 rounded-full bg-surface3 border-4 border-accent/20 overflow-hidden ring-2 ring-accent/30 shadow-2xl transition-transform group-hover:scale-110">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop" 
            alt="Ahmed" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1 relative z-10">
          <h2 className="text-2xl font-display font-extrabold tracking-tightest">Ahmed <span className="text-accent">Al Mansouri</span></h2>
          <p className="text-xs text-muted font-mono uppercase tracking-widest leading-none">Pro Member since 2025</p>
          <div className="flex gap-4 mt-4">
            <div className="flex flex-col gap-0.5">
               <span className="text-[9px] text-muted font-mono uppercase tracking-widest font-bold">Vehicles</span>
               <span className="text-sm font-display font-black tracking-tightest">2 Active</span>
            </div>
            <div className="flex flex-col gap-0.5 border-l border-white/5 pl-4">
               <span className="text-[9px] text-muted font-mono uppercase tracking-widest font-bold">Workspace</span>
               <span className="text-sm font-display font-black tracking-tightest">Individual</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Plan Upsell */}
      <div className="bg-gradient-to-br from-accent to-accent2 p-6 rounded-3xl border border-white/20 shadow-[0_8px_32px_rgba(108,99,255,0.4)] relative overflow-hidden group">
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 p-4 opacity-30 select-none">
          <TrendingUp className="w-20 h-20 text-white" />
        </div>
        <div className="space-y-4 relative z-10">
          <div className="space-y-1">
            <h4 className="font-display font-black text-xl text-white tracking-tightest uppercase italic">Unlock Fleet B2B</h4>
            <p className="text-white/80 text-sm max-w-[200px]">Manage team drivers, complex tax logs, and bulk expenses.</p>
          </div>
          <button className="px-5 py-2.5 bg-white text-accent rounded-xl font-display font-extrabold text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Section: Notifications */}
      <div className="space-y-4">
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold px-4 flex items-center gap-2">
          <Bell className="w-3 h-3" />
          Alert Preferences
        </h4>
        <div className="glass overflow-hidden rounded-3xl border border-white/5 divide-y divide-white/5">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => toggleNotification(key)}>
              <div className="space-y-1">
                <span className="text-sm font-display font-bold text-text capitalize tracking-tightest group-hover:text-accent transition-colors">{key} Notifications</span>
                <p className="text-[10px] text-muted font-mono uppercase tracking-widest leading-none">Status updates & reminders</p>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-all ${value ? 'bg-accent' : 'bg-surface3'}`}>
                <motion.div 
                  initial={false}
                  animate={{ x: value ? 24 : 0 }}
                  className="w-4 h-4 rounded-full bg-white shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Privacy & Data */}
      <div className="space-y-4">
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent2 font-bold px-4 flex items-center gap-2">
          <ShieldCheck className="w-3 h-3" />
          Data & Privacy
        </h4>
        <div className="glass overflow-hidden rounded-3xl border border-white/5 divide-y divide-white/5">
           <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center border border-white/5">
                  <Lock className="w-5 h-5 text-accent2" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-display font-bold text-text tracking-tightest group-hover:text-accent transition-colors">Biometric Authentication</span>
                  <p className="text-[10px] text-muted font-mono uppercase tracking-widest leading-none">Use Face ID or Touch ID</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-all bg-accent2`}>
                <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
              </div>
           </div>
           
           <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center border border-white/5">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-display font-bold text-text tracking-tightest group-hover:text-accent transition-colors">Location Tracking</span>
                  <p className="text-[10px] text-muted font-mono uppercase tracking-widest leading-none">Gas station auto-detection</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-all bg-accent`}>
                <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
              </div>
           </div>
        </div>
      </div>

       {/* Footer Actions */}
       <div className="space-y-3 pb-8">
         <button className="w-full flex items-center justify-between p-5 glass rounded-2xl border border-white/5 text-muted hover:text-text hover:border-white/20 transition-all group">
            <div className="flex items-center gap-4">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-display font-bold tracking-tightest">Support & Help Center</span>
            </div>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
         </button>
         
         <button className="w-full flex items-center justify-between p-5 glass rounded-2xl border border-white/5 text-muted hover:text-accent4 group active:scale-95 transition-all">
            <div className="flex items-center gap-4 group-hover:gap-6 transition-all">
              <LogOut className="w-5 h-5 text-accent4" />
              <span className="text-sm font-display font-bold tracking-tightest text-accent4">Electronic Exit</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-60 transition-opacity whitespace-nowrap">Sign Out Globally</span>
         </button>
       </div>

       {/* Legal links */}
       <div className="flex justify-center gap-8 py-4">
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest cursor-pointer hover:text-accent hover:underline underline-offset-4 transition-all">Privacy</span>
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest cursor-pointer hover:text-accent hover:underline underline-offset-4 transition-all">Terms</span>
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest cursor-pointer hover:text-accent hover:underline underline-offset-4 transition-all italic">v1.2.0</span>
       </div>
    </div>
  )
}

export default Settings
