import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, ShieldCheck, MapPin, Database, ChevronRight, 
  ArrowRight, Activity, Terminal, Lock, Sparkles, Zap, 
  FileText, Info, HelpCircle, Eye, Radio, CreditCard,
  Users, Briefcase, Car, TrendingUp, DollarSign, Loader2,
  Camera, User, Globe
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import Logo from '../components/Logo'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const PLANS = [
  { id: 'free', name: 'Free', price: 'AED 0', desc: 'Basic Personal Use', features: ['1 Vehicle', 'Basic Expense Logging', 'Manual Trip Entry', '7 Day History'], color: 'text-text-muted', badge: 'PERSONAL' },
  { id: 'pro', name: 'Pro', price: 'AED 29', desc: 'Advanced Management', features: ['Up to 5 Vehicles', 'AI Powered Insights', 'Auto-Classification', 'Full Export Options', '365 Day History'], color: 'text-primary', badge: 'MOST_POPULAR', highlight: true },
  { id: 'fleet', name: 'Fleet', price: 'AED 129', desc: 'Full Fleet Control', features: ['Unlimited Vehicles', 'Driver Management', 'Fleet Dashboards', 'Compliance Audits', 'Priority Support', 'Custom Exports'], color: 'text-accent', badge: 'BUSINESS' },
]

const Onboarding = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Consent, 2: Identity, 3: Plan Selection
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
     full_name: '',
     company: '',
     role: 'Fleet Manager',
     currency: 'AED'
  })

  useEffect(() => {
     checkUser()
  }, [])

  const checkUser = async () => {
     const { data: { user } } = await supabase.auth.getUser()
     if (!user) {
        navigate('/auth')
        return
     }
     setUser(user)
     setFormData(p => ({ ...p, full_name: user?.user_metadata?.full_name || '' }))
  }

  const handleCompleteOnboarding = async (planId) => {
     setLoading(true)
     try {
        const { error } = await supabase
           .from('profiles')
           .upsert({
              id: user.id,
              full_name: formData.full_name,
              company: formData.company,
              role: formData.role,
              currency: formData.currency,
              subscription_tier: planId,
              onboarding_complete: true,
              updated_at: new Date().toISOString()
           })

        if (error) throw error
        navigate('/')
     } catch (err) {
        console.error('Onboarding sync failure:', err)
     } finally {
        setLoading(false)
     }
  }

   return (
    <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden font-body antialiased">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="max-w-[1200px] w-full relative z-10">
         <AnimatePresence mode="wait">
            {step === 1 && (
                <motion.div 
                   key="consent"
                   initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                   className="saas-card p-12 lg:px-24 lg:py-20 space-y-16 max-w-4xl mx-auto relative overflow-hidden bg-bg-card"
                >
                   <div className="space-y-6 text-center">
                     <div className="flex justify-center mb-10">
                        <Logo type="full" className="h-16" animate={true} />
                     </div>
                     <h1 className="text-5xl lg:text-7xl font-display text-text-main italic uppercase tracking-tighter leading-none">Auto<span className="text-accent underline decoration-accent/20 decoration-8 underline-offset-8">Track</span> <br/> Setup</h1>
                     <p className="text-[12px] text-text-helper font-mono font-bold uppercase tracking-[0.3em]">Premium Fleet & Expense Management</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-white/5">
                     <div className="space-y-6 flex gap-8 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                           <MapPin className="w-7 h-7 text-primary" />
                        </div>
                         <div className="space-y-3">
                           <h3 className="text-xl font-display font-bold text-text-title italic uppercase tracking-tighter">Location Tracking</h3>
                           <p className="text-[13px] text-text-secondary font-display font-medium leading-relaxed">We use GPS coordinates to accurately log your trips and calculate tax reimbursements. All location data is encrypted for your privacy.</p>
                        </div>
                     </div>
                     <div className="space-y-6 flex gap-8 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                           <Database className="w-7 h-7 text-primary" />
                        </div>
                         <div className="space-y-3">
                           <h3 className="text-xl font-display font-bold text-text-title italic uppercase tracking-tighter">Smart Insights</h3>
                           <p className="text-[13px] text-text-secondary font-display font-medium leading-relaxed">We analyze your spending patterns to provide AI-powered cost saving suggestions. We never share your private data with third parties.</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col items-center gap-10 pt-10">
                     <label className="flex items-center gap-6 cursor-pointer group">
                        <input type="checkbox" className="hidden" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                        <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center border transition-all shadow-premium",
                           agreed ? "bg-primary border-primary text-white shadow-glow" : "bg-white border-border group-hover:bg-slate-50"
                        )}>
                           <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                        </div>
                         <span className="text-[12px] font-mono font-black text-text-secondary uppercase tracking-widest italic leading-none group-hover:text-text-main transition-colors">I accept the Terms of Service & Privacy Policy</span>
                     </label>

                     <button disabled={!agreed} onClick={() => setStep(2)} className={cn("h-18 px-16 btn-primary text-sm font-black italic tracking-[0.2em] shadow-glow disabled:opacity-30")}>
                        Get Started
                        <ArrowRight className="w-6 h-6 ml-4" />
                     </button>
                  </div>
               </motion.div>
            )}

            {step === 2 && (
                <motion.div 
                   key="identity"
                   initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                   className="saas-card p-12 lg:px-24 lg:py-20 space-y-16 max-w-4xl mx-auto relative overflow-hidden bg-bg-card"
                >
                   <div className="text-center space-y-6">
                     <div className="flex justify-center mb-10">
                        <Logo type="icon" className="h-14" />
                     </div>
                     <h2 className="text-6xl font-display text-text-main italic uppercase tracking-tighter">Your <span className="text-accent underline decoration-accent/10 decoration-4 underline-offset-4">Profile</span></h2>
                     <p className="text-[12px] text-text-secondary font-mono font-bold uppercase tracking-[0.4em]">Set up your personal or business account</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
                     <div className="space-y-6">
                         <label className="text-[11px] text-text-helper font-mono font-black uppercase tracking-widest pl-2">Your Name</label>
                        <div className="relative group">
                           <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-subtle group-focus-within:text-primary transition-all" />
                           <input 
                              placeholder="FULL NAME" 
                              value={formData.full_name} 
                              onChange={e => setFormData(p => ({ ...p, full_name: e.target.value.toUpperCase() }))}
                              className="w-full h-18 bg-white border border-border rounded-2xl px-16 text-lg font-display font-black italic text-text-main focus:outline-none focus:bg-white focus:border-primary/40 transition-all uppercase"
                           />
                        </div>
                     </div>
                     <div className="space-y-6">
                         <label className="text-[11px] text-text-helper font-mono font-black uppercase tracking-widest pl-2">Company Name</label>
                        <div className="relative group">
                           <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-text-subtle group-focus-within:text-primary transition-all" />
                           <input 
                              placeholder="COMPANY NAME" 
                              value={formData.company} 
                              onChange={e => setFormData(p => ({ ...p, company: e.target.value.toUpperCase() }))}
                              className="w-full h-18 bg-white border border-border rounded-2xl px-16 text-lg font-display font-black italic text-text-main focus:outline-none focus:bg-white focus:border-primary/40 transition-all uppercase"
                           />
                        </div>
                     </div>
                     <div className="space-y-6">
                         <label className="text-[11px] text-text-helper font-mono font-black uppercase tracking-widest pl-2">Your Role</label>
                        <select 
                           value={formData.role} 
                           onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                            className="w-full h-18 bg-white border-2 border-border rounded-2xl px-12 text-[12px] font-display font-semibold italic text-text-main focus:outline-none focus:border-text-main transition-all uppercase tracking-widest appearance-none"
                        >
                           <option value="Fleet Manager">Fleet Manager</option>
                           <option value="Owner Operator">Owner Driver</option>
                           <option value="Dispatch Command">Operations</option>
                        </select>
                     </div>
                     <div className="space-y-6">
                         <label className="text-[11px] text-text-helper font-mono font-black uppercase tracking-widest pl-2">Preferred Currency</label>
                        <div className="grid grid-cols-2 gap-4">
                           {['AED', 'USD'].map(c => (
                              <button 
                                 key={c} onClick={() => setFormData(p => ({ ...p, currency: c }))}
                                 className={cn(
                                    "h-18 rounded-2xl border font-display font-black italic text-[11px] tracking-widest transition-all",
                                     formData.currency === c ? "bg-text-main border-text-main text-white shadow-md active:scale-95" : "bg-white border-border text-text-subtle hover:text-text-main"
                                 )}
                              >
                                 {c}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-center pt-10">
                     <button 
                        disabled={!formData.full_name || !formData.company} 
                        onClick={() => setStep(3)} 
                        className="h-18 px-16 btn-primary text-sm font-black italic tracking-[0.2em] shadow-glow disabled:opacity-30"
                     >
                        Continue
                        <ArrowRight className="w-6 h-6 ml-4" />
                     </button>
                  </div>
               </motion.div>
            )}

            {step === 3 && (
               <motion.div 
                  key="plans"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="space-y-16"
               >
                   <div className="text-center space-y-6">
                     <div className="flex justify-center mb-10">
                        <Logo type="icon" className="h-14" />
                     </div>
                     <h2 className="text-6xl font-display text-text-main italic uppercase tracking-tighter">Choose <span className="text-accent underline decoration-accent/10 decoration-4 underline-offset-4">Your Plan</span></h2>
                     <p className="text-[12px] text-text-secondary font-mono font-bold uppercase tracking-[0.4em]">Select the best fit for your needs</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {PLANS.map((plan, i) => (
                         <motion.div 
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -8 }}
                            className={cn(
                               "saas-card p-10 flex flex-col justify-between group h-full relative border-slate-100",
                               plan.highlight ? "ring-2 ring-primary bg-white shadow-elevated z-10 scale-105" : "bg-white/80"
                            )}
                         >
                           {plan.highlight && (
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-primary text-white text-[9px] font-black uppercase tracking-[0.3em] italic rounded-full shadow-lg shadow-primary/20 z-20">
                                 MOST POPULAR NODE
                              </div>
                           )}
                           <div className="space-y-10">
                              <div className="space-y-4">
                                 <span className={cn("text-[10px] font-mono font-black uppercase tracking-[0.3em] italic opacity-60 leading-none block", plan.color)}>{plan.desc}</span>
                                  <h3 className="text-3xl font-display font-black text-text-main italic tracking-tighter uppercase">{plan.name}</h3>
                                 <div className="flex flex-col pt-2">
                                    <div className="flex items-baseline gap-2">
                                       <span className="text-[14px] font-black text-primary italic">AED</span>
                                       <span className="text-6xl font-display font-black italic tracking-tighter text-text-main leading-none">
                                          {plan.price.replace('AED ', '')}
                                       </span>
                                    </div>
                                    <span className="text-[10px] text-text-helper uppercase font-black tracking-widest mt-1 italic opacity-60">Provisioning Cycle</span>
                                 </div>
                              </div>
                              <div className="space-y-5 border-t border-slate-50 pt-8">
                                 {plan.features.map((f, j) => (
                                     <div key={j} className="flex items-center gap-4 group/feat">
                                        <CheckCircle2 className={cn("w-5 h-5", plan.highlight ? "text-primary" : "text-emerald-500")} />
                                        <span className="text-[11px] font-bold text-text-helper leading-none uppercase italic group-hover/feat:text-text-main transition-colors">{f}</span>
                                     </div>
                                 ))}
                              </div>
                           </div>
                           <button 
                              onClick={() => handleCompleteOnboarding(plan.id)}
                              disabled={loading}
                              className={cn(
                                 "w-full h-16 mt-10 rounded-2xl text-[10px] uppercase font-black tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-3 italic group/btn",
                                 plan.highlight 
                                   ? "bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-[1.02]" 
                                   : "bg-slate-50 text-text-main border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-lg"
                              )}
                           >
                              {loading ? (
                                 <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                              ) : (
                                 <>
                                    <span>{plan.id === 'free' ? 'START FREE' : plan.id === 'pro' ? 'GET PRO' : 'GO FLEET'}</span>
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                 </>
                              )}
                           </button>
                        </motion.div>
                     ))}
                  </div>

                  <div className="text-center">
                      <button onClick={() => setStep(2)} className="text-[10px] font-mono font-black text-text-subtle uppercase tracking-[0.3em] hover:text-text-main transition-all italic underline underline-offset-4">Go Back</button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      <div className="absolute bottom-10 left-0 right-0 px-24 hidden lg:flex items-center justify-between opacity-20 pointer-events-none">
         <div className="flex items-center gap-6 text-[10px] font-mono font-black uppercase tracking-[0.3em] font-black text-white flex-1">
            <Terminal className="w-5 h-5 text-primary" />
            Secure Data Processing · Encrypted Storage · 24/7 Monitoring
         </div>
         <div className="flex gap-10">
            <div className="flex items-center gap-3">
               <Radio className="w-4 h-4 text-primary animate-pulse" />
               <span className="text-[9px] font-mono font-black text-white uppercase italic">System Status: Online</span>
            </div>
            <div className="flex items-center gap-3">
               <Eye className="w-4 h-4 text-emerald-500" />
               <span className="text-[10px] font-mono font-black text-white uppercase italic">Secure Connection</span>
            </div>
         </div>
      </div>
    </div>
  )
}

export default Onboarding
