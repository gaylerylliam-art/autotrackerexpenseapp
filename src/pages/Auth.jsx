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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/10 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-10">
           <div className="p-3 bg-white rounded-2xl shadow-xl shadow-blue-500/5 mb-6 border border-slate-100">
              <Logo type="icon" className="w-10 h-10" />
           </div>
           <h1 className="text-3xl font-display font-bold tracking-tight text-slate-900 mb-2">Auto<span className="text-primary border-b-4 border-primary/10">Track</span></h1>
           <p className="text-sm text-slate-500 font-semibold tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secure Asset Management
           </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-slate-200/60 p-8 sm:p-10 relative overflow-hidden group">
          {/* Subtle Watermark */}
          <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
             <Logo type="icon" className="w-40 h-40" />
          </div>

          <div className="mb-8 p-1 bg-slate-100/80 rounded-2xl flex items-center relative z-10">
             <button 
               onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
               className={cn(
                 "flex-1 py-3rounded-xl text-xs font-bold transition-all duration-300",
                 isLogin ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5 py-3 rounded-xl" : "text-slate-400 hover:text-slate-600 py-3"
               )}
             >
                Sign In
             </button>
             <button 
               onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
               className={cn(
                 "flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300",
                 !isLogin ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5 py-3 rounded-xl" : "text-slate-400 hover:text-slate-600 py-3"
               )}
             >
                Create Account
             </button>
          </div>

          <div className="text-center mb-8">
             <h2 className="text-2xl font-bold text-slate-900">{isLogin ? 'Welcome Back' : 'Start for Free'}</h2>
             <p className="text-sm text-slate-500 mt-1 font-medium">{isLogin ? 'Access your vehicle analytics' : 'Join the precision fleet OS'}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6 relative z-10">
             <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                   <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. ops@autotrack.pro"
                        className="w-full h-14 bg-slate-50 rounded-2xl border-2 border-slate-100 px-12 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
                        required
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between items-center pr-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
                      {isLogin && <button type="button" className="text-[10px] font-bold text-primary hover:underline">Forgot password?</button>}
                   </div>
                   <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full h-14 bg-slate-50 rounded-2xl border-2 border-slate-100 px-12 text-sm font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-primary/50 focus:bg-white transition-all"
                        required
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                   </div>
                </div>
             </div>

             <div className="min-h-[22px]">
               <AnimatePresence mode="wait">
                 {error && (
                   <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2 items-center text-rose-500">
                     <AlertCircle className="w-4 h-4 shrink-0" />
                     <p className="text-[11px] font-bold tracking-tight">{error}</p>
                   </motion.div>
                 )}
                 {success && (
                   <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2 items-center text-emerald-600">
                     <CheckCircle2 className="w-4 h-4 shrink-0" />
                     <p className="text-[11px] font-bold tracking-tight">{success}</p>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

             <button 
               type="submit"
               disabled={loading}
               className="w-full h-15 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70"
             >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                 <>
                   <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                   <ArrowRight className="w-4 h-4" />
                 </>
               )}
             </button>
          </form>

          <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
             Authorized Access Only
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-8 mt-12 opacity-40">
           <div className="flex items-center gap-2 grayscale grayscale-100">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">AES-256 Encryption</span>
           </div>
           <div className="w-px h-3 bg-slate-300" />
           <div className="flex items-center gap-2 grayscale grayscale-100">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">SOC2 Type II Ready</span>
           </div>
        </div>
      </motion.div>

      <div className="mt-12 text-center relative z-10">
         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">
            AutoTrack Precision OS
         </p>
      </div>
    </div>
  )
}

export default Auth
