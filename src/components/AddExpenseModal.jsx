import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ChevronDown, AlertCircle, Tag, Camera } from 'lucide-react'
import { EXPENSE_CATEGORIES, CATEGORY_KEYS } from '../constants/expenseCategories'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const VEHICLES = ['BMW X5 — P 12345', 'Toyota Land Cruiser — K 67890']

const validate = (form) => {
  const errors = {}
  if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
    errors.amount = 'Enter a valid amount greater than 0'
  if (!form.category) errors.category = 'Select a category'
  
  // Mandatory subcategory for Fire & Safety (...) category
  if (form.category === CATEGORY_KEYS.FIRE_SAFETY_IT && !form.subcategory) {
    errors.subcategory = 'Subcategory selection is mandatory'
  }

  if (!form.merchant.trim()) errors.merchant = 'Enter a merchant name'
  if (!form.vehicle) errors.vehicle = 'Select a vehicle'
  return errors
}

const AddExpenseModal = ({ isOpen, onClose, onSave }) => {
  const emptyForm = {
    merchant: '',
    amount: '',
    category: '',
    subcategory: '',
    tag: 'Business',
    vehicle: VEHICLES[0],
    notes: '',
    includeVat: true,
  }

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [showCatPicker, setShowCatPicker] = useState(false)
  const [showSubPicker, setShowSubPicker] = useState(false)
  const [saved, setSaved] = useState(false)

  const selectedCat = EXPENSE_CATEGORIES.find(c => c.key === form.category)
  const vatAmount = selectedCat?.vatApplicable && form.includeVat && form.amount
    ? (Number(form.amount) * 0.05).toFixed(2)
    : 0

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }))
  }

  const handleCategorySelect = (key) => {
    set('category', key)
    set('subcategory', '')
    setShowCatPicker(false)
  }

  const handleSubmit = () => {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    const expense = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0], // Use YYYY-MM-DD
      category: form.category,
      subcategory: form.subcategory,
      vehicleId: form.vehicle.split(' — ')[1] || form.vehicle, // Extract plate if possible
      merchant: form.merchant,
      vendor: form.merchant,
      detail: [form.subcategory, form.notes].filter(Boolean).join(' · ') || selectedCat?.label || '',
      description: form.notes,
      amount: Number(form.amount),
      vat: Number(vatAmount),
      currency: 'AED',
      tag: form.tag,
      receipt: null,
      color: selectedCat?.color || 'bg-white/10 text-white',
      icon: selectedCat?.icon || '📦',
      syncStatus: 'success',
    }

    onSave?.(expense)
    setSaved(true)
    setTimeout(() => { setSaved(false); setForm(emptyForm); onClose() }, 1000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-bg/90 backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            className="relative w-full max-w-lg mx-4 glass rounded-[40px] border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="space-y-0.5">
                <h3 className="font-display font-black text-xl tracking-tightest">Add Expense</h3>
                <p className="text-[9px] text-muted font-mono font-black uppercase tracking-widest">All categories · VAT auto-calc</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-muted hover:text-text active:scale-95 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">

              {/* Vehicle */}
              <div className="space-y-2">
                <label className="text-[9px] text-muted font-mono font-black uppercase tracking-widest">Vehicle</label>
                <select
                  value={form.vehicle}
                  onChange={e => set('vehicle', e.target.value)}
                  className="w-full bg-surface2 border border-white/10 rounded-2xl px-4 py-3 text-sm font-display font-black text-text appearance-none cursor-pointer focus:outline-none focus:border-accent/50 transition-colors"
                >
                  {VEHICLES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>

              {/* Category Picker */}
              <div className="space-y-2">
                <label className="text-[9px] text-muted font-mono font-black uppercase tracking-widest">Category *</label>
                <button
                  onClick={() => setShowCatPicker(!showCatPicker)}
                  className={cn(
                    "w-full bg-surface2 border rounded-2xl px-4 py-3 flex items-center justify-between transition-colors",
                    errors.category ? "border-red-500/50" : "border-white/10 focus:border-accent/50",
                  )}
                >
                  {selectedCat ? (
                    <span className="flex items-center gap-3">
                      <span className="text-xl leading-none">{selectedCat.icon}</span>
                      <span className="font-display font-black text-sm text-text">{selectedCat.label}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted font-mono uppercase tracking-widest">Select category…</span>
                  )}
                  <ChevronDown className="w-4 h-4 text-muted" />
                </button>
                {errors.category && <p className="text-[9px] text-red-400 font-mono uppercase tracking-widest flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{errors.category}</p>}

                <AnimatePresence>
                  {showCatPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-surface2/95 border border-white/10 rounded-3xl p-3 grid grid-cols-2 gap-2 shadow-2xl backdrop-blur-xl"
                    >
                      {EXPENSE_CATEGORIES.map(cat => (
                        <button
                          key={cat.key}
                          onClick={() => handleCategorySelect(cat.key)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-2xl border transition-all text-left",
                            form.category === cat.key
                              ? "border-accent/40 bg-accent/10 text-accent"
                              : "border-white/5 hover:bg-white/5 hover:border-white/10 text-muted hover:text-text"
                          )}
                        >
                          <span className="text-xl leading-none shrink-0">{cat.icon}</span>
                          <div className="min-w-0">
                            <span className="text-[10px] font-display font-black tracking-tightest block truncate">{cat.label}</span>
                            {cat.isNew && <span className="text-[7px] font-mono font-black uppercase tracking-widest text-orange-400 bg-orange-400/10 px-1.5 py-0.5 rounded mt-0.5 inline-block">New</span>}
                          </div>
                          {form.category === cat.key && <Check className="w-3 h-3 shrink-0 ml-auto" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Subcategory */}
              {selectedCat && selectedCat.subcategories.length > 1 && (
                <div className="space-y-2">
                  <label className="text-[9px] text-muted font-mono font-black uppercase tracking-widest">Subcategory</label>
                  <select
                    value={form.subcategory}
                    onChange={e => set('subcategory', e.target.value)}
                    className="w-full bg-surface2 border border-white/10 rounded-2xl px-4 py-3 text-sm font-display font-black text-text appearance-none cursor-pointer focus:outline-none focus:border-accent/50 transition-colors"
                  >
                    <option value="">Select subcategory…</option>
                    {selectedCat.subcategories.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.subcategory && (
                    <p className="text-[9px] text-red-400 font-mono uppercase tracking-widest flex items-center gap-1 mt-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {errors.subcategory}
                    </p>
                  )}
                </div>
              )}

              {/* Merchant */}
              <div className="space-y-2">
                <label className="text-[9px] text-muted font-mono font-black uppercase tracking-widest">Merchant / Description *</label>
                <input
                  type="text"
                  value={form.merchant}
                  onChange={e => set('merchant', e.target.value)}
                  placeholder="e.g. Al Futtaim CCTV, Galadari FireSafe…"
                  className={cn(
                    "w-full bg-surface2 border rounded-2xl px-4 py-3 text-sm font-display font-black text-text placeholder:text-muted/40 focus:outline-none transition-colors",
                    errors.merchant ? "border-red-500/50" : "border-white/10 focus:border-accent/50"
                  )}
                />
                {errors.merchant && <p className="text-[9px] text-red-400 font-mono uppercase tracking-widest flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{errors.merchant}</p>}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-[9px] text-muted font-mono font-black uppercase tracking-widest">Amount (AED) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-black text-muted text-sm">AED</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={form.amount}
                    onChange={e => set('amount', e.target.value)}
                    placeholder="0.00"
                    className={cn(
                      "w-full bg-surface2 border rounded-2xl pl-16 pr-4 py-3 text-sm font-display font-black text-text placeholder:text-muted/40 focus:outline-none transition-colors",
                      errors.amount ? "border-red-500/50" : "border-white/10 focus:border-accent/50"
                    )}
                  />
                </div>
                {errors.amount && <p className="text-[9px] text-red-400 font-mono uppercase tracking-widest flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />{errors.amount}</p>}

                {/* VAT Preview */}
                {selectedCat?.vatApplicable && Number(form.amount) > 0 && (
                  <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-accent2/5 border border-accent2/20">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest">VAT 5%</span>
                      <button
                        onClick={() => set('includeVat', !form.includeVat)}
                        className={cn("w-8 h-4 rounded-full p-0.5 transition-all", form.includeVat ? "bg-accent2" : "bg-surface3")}
                      >
                        <motion.div animate={{ x: form.includeVat ? 16 : 0 }} className="w-3 h-3 rounded-full bg-white" />
                      </button>
                    </div>
                    <span className="text-[10px] font-mono font-black text-accent2">+ AED {vatAmount}</span>
                  </div>
                )}
              </div>

              {/* Business Tag */}
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl glass border border-white/5">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-accent2" />
                  <div>
                    <p className="text-[11px] font-display font-black text-text">Business Expense</p>
                    <p className="text-[9px] text-muted font-mono uppercase tracking-widest">Tag for VAT reclaim</p>
                  </div>
                </div>
                <button
                  onClick={() => set('tag', form.tag === 'Business' ? 'Personal' : 'Business')}
                  className={cn("w-12 h-6 rounded-full p-1 transition-all", form.tag === 'Business' ? "bg-accent2" : "bg-surface3")}
                >
                  <motion.div animate={{ x: form.tag === 'Business' ? 24 : 0 }} className="w-4 h-4 rounded-full bg-white shadow" />
                </button>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-[9px] text-muted font-mono font-black uppercase tracking-widest">Notes (Optional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  rows={2}
                  placeholder="Installation reference, serial number, job order…"
                  className="w-full bg-surface2 border border-white/10 rounded-2xl px-4 py-3 text-sm font-display text-text placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button onClick={onClose} className="flex-1 py-4 rounded-2xl glass border border-white/10 text-[11px] font-mono font-black uppercase tracking-widest text-muted hover:text-text transition-colors active:scale-95">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={cn(
                  "flex-1 py-4 rounded-2xl text-[11px] font-mono font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2",
                  saved
                    ? "bg-accent2 text-white shadow-xl shadow-accent2/30"
                    : "bg-accent text-white shadow-xl shadow-accent/30 hover:brightness-110"
                )}
              >
                {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Expense'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddExpenseModal
