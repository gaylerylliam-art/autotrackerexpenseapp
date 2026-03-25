import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Car, Fuel, Bell, MapPin, Check, ChevronRight, ChevronLeft, Sparkles, Shield, Activity, Wallet, Plus, Loader2, DollarSign } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const steps = [
  { id: 'vehicle', title: 'Add Vehicle', icon: Car, label: 'Garage Setup' },
  { id: 'financial', title: 'Asset Value', icon: DollarSign, label: 'Depreciation' },
  { id: 'toll', title: 'Toll Systems', icon: Activity, label: 'Salik / Darb' },
  { id: 'fuel', title: 'Fuel & Mileage', icon: Fuel, label: 'Efficiency' },
  { id: 'tracking', title: 'Auto-Track', icon: MapPin, label: 'Smart Alerts' },
]

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  // Onboarding Data States
  const [vehicleData, setVehicleData] = useState({ make: '', plate: '', year: '', color: '#6c63ff' })
  const [financialData, setFinancialData] = useState({ cost: '', date: '', life: '5', resValue: '' })
  const [connectedTolls, setConnectedTolls] = useState([])
  const [connectingToll, setConnectingToll] = useState(null)
  const [fuelData, setFuelData] = useState({ type: '', mileage: '' })
  const [trackingFeatures, setTrackingFeatures] = useState({ autoTrack: false, reminders: false })

  const progress = ((currentStep) / (steps.length)) * 100

  const handleConnectToll = (sysName) => {
    if (connectedTolls.includes(sysName)) {
      setConnectedTolls(prev => prev.filter(t => t !== sysName))
      return
    }
    
    setConnectingToll(sysName)
    setTimeout(() => {
      setConnectedTolls(prev => [...prev, sysName])
      setConnectingToll(null)
    }, 1200)
  }

  const handleNext = () => {
    if (currentStep < 5) {
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
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-accent to-accent2 shadow-[0_0_12px_rgba(108,99,255,0.4)]"
              />
           </div>
        </div>

        {/* Form Container */}
        <div className="min-h-[460px] flex flex-col">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
              className="flex-1"
            >
               {currentStep === 0 && (
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <h1 className="text-4xl font-display font-black tracking-tightest leading-none">Let's build your <span className="gradient-text">Garage.</span></h1>
                       <p className="text-muted text-sm leading-relaxed max-w-[300px]">Add your primary vehicle to start tracking expenses and health.</p>
                    </div>
                    
                    <div className="space-y-5">
                       <div className="space-y-2">
                          <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-black flex justify-between">
                            <span>Make & Model</span>
                            {vehicleData.make && <Check className="w-3 h-3 text-accent2" />}
                          </label>
                          <input 
                            type="text" 
                            placeholder="e.g. BMW X5" 
                            value={vehicleData.make}
                            onChange={(e) => setVehicleData(p => ({ ...p, make: e.target.value }))}
                            className="w-full bg-surface/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent/40 transition-all placeholder:text-muted/20" 
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-black flex justify-between">
                            <span>Plate Number (Dubai, Abu Dhabi, etc.)</span>
                            {vehicleData.plate && <Check className="w-3 h-3 text-accent2" />}
                          </label>
                          <input 
                            type="text" 
                            placeholder="P 12345" 
                            value={vehicleData.plate}
                            onChange={(e) => setVehicleData(p => ({ ...p, plate: e.target.value }))}
                            className="w-full bg-surface/50 border border-white/5 rounded-2xl px-6 py-4 font-display font-black tracking-widest text-base focus:outline-none focus:border-accent/40 transition-all placeholder:text-muted/10 text-center uppercase" 
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-black">Year</label>
                             <input 
                               type="number" 
                               placeholder="2024" 
                               value={vehicleData.year}
                               onChange={(e) => setVehicleData(p => ({ ...p, year: e.target.value }))}
                               className="w-full bg-surface/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent/40 transition-all" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-black">Color</label>
                             <div className="flex gap-2 py-1 items-center justify-center">
                               {['#6c63ff', '#3ecf8e', '#f7c948', '#ff6b6b'].map(c => (
                                 <button 
                                  key={c} 
                                  onClick={() => setVehicleData(p => ({ ...p, color: c }))}
                                  className={cn("w-8 h-8 rounded-full border border-white/10 transition-transform", vehicleData.color === c && 'scale-125 ring-2 ring-white/20')} 
                                  style={{ backgroundColor: c }} 
                                 />
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
                       <h1 className="text-4xl font-display font-black tracking-tightest leading-none">Asset <span className="text-accent3">Value.</span></h1>
                       <p className="text-muted text-sm leading-relaxed max-w-[300px]">Calculate real costs and automated depreciation by entering purchase details.</p>
                    </div>

                    <div className="space-y-5">
                       <div className="space-y-2">
                          <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-black flex justify-between">
                            <span>Purchase Cost (AED)</span>
                            {financialData.cost && <Check className="w-3 h-3 text-accent2" />}
                          </label>
                          <input 
                            type="number" 
                            placeholder="e.g. 250000" 
                            value={financialData.cost}
                            onChange={(e) => setFinancialData(p => ({ ...p, cost: e.target.value }))}
                            className="w-full bg-surface/50 border border-white/5 rounded-2xl px-6 py-4 font-display font-black tracking-tightest text-xl focus:outline-none focus:border-accent/40 transition-all placeholder:text-muted/20" 
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-black">Purchase Date</label>
                             <input 
                               type="date" 
                               value={financialData.date}
                               onChange={(e) => setFinancialData(p => ({ ...p, date: e.target.value }))}
                               className="w-full bg-surface/50 border border-white/5 rounded-2xl px-4 py-4 text-xs font-mono font-black uppercase tracking-widest text-muted focus:outline-none focus:border-accent/40 transition-all [color-scheme:dark]" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-black flex justify-between">
                                Useful Life <span className="text-accent2 italic">{financialData.life} yrs</span>
                             </label>
                             <div className="h-full bg-surface/50 border border-white/5 rounded-2xl flex items-center px-4 relative">
                                <input 
                                  type="range" 
                                  min="1" max="15" 
                                  value={financialData.life}
                                  onChange={(e) => setFinancialData(p => ({ ...p, life: e.target.value }))}
                                  className="w-full accent-accent transition-all cursor-pointer" 
                                />
                             </div>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] text-muted font-mono uppercase tracking-widest pl-1 font-black flex justify-between">
                            <span>Est. Resale Value (Optional)</span>
                          </label>
                          <input 
                            type="number" 
                            placeholder="Defaults to 15% if blank" 
                            value={financialData.resValue}
                            onChange={(e) => setFinancialData(p => ({ ...p, resValue: e.target.value }))}
                            className="w-full bg-surface/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent/40 transition-all placeholder:text-muted/20" 
                          />
                       </div>
                    </div>
                 </div>
               )}

               {currentStep === 2 && (
                 <div className="space-y-8">
                    <div className="space-y-2">
                       <h1 className="text-4xl font-display font-black tracking-tightest leading-none text-text">Connect <span className="text-blue-400 underline decoration-blue-400/20 underline-offset-8">Tolls.</span></h1>
                       <p className="text-muted text-sm leading-relaxed max-w-[280px]">Automate your gate crossings and account balances. Secure real-time sync.</p>
                    </div>

                    <div className="space-y-4">
                       {[
                         { name: 'Salik (Dubai)', desc: 'Gate crossings & balance', icon: '🛣️' },
                         { name: 'Darb (Abu Dhabi)', desc: 'Integrated toll system', icon: '🏙️' },
                         { name: 'Aber (Umm Al Quwain)', desc: 'Regional toll solution', icon: '🚗' },
                       ].map((sys, i) => {
                         const isConnected = connectedTolls.includes(sys.name)
                         const isConnecting = connectingToll === sys.name
                         
                         return (
                         <div 
                           key={i} 
                           onClick={() => handleConnectToll(sys.name)}
                           className={cn(
                             "glass p-5 rounded-[24px] border flex items-center justify-between group cursor-pointer transition-all active:scale-[0.98]",
                             isConnected ? "bg-accent2/10 border-accent2/40" : "border-white/5 hover:border-blue-400/40"
                           )}
                         >
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-[18px] bg-white/[0.02] border border-white/5 flex items-center justify-center text-xl shadow-inner">
                                  {sys.icon}
                               </div>
                               <div className="space-y-0.5">
                                  <h4 className={cn("font-display font-black text-sm tracking-tightest transition-colors", isConnected ? "text-accent2" : "text-text group-hover:text-blue-400")}>{sys.name}</h4>
                                  <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-black opacity-60 leading-none">{isConnected ? 'Connected Synced' : sys.desc}</p>
                               </div>
                            </div>
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                              isConnected ? "bg-accent2 text-bg" : "border border-white/10 text-muted group-hover:border-blue-400/20 group-hover:text-blue-400"
                            )}>
                               {isConnecting ? (
                                 <Loader2 className="w-4 h-4 animate-spin" />
                               ) : isConnected ? (
                                 <Check className="w-4 h-4" />
                               ) : (
                                 <Plus className="w-4 h-4" />
                               )}
                            </div>
                         </div>
                       )})}
                    </div>
                 </div>
               )}

               {currentStep === 3 && (
                 <div className="space-y-8">
                    <div className="space-y-1">
                       <h1 className="text-4xl font-display font-black tracking-tightest leading-none">Fuel & <span className="text-accent2">Usage.</span></h1>
                       <p className="text-muted text-sm leading-relaxed">Let's calibrate your efficiency metrics.</p>
                    </div>

                    <div className="space-y-10">
                       <div className="space-y-4">
                          <label className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] px-1 font-black flex justify-between">
                             <span>Fuel Type</span>
                             {fuelData.type && <Check className="w-3 h-3 text-accent2" />}
                          </label>
                          <div className="flex gap-2">
                             {['E-Plus 91', 'Special 95', 'Super 98', 'Diesel'].map(type => (
                               <button 
                                key={type} 
                                onClick={() => setFuelData(p => ({ ...p, type }))}
                                className={cn(
                                  "flex-1 py-3 px-1 rounded-xl border border-white/5 font-display font-black text-[9px] uppercase tracking-widest transition-all",
                                  fuelData.type === type ? "bg-accent2/20 border-accent2 text-accent2 shadow-[0_0_12px_rgba(62,207,142,0.2)]" : "glass text-muted hover:text-text hover:border-accent2/30"
                                )}
                               >
                                  {type}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-4">
                          <label className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] px-1 font-black flex justify-between">
                            <span>Current Odometer</span>
                            {fuelData.mileage && <Check className="w-3 h-3 text-accent2" />}
                          </label>
                          <div className="relative">
                             <input 
                              type="number" 
                              placeholder="0" 
                              value={fuelData.mileage}
                              onChange={(e) => setFuelData(p => ({ ...p, mileage: e.target.value }))}
                              className="w-full bg-surface/50 border border-white/5 rounded-2xl px-6 py-6 text-2xl font-display font-black tracking-tightest focus:outline-none focus:border-accent2 transition-all placeholder:text-muted/10" 
                             />
                             <span className="absolute right-6 top-1/2 -translate-y-1/2 text-muted font-mono text-sm font-black uppercase tracking-widest">km</span>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {currentStep === 4 && (
                 <div className="space-y-8">
                    <div className="space-y-1">
                       <h1 className="text-4xl font-display font-black tracking-tightest leading-none">Set it <span className="text-accent">Auto.</span></h1>
                       <p className="text-muted text-sm leading-relaxed">Turn on the smart features to track without opening the app.</p>
                    </div>

                    <div className="space-y-6">
                       <div 
                         onClick={() => setTrackingFeatures(p => ({ ...p, autoTrack: !p.autoTrack }))}
                         className={cn(
                           "glass p-6 rounded-[32px] border cursor-pointer transition-all",
                           trackingFeatures.autoTrack ? "bg-gradient-to-br from-accent/20 to-transparent border-accent/40" : "border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent hover:border-accent/20"
                         )}
                       >
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                               <h4 className="font-display font-black text-lg tracking-tightest">Auto-Tracking</h4>
                               <p className="text-[10px] text-muted font-mono font-black uppercase tracking-widest italic leading-none opacity-60">Uses GPS to log trips & tolls</p>
                            </div>
                            <div className={cn("w-12 h-6 rounded-full relative transition-colors shadow-inner", trackingFeatures.autoTrack ? "bg-accent shadow-[0_0_12px_rgba(108,99,255,0.4)]" : "bg-white/10")}>
                               <motion.div 
                                 animate={{ x: trackingFeatures.autoTrack ? 24 : 4 }}
                                 className={cn("w-4 h-4 rounded-full absolute top-1", trackingFeatures.autoTrack ? "bg-white" : "bg-muted")} 
                               />
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {trackingFeatures.autoTrack && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-3 bg-black/20 rounded-xl border border-white/5 flex gap-3 text-xs items-center">
                                   <MapPin className="w-4 h-4 text-accent animate-pulse" />
                                   <span className="text-muted">Location permissions will be requested via iOS settings.</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>

                       <div 
                         onClick={() => setTrackingFeatures(p => ({ ...p, reminders: !p.reminders }))}
                         className={cn(
                           "glass p-6 rounded-[32px] border cursor-pointer transition-all",
                           trackingFeatures.reminders ? "bg-gradient-to-br from-accent2/10 to-transparent border-accent2/40" : "border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent hover:border-accent2/20"
                         )}
                       >
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                               <h4 className="font-display font-black text-lg tracking-tightest">Reminders</h4>
                               <p className="text-[10px] text-muted font-mono font-black uppercase tracking-widest italic leading-none opacity-60">Insurance, Service & Registration</p>
                            </div>
                            <div className={cn("w-12 h-6 rounded-full relative transition-colors shadow-inner", trackingFeatures.reminders ? "bg-accent2 shadow-[0_0_12px_rgba(62,207,142,0.4)]" : "bg-white/10")}>
                               <motion.div 
                                 animate={{ x: trackingFeatures.reminders ? 24 : 4 }}
                                 className={cn("w-4 h-4 rounded-full absolute top-1", trackingFeatures.reminders ? "bg-bg" : "bg-muted")} 
                               />
                            </div>
                          </div>
                          <AnimatePresence>
                            {trackingFeatures.reminders && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-3 bg-black/20 rounded-xl border border-white/5 flex gap-3 text-xs items-center">
                                   <Bell className="w-4 h-4 text-accent2" />
                                   <span className="text-muted">Push notifications enabled successfully.</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </div>
                    </div>
                 </div>
               )}

               {currentStep === 5 && (
                 <div className="space-y-12 text-center flex flex-col items-center justify-center py-10">
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
                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.3 }}
                         className="flex items-center gap-4 bg-surface2/50 border border-white/5 p-4 rounded-2xl text-left"
                       >
                          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent">
                             <Shield className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                             <h5 className="font-display font-black text-xs tracking-widest uppercase">Verified Setup</h5>
                             <p className="text-[9px] text-muted font-mono uppercase tracking-widest">{connectedTolls.length || 0} integrations active</p>
                          </div>
                          <Check className="w-4 h-4 text-accent" />
                       </motion.div>

                       <motion.div 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.5 }}
                         className="flex items-center gap-4 bg-surface2/50 border border-white/5 p-4 rounded-2xl text-left"
                       >
                          <div className="w-10 h-10 rounded-xl bg-accent2/20 flex items-center justify-center text-accent2">
                             <Activity className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                             <h5 className="font-display font-black text-xs tracking-widest uppercase">Telemetry</h5>
                             <p className="text-[9px] text-muted font-mono uppercase tracking-widest">{trackingFeatures.autoTrack ? 'Active tracking' : 'Manual mode'}</p>
                          </div>
                          <Check className="w-4 h-4 text-accent2" />
                       </motion.div>
                    </div>
                 </div>
               )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4">
           {currentStep < 5 ? (
             <div className="flex items-center gap-4 relative z-10">
               {currentStep > 0 && (
                 <button 
                  onClick={handleBack}
                  className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center text-muted hover:text-text active:scale-90 transition-all cursor-pointer"
                 >
                   <ChevronLeft className="w-6 h-6" />
                 </button>
               )}
               <button 
                onClick={handleNext}
                className="flex-1 h-16 rounded-[24px] bg-accent text-white font-display font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-accent/20 flex items-center justify-center gap-2 group active:scale-[0.98] transition-all cursor-pointer hover:bg-accent/90"
               >
                 {currentStep === 4 ? 'Finish Setup' : 'Continue'}
                 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
             </div>
           ) : (
             <button 
              onClick={handleSkip}
              className="w-full h-20 rounded-[32px] bg-white text-black font-display font-black text-sm uppercase tracking-[0.3em] shadow-2xl active:scale-[0.98] transition-all cursor-pointer hover:bg-white/90 relative z-10"
             >
               Go to Dashboard
             </button>
           )}
           
           {currentStep < 5 && (
             <button 
              onClick={handleSkip}
              className="w-full text-center text-[10px] text-muted font-mono uppercase tracking-[0.2em] py-2 hover:text-white transition-colors cursor-pointer relative z-10"
             >
               Skip to dashboard
             </button>
           )}
        </div>

      </div>
    </div>
  )
}

export default Onboarding

