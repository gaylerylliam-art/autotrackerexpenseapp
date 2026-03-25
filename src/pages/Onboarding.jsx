import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Car, Fuel, Bell, MapPin, Check, ChevronRight, ChevronLeft, Sparkles, Shield, Activity, Wallet, Plus } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const steps = [
  { id: 'vehicle', title: 'Add Vehicle', icon: Car, label: 'Garage Setup' },
  { id: 'toll', title: 'Toll Systems', icon: Activity, label: 'Salik / Darb' },
  { id: 'fuel', title: 'Fuel & Mileage', icon: Fuel, label: 'Efficiency' },
  { id: 'tracking', title: 'Auto-Track', icon: MapPin, label: 'Smart Alerts' },
]

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const progress = ((currentStep + 1) / (steps.length + 1)) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    } else {
      localStorage.setItem('autotrack_setup_complete', 'true')
      navigate('/')
    }
  }

  const handleSkip = () => {
    localStorage.setItem('autotrack_setup_complete', 'true')
    navigate('/')
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/30 flex flex-col items-center justify-center p-6 pb-24 relative overflow-hidden">
      {/* Abstract Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent2/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content Area */}
      <div className="w-full max-w-md relative z-10 flex flex-col gap-10">
        
        {/* Progress Header */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <span className="text-[10px] text-accent font-mono font-black uppercase tracking-[0.2em]">Setup Progress</span>
              <span className="text-[10px] text-muted font-mono font-black uppercase tracking-[0.2em]">{Math.round(progress)}% Complete</span>
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-accent to-accent2 shadow-[0_0_12px_rgba(108,99,255,0.4)]"
              />
           </div>
        </div>

        {/* Form Container */}
        <div className="min-h-[460px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 space-y-8"
            >
               {currentStep === 0 && (
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <h1 className="text-4xl font-display font-black tracking-tightest leading-none">Let's build your <span className="gradient-text">Garage.</span></h1>
                       <p className="text-muted text-sm leading-relaxed max-w-[300px]">Add your primary vehicle to start tracking expenses and health.</p>
                    </div>
                    
                    <div className="space-y-5">
                       <div className="space-y-2">
                          <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-black">Make & Model</label>
                          <input type="text" placeholder="e.g. BMW X5" className="w-full bg-surface/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent/40 transition-all placeholder:text-muted/20" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-black">Plate Number (Dubai, Abu Dhabi, etc.)</label>
                          <input type="text" placeholder="P 12345" className="w-full bg-surface/50 border border-white/5 rounded-2xl px-6 py-4 font-display font-black tracking-widest text-base focus:outline-none focus:border-accent/40 transition-all placeholder:text-muted/10 text-center uppercase" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-black">Year</label>
                             <input type="number" placeholder="2024" className="w-full bg-surface/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent/40 transition-all" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-black">Color</label>
                             <div className="flex gap-2 py-1 items-center justify-center">
                               {['#6c63ff', '#3ecf8e', '#f7c948', '#ff6b6b'].map(c => (
                                 <button key={c} className="w-8 h-8 rounded-full border border-white/10" style={{ backgroundColor: c }} />
                               ))}
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {currentStep === 1 && (
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <h1 className="text-4xl font-display font-black tracking-tightest leading-none text-text">Connect <span className="text-blue-400 underline decoration-blue-400/20 underline-offset-8">Tolls.</span></h1>
                       <p className="text-muted text-sm leading-relaxed max-w-[280px]">Automate your gate crossings and account balances.</p>
                    </div>

                    <div className="space-y-4">
                       {[
                         { name: 'Salik (Dubai)', desc: 'Gate crossings & balance alerts', icon: '🛣️' },
                         { name: 'Darb (Abu Dhabi)', desc: 'Integrated toll system', icon: '🏙️' },
                         { name: 'Aber (Umm Al Quwain)', desc: 'Regional toll solution', icon: '🚗' },
                       ].map((sys, i) => (
                         <div key={i} className="glass p-5 rounded-[24px] border border-white/5 flex items-center justify-between group cursor-pointer hover:border-blue-400/40 transition-all active:scale-[0.98]">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-[18px] bg-white/[0.02] border border-white/5 flex items-center justify-center text-xl shadow-inner">
                                  {sys.icon}
                               </div>
                               <div className="space-y-0.5">
                                  <h4 className="font-display font-black text-sm tracking-tightest text-text group-hover:text-blue-400 transition-colors">{sys.name}</h4>
                                  <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-black opacity-60 leading-none">{sys.desc}</p>
                               </div>
                            </div>
                            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center text-muted group-hover:border-blue-400/20 group-hover:text-blue-400">
                               <Plus className="w-4 h-4" />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               {currentStep === 2 && (
                 <div className="space-y-8">
                    <div className="space-y-1">
                       <h1 className="text-4xl font-display font-black tracking-tightest leading-none">Fuel & <span className="text-accent2">Usage.</span></h1>
                       <p className="text-muted text-sm leading-relaxed">Let's calibrate your efficiency metrics.</p>
                    </div>

                    <div className="space-y-10">
                       <div className="space-y-4">
                          <label className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] px-1 font-black">Fuel Type</label>
                          <div className="flex gap-2">
                             {['E-Plus 91', 'Special 95', 'Super 98', 'Diesel'].map(type => (
                               <button key={type} className="flex-1 py-3 px-1 rounded-xl glass border border-white/5 font-display font-black text-[9px] uppercase tracking-widest text-muted hover:text-text hover:border-accent2/30 hover:bg-accent2/5 transition-all">
                                  {type}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] px-1 font-black">Current Odometer</label>
                          <div className="relative">
                             <input type="number" placeholder="0" className="w-full bg-surface/50 border border-white/5 rounded-2xl px-6 py-6 text-2xl font-display font-black tracking-tightest focus:outline-none focus:border-accent2 transition-all placeholder:text-muted/10" />
                             <span className="absolute right-6 top-1/2 -translate-y-1/2 text-muted font-mono text-sm font-black uppercase tracking-widest">km</span>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {currentStep === 3 && (
                 <div className="space-y-8">
                    <div className="space-y-1">
                       <h1 className="text-4xl font-display font-black tracking-tightest leading-none">Set it <span className="text-accent">Auto.</span></h1>
                       <p className="text-muted text-sm leading-relaxed">Turn on the smart features to track without opening the app.</p>
                    </div>

                    <div className="space-y-6">
                       <div className="glass p-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-accent/10 to-transparent flex items-center justify-between">
                          <div className="space-y-1">
                             <h4 className="font-display font-black text-lg tracking-tightest">Auto-Tracking</h4>
                             <p className="text-[10px] text-muted font-mono font-black uppercase tracking-widest italic leading-none opacity-60">Uses GPS to log trips & tolls</p>
                          </div>
                          <div className="w-12 h-6 rounded-full bg-accent relative cursor-pointer shadow-[0_0_12px_rgba(108,99,255,0.4)]">
                             <div className="w-4 h-4 rounded-full bg-white absolute right-1 top-1" />
                          </div>
                       </div>

                       <div className="glass p-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent flex items-center justify-between">
                          <div className="space-y-1">
                             <h4 className="font-display font-black text-lg tracking-tightest">Reminders</h4>
                             <p className="text-[10px] text-muted font-mono font-black uppercase tracking-widest italic leading-none opacity-60">Insurance, Service & Registration</p>
                          </div>
                          <div className="w-12 h-6 rounded-full bg-white/10 relative cursor-pointer">
                             <div className="w-4 h-4 rounded-full bg-muted absolute left-1 top-1" />
                          </div>
                       </div>
                    </div>
                    
                    <div className="p-6 rounded-[28px] border border-dashed border-white/10 text-center animate-pulse">
                        <Sparkles className="w-6 h-6 text-accent/40 mx-auto mb-2" />
                        <p className="text-[9px] text-muted font-mono uppercase tracking-[0.2em] font-black">AI prediction will calibrate while you drive</p>
                    </div>
                 </div>
               )}

               {currentStep === 4 && (
                 <div className="space-y-12 text-center flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-accent2/20 border border-accent2/40 flex items-center justify-center text-accent2 shadow-[0_0_40px_rgba(62,207,142,0.2)]">
                       <motion.div
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                       >
                          <Check className="w-12 h-12 stroke-[4px]" />
                       </motion.div>
                    </div>
                    
                    <div className="space-y-4">
                       <h1 className="text-5xl font-display font-black tracking-tightest leading-tight">All <span className="gradient-text">Set.</span></h1>
                       <p className="text-muted text-sm leading-relaxed max-w-[260px] mx-auto">Your Autotrack experience is now optimized for the UAE.</p>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 w-full">
                       <div className="flex items-center gap-4 bg-surface2/50 border border-white/5 p-4 rounded-2xl text-left">
                          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                             <Shield className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                             <h5 className="font-display font-black text-xs tracking-widest uppercase">Verified Setup</h5>
                             <p className="text-[9px] text-muted font-mono uppercase tracking-widest">Active & Secure</p>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-10">
           {currentStep < 4 ? (
             <div className="flex items-center gap-4">
               {currentStep > 0 && (
                 <button 
                  onClick={handleBack}
                  className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center text-muted hover:text-text active:scale-90 transition-all"
                 >
                   <ChevronLeft className="w-6 h-6" />
                 </button>
               )}
               <button 
                onClick={handleNext}
                className="flex-1 h-16 rounded-[24px] bg-accent text-white font-display font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-accent/20 flex items-center justify-center gap-2 group active:scale-[0.98] transition-all"
               >
                 {currentStep === 3 ? 'Finish Setup' : 'Continue'}
                 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
             </div>
           ) : (
             <button 
              onClick={handleSkip}
              className="w-full h-20 rounded-[32px] bg-white text-black font-display font-black text-sm uppercase tracking-[0.3em] shadow-2xl active:scale-[0.98] transition-all"
             >
               Go to Dashboard
             </button>
           )}
           
           {currentStep < 4 && (
             <button 
              onClick={handleSkip}
              className="w-full text-center text-[10px] text-muted font-mono uppercase tracking-[0.2em] py-2 hover:text-white transition-colors"
             >
               Skip for now
             </button>
           )}
        </div>

      </div>
    </div>
  )
}

export default Onboarding
