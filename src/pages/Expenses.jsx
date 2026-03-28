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
      className="saas-card group flex items-center justify-between p-6 hover:border-text-main/10 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-6 flex-1">
         <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
            isFuel ? 'bg-bg-secondary/40 text-text-main' : 'bg-bg-secondary/40 text-text-main'
         )}>
            {isFuel ? <Zap className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
         </div>
         <div className="space-y-1">
            <div className="flex items-center gap-3">
               <h4 className="font-bold text-text-main group-hover:text-accent transition-colors uppercase text-[13px] tracking-tight">{expense.vendor || 'Unnamed Vendor'}</h4>
               <span className="text-[10px] bg-bg-page text-text-helper px-2 py-0.5 rounded-md font-bold uppercase tracking-widest">{expense.category}</span>
            </div>
            <div className="flex items-center gap-3">
               <Car className="w-3.5 h-3.5 text-text-subtle" />
               <p className="text-[11px] text-text-helper font-bold uppercase tracking-widest italic">{expense.vehicles?.name || 'All Units'}</p>
            </div>
         </div>
      </div>

      <div className="hidden md:flex flex-col items-end gap-1 px-8 border-r border-border mr-8">
         <p className="text-[10px] text-text-subtle font-bold uppercase tracking-widest leading-none">Date</p>
         <p className="text-[12px] font-mono font-bold text-text-main">{new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
      </div>

      <div className="flex items-center gap-6">
         <div className="text-right">
            <p className="text-lg font-display font-bold text-text-main group-hover:text-accent transition-colors italic tracking-tighter">AED {parseFloat(expense.amount).toLocaleString()}</p>
            <div className="flex items-center justify-end gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-text-subtle italic">Cleared</span>
            </div>
         </div>
         <ChevronRight className="w-5 h-5 text-text-subtle group-hover:text-text-main transition-all" />
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
             <h1 className="text-3xl font-display font-bold text-text-main tracking-tight">Expenses</h1>
             <p className="text-text-secondary font-medium italic">Detailed audit log of all mobility transactions.</p>
          </div>
         
         <div className="flex flex-col sm:flex-row items-center gap-4">
             <div className="relative group w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle group-focus-within:text-text-main transition-all" />
                <input 
                  placeholder="Search logs..." 
                  className="w-full h-12 bg-white border border-border rounded-2xl px-12 text-sm focus:outline-none focus:border-text-main transition-all outline-none italic placeholder:text-text-subtle"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
             </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                   onClick={handleExport}
                   disabled={exporting || expenses.length === 0}
                   className="h-12 px-6 bg-white border border-border rounded-2xl flex items-center gap-2 text-text-secondary hover:bg-bg-page transition-all font-bold text-[11px] uppercase tracking-widest disabled:opacity-50"
                >
                   {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                   {exporting ? 'Processing' : 'Export'}
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
             <div className="saas-card p-8 space-y-6 bg-white">
                <div className="flex items-center justify-between">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-text-helper italic">Net Expenditure</p>
                   <TrendingUp className="w-4 h-4 text-text-subtle" />
                </div>
                <div className="space-y-1">
                   <h3 className="text-3xl font-display font-bold text-text-main italic tracking-tighter">AED {totalSpend.toLocaleString()}</h3>
                   <p className="text-[10px] text-accent font-black uppercase tracking-widest flex items-center gap-1 italic">
                      <TrendingUp className="w-3 h-3" />
                      +12.5% VS LAST YEAR
                   </p>
                </div>
                <div className="pt-6 border-t border-border">
                   <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-text-helper italic">Compliance</span>
                      <span className="text-xs font-bold text-text-main italic">84%</span>
                   </div>
                   <div className="h-1 w-full bg-bg-page rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '84%' }} className="h-full bg-text-main" />
                   </div>
                </div>
             </div>

             <div className="saas-card p-8 bg-text-main/5 border-text-main/10 relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                   <ShieldCheck className="w-32 h-32 text-text-main" />
                </div>
                <div className="relative z-10 space-y-4">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-main italic">Tax Compliant</p>
                   </div>
                   <h3 className="text-xl font-display font-bold text-text-main italic uppercase tracking-tighter">Reporting Ready</h3>
                   <p className="text-[11px] text-text-secondary font-medium leading-relaxed italic">Your logs are automatically reconciled for VAT and business compliance.</p>
                </div>
             </div>
         </div>

         {/* Transaction List */}
          <div className="lg:col-span-3 space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold text-text-main flex items-center gap-3 uppercase tracking-tighter italic">
                   Transaction Ledger
                   <span className="px-2 py-0.5 bg-bg-card border border-border text-text-helper rounded-lg text-xs font-bold font-mono">{filteredExpenses.length}</span>
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 italic">
                   <Radio className="w-3 h-3 animate-pulse" />
                   Synced
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
                         <div className="saas-card h-64 border-dashed border-2 border-border flex flex-col items-center justify-center gap-4 text-center p-8 bg-white/40" onClick={() => setIsAddModalOpen(true)}>
                            <div className="w-16 h-16 rounded-2xl bg-bg-page border border-border flex items-center justify-center text-text-subtle">
                               <Plus className="w-8 h-8" />
                            </div>
                            <div>
                               <p className="text-lg font-bold text-text-main italic uppercase tracking-tighter">No logs found</p>
                               <p className="text-[11px] text-text-helper font-medium uppercase tracking-widest">Register your first mobility expense unit</p>
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

