import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Fuel, PenTool, Shield, Compass, Wallet, Plus, Filter, MapPin, Receipt, XCircle } from 'lucide-react'

const initialExpenses = [
  { id: 1, date: 'Today', category: 'Fuel', merchant: 'ADNOC Station #192', detail: 'Super 98 (42L)', amount: 'AED 140', time: '10:45 AM', status: 'verified' },
  { id: 2, date: 'Today', category: 'Toll', merchant: 'Salik (Darb)', detail: 'Al Garhoud Gate', amount: 'AED 4', time: '08:22 AM', status: 'verified' },
  { id: 3, date: 'Yesterday', category: 'Maintenance', merchant: 'Grand Service Station', detail: 'Full Body Wash', amount: 'AED 65', time: '04:15 PM', status: 'verified' },
  { id: 4, date: 'Mar 18', category: 'Fine', merchant: 'RTA Dubai', detail: 'Parking Violation', amount: 'AED 200', time: '11:30 AM', status: 'verified' },
  { id: 5, date: 'Mar 15', category: 'Insurance', merchant: 'Oman Insurance', detail: 'Annual Coverage', amount: 'AED 3,240', time: '09:00 AM', status: 'pending' },
]

const categories = [
  { name: 'All', icon: Filter },
  { name: 'Fuel', icon: Fuel },
  { name: 'Service', icon: PenTool },
  { name: 'Toll', icon: Compass },
  { name: 'Fine', icon: XCircle },
  { name: 'Insure', icon: Shield },
]

const Expenses = () => {
  const [activeTab, setActiveTab] = useState('All')

  const filteredExpenses = activeTab === 'All' 
    ? initialExpenses 
    : initialExpenses.filter(e => e.category === activeTab || (activeTab === 'Service' && e.category === 'Maintenance') || (activeTab === 'Toll' && e.category === 'Toll') || (activeTab === 'Insure' && e.category === 'Insurance'))

  // Group by date
  const grouped = filteredExpenses.reduce((acc, curr) => {
    if (!acc[curr.date]) acc[curr.date] = []
    acc[curr.date].push(curr)
    return acc
  }, {})

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Fuel': return <Fuel className="w-5 h-5 text-accent2" />
      case 'Maintenance': return <PenTool className="w-5 h-5 text-accent" />
      case 'Toll': return <Compass className="w-5 h-5 text-blue-400" />
      case 'Fine': return <XCircle className="w-5 h-5 text-accent4" />
      case 'Insurance': return <Shield className="w-5 h-5 text-accent3" />
      default: return <Wallet className="w-5 h-5 text-muted" />
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Summary */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-muted font-mono text-[11px] uppercase tracking-widest">March 2026</span>
            <h2 className="text-3xl font-display font-extrabold tracking-tightest">Total: <span className="gradient-text">AED 4,820</span></h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface2 border border-white/5 flex items-center justify-center font-display font-black text-xs text-muted">
            {filteredExpenses.length}
          </div>
        </div>

        {/* Filter Scroll Container */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveTab(cat.name)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-sm transition-all whitespace-nowrap border
                ${activeTab === cat.name 
                  ? 'bg-accent text-white border-accent shadow-[0_4px_12px_rgba(108,99,255,0.4)]' 
                  : 'bg-surface2 border-white/5 text-muted hover:text-text hover:bg-surface3'}
              `}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-8 pb-12">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20 bg-surface2 rounded-3xl border border-dashed border-white/10">
            <div className="w-16 h-16 rounded-full bg-surface3 flex items-center justify-center mx-auto mb-4 border border-white/5">
              <Receipt className="w-8 h-8 text-muted/30" />
            </div>
            <p className="text-muted font-mono text-xs uppercase tracking-widest">No transactions found</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, items]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-mono text-muted uppercase tracking-[0.2em] whitespace-nowrap">{date}</span>
                <div className="h-px bg-white/5 flex-1" />
              </div>
              <div className="grid gap-3">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layoutId={`tx-${item.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between card-hover group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface2 flex items-center justify-center border border-white/5 transition-colors group-hover:bg-surface3">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-extrabold text-sm tracking-tightest group-hover:text-accent transition-colors">{item.merchant}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-muted font-mono uppercase tracking-widest">
                          <span className="opacity-60">{item.time}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-accent2/60">{item.detail}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-display font-black text-base tracking-tighter text-accent4">{item.amount}</span>
                      {item.status === 'pending' && (
                        <div className="px-2 py-0.5 rounded-full bg-accent3/10 border border-accent3/20 text-accent3 text-[9px] font-mono uppercase tracking-widest">
                          Processing
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button (already handled in Layout, but we could add a screen-local one if needed) */}
      <div className="h-4" />
    </div>
  )
}

export default Expenses
