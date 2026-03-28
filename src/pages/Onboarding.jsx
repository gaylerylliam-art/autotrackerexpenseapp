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
    <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden text-slate-900">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="max-w-[1200px] w-full relative z-10">
         <AnimatePresence mode="wait">
            {step === 1 && (
               <motion.div 
                  key="consent"
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                  className="saas-card p-12 lg:p-24 space-y-16 max-w-4xl mx-auto border-white/10 shadow-premium bg-white/5 backdrop-blur-2xl"
               >
                  <div className="space-y-6 text-center">
                     <div className="flex justify-center mb-8">
                        <Logo type="full" className="h-20" animate={true} />
                     </div>
                     <h1 className="text-5xl lg:text-7xl font-display font-black text-slate-900 italic uppercase tracking-tighter leading-none underline decoration-primary/20 decoration-8 underline-offset-8">Setup <br/> Profile</h1>
                     <p className="text-[12px] text-slate-700 font-mono font-bold uppercase tracking-[0.3em] italic">Secure individual & fleet expense management</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10 border-t border-white/5">
                     <div className="space-y-6 flex gap-8 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                           <MapPin className="w-7 h-7 text-primary" />
                        </div>
                        <div className="space-y-3">
                           <h3 className="text-xl font-display font-black text-slate-900 italic uppercase tracking-tighter">Location Tracking</h3>
                           <p className="text-[11px] text-slate-700 font-display font-medium leading-relaxed">We use GPS coordinates to accurately log your trips and calculate tax reimbursements. All location data is encrypted for your privacy.</p>
                        </div>
                     </div>
                     <div className="space-y-6 flex gap-8 group">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500">
                           <Database className="w-7 h-7 text-primary" />
                        </div>
                        <div className="space-y-3">
                           <h3 className="text-xl font-display font-black text-slate-900 italic uppercase tracking-tighter">Smart Insights</h3>
                           <p className="text-[11px] text-slate-700 font-display font-medium leading-relaxed">We analyze your spending patterns to provide AI-powered cost saving suggestions. We never share your private data with third parties.</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col items-center gap-10 pt-10">
                     <label className="flex items-center gap-6 cursor-pointer group">
                        <input type="checkbox" className="hidden" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                        <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center border transition-all shadow-premium",
                           agreed ? "bg-primary border-primary text-white shadow-glow" : "bg-white/5 border-white/10 group-hover:bg-white/10"
                        )}>
                           <CheckCircle2 className="w-6 h-6 stroke-[3]" />
                        </div>
                        <span className="text-[12px] font-mono font-bold text-slate-700 uppercase tracking-widest italic leading-none group-hover:text-slate-900 transition-colors">I accept the Terms of Service & Privacy Policy</span>
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
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="saas-card p-12 lg:p-24 space-y-16 max-w-4xl mx-auto border-white/10 shadow-premium bg-white/5 backdrop-blur-2xl"
               >
                  <div className="text-center space-y-6">
                     <div className="flex justify-center mb-8">
                        <Logo type="icon" className="h-16" />
                     </div>
                     <h2 className="text-6xl font-display font-black text-slate-900 italic uppercase tracking-tighter leading-none">Your <span className="text-primary">Profile</span></h2>
                     <p className="text-[12px] text-slate-700 font-mono font-bold uppercase tracking-[0.4em] italic leading-relaxed">Set up your personal or business account</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
                     <div className="space-y-6">
                        <label className="text-[11px] text-slate-700 font-mono font-black uppercase tracking-widest italic pl-2">Your Name</label>
                        <div className="relative group">
                           <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary transition-all" />
                           <input 
                              placeholder="FULL NAME" 
                              value={formData.full_name} 
                              onChange={e => setFormData(p => ({ ...p, full_name: e.target.value.toUpperCase() }))}
                              className="w-full h-18 bg-white/5 border border-slate-200 rounded-2xl px-16 text-lg font-display font-black italic text-slate-900 focus:outline-none focus:bg-white focus:border-primary/40 transition-all uppercase"
                           />
                        </div>
                     </div>
                     <div className="space-y-6">
                        <label className="text-[11px] text-slate-700 font-mono font-black uppercase tracking-widest italic pl-2">Company Name</label>
                        <div className="relative group">
                           <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary transition-all" />
                           <input 
                              placeholder="COMPANY NAME" 
                              value={formData.company} 
                              onChange={e => setFormData(p => ({ ...p, company: e.target.value.toUpperCase() }))}
                              className="w-full h-18 bg-white/5 border border-slate-200 rounded-2xl px-16 text-lg font-display font-black italic text-slate-900 focus:outline-none focus:bg-white focus:border-primary/40 transition-all uppercase"
                           />
                        </div>
                     </div>
                     <div className="space-y-6">
                        <label className="text-[11px] text-slate-700 font-mono font-black uppercase tracking-widest italic pl-2">Your Role</label>
                        <select 
                           value={formData.role} 
                           onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                           className="w-full h-18 bg-white border-2 border-slate-200 rounded-2xl px-12 text-[12px] font-display font-black italic text-slate-900 focus:outline-none focus:bg-white focus:border-primary/40 transition-all uppercase tracking-widest appearance-none"
                        >
                           <option value="Fleet Manager">Fleet Manager</option>
                           <option value="Owner Operator">Owner Driver</option>
                           <option value="Dispatch Command">Operations</option>
                        </select>
                     </div>
                     <div className="space-y-6">
                        <label className="text-[11px] text-slate-700 font-mono font-black uppercase tracking-widest italic pl-2">Preferred Currency</label>
                        <div className="grid grid-cols-2 gap-4">
                           {['AED', 'USD'].map(c => (
                              <button 
                                 key={c} onClick={() => setFormData(p => ({ ...p, currency: c }))}
                                 className={cn(
                                    "h-18 rounded-2xl border font-display font-black italic text-[11px] tracking-widest transition-all",
                                    formData.currency === c ? "bg-primary border-primary text-white shadow-glow" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
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
                     <div className="flex justify-center mb-8">
                        <Logo type="icon" className="h-16" />
                     </div>
                     <h2 className="text-6xl font-display font-black text-slate-900 italic uppercase tracking-tighter leading-none">Choose <span className="text-primary">Your Plan</span></h2>
                     <p className="text-[12px] text-slate-700 font-mono font-bold uppercase tracking-[0.4em] italic">Select the best fit for your needs</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                     {PLANS.map((plan, i) => (
                        <motion.div 
                           key={plan.id}
                           initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                           className={cn(
                              "saas-card p-12 flex flex-col justify-between group h-full relative border-white/10 shadow-premium bg-white/5 backdrop-blur-2xl",
                              plan.highlight && "border-primary/40 bg-primary/2 shadow-glow shadow-primary/10"
                           )}
                        >
                           {plan.highlight && (
                              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-white text-[9px] font-black uppercase tracking-[0.3em] italic rounded-full shadow-glow">
                                 {plan.badge}
                              </div>
                           )}
                           <div className="space-y-12">
                              <div className="space-y-4">
                                 <span className={cn("text-[10px] font-mono font-black uppercase tracking-widest italic opacity-40 leading-none block", plan.color)}>{plan.desc}</span>
                                 <h3 className="text-4xl font-display font-black text-slate-900 italic leading-none">{plan.name}</h3>
                                 <div className="flex items-end gap-3 pt-4">
                                    <span className="text-5xl font-mono font-black italic tracking-tighter leading-none text-slate-900">{plan.price}</span>
                                    <span className="text-[11px] text-slate-500 uppercase font-black tracking-widest italic opacity-70 mb-1">/MON</span>
                                 </div>
                              </div>
                              <div className="space-y-6 border-t border-white/5 pt-10">
                                 {plan.features.map((f, j) => (
                                    <div key={j} className="flex items-center gap-4 group/feat">
                                       <CheckCircle2 className="w-5 h-5 text-primary" />
                                       <span className="text-[11px] font-display font-bold text-slate-700 leading-none uppercase italic group-hover/feat:text-slate-900 transition-colors">{f}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           <button 
                              onClick={() => handleCompleteOnboarding(plan.id)}
                              disabled={loading}
                              className={cn(
                                 "w-full h-16 btn-primary mt-12 text-[10px] font-black italic shadow-premium relative overflow-hidden",
                                 plan.id === 'free' ? "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10 hover:text-white" : ""
                              )}
                           >
                              {loading ? <Loader2 className="w-6 h-6 animate-spin text-white mx-auto" /> : `Select ${plan.name} Plan`}
                           </button>
                        </motion.div>
                     ))}
                  </div>

                  <div className="text-center">
                     <button onClick={() => setStep(2)} className="text-[10px] font-mono font-black text-text-muted uppercase tracking-[0.3em] hover:text-white transition-all italic opacity-40">Go Back</button>
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
