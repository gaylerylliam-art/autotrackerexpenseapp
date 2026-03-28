import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Car, 
  ShieldCheck, 
  Zap, 
  Plus, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Info,
  Database,
  Search,
  Cpu,
  Activity,
  Fuel,
  Hash,
  Palette,
  Calendar,
  Loader2
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { supabase } from '../utils/supabase'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const AddVehicleModal = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1) // 1: Identifier, 2: Parameters, 3: Fuel Type, 4: Finish
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    plate: '',
    year: '2024',
    fuel: 'Special 95',
    color: 'White',
    trim: 'M-Sport',
  })

  const handleNext = () => step < 4 && setStep(s => s + 1)
  const handleBack = () => step > 1 && setStep(s => s - 1)

  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Authentication required')

      const { error: insertError } = await supabase
        .from('vehicles')
        .insert([{
          user_id: user.id,
          name: `${formData.make} ${formData.model}`,
          make: formData.make,
          model: formData.model,
          plate: formData.plate,
          year: parseInt(formData.year),
          trim: formData.trim,
          color: formData.color,
          status: 'Operational',
          health: 'Excellent'
        }])

      if (insertError) throw insertError

      if (onSave) onSave()
      setStep(4)
      setTimeout(() => {
        onClose()
        setStep(1)
        setFormData({
          make: '',
          model: '',
          plate: '',
          year: '2024',
          fuel: 'Special 95',
          color: 'White',
          trim: 'M-Sport',
        })
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to add vehicle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 sm:p-12 text-slate-900">
          {/* Backdrop (Stripe Style) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl"
          />

          {/* Modal Architecture */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="w-full max-w-4xl bg-white rounded-[56px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden relative flex flex-col lg:flex-row"
          >
            
            {/* Visual Viewport (Left Panel) */}
            <div className="w-full lg:w-[40%] bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-12 border-r border-slate-100">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Database className="w-60 h-60" />
               </div>

               <AnimatePresence mode="wait">
                  {step <= 3 && (
                    <motion.div key="blueprint" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center flex flex-col items-center relative z-10">
                       <div className="w-32 h-32 rounded-[56px] bg-primary shadow-2xl flex items-center justify-center text-white relative">
                          <Car className="w-16 h-16" />
                          <div className="absolute inset-0 rounded-[56px] border border-white/20 animate-pulse pointer-events-none" />
                       </div>
                       <div className="space-y-4">
                          <h2 className="text-3xl font-display font-black tracking-tighter uppercase italic">Add <span className="text-primary">Vehicle</span></h2>
                          <p className="text-[10px] text-text-secondary font-mono font-bold uppercase tracking-widest leading-loose max-w-[240px]">Register a new vehicle to start tracking expenses and maintenance.</p>
                       </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 text-center flex flex-col items-center">
                       <div className="w-32 h-32 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-xl shadow-emerald-500/10">
                          <Check className="w-16 h-16 text-emerald-500 stroke-[3]" />
                       </div>
                       <div className="space-y-4">
                          <h2 className="text-3xl font-display font-black uppercase italic text-emerald-600">Vehicle Added</h2>
                          <p className="text-[10px] text-text-secondary font-mono font-bold uppercase tracking-widest">Your vehicle has been registered successfully.</p>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>

               {/* Step Indicator (Stripe Style) */}
               <div className="absolute bottom-12 flex gap-3">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={cn("w-3 h-3 rounded-full border border-slate-200 transition-all", s === step ? "bg-primary w-10 border-primary" : "bg-white")} />
                  ))}
               </div>
            </div>

            {/* Parameter Entry (Right Panel) */}
            <div className="flex-1 p-12 lg:p-16 flex flex-col bg-white">
               <div className="flex items-start justify-between mb-12">
                  <div className="space-y-1">
                     <h2 className="text-lg font-display font-black uppercase tracking-widest italic leading-none">Vehicle <span className="text-primary">Details</span></h2>
                     <p className="text-[9px] text-text-secondary font-mono font-bold uppercase tracking-widest italic">Registration Stage</p>
                  </div>
                  <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all text-text-secondary"><X className="w-6 h-6" /></button>
               </div>

               <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div key="st1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                         <div className="space-y-3">
                            <label className="text-[10px] text-text-secondary font-display font-black uppercase tracking-[0.2em] italic pl-2">Vehicle Make</label>
                            <div className="relative group">
                               <input 
                                 placeholder="e.g. BMW" 
                                 value={formData.make}
                                 onChange={e => setFormData(p => ({ ...p, make: e.target.value }))}
                                 className="w-full h-18 bg-slate-50 rounded-[28px] border border-slate-100 px-10 text-xl font-display font-black italic text-text-primary placeholder:text-slate-200 focus:outline-none focus:bg-white focus:border-primary transition-all" 
                               />
                               <Car className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-200 group-focus-within:text-primary transition-all" />
                            </div>
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] text-text-secondary font-display font-black uppercase tracking-[0.2em] italic pl-2">Vehicle Model</label>
                            <input 
                              placeholder="e.g. X5" 
                              value={formData.model}
                              onChange={e => setFormData(p => ({ ...p, model: e.target.value }))}
                              className="w-full h-18 bg-slate-50 rounded-[28px] border border-slate-100 px-10 text-xl font-display font-black italic text-text-primary focus:outline-none focus:bg-white focus:border-primary transition-all" 
                            />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] text-text-secondary font-display font-black uppercase tracking-[0.2em] italic pl-2">License Plate</label>
                            <input 
                              placeholder="e.g. DUBAI P12345" 
                              value={formData.plate}
                              onChange={e => setFormData(p => ({ ...p, plate: e.target.value.toUpperCase() }))}
                              className="w-full h-18 bg-slate-50 rounded-[28px] border border-slate-100 px-10 text-2xl font-mono font-black italic text-text-primary focus:outline-none focus:bg-white focus:border-cyan-400 transition-all uppercase tracking-widest" 
                            />
                         </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div key="st2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-2 gap-8">
                         {[
                           { id: 'year', label: 'Model Year', val: formData.year, icon: Calendar },
                           { id: 'trim', label: 'Trim / Variant', val: formData.trim, icon: Activity },
                           { id: 'color', label: 'Vehicle Color', val: formData.color, icon: Palette },
                           { id: 'odometer', label: 'Current Mileage', val: '0 KM', icon: Hash },
                         ].map(p => (
                           <div key={p.id} className="space-y-3">
                              <label className="text-[10px] text-text-secondary font-display font-black uppercase tracking-[0.2em] italic pl-2">{p.label}</label>
                              <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center px-6 gap-4 border-l-4 border-l-slate-200 group hover:border-l-primary hover:bg-white transition-all">
                                 <input 
                                   value={formData[p.id]}
                                   onChange={e => setFormData(old => ({ ...old, [p.id]: e.target.value }))}
                                   className="bg-transparent border-none text-xs font-display font-bold italic uppercase tracking-widest text-text-primary focus:outline-none w-full"
                                 />
                              </div>
                           </div>
                         ))}
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div key="st3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                         <label className="text-[10px] text-text-secondary font-display font-black uppercase tracking-[0.2em] italic pl-2">Fuel / Power Type</label>
                         <div className="grid grid-cols-2 gap-4">
                            {['Special 95', 'Super 98', 'Diesel', 'Electric'].map(f => (
                               <button 
                                 key={f}
                                 onClick={() => setFormData(p => ({ ...p, fuel: f }))}
                                 className={cn(
                                   "h-18 saas-card flex items-center justify-center font-display font-black uppercase italic text-[10px] tracking-widest transition-all",
                                   formData.fuel === f ? "bg-primary text-white shadow-xl shadow-blue-500/20 border-primary" : "hover:bg-slate-50 text-text-secondary"
                                 )}
                               >
                                 {f}
                               </button>
                            ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               {/* Matrix Navigation */}
               <div className="mt-12 flex flex-col gap-6">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-mono font-black uppercase tracking-widest italic flex items-center gap-3">
                       <AlertCircle className="w-5 h-5" />
                       {error}
                    </div>
                  )}
                  <div className="flex gap-4">
                    {step > 1 && step < 4 && (
                      <button onClick={handleBack} className="btn-secondary h-18 w-18 flex items-center justify-center border-slate-200"><ChevronLeft className="w-6 h-6 text-slate-400" /></button>
                    )}
                    {step < 4 && (
                      <button 
                        onClick={step === 3 ? handleSave : handleNext}
                        disabled={loading || (step === 1 && (!formData.make || !formData.plate))}
                        className="btn-primary flex-1 h-18 rounded-[28px] flex items-center justify-center gap-4 text-xs font-display font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 italic"
                      >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : (
                          <>
                            <span className="ml-[0.3em] text-white">{step === 3 ? 'Add Vehicle' : 'Next Step'}</span>
                            <ChevronRight className="w-5 h-5 text-white" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
               </div>
            </div>

            {/* Abstract Decorative Elements (Notion Style) */}
            <div className="absolute right-0 bottom-0 p-8 opacity-10 pointer-events-none grayscale brightness-125">
               <Cpu className="w-60 h-60 text-slate-200" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddVehicleModal
