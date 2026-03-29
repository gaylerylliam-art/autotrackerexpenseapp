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
                      <Logo type="full" className="h-10 mb-8" animate={true} />
                      <h1>Initialize Assets</h1>
                      <p className="body-text">Initialize your operational profile to begin asset commissioning. Premium fleet intelligence awaits.</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                      <div className="space-y-2">
                         <span className="caption">Operational Name</span>
                         <input 
                            value={formData.full_name} 
                            onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))}
                            className="input-field px-6 font-medium"
                            placeholder="John Doe"
                         />
                      </div>
                      <div className="space-y-2">
                         <span className="caption">Fleet / Company</span>
                         <input 
                            value={formData.company} 
                            onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                            className="input-field px-6 font-medium"
                            placeholder="Star Fleet Logistics"
                         />
                      </div>
                      <div className="space-y-2">
                         <span className="caption">Command Role</span>
                         <select 
                            value={formData.role} 
                            onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                            className="input-field px-6 font-medium appearance-none"
                         >
                            <option value="Fleet Manager">Fleet Manager</option>
                            <option value="Owner Operator">Owner Driver</option>
                            <option value="Dispatch Command">Operations</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <span className="caption">Base Currency</span>
                         <div className="flex gap-4">
                            {['AED', 'USD'].map(c => (
                               <button 
                                  key={c} onClick={() => setFormData(p => ({ ...p, currency: c }))}
                                  className={cn(
                                     "flex-1 h-12 rounded-xl border font-semibold text-[14px] transition-all",
                                      formData.currency === c ? "bg-primary text-white border-primary shadow-sm" : "bg-white border-slate-100 text-text-secondary hover:text-text-primary"
                                  )}
                               >
                                  {c}
                               </button>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="flex flex-col items-center gap-6 pt-8 border-t border-slate-50">
                      <label className="flex items-center gap-3 cursor-pointer group">
                         <input type="checkbox" className="hidden" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                         <div className={cn(
                            "w-6 h-6 rounded-md flex items-center justify-center border transition-all",
                            agreed ? "bg-primary border-primary text-white" : "bg-white border-slate-200"
                         )}>
                            {agreed && <CheckCircle2 className="w-4 h-4" />}
                         </div>
                         <span className="caption font-medium normal-case tracking-normal">I accept the Operations Protocol & Privacy SLA</span>
                      </label>

                      <button 
                         disabled={!agreed || !formData.full_name || !formData.company} 
                         onClick={() => setStep(2)} 
                         className="btn-primary w-full md:w-auto px-12"
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
                  className="space-y-10"
               >
                   <div className="text-center space-y-2">
                      <h1>Select Node Tier</h1>
                      <p className="body-text max-w-xl mx-auto">Select the optimal computing node for your asset tracking requirements.</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {PLANS.map((plan, i) => (
                          <motion.div 
                             key={plan.id}
                             onClick={() => setSelectedPlan(plan.id)}
                             className={cn(
                                "saas-card p-8 flex flex-col justify-between group cursor-pointer relative",
                                selectedPlan === plan.id ? "ring-2 ring-primary bg-white shadow-lg" : "bg-white/80"
                             )}
                          >
                            <div className="space-y-6">
                               <div className="space-y-1">
                                  <span className={cn("caption font-bold tracking-[0.1em]", plan.color)}>{plan.desc}</span>
                                  <h2 className="mb-0">{plan.name}</h2>
                               </div>
                               
                               <div className="flex flex-col">
                                  <div className="flex items-baseline gap-1">
                                     <span className="text-[14px] font-semibold text-primary">AED</span>
                                     <span className="price-text">{plan.price.replace('AED ', '')}</span>
                                  </div>
                                  <span className="caption mb-0">per asset / monthly</span>
                               </div>

                               <div className="space-y-4 pt-6 border-t border-slate-50">
                                  {plan.features.map((f, j) => (
                                      <div key={j} className="flex items-center gap-3">
                                         <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                         <span className="body-text lg:text-[14px] text-text-primary font-medium">{f}</span>
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
                         className="btn-primary px-12"
                      >
                         Confirm & Continue
                         <ArrowRight className="w-5 h-5" />
                      </button>
                      <button onClick={() => setStep(1)} className="caption font-semibold normal-case underline underline-offset-4 hover:text-primary transition-all">Re-initialize identity</button>
                   </div>
               </motion.div>
            )}

            {step === 3 && (
               <motion.div 
                  key="gps"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="saas-card p-12 lg:p-16 space-y-10 max-w-2xl mx-auto text-center bg-white"
               >
                  <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                     <MapPin className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-3">
                     <h1>GPS Provisioning</h1>
                     <p className="body-text max-w-md mx-auto">Enable location telemetry to track trips, calculate mileage, and ensure regulatory tax compliance.</p>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-4 text-left">
                     {[
                        { title: 'Tax Compliance', desc: 'Secure zone logging for VAT logic.' },
                        { title: 'Trip Automation', desc: 'Automatic start/stop trip detection.' }
                     ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                           <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                           <div className="space-y-0.5">
                              <p className="text-[14px] font-semibold text-text-primary">{item.title}</p>
                              <p className="caption normal-case mb-0">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="flex flex-col gap-4 pt-4">
                     <button onClick={() => setStep(4)} className="btn-primary w-full">
                        Activate Location Uplink
                     </button>
                     <button onClick={() => setStep(4)} className="caption font-semibold">Skip for now</button>
                  </div>
               </motion.div>
            )}

            {step === 4 && (
               <motion.div 
                  key="vehicle"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="saas-card p-12 lg:p-16 space-y-10 max-w-2xl mx-auto bg-white"
               >
                  <div className="space-y-2 text-center">
                     <h1>First Asset</h1>
                     <p className="body-text">Initialize your primary tracking node.</p>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-50">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <span className="caption">Vehicle Alias</span>
                           <input 
                              value={formData.vehicle_name} 
                              onChange={e => setFormData(p => ({ ...p, vehicle_name: e.target.value }))}
                              className="input-field font-medium"
                              placeholder="My Patrol"
                           />
                        </div>
                        <div className="space-y-2">
                           <span className="caption">Plate Number</span>
                           <input 
                              value={formData.plate_number} 
                              onChange={e => setFormData(p => ({ ...p, plate_number: e.target.value.toUpperCase() }))}
                              className="input-field font-medium uppercase"
                              placeholder="F 12345"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <span className="caption">Asset Type</span>
                        <div className="grid grid-cols-3 gap-4">
                           {['Sedan', 'SUV', 'Luxury'].map(t => (
                              <button 
                                 key={t} onClick={() => setFormData(p => ({ ...p, vehicle_type: t }))}
                                 className={cn(
                                    "h-12 rounded-xl border font-medium text-[13px] transition-all",
                                     formData.vehicle_type === t ? "bg-text-primary text-white border-text-primary" : "bg-white border-slate-100 text-text-secondary hover:text-text-primary"
                                 )}
                              >
                                 {t}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 flex flex-col gap-4">
                     <button 
                        disabled={!formData.vehicle_name || loading} 
                        onClick={handleCompleteOnboarding}
                        className="btn-primary w-full"
                     >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Finalize Setup'}
                     </button>
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
