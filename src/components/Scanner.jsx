import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, Upload, Check, Zap, Loader2, Sparkles, Receipt, Fuel, AlertCircle, ChevronRight, PenTool, Car, Shield } from 'lucide-react'

const Scanner = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('idle') // idle, scanning, processing, reviews
  const [progress, setProgress] = useState(0)
  const [parsedData, setParsedData] = useState(null)

  useEffect(() => {
    if (step === 'scanning') {
      const timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer)
            setStep('processing')
            return 100
          }
          return p + 2
        })
      }, 50)
      return () => clearInterval(timer)
    }
  }, [step])

  useEffect(() => {
    if (step === 'processing') {
      const timer = setTimeout(() => {
        setParsedData({
          merchant: 'ADNOC Distribution',
          date: '25 Mar 2026',
          time: '14:22',
          total: 'AED 184.50',
          category: 'Fuel',
          vehicle: 'BMW X5 (P 12345)',
          confidence: 0.98,
          fuelType: 'Special 95',
          quantity: '52.42 L'
        })
        setStep('review')
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [step])

  const handleScan = () => setStep('scanning')

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-bg/95 backdrop-blur-xl" 
          />

          {/* Scanner Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="w-full max-w-lg mx-4 glass rounded-[40px] border border-white/10 overflow-hidden relative shadow-[0_0_100px_rgba(108,99,255,0.1)]"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent ring-1 ring-accent/30">
                   <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-display font-black tracking-tightest text-lg">AI <span className="gradient-text">Vision Scan</span></h3>
                  <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-bold">Auto-Extraction v2.1</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 glass rounded-full border border-white/10 hover:bg-white/10 transition-all text-muted hover:text-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8">
              {step === 'idle' && (
                <div className="space-y-8 py-4">
                  <div className="aspect-[3/4] rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-6 relative group transition-colors hover:border-accent/40 bg-white/[0.02]">
                    <div className="p-6 rounded-full bg-accent/10 border border-accent/20 text-accent group-hover:scale-110 transition-transform">
                      <Camera className="w-10 h-10" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className="font-display font-bold text-lg">Snap or Upload Receipt</p>
                      <p className="text-muted text-xs font-mono uppercase tracking-widest">Supports JPG, PNG, PDF</p>
                    </div>
                    {/* Corners animation */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent rounded-tl-xl opacity-40" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent rounded-tr-xl opacity-40" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent rounded-bl-xl opacity-40" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent rounded-br-xl opacity-40" />
                  </div>
                  <div className="flex gap-4">
                     <button onClick={handleScan} className="flex-1 py-4 bg-accent text-white rounded-2xl font-display font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-xl">
                       Launch Camera
                     </button>
                     <button className="px-6 py-4 glass rounded-2xl border border-white/10 text-muted hover:text-text transition-all">
                       <Upload className="w-5 h-5" />
                     </button>
                  </div>
                </div>
              )}

              {step === 'scanning' && (
                <div className="space-y-8 py-8 flex flex-col items-center justify-center relative overflow-hidden">
                   <div className="w-64 h-80 relative rounded-2xl border-2 border-accent/40 overflow-hidden bg-surface3 shadow-inner">
                      {/* Simulated Receipt Image */}
                      <div className="absolute inset-0 opacity-20 grayscale scale-150">
                         <div className="w-full h-full bg-gradient-to-b from-white to-neutral-500 flex flex-col gap-4 p-8">
                            <div className="h-4 bg-black/40 rounded w-1/2" />
                            <div className="h-4 bg-black/40 rounded w-full" />
                            <div className="h-2 bg-black/40 rounded w-3/4" />
                            <div className="h-8 bg-black/40 rounded w-1/3 mt-auto" />
                         </div>
                      </div>
                      
                      {/* Scanning Line */}
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }} 
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_15px_rgba(108,99,255,0.8)] z-10"
                      />
                      
                      <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
                   </div>
                   <div className="text-center space-y-4">
                     <h4 className="font-display font-black text-xl tracking-tightest uppercase italic">Digitizing Paper...</h4>
                     <div className="w-48 h-1.5 bg-white/5 rounded-full overflow-hidden mx-auto">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${progress}%` }} 
                          className="h-full bg-accent" 
                        />
                     </div>
                     <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-bold">Progress: {progress}%</p>
                   </div>
                </div>
              )}

              {step === 'processing' && (
                <div className="space-y-12 py-12 flex flex-col items-center justify-center text-center">
                   <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        className="w-32 h-32 rounded-full border-t-2 border-accent/60 border-l-2 border-accent/20 border-r-2 border-accent/20 border-b-2 border-accent/40"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <h4 className="font-display font-black text-2xl tracking-tightest">AI <span className="gradient-text">Is Thinking</span></h4>
                      <p className="text-muted text-sm max-w-[240px] leading-relaxed mx-auto font-medium">
                        Claude 3.5 Sonnet is parsing merchant data, items, and tax identifiers...
                      </p>
                   </div>
                </div>
              )}

              {step === 'review' && parsedData && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="glass p-6 rounded-3xl border border-accent/20 bg-accent/5 space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-black flex items-center gap-2">
                           <Check className="w-3 h-3" />
                           Scan Successful
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-accent2 bg-accent2/10 px-2 py-0.5 rounded-full ring-1 ring-accent2/20">
                           {Math.round(parsedData.confidence * 100)}% Confidence
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <h4 className="text-2xl font-display font-black tracking-tightest">{parsedData.merchant}</h4>
                        <div className="flex items-center gap-4 text-xs text-muted font-mono uppercase tracking-widest">
                           <span>{parsedData.date}</span>
                           <span>{parsedData.time}</span>
                        </div>
                     </div>
                  </div>

                  <div className="grid gap-3">
                     {[
                       { label: 'Total Amount', value: parsedData.total, icon: Zap },
                       { label: 'Category', value: parsedData.category, icon: Fuel },
                       { label: 'Vehicle', value: parsedData.vehicle, icon: Car },
                       { label: 'Volume', value: parsedData.quantity, icon: Fuel, sub: parsedData.fuelType },
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-4 glass rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all group">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-surface2 flex items-center justify-center border border-white/5">
                                <item.icon className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                             </div>
                             <div className="space-y-0.5">
                                <span className="text-[9px] text-muted font-mono uppercase tracking-widest font-bold block">{item.label}</span>
                                <span className="text-sm font-display font-black tracking-tightest leading-none">{item.value}</span>
                                {item.sub && <p className="text-[9px] text-accent/60 font-mono uppercase">{item.sub}</p>}
                             </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted group-hover:text-text translate-x-0 group-hover:translate-x-1 transition-all" />
                       </div>
                     ))}
                  </div>

                  <div className="flex gap-4">
                     <button onClick={onClose} className="flex-1 py-4 bg-accent text-white rounded-2xl font-display font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
                       Approve & Save
                     </button>
                     <button onClick={() => setStep('idle')} className="px-6 py-4 glass rounded-2xl border border-white/10 text-muted hover:text-text transition-all">
                       Redo
                     </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-4">
               <span className="text-[9px] font-mono text-muted uppercase tracking-widest gap-2 flex items-center">
                  <Shield className="w-3 h-3 opacity-40" />
                  Encrypted Vision processing
               </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Sub-components as needed or just export main Scanner
export default Scanner
