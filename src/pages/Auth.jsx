import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ChevronRight, Shield, User, AlertCircle, Loader2, Cpu, Globe, Zap, ArrowRight, CheckCircle2 } from 'lucide-react'
import CONFIG from '../config'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Logo from '../components/Logo'
import { supabase } from '../utils/supabase'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
        
        // Fetch profile to check onboarding status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', data.user.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
           // If profile doesn't exist yet but user is auth'd, send to onboarding
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
        setSuccess('Check your email to finish setting up your account.')
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg text-slate-900 selection:bg-primary/10 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-400/5 rounded-full blur-[160px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg space-y-12 relative z-10"
      >
        <div className="text-center space-y-8">
             <Logo type="full" className="scale-125 mx-auto" animate={true} />
             <div className="flex flex-col items-center gap-2">
                 <h1 className="text-4xl font-display font-black tracking-tighter italic uppercase text-slate-900">Sign <span className="text-primary">In</span></h1>
                <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-text-secondary opacity-40">Secure Mileage & Expense Management</p>
             </div>
        </div>

        <div className="saas-card p-12 rounded-[56px] border border-white shadow-premium space-y-10 relative overflow-hidden bg-white/10 backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Zap className="w-40 h-40 text-primary" />
          </div>

          <div className="flex p-2 bg-slate-50/50 rounded-3xl border border-slate-100/50 relative z-10 shadow-inner">
            <button 
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
              className={cn(
                "flex-1 py-4 rounded-[20px] font-display font-black text-[10px] uppercase tracking-widest italic transition-all",
                isLogin ? "bg-white shadow-xl text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
               Sign In
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
              className={cn(
                "flex-1 py-4 rounded-[20px] font-display font-black text-[10px] uppercase tracking-widest italic transition-all",
                !isLogin ? "bg-white shadow-xl text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
               Create Account
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-8 relative z-10">
            <div className="grid gap-6">
               <div className="space-y-3">
                 <label className="text-[10px] text-text-secondary font-display font-black uppercase tracking-widest italic pl-2">Email Address</label>
                 <div className="relative group">
                   <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                   <input 
                     type="email" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="ops@autotrack.pro"
                     className="w-full h-18 bg-white/80 rounded-[28px] border border-white px-16 text-sm font-display font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary transition-all italic shadow-sm focus:shadow-blue-500/5 backdrop-blur-md"
                     required
                   />
                 </div>
               </div>

               <div className="space-y-3">
                 <label className="text-[10px] text-text-secondary font-display font-black uppercase tracking-widest italic pl-2">Password</label>
                 <div className="relative group">
                   <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                   <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••••••"
                     className="w-full h-18 bg-white/80 rounded-[28px] border border-white px-16 text-sm font-mono font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary transition-all shadow-sm focus:shadow-blue-500/5 backdrop-blur-md"
                     required
                   />
                 </div>
               </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                   key="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 text-red-500 border border-red-500/20 p-5 rounded-3xl flex gap-4 items-center"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="font-display font-black uppercase text-[10px] tracking-widest leading-loose">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div 
                   key="success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 p-5 rounded-3xl flex gap-4 items-center"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p className="font-display font-black uppercase text-[10px] tracking-widest leading-loose">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-20 rounded-[32px] btn-primary flex items-center justify-center gap-4 group active:scale-[0.98] transition-all disabled:opacity-50 relative overflow-hidden italic shadow-2xl"
            >
              {loading ? (
                <div className="flex items-center gap-4">
                   <Loader2 className="w-6 h-6 animate-spin text-white" />
                   <span className="text-[10px] font-display font-black uppercase tracking-widest">Signing in...</span>
                </div>
              ) : (
                <>
                   <span className="text-sm font-display font-black uppercase tracking-[0.3em] font-black">{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-between pt-4 opacity-40">
             <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-emerald-600" />
                 <span className="text-[8px] font-display font-black uppercase tracking-widest text-emerald-700">SSL Secure Connection</span>
             </div>
             <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-primary" />
                 <span className="text-[8px] font-display font-black uppercase tracking-widest text-primary">Regional Data Storage</span>
             </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-text-secondary font-display font-black uppercase tracking-[0.5em] italic opacity-20">
           AutoTracker • Simplified Vehicle Expenses
        </p>
      </motion.div>
    </div>
  )
}

export default Auth
