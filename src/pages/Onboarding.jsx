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
  const [step, setStep] = useState(1) // 1: Profile, 2: Plans, 3: GPS Activation, 4: Vehicle Setup
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [user, setUser] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [formData, setFormData] = useState({
     full_name: '',
     company: '',
     role: 'Fleet Manager',
     currency: 'AED',
     vehicle_name: '',
     vehicle_type: 'Sedan',
     plate_number: ''
  })

  useEffect(() => {
     checkUser()
  }, [])

  const checkUser = async () => {
     const { data: { user } } = await supabase.auth.getUser()
     if (!user) { navigate('/auth'); return; }
     setUser(user)
     setFormData(p => ({ ...p, full_name: user?.user_metadata?.full_name || '' }))
  }

  const handleCompleteOnboarding = async () => {
     setLoading(true)
     try {
        // 1. Update Profile & Plan
        const { error: profError } = await supabase
           .from('profiles')
           .upsert({
              id: user.id,
              full_name: formData.full_name,
              company: formData.company,
              role: formData.role,
              currency: formData.currency,
              subscription_tier: selectedPlan,
              onboarding_complete: true,
              updated_at: new Date().toISOString()
           })
        if (profError) throw profError

        // 2. Add Initial Vehicle
        const { error: vehError } = await supabase
           .from('vehicles')
           .insert([{
              user_id: user.id,
              name: formData.vehicle_name,
              type: formData.vehicle_type,
              plate_number: formData.plate_number,
              status: 'Active'
           }])
        if (vehError) throw vehError

        navigate('/')
     } catch (err) {
        console.error('Onboarding protocol failure:', err)
     } finally {
        setLoading(false)
     }
  }

   return (
    <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden font-body antialiased">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1200px] w-full relative z-10">
         <AnimatePresence mode="wait">
            {step === 1 && (
                <motion.div 
                   key="profile"
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                   className="saas-card p-10 lg:p-20 space-y-12 max-w-4xl mx-auto bg-white/90"
                >
                   <div className="space-y-4">
                      <Logo type="full" className="h-12 mb-8" animate={true} />
                      <h1 className="text-text-main">Welcome to <span className="text-primary italic">AutoTracker</span></h1>
                      <p className="body-text text-text-helper opacity-80">Initialize your operational profile to begin asset commissioning. Premium fleet intelligence awaits.</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                      <div className="space-y-3">
                         <label className="caption-text font-black uppercase tracking-widest pl-1">Operational Name</label>
                         <input 
                            value={formData.full_name} 
                            onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-display font-bold text-text-main focus:bg-white focus:border-primary/40 transition-all outline-none"
                            placeholder="John Doe"
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="caption-text font-black uppercase tracking-widest pl-1">Fleet / Company</label>
                         <input 
                            value={formData.company} 
                            onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-display font-bold text-text-main focus:bg-white focus:border-primary/40 transition-all outline-none"
                            placeholder="Star Fleet Logistics"
                         />
                      </div>
                      <div className="space-y-3">
                         <label className="caption-text font-black uppercase tracking-widest pl-1">Command Role</label>
                         <select 
                            value={formData.role} 
                            onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                            className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-display font-bold text-text-main focus:bg-white focus:border-primary/40 transition-all outline-none appearance-none"
                         >
                            <option value="Fleet Manager">Fleet Manager</option>
                            <option value="Owner Operator">Owner Driver</option>
                            <option value="Dispatch Command">Operations</option>
                         </select>
                      </div>
                      <div className="space-y-3">
                         <label className="caption-text font-black uppercase tracking-widest pl-1">Base Currency</label>
                         <div className="flex gap-4">
                            {['AED', 'USD'].map(c => (
                               <button 
                                  key={c} onClick={() => setFormData(p => ({ ...p, currency: c }))}
                                  className={cn(
                                     "flex-1 h-14 rounded-2xl border font-display font-black italic text-[11px] tracking-widest transition-all",
                                      formData.currency === c ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white border-slate-100 text-text-subtle hover:text-text-main"
                                  )}
                               >
                                  {c}
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col items-center gap-8 pt-8 border-t border-slate-50">
                      <label className="flex items-center gap-4 cursor-pointer group">
                         <input type="checkbox" className="hidden" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                         <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center border transition-all",
                            agreed ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-200"
                         )}>
                            {agreed && <CheckCircle2 className="w-5 h-5" />}
                         </div>
                         <span className="caption-text font-bold uppercase tracking-widest hover:text-text-main transition-colors">I accept the Operations Protocol & Privacy SLA</span>
                      </label>

                      <button 
                         disabled={!agreed || !formData.full_name || !formData.company} 
                         onClick={() => setStep(2)} 
                         className="btn-primary w-full md:w-auto px-16 disabled:opacity-30 disabled:scale-100"
                      >
                         Provision Identity
                         <ArrowRight className="w-5 h-5" />
                      </button>
                   </div>
                </motion.div>
            )}

            {step === 2 && (
               <motion.div 
                  key="plans"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
               >
                   <div className="text-center space-y-4">
                      <h1 className="text-text-main">Choose your <span className="text-primary italic">Intelligence tier</span></h1>
                      <p className="body-text text-helper max-w-xl mx-auto">Select the optimal computing node for your asset tracking requirements.</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {PLANS.map((plan, i) => (
                          <motion.div 
                             key={plan.id}
                             whileHover={{ y: -8 }}
                             onClick={() => setSelectedPlan(plan.id)}
                             className={cn(
                                "saas-card p-10 flex flex-col justify-between group cursor-pointer relative",
                                selectedPlan === plan.id ? "ring-2 ring-primary bg-white shadow-elevated scale-105" : "bg-white/80"
                             )}
                          >
                            {plan.highlight && (
                               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2 bg-primary text-white text-[9px] font-black uppercase tracking-[0.3em] italic rounded-full shadow-lg shadow-primary/20 z-20">
                                  OPTIMAL NODE
                               </div>
                            )}

                            <div className="space-y-8">
                               <div className="space-y-2">
                                  <span className={cn("caption-text font-black uppercase tracking-[0.3em] italic opacity-60", plan.color)}>{plan.desc}</span>
                                  <h2 className="text-text-main italic uppercase">{plan.name}</h2>
                               </div>
                               
                               <div className="flex flex-col">
                                  <div className="flex items-baseline gap-2">
                                     <span className="text-[14px] font-black text-primary italic">AED</span>
                                     <span className="price-header text-text-main">{plan.price.replace('AED ', '')}</span>
                                  </div>
                                  <span className="caption-text font-black uppercase tracking-widest italic leading-none mt-1">Provision cycle</span>
                               </div>

                               <div className="space-y-4 pt-6 border-t border-slate-50">
                                  {plan.features.map((f, j) => (
                                      <div key={j} className="flex items-center gap-3">
                                         <CheckCircle2 className="w-4 h-4 text-primary" />
                                         <span className="text-[11px] font-bold text-text-helper uppercase italic leading-none">{f}</span>
                                      </div>
                                  ))}
                               </div>
                            </div>
                         </motion.div>
                      ))}
                   </div>

                   <div className="flex justify-center flex-col items-center gap-6">
                      <button 
                         disabled={!selectedPlan} 
                         onClick={() => setStep(3)}
                         className="btn-primary px-16 disabled:opacity-30"
                      >
                         Confirm & Continue
                         <ArrowRight className="w-5 h-5" />
                      </button>
                      <button onClick={() => setStep(1)} className="caption-text font-black uppercase tracking-[0.4em] underline underline-offset-8 hover:text-primary transition-all">Re-initialize identity</button>
                   </div>
               </motion.div>
            )}

            {step === 3 && (
               <motion.div 
                  key="gps"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="saas-card p-12 lg:p-20 space-y-12 max-w-3xl mx-auto text-center bg-white/90"
               >
                  <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-8 shadow-inner">
                     <MapPin className="w-10 h-10 text-primary animate-bounce" />
                  </div>
                  <div className="space-y-4">
                     <h1 className="text-text-main">Provision <span className="text-primary italic">GPS Telemetry</span></h1>
                     <p className="body-text text-text-helper max-w-md mx-auto">AutoTracker requires high-fidelity location telemetry to architect your fiscal trip logs within regulated UAE zones.</p>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-6 text-left">
                     {[
                        { title: 'Trip Automation', desc: 'Auto-detect logic for route mapping.' },
                        { title: 'Asset Security', desc: 'Secure location fencing for asset clusters.' },
                        { title: 'Tax Compliance', desc: 'Precision zone logging for VAT/Toll logic.' }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                           <Zap className="w-5 h-5 text-primary shrink-0" />
                           <div className="space-y-1">
                              <p className="text-[11px] font-black uppercase text-text-main tracking-widest">{item.title}</p>
                              <p className="caption-text font-bold">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="flex flex-col gap-6 pt-6">
                     <button onClick={() => setStep(4)} className="btn-primary w-full h-18 text-sm">
                        Activate Location Uplink
                        <Radio className="w-5 h-5 animate-pulse" />
                     </button>
                     <button onClick={() => setStep(4)} className="caption-text font-black uppercase tracking-widest opacity-40 hover:opacity-100">Configure Uplink Later</button>
                  </div>
               </motion.div>
            )}

            {step === 4 && (
               <motion.div 
                  key="vehicle"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="saas-card p-12 lg:p-20 space-y-12 max-w-3xl mx-auto bg-white/90"
               >
                  <div className="space-y-4 text-center">
                     <h1 className="text-text-main">Commission <span className="text-primary italic">First Asset</span></h1>
                     <p className="body-text text-text-helper">Initialize your primary tracking node. You can add more clusters later.</p>
                  </div>

                  <div className="space-y-8 pt-6 border-t border-slate-50">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="caption-text font-black uppercase tracking-widest pl-1">Vehicle Alias</label>
                           <input 
                              value={formData.vehicle_name} 
                              onChange={e => setFormData(p => ({ ...p, vehicle_name: e.target.value }))}
                              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-display font-bold text-text-main outline-none focus:bg-white focus:border-primary/40"
                              placeholder="My Patrol"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="caption-text font-black uppercase tracking-widest pl-1">Hardware ID / Plate</label>
                           <input 
                              value={formData.plate_number} 
                              onChange={e => setFormData(p => ({ ...p, plate_number: e.target.value.toUpperCase() }))}
                              className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-display font-bold text-text-main outline-none focus:bg-white focus:border-primary/40 uppercase"
                              placeholder="F 12345"
                           />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="caption-text font-black uppercase tracking-widest pl-1">Asset Configuration</label>
                        <div className="grid grid-cols-3 gap-4">
                           {['Sedan', 'SUV', 'Luxury'].map(t => (
                              <button 
                                 key={t} onClick={() => setFormData(p => ({ ...p, vehicle_type: t }))}
                                 className={cn(
                                    "h-14 rounded-2xl border font-display font-black italic text-[10px] tracking-widest transition-all",
                                     formData.vehicle_type === t ? "bg-text-main text-white border-text-main shadow-lg" : "bg-white border-slate-100 text-text-subtle hover:text-text-main"
                                 )}
                              >
                                 {t.toUpperCase()}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="pt-10 flex flex-col gap-6">
                     <button 
                        disabled={!formData.vehicle_name || loading} 
                        onClick={handleCompleteOnboarding}
                        className="btn-primary w-full h-18 text-sm"
                     >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
                           <>
                              FINALIZE COMMISSIONING
                              <Zap className="w-5 h-5 text-white" />
                           </>
                        )}
                     </button>
                     <p className="caption-text font-black text-center uppercase tracking-widest opacity-40">Ready to uplink to control hub Alpha</p>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      <div className="absolute bottom-10 left-0 right-0 px-24 hidden lg:flex items-center justify-between opacity-20 pointer-events-none">
         <div className="flex items-center gap-6 text-[10px] font-mono font-black uppercase tracking-[0.3em] font-black text-white flex-1">
            <Terminal className="w-5 h-5 text-primary" />
            Operational Sync Tier: Alpha-9 · Secure Tunneling Active
         </div>
      </div>
    </div>
  )
}

export default Onboarding
