import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Fuel, PenTool, Shield, Compass, Wallet, Plus, Filter, MapPin, Receipt, XCircle, TrendingUp, Globe, Tag, ChevronDown, Check } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const currencies = [
  { code: 'AED', symbol: 'د.إ', rate: 1 },
  { code: 'USD', symbol: '$', rate: 0.27 },
  { code: 'EUR', symbol: '€', rate: 0.25 },
]

const initialExpenses = [
  { id: 1, date: 'TODAY', category: 'Fuel', merchant: 'ADNOC — Al Quoz', detail: '87,420 km · Petrol 95', amount: 180, vat: 9, currency: 'AED', tag: 'Business', receipt: 'https://images.unsplash.com/photo-1554224155-1696413575b9?w=400&h=600&fit=crop', color: 'bg-red-500/10 text-red-500', icon: '⛽' },
  { id: 2, date: 'YESTERDAY', category: 'Maintenance', merchant: 'Al Futtaim Auto Centre', detail: 'Maintenance · 87,350 km', amount: 450, vat: 22.5, currency: 'AED', tag: 'Personal', receipt: null, color: 'bg-blue-600/10 text-blue-400', icon: '🔧' },
  { id: 3, date: 'YESTERDAY', category: 'Toll', merchant: 'Salik Gate — Al Garhoud', detail: 'Toll · Auto-charged', amount: 16, vat: 0, currency: 'AED', tag: 'Business', receipt: null, color: 'bg-teal-500/10 text-teal-400', icon: '🛣️' },
  { id: 4, date: 'MARCH 18', category: 'Wash', merchant: 'German Express Car Wash', detail: 'Car Wash · JBR', amount: 60, vat: 3, currency: 'AED', tag: 'Personal', receipt: 'https://images.unsplash.com/photo-1554224155-1696413575b9?w=400&h=600&fit=crop', color: 'bg-purple-500/10 text-purple-400', icon: '🧼' },
  { id: 5, date: 'MARCH 18', category: 'Fine', merchant: 'RTA Fine', detail: 'Fine · Speeding 121 km/h', amount: 600, vat: 0, currency: 'AED', tag: 'Personal', receipt: null, color: 'bg-orange-500/10 text-orange-400', icon: '⚠️' },
  { id: 6, date: 'MARCH 15', category: 'Maintenance', merchant: 'Michelin Tyre Replacement', detail: 'Tyres · Emirates Road Tyre', amount: 1200, vat: 60, currency: 'AED', tag: 'Business', receipt: null, color: 'bg-yellow-500/10 text-yellow-400', icon: '⚙️' },
]

const categories = [
  { name: 'All', icon: Filter },
  { name: 'Fuel', icon: Fuel },
  { name: 'Maintenance', icon: PenTool },
  { name: 'Insurance', icon: Shield },
  { name: 'Toll', icon: Compass },
]

const Expenses = () => {
  const [activeTab, setActiveTab] = useState('All')
  const [selectedIds, setSelectedIds] = useState([])
  const [previewReceipt, setPreviewReceipt] = useState(null)
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0])
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)

  const toggleSelect = (e, id) => {
    e.stopPropagation()
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const formatAmount = (val) => {
    const converted = val * selectedCurrency.rate
    return `${selectedCurrency.symbol} ${converted.toLocaleString(undefined, { minimumFractionDigits: selectedCurrency.code === 'AED' ? 0 : 2, maximumFractionDigits: 2 })}`
  }

  const filteredExpenses = activeTab === 'All' 
    ? initialExpenses 
    : initialExpenses.filter(e => e.category === activeTab)

  const totalSpent = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0)
  const totalVAT = filteredExpenses.reduce((acc, curr) => acc + curr.vat, 0)

  const grouped = filteredExpenses.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = []
    acc[curr.date].push(curr)
    return acc
  }, {})

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      {/* Header Summary Card */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
              <h2 className="text-2xl font-display font-black tracking-tightest">Expenses</h2>
              <div className="flex items-center gap-2">
                 <p className="text-[10px] text-muted font-mono font-black uppercase tracking-widest">March 2026</p>
                 <div className="w-1 h-1 rounded-full bg-white/20" />
                 <div className="relative">
                    <button 
                      onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                      className="text-[10px] text-accent font-mono font-black uppercase tracking-widest flex items-center gap-1 hover:text-accent2 transition-colors"
                    >
                       <Globe className="w-3 h-3" />
                       {selectedCurrency.code}
                       <ChevronDown className="w-3 h-3" />
                    </button>
                    <AnimatePresence>
                      {showCurrencyDropdown && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowCurrencyDropdown(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 mt-2 z-50 glass border border-white/10 rounded-2xl overflow-hidden min-w-[120px] shadow-2xl"
                          >
                             {currencies.map(c => (
                               <button
                                 key={c.code}
                                 onClick={() => {
                                   setSelectedCurrency(c)
                                   setShowCurrencyDropdown(false)
                                 }}
                                 className={cn(
                                   "w-full px-4 py-2.5 flex items-center justify-between text-[10px] font-mono font-black uppercase tracking-widest hover:bg-white/5 transition-colors",
                                   selectedCurrency.code === c.code ? "text-accent bg-accent/5" : "text-muted"
                                 )}
                               >
                                  {c.code}
                                  {selectedCurrency.code === c.code && <Check className="w-3 h-3" />}
                               </button>
                             ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                 </div>
              </div>
           </div>
           <div className="flex gap-3">
             <button className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-muted hover:text-text active:scale-95 transition-all">
                <TrendingUp className="w-5 h-5" />
             </button>
             <button className="w-10 h-10 rounded-full bg-accent shadow-[0_4px_12px_rgba(108,99,255,0.3)] flex items-center justify-center text-white active:scale-95 transition-all font-black">
                <Plus className="w-5 h-5" />
             </button>
           </div>
        </div>

        <div className="glass rounded-[40px] border border-white/5 bg-gradient-to-br from-white/[0.04] to-transparent p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
           <div className="space-y-4 relative z-10 flex-1">
              <div>
                <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60">Fleet Expenditure</span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-5xl font-display font-black tracking-tightest leading-tight">{formatAmount(totalSpent)}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-accent2 font-mono font-black uppercase tracking-widest flex items-center gap-1 bg-accent2/10 px-2 py-0.5 rounded-full w-fit">
                       <TrendingUp className="w-3 h-3" />
                       12% growth
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/5">
                        <span className="text-[9px] text-muted font-mono uppercase font-black uppercase tracking-widest opacity-60">Inc. VAT</span>
                        <span className="text-[10px] text-text font-mono font-black uppercase tracking-widest">{formatAmount(totalVAT)}</span>
                    </div>
                  </div>
                </div>
              </div>
           </div>
           <div className="flex flex-wrap gap-2">
             <button className="flex items-center gap-2 px-6 py-3 rounded-2xl glass border border-white/10 text-[10px] font-mono font-black uppercase tracking-widest text-text hover:bg-white/10 transition-all font-black">
                <Plus className="w-4 h-4 text-accent" />
                Add Receipt
             </button>
             <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-bg text-[10px] font-mono font-black uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-xl shadow-white/5 font-black">
                <Receipt className="w-4 h-4" />
                Audit Report
             </button>
           </div>
           {/* Decorative abstract */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4 font-display">
           {categories.map((cat) => (
             <button
               key={cat.name}
               onClick={() => setActiveTab(cat.name)}
               className={`
                 flex items-center gap-2 px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all border
                 ${activeTab === cat.name 
                   ? 'bg-accent text-white border-accent shadow-xl shadow-accent/20' 
                   : 'glass border-white/5 text-muted hover:text-text'}
               `}
             >
               {cat.name === 'All' ? <cat.icon className="w-3 h-3" /> : (
                 <span className="text-sm leading-none">
                    {cat.name === 'Fuel' ? '⛽' : cat.name === 'Maintenance' ? '🔧' : cat.name === 'Insurance' ? '🛡️' : '🛣️'}
                 </span>
               )}
               {cat.name}
             </button>
           ))}
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="space-y-10">
         {Object.entries(grouped).map(([date, items]) => (
           <div key={date} className="space-y-4">
              <h4 className="text-[10px] text-muted font-mono font-black uppercase tracking-[0.2em] px-1 opacity-60 italic">{date}</h4>
              <div className="space-y-3">
                 {items.map((item, i) => (
                   <motion.div
                     key={item.id}
                     whileHover={{ x: 4 }}
                     className={cn(
                       "glass p-5 rounded-[40px] border border-white/5 flex items-center justify-between card-hover group cursor-pointer active:scale-[0.99] transition-all relative overflow-hidden",
                       selectedIds.includes(item.id) && "ring-2 ring-accent/50 bg-accent/10"
                     )}
                   >
                      <div className="flex items-center gap-5 relative z-10">
                         {/* Selection Logic */}
                         <div 
                           onClick={(e) => toggleSelect(e, item.id)}
                           className={cn(
                             "w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all shrink-0",
                             selectedIds.includes(item.id) ? "bg-accent border-accent text-white scale-110" : "border-white/10 group-hover:border-white/20"
                           )}
                         >
                           {selectedIds.includes(item.id) && <Plus className="w-4 h-4 rotate-45" />}
                         </div>

                         <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/5 relative shrink-0", item.color)}>
                            {item.icon}
                            {item.tag === 'Business' && (
                               <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent2 flex items-center justify-center text-[10px] text-white shadow-lg border-2 border-bg">
                                  <Tag className="w-2.5 h-2.5" />
                               </div>
                            )}
                         </div>
                         
                         <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                               <h5 className="font-display font-black text-sm tracking-tightest group-hover:text-accent transition-colors">{item.merchant}</h5>
                               {item.tag === 'Business' && (
                                 <span className="text-[8px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded bg-accent2/20 text-accent2 border border-accent2/20 italic">
                                    BIZ
                                 </span>
                               )}
                            </div>
                            <div className="flex items-center gap-2">
                               <p className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60 leading-none">{item.detail}</p>
                               {item.receipt && (
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); setPreviewReceipt(item.receipt)}}
                                   className="p-1 hover:bg-white/10 rounded-md transition-all text-muted hover:text-accent"
                                 >
                                    <Receipt className="w-3.5 h-3.5" />
                                 </button>
                               )}
                            </div>
                         </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1.5 relative z-10">
                        <span className="font-display font-black text-lg tracking-tightest group-hover:scale-110 transition-transform origin-right">
                           {formatAmount(item.amount)}
                        </span>
                        {item.vat > 0 && (
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                             <span className="text-[8px] text-muted font-mono font-black uppercase tracking-widest">VAT 5%</span>
                             <span className="text-[9px] text-accent font-mono font-black uppercase tracking-widest">{formatAmount(item.vat)}</span>
                          </div>
                        )}
                      </div>

                      {/* Hover Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                   </motion.div>
                 ))}
              </div>
           </div>
         ))}
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 left-4 right-4 z-[70] glass px-8 py-5 rounded-[40px] border border-accent/40 shadow-[0_32px_128px_rgba(108,99,255,0.4)] flex items-center justify-between"
          >
             <div className="flex flex-col gap-0.5">
                <span className="text-xl font-display font-black tracking-tightest text-text leading-none italic">{selectedIds.length} Fleet Items</span>
                <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest">Operations Pending Authorization</span>
             </div>
             <div className="flex gap-4">
                <button className="px-6 py-3 rounded-2xl glass border border-white/10 text-[10px] font-mono font-black uppercase tracking-widest text-text hover:bg-white/10 active:scale-95 transition-all font-black">
                   Bulk Audit
                </button>
                <button className="px-6 py-3 rounded-2xl bg-accent text-white text-[10px] font-mono font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-accent/30 font-black">
                   Set BIZ Tag
                </button>
                <button 
                  onClick={() => setSelectedIds([])}
                  className="w-12 h-12 rounded-2xl glass border border-accent4/30 text-accent4 flex items-center justify-center hover:bg-accent4/10 transition-colors"
                >
                   <XCircle className="w-6 h-6" />
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {previewReceipt && (
          <div 
            className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl"
            onClick={() => setPreviewReceipt(null)}
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative max-w-sm w-full glass rounded-[48px] border border-white/10 overflow-hidden shadow-[0_64px_256px_rgba(0,0,0,0.8)]"
               onClick={e => e.stopPropagation()}
             >
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.03]">
                   <div>
                      <p className="font-display font-black text-[10px] uppercase tracking-widest text-accent mb-1">Audit Ready</p>
                      <h4 className="font-display font-black text-lg uppercase tracking-tightest">Receipt Proof</h4>
                   </div>
                   <button onClick={() => setPreviewReceipt(null)} className="p-3 hover:bg-white/10 rounded-full transition-all">
                      <XCircle className="w-6 h-6 text-muted" />
                   </button>
                </div>
                <div className="p-6">
                   <div className="aspect-[3/4] rounded-[40px] border border-white/10 overflow-hidden shadow-inner group overflow-hidden">
                      <img src={previewReceipt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Receipt Preview" />
                   </div>
                </div>
                <div className="p-8 pt-2 flex gap-3">
                   <button className="flex-1 py-5 rounded-[28px] bg-accent text-white font-display font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-accent/30 hover:scale-105 active:scale-95 transition-all">Download PDF</button>
                   <button className="px-8 py-5 rounded-[28px] glass border border-white/10 text-text font-display font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all">Audit</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Expenses
