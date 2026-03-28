import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, CreditCard, Fuel, Zap, ShieldCheck, Activity, Plus, 
  ChevronRight, ChevronLeft, Check, Sparkles, AlertCircle, 
  DollarSign, Hash, Clock, Calendar, Cpu, Database, 
  Loader2, Wallet, Car, Info, Server, Terminal, Radio,
  Camera, Upload, FileText, Eye, Shield, Globe, Navigation
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import expenseCategories from '../constants/expenseCategories'
import { supabase } from '../utils/supabase'
import { performOCR } from '../utils/ocrService'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const CURRENCIES = [
  { id: 'AED', symbol: 'د.إ', label: 'UAE Dirham', rate: 1 },
  { id: 'USD', symbol: '$', label: 'US Dollar', rate: 3.67 },
  { id: 'EUR', symbol: '€', label: 'Euro', rate: 4.01 },
  { id: 'GBP', symbol: '£', label: 'British Pound', rate: 4.65 },
]

const AddExpenseModal = ({ isOpen, onClose, onSave }) => {
  const [step, setStep] = useState(1) // 1: Amount, 2: Category, 3: Details
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const [vehicles, setVehicles] = useState([])
  const [receipt, setReceipt] = useState(null)
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'AED',
    category: '',
    subcategory: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    vehicle_id: '',
    vendor: '',
  })

  useEffect(() => {
    if (isOpen) {
      fetchContext()
    }
  }, [isOpen])

  const fetchContext = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
       const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
       setProfile(prof)
       if (prof?.currency) setFormData(p => ({ ...p, currency: prof.currency }))
    }

    const { data: v } = await supabase.from('vehicles').select('id, name')
    setVehicles(v || [])
    if (v?.length > 0 && !formData.vehicle_id) setFormData(p => ({ ...p, vehicle_id: v[0].id }))
  }

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setReceipt(file)
      setScanning(true)
      try {
        const ocrData = await performOCR(file)
        setFormData(p => ({
          ...p,
          amount: ocrData.amount,
          vendor: ocrData.vendor,
          category: ocrData.category
        }))
        if (step === 1) setStep(3)
      } catch (err) {
        console.error('OCR Failure:', err)
      } finally {
        setScanning(false)
      }
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Authentication required')

      let receiptUrl = ''
      if (receipt) {
        const fileExt = receipt.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`
        const { error: uploadError } = await supabase.storage.from('receipts').upload(filePath, receipt)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('receipts').getPublicUrl(filePath)
        receiptUrl = publicUrl
      }

      const selectedCurrency = CURRENCIES.find(c => c.id === formData.currency)
      const convertedAmount = parseFloat(formData.amount) * (selectedCurrency?.rate || 1)

      const { error: insertError } = await supabase
        .from('expenses')
        .insert([{
          user_id: user.id,
          vehicle_id: formData.vehicle_id || null,
          amount: convertedAmount,
          original_amount: parseFloat(formData.amount),
          original_currency: formData.currency,
          exchange_rate: selectedCurrency?.rate || 1,
          category: formData.category,
          subcategory: formData.subcategory,
          date: formData.date,
          vendor: formData.vendor,
          notes: formData.description,
          receipt_url: receiptUrl,
          status: 'Cleared'
        }])

      if (insertError) throw insertError

      if (onSave) onSave()
      onClose()
      resetForm()
    } catch (err) {
      setError(err.message || 'Failed to save expense')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setFormData({
      amount: '',
      currency: profile?.currency || 'AED',
      category: '',
      subcategory: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      vehicle_id: '',
      vendor: '',
    })
    setReceipt(null)
    setScanning(false)
  }

  const handleNext = () => step < 3 && setStep(s => s + 1)
  const handleBack = () => step > 1 && setStep(s => s - 1)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 text-slate-900">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden relative flex flex-col"
          >
            <div className="p-8 pb-4 flex items-center justify-between relative z-10 border-b border-slate-50">
               <div>
                  <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight">Add Expense</h2>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Step {step} of 3</p>
               </div>
               <button 
                 onClick={onClose} 
                 className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>

            <div className="px-8 py-4 relative z-10">
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${(step / 3) * 100}%` }} 
                    className="h-full bg-primary rounded-full" 
                  />
               </div>
            </div>

            <div className="p-8 min-h-[420px] flex flex-col justify-center relative z-10">
               <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                       <div className="space-y-6">
                          <div className="flex items-center justify-between">
                             <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Amount</label>
                             <div className="flex items-center gap-2">
                                {CURRENCIES.map(c => (
                                   <button 
                                      key={c.id} onClick={() => setFormData(p => ({ ...p, currency: c.id }))}
                                      className={cn(
                                         "h-8 px-3 rounded-lg text-[10px] font-bold transition-all",
                                         formData.currency === c.id ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-white"
                                      )}
                                   >
                                      {c.id}
                                   </button>
                                ))}
                             </div>
                          </div>
                          <div className="relative group">
                             <input 
                               type="number" autoFocus placeholder="0.00" value={formData.amount}
                               onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
                               className="w-full h-24 bg-slate-50 rounded-3xl border border-slate-200 px-8 text-5xl font-display font-medium text-slate-900 placeholder:text-slate-200 focus:outline-none focus:bg-white focus:border-primary transition-all" 
                             />
                             <span className="absolute right-8 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-300">{formData.currency}</span>
                          </div>
                          {formData.currency !== 'AED' && formData.amount && (
                             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                                <Globe className="w-4 h-4 text-emerald-600" />
                                <p className="text-[11px] font-bold text-emerald-700">
                                   Approx. AED {(parseFloat(formData.amount) * (CURRENCIES.find(c => c.id === formData.currency)?.rate || 1)).toFixed(2)}
                                </p>
                             </motion.div>
                          )}
                          <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                             <Sparkles className="w-4 h-4 text-primary" />
                             <p className="text-[11px] font-medium text-blue-700">Scan receipts for automatic data entry.</p>
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                       <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Category</label>
                       <div className="grid grid-cols-2 gap-4 h-[350px] overflow-y-auto no-scrollbar pr-1 pb-4">
                          {[
                            { id: 'Fuel', label: 'Fuel', icon: Fuel, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { id: 'Service', label: 'Service', icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { id: 'Maintenance', label: 'Maintenance', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { id: 'Fire, Safety & IT', label: 'Fire & IT', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
                            { id: 'Insurance', label: 'Insurance', icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
                            { id: 'Fines', label: 'Fines', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
                            { id: 'Toll', label: 'Tolls/Parking', icon: Navigation, color: 'text-amber-600', bg: 'bg-amber-50' },
                            { id: 'Other', label: 'Other', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50' },
                          ].map(cat => (
                            <button 
                              key={cat.id} onClick={() => { setFormData(p => ({ ...p, category: cat.id })); handleNext(); }}
                              className={cn(
                                "h-24 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all relative overflow-hidden",
                                formData.category === cat.id 
                                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                  : "bg-white border-slate-200 hover:border-primary hover:bg-slate-50 shadow-sm"
                              )}
                            >
                               <cat.icon className={cn("w-6 h-6", formData.category === cat.id ? "text-white" : cat.color)} />
                               <span className="text-[10px] font-bold text-center px-2">{cat.label}</span>
                            </button>
                          ))}
                       </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Subcategory (Optional)</label>
                          <select 
                             value={formData.subcategory} onChange={e => setFormData(p => ({ ...p, subcategory: e.target.value }))}
                             className="w-full h-12 bg-slate-50 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-primary transition-all appearance-none"
                          >
                             <option value="">Select subcategory...</option>
                             {expenseCategories.find(c => c.category === formData.category)?.subcategories.map(sub => (
                               <option key={sub} value={sub}>{sub}</option>
                             ))}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Vehicle</label>
                          <select 
                             value={formData.vehicle_id} onChange={e => setFormData(p => ({ ...p, vehicle_id: e.target.value }))}
                             className="w-full h-12 bg-slate-50 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-900 focus:outline-none focus:border-primary transition-all appearance-none"
                          >
                             {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1">Receipt Image</label>
                          <div className="relative group">
                             <input type="file" onChange={handleFileChange} className="hidden" id="receipt-upload" accept="image/*" />
                             <label 
                                htmlFor="receipt-upload"
                                className={cn(
                                  "w-full h-16 rounded-xl border border-dashed flex items-center justify-center gap-3 cursor-pointer transition-all relative overflow-hidden",
                                  receipt ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                                )}
                             >
                                {scanning && (
                                   <motion.div initial={{ y: "-100%" }} animate={{ y: "100%" }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute inset-x-0 h-0.5 bg-primary shadow-glow shadow-primary z-10" />
                                )}
                                {scanning ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : receipt ? <Check className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                                <span className="text-[10px] font-bold uppercase tracking-wider">{scanning ? 'Analyzing...' : receipt ? receipt.name : 'Upload Receipt'}</span>
                             </label>
                          </div>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            <div className="p-8 pt-0 flex flex-col gap-4">
               {error && (
                  <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-red-100">
                     <AlertCircle className="w-4 h-4" /> {error}
                  </div>
               )}
               <div className="flex gap-4">
                  {step > 1 && (
                    <button onClick={handleBack} className="h-12 w-12 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
                       <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={step === 3 ? handleSave : handleNext}
                    disabled={loading || scanning || (step === 1 && !formData.amount)}
                    className="flex-1 h-12 bg-primary rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                  >
                     {loading ? (
                        <>
                           <Loader2 className="w-4 h-4 animate-spin" />
                           <span>Saving...</span>
                        </>
                     ) : (
                        <>
                           <span>{step === 3 ? 'Save Expense' : 'Continue'}</span>
                           <ChevronRight className="w-4 h-4" />
                        </>
                     )}
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddExpenseModal
