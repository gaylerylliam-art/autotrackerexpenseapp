import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Camera, Upload, Activity, Check, AlertCircle, Loader2, Sparkles, 
  ShieldCheck, Cpu, Zap, Info, Database, Search, ChevronRight, 
  TrendingDown, Shield, Server, Terminal, Radio, Eye
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const Scanner = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('idle') // idle, scanning, reviewing, success
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (step === 'scanning') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval)
            setStep('reviewing')
            return 100
          }
          return p + 4
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [step])

  const handleStartScan = () => {
    setStep('scanning')
    setProgress(0)
  }

  const handleCommit = () => {
    setStep('success')
    setTimeout(() => {
      onClose()
      setStep('idle')
    }, 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 sm:p-12">
          {/* Backdrop (Fina Style) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-3xl"
          />

          {/* Scanner Sheet */}
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="w-full max-w-5xl bg-[#1e293b]/50 rounded-[40px] shadow-glow border border-white/10 flex flex-col lg:flex-row overflow-hidden relative glass-effect"
          >
            {/* Background Glow */}
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full pointer-events-none opacity-50" />
            
            {/* Visual Viewport (Left Panel - Fina Style) */}
            <div className="w-full lg:w-[45%] bg-white/5 relative overflow-hidden flex flex-col items-center justify-center p-16 border-r border-white/10">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                  <Cpu className="w-72 h-72 text-primary" />
               </div>

               <AnimatePresence mode="wait">
                  {step === 'idle' && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 text-center flex flex-col items-center relative z-10 w-full">
                       <div className="w-28 h-28 rounded-[36px] bg-primary flex items-center justify-center text-white shadow-glow group cursor-pointer hover:scale-110 transition-transform">
                          <Eye className="w-12 h-12 stroke-[2.5] group-hover:animate-pulse" />
                       </div>
                       <div className="space-y-4">
                          <h2 className="text-3xl font-display font-black tracking-tighter uppercase italic text-white leading-none">Receipt <span className="text-primary glow-text">Scanner</span></h2>
                          <p className="text-[11px] text-text-muted font-mono font-bold uppercase tracking-[0.3em] leading-loose max-w-[280px] opacity-60 italic">Scan fuel or maintenance receipts to automatically log expenses.</p>
                       </div>
                       <button 
                         onClick={handleStartScan}
                         className="btn-primary w-full h-18 text-xs shadow-glow"
                       >
                          <Sparkles className="w-5 h-5 mr-3" /> 
                          <span className="uppercase font-black tracking-widest italic leading-none text-white whitespace-nowrap">Start Scanning</span>
                       </button>
                    </motion.div>
                  )}

                  {step === 'scanning' && (
                    <motion.div key="scanning" className="w-full h-full flex flex-col items-center justify-center space-y-12 relative z-10">
                       <div className="relative w-full aspect-square max-w-[320px] bg-white/5 rounded-[48px] border border-white/10 shadow-premium overflow-hidden">
                          <motion.div 
                            initial={{ top: '0%' }}
                            animate={{ top: '100%' }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-10 shadow-glow"
                          />
                          <div className="absolute inset-0 bg-primary/10 backdrop-blur-[4px]" />
                          <div className="flex flex-col h-full items-center justify-center text-primary/40">
                             <Server className="w-24 h-24 stroke-[2]" />
                             <span className="text-[11px] font-mono font-black uppercase tracking-[0.4em] mt-6 text-primary glow-text italic">Analyzing Receipt...</span>
                          </div>
                       </div>
                       <div className="w-full max-w-[320px] space-y-4">
                          <div className="flex justify-between text-[11px] font-mono font-black uppercase tracking-widest text-white italic">
                             <span className="opacity-40">Scanning Progress</span>
                             <span className="text-primary glow-text">{progress}%</span>
                          </div>
                          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/10 relative">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-primary rounded-full shadow-glow relative z-10" />
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {step === 'reviewing' && (
                    <motion.div key="review" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 flex flex-col items-center relative z-10">
                       <div className="w-28 h-28 rounded-[36px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-glow">
                          <ShieldCheck className="w-14 h-14 stroke-[2.5]" />
                       </div>
                       <div className="text-center space-y-3">
                          <h2 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter leading-none">Scan <span className="text-emerald-400 glow-text">Complete</span></h2>
                          <div className="flex items-center gap-4 justify-center">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow" />
                             <p className="text-[11px] text-emerald-400 font-mono font-black uppercase tracking-[0.3em] italic">Scan Accuracy: 98%</p>
                          </div>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Analysis & Review (Right Panel - Fina Style) */}
            <div className="flex-1 p-16 flex flex-col relative z-10">
               <div className="flex items-start justify-between mb-16">
                  <div className="space-y-3">
                     <h2 className="text-2xl font-display font-black uppercase tracking-tighter italic text-white leading-none">Review <span className="text-primary glow-text">Details</span></h2>
                     <div className="flex items-center gap-4">
                        <p className="text-[10px] text-text-muted font-mono font-bold uppercase tracking-widest opacity-40 italic leading-none">Verified receipt data</p>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="badge badge-fuel h-5 px-3">VERIFIED</div>
                     </div>
                  </div>
                  <button 
                    onClick={onClose} 
                    className="w-12 h-12 rounded-[14px] bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-white transition-all shadow-premium"
                  >
                    <X className="w-6 h-6 stroke-[2.5]" />
                  </button>
               </div>

               <div className="flex-1 space-y-12">
                  <div className={cn("space-y-8 transition-all duration-700", step !== 'reviewing' && "opacity-20 pointer-events-none blur-xl")}>
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="text-[11px] text-text-muted font-display font-black uppercase tracking-[0.3em] italic pl-2 text-white">Amount</label>
                           <div className="h-20 bg-white/5 rounded-[24px] border border-white/10 flex items-center px-8 gap-6 border-l-4 border-l-primary group hover:bg-white/10 transition-all">
                              <span className="text-xs font-mono font-black text-primary italic">AED</span>
                              <input defaultValue="240.00" className="bg-transparent border-none text-2xl font-mono font-black italic text-white focus:outline-none w-full placeholder:text-white/5 shadow-glow" />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <label className="text-[11px] text-text-muted font-display font-black uppercase tracking-[0.3em] italic pl-2 text-white">Category</label>
                           <div className="h-20 bg-white/5 rounded-[24px] border border-white/10 flex items-center px-8 group hover:bg-white/10 transition-all border-l-4 border-l-blue-400">
                              <Fuel className="w-5 h-5 text-blue-400 mr-4" />
                              <span className="text-xs font-display font-black italic uppercase tracking-widest text-white">Fuel</span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="text-[11px] text-text-muted font-display font-black uppercase tracking-[0.3em] italic pl-2 text-white">Select Vehicle</label>
                        <div className="h-20 bg-white/5 rounded-[24px] border border-white/10 flex items-center px-8 gap-6 border-l-4 border-l-emerald-400 group hover:bg-white/10 transition-all">
                           <Car className="w-6 h-6 text-emerald-400 stroke-[2.5] group-hover:rotate-12 transition-transform" />
                           <span className="text-xs font-display font-black italic uppercase tracking-widest text-white">BMW X5 2024 M Sport</span>
                        </div>
                     </div>

                     <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/10 space-y-6 relative overflow-hidden group/box">
                        <div className="absolute right-0 top-0 p-8 opacity-[0.05] group-hover/box:scale-110 transition-transform">
                           <Terminal className="w-24 h-24 text-primary" />
                        </div>
                        <div className="flex items-center gap-5 relative z-10">
                           <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-glow">
                              <Zap className="w-5 h-5 stroke-[3]" />
                           </div>
                           <span className="text-[11px] font-display font-black text-primary uppercase tracking-[0.3em] italic leading-none">Savings Insight</span>
                        </div>
                        <p className="text-xs text-text-muted font-semibold leading-relaxed italic relative z-10 text-white opacity-60">
                           You could save <span className="text-primary font-black">4% per month</span> by fueling at this station consistently according to historical price trends.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="pt-12 flex gap-6">
                  <button onClick={onClose} className="btn-glass flex-1 h-18 text-[11px] uppercase font-black tracking-widest italic text-white hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400">Cancel</button>
                  <button 
                    disabled={step !== 'reviewing'}
                    onClick={handleCommit}
                    className="btn-primary flex-[2] h-18 text-xs font-black uppercase tracking-[0.3em] italic disabled:opacity-30 disabled:grayscale shadow-glow group"
                  >
                     Save Expense 
                     <div className="w-6 h-6 rounded-lg bg-white/20 ml-4 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                        <ChevronRight className="w-4 h-4 stroke-[4]" />
                     </div>
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Scanner
