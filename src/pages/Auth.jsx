import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, 
  Loader2, ShieldCheck, CheckCircle2 
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Logo from '../components/Logo'
import { supabase } from '../utils/supabase'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isLogin) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (authError) throw authError
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', data.user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
           navigate('/onboarding')
           return
        }

        if (profile?.onboarding_complete) {
          navigate('/')
        } else {
          navigate('/onboarding')
        }
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split('@')[0],
              onboarding_complete: false
            }
          }
        })
        if (authError) throw authError
        setSuccess('Account created! Please check your email to verify.')
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-page text-text-secondary selection:bg-text-main/10 flex flex-col items-center justify-center p-4 relative overflow-hidden font-body antialiased">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-[radial-gradient(circle_at_50%_0%,rgba(15,16,16,0.02),transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Branding Header */}
         <div className="flex flex-col items-center mb-10">
            <div className="p-3 bg-white rounded-2xl shadow-premium mb-6 border border-border">
               <Logo type="icon" className="w-10 h-10 grayscale" />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tighter text-text-main mb-2 uppercase italic">Auto<span className="opacity-30">Track</span></h1>
            <p className="text-[10px] text-text-helper font-black uppercase tracking-[0.2em] flex items-center gap-2 italic">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               High-Integrity Mobility OS
            </p>
         </div>

         {/* Auth Card */}
         <div className="saas-card rounded-[40px] shadow-premium border border-border p-8 sm:p-10 relative overflow-hidden group bg-white">
          {/* Subtle Watermark */}
          <div className="absolute -top-10 -right-10 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
             <Logo type="icon" className="w-40 h-40" />
          </div>

          <div className="mb-10 p-1.5 bg-bg-page/50 backdrop-blur-sm rounded-2xl flex items-center relative z-10 border border-border">
             <button 
               onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
               className={cn(
                 "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 italic",
                 isLogin ? "bg-white text-text-main shadow-sm border border-border" : "text-text-helper hover:text-text-main"
               )}
             >
                Node Sign-In
             </button>
             <button 
               onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
               className={cn(
                 "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 italic",
                 !isLogin ? "bg-white text-text-main shadow-sm border border-border" : "text-text-helper hover:text-text-main"
               )}
             >
                Initialize
             </button>
          </div>

          <div className="text-center mb-10">
             <h2 className="text-2xl font-bold text-text-main tracking-tighter uppercase italic">{isLogin ? 'Welcome Back' : 'Asset Ignition'}</h2>
             <p className="text-[11px] text-text-helper font-bold uppercase tracking-[0.2em] mt-1 italic">{isLogin ? 'Access your mobility ledger' : 'Join the precision fleet OS'}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6 relative z-10">
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-text-helper uppercase tracking-[0.2em] pl-1 italic">Identity Node (Email)</label>
                   <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-subtle group-focus-within:text-text-main transition-colors" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. node.admin@autotrack.pro"
                        className="w-full h-15 bg-bg-page rounded-2xl border border-border px-12 text-sm font-bold text-text-main placeholder:text-text-subtle focus:outline-none focus:border-text-main transition-all placeholder:italic"
                        required
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between items-center pr-1">
                      <label className="text-[9px] font-black text-text-helper uppercase tracking-[0.2em] pl-1 italic">Security Seed (Password)</label>
                      {isLogin && <button type="button" className="text-[9px] font-black text-text-helper hover:text-text-main uppercase tracking-widest italic transition-colors">Recover Seed</button>}
                   </div>
                   <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-subtle group-focus-within:text-text-main transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full h-15 bg-bg-page rounded-2xl border border-border px-12 text-sm font-bold text-text-main placeholder:text-text-subtle focus:outline-none focus:border-text-main transition-all"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-subtle hover:text-text-main transition-colors"
                      >
                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                   </div>
                </div>
             </div>

             <div className="min-h-[22px]">
               <AnimatePresence mode="wait">
                 {error && (
                   <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2 items-center text-accent">
                     <AlertCircle className="w-4 h-4 shrink-0" />
                     <p className="text-[11px] font-bold tracking-tight uppercase italic">{error}</p>
                   </motion.div>
                 )}
                 {success && (
                   <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2 items-center text-text-main">
                     <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                     <p className="text-[11px] font-bold tracking-tight uppercase italic">{success}</p>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

             <button 
               type="submit"
               disabled={loading}
               className="w-full h-15 rounded-2xl bg-text-main text-white font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-xl hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 italic"
             >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                 <>
                   <span>{isLogin ? 'Authorize Access' : 'Initialize Node'}</span>
                   <ArrowRight className="w-4 h-4" />
                 </>
               )}
             </button>
          </form>

          <p className="mt-8 text-center text-[9px] text-text-subtle font-black uppercase tracking-[0.4em] italic">
             Authorized Personnel Only
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 mt-12 opacity-60">
           <div className="flex items-center gap-2 grayscale grayscale-100">
              <ShieldCheck className="w-4 h-4 text-text-main" />
              <span className="text-[9px] font-black uppercase tracking-widest text-text-subtle italic">AES-256 BIT</span>
           </div>
           <div className="w-px h-3 bg-border" />
           <div className="flex items-center gap-2 grayscale grayscale-100">
              <CheckCircle2 className="w-4 h-4 text-text-main" />
              <span className="text-[9px] font-black uppercase tracking-widest text-text-subtle italic">SOC2 TYPE-II</span>
           </div>
        </div>
      </motion.div>

      <div className="mt-12 text-center relative z-10">
         <p className="text-[9px] text-text-subtle font-black uppercase tracking-[0.6em] italic">
            AutoTrack Precision Infrastructure
         </p>
      </div>
    </div>
  )
}

export default Auth
