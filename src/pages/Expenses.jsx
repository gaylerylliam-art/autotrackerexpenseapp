import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Search, Filter, CreditCard, DollarSign, Calendar, 
  ChevronRight, ArrowUpRight, FileText, Download, Trash2,
  CheckCircle2, AlertCircle, Clock, Wallet, Zap, Activity,
  Database, ShieldCheck, Loader2, Share2, MoreVertical,
  FilterX, TrendingUp, Sparkles, User, Car, Radio, Terminal,
  Tag, MapPin
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import AddExpenseModal from '../components/AddExpenseModal'
import { supabase } from '../utils/supabase'
import { generateCSVReport } from '../utils/reportService'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const ExpenseRow = ({ expense }) => {
  const isFuel = expense.category === 'Fuel'
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="premium-card group flex items-center justify-between p-6 hover:border-primary/20 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-6 flex-1">
         <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
            isFuel ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
         )}>
            {isFuel ? <Zap className="w-6 h-6 stroke-[2.5]" /> : <Tag className="w-6 h-6 stroke-[2.5]" />}
         </div>
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{expense.vendor || 'Unnamed Vendor'}</h4>
               <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">{expense.category}</span>
            </div>
            <div className="flex items-center gap-3">
               <Car className="w-3.5 h-3.5 text-slate-400" />
               <p className="text-xs text-slate-500 font-medium">{expense.vehicles?.name || 'All Vehicles'}</p>
            </div>
         </div>
      </div>

      <div className="hidden md:flex flex-col items-end gap-1 px-8 border-r border-slate-100 mr-8">
         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Date</p>
         <p className="text-sm font-bold text-slate-900">{new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
      </div>

      <div className="flex items-center gap-6">
         <div className="text-right">
            <p className="text-xl font-display font-bold text-slate-900 group-hover:text-primary transition-colors">AED {parseFloat(expense.amount).toLocaleString()}</p>
            <div className="flex items-center justify-end gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cleared</span>
            </div>
         </div>
         <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-all" />
      </div>
    </motion.div>
  )
}

const Expenses = () => {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchExpenses()

    const channel = supabase.channel('expenses-manifest-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
        fetchExpenses(false)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchExpenses = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*, vehicles(name)')
        .order('date', { ascending: false })
      
      if (error) throw error
      setExpenses(data || [])
    } catch (err) {
      console.error('Error fetching expenses:', err)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    await new Promise(r => setTimeout(r, 1000))
    generateCSVReport(expenses)
    setExporting(false)
  }

  const totalSpend = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0)
  const filteredExpenses = expenses.filter(e => 
    e.category.toLowerCase().includes(search.toLowerCase()) || 
    (e.vendor && e.vendor.toLowerCase().includes(search.toLowerCase())) ||
    (e.vehicles?.name && e.vehicles.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Expenses</h1>
            <p className="text-slate-500 font-medium">Detailed log of all financial transactions.</p>
         </div>
         
         <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group w-full sm:w-64">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all" />
               <input 
                 placeholder="Search transactions..." 
                 className="w-full h-12 bg-white border border-slate-200 rounded-2xl px-12 text-sm focus:outline-none focus:border-primary transition-all outline-none"
                 value={search}
                 onChange={e => setSearch(e.target.value)}
               />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <button 
                  onClick={handleExport}
                  disabled={exporting || expenses.length === 0}
                  className="h-12 px-6 bg-slate-100 rounded-2xl flex items-center gap-2 text-slate-600 hover:bg-slate-200 transition-all font-bold text-xs disabled:opacity-50"
               >
                  {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {exporting ? 'Generating...' : 'Export'}
               </button>
               <button 
                 onClick={() => setIsAddModalOpen(true)}
                 className="h-12 px-8 btn-primary group w-full sm:w-auto"
               >
                  <Plus className="w-5 h-5 stroke-[2.5]" /> 
                  Add Expense
               </button>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Stats Sidebar */}
         <div className="lg:col-span-1 space-y-6">
            <div className="premium-card p-8 space-y-6">
               <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Spend</p>
                  <TrendingUp className="w-4 h-4 text-primary" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-3xl font-display font-bold text-slate-900 tracking-tight">AED {totalSpend.toLocaleString()}</h3>
                  <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                     <TrendingUp className="w-3 h-3" />
                     +12.5% vs last month
                  </p>
               </div>
               <div className="pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Efficiency</span>
                     <span className="text-xs font-bold text-primary">84%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-primary" />
                  </div>
               </div>
            </div>

            <div className="premium-card p-8 bg-primary/5 border-primary/10 relative overflow-hidden group">
               <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <ShieldCheck className="w-32 h-32 text-primary" />
               </div>
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                     <ShieldCheck className="w-4 h-4 text-primary" />
                     <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Tax Compliant</p>
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight">Reporting Ready</h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Your expenses are automatically categorized for VAT and business tax reconciliation.</p>
               </div>
            </div>
         </div>

         {/* Transaction List */}
         <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  Recent Transactions
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold">{filteredExpenses.length}</span>
               </h3>
               <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  <Radio className="w-3 h-3 animate-pulse" />
                  Cloud Synced
               </div>
            </div>

            <div className="space-y-4">
               {loading ? (
                  <div className="h-64 flex items-center justify-center">
                     <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  </div>
               ) : (
                  <>
                     <AnimatePresence mode="popLayout">
                        {filteredExpenses.map(e => (
                          <ExpenseRow key={e.id} expense={e} />
                        ))}
                     </AnimatePresence>
                     {filteredExpenses.length === 0 && (
                        <div className="premium-card h-64 border-dashed border-2 flex flex-col items-center justify-center gap-4 text-center p-8 bg-slate-50/50" onClick={() => setIsAddModalOpen(true)}>
                           <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-300">
                              <Plus className="w-8 h-8" />
                           </div>
                           <div>
                              <p className="text-lg font-bold text-slate-900">No transactions found</p>
                              <p className="text-xs text-slate-500 font-medium">Click the button above to add your first expense.</p>
                           </div>
                        </div>
                     )}
                  </>
               )}
            </div>
         </div>
      </div>
      
      <AddExpenseModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={fetchExpenses} 
      />
    </div>
  )
}

export default Expenses

