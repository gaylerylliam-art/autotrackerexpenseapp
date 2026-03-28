import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Download, X, FileSpreadsheet, 
  Printer, Share2, Mail, CheckCircle2, 
  ShieldCheck, AlertCircle, Globe, Briefcase,
  ChevronRight, ArrowRight, Shield
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Logo from './Logo'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const ExportModal = ({ isOpen, onClose, data }) => {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState(null) // pdf, excel, email
  const [showEmailInput, setShowEmailInput] = useState(false)
  const [accountantEmail, setAccountantEmail] = useState('')
  const [isSent, setIsSent] = useState(false)

  if (!isOpen) return null

  const handleExcelExport = () => {
    setIsExporting(true)
    setExportType('excel')
    
    // Simulate CSV generation
    const csvContent = [
      ["AutoTracker Tax Report", "Date: " + new Date().toLocaleDateString()],
      ["Vehicle", "Business KM", "Personal KM", "Tax Mode", "Reimbursement"],
      ["BMW X5", "6062", "2358", "UAE Reimbursement", "AED 4,243"],
      ["Toyota LC", "2400", "850", "UAE Reimbursement", "AED 1,680"],
      ["", "", "", "Total Reimbursement", "AED 5,923"],
    ].map(e => e.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `AutoTracker_Tax_Report_${new Date().getFullYear()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    
    setTimeout(() => {
      link.click()
      document.body.removeChild(link)
      setIsExporting(false)
      setExportType(null)
    }, 1500)
  }

  const handleSendEmail = (e) => {
    e.preventDefault()
    if (!accountantEmail) return
    
    setIsExporting(true)
    setExportType('email')
    
    setTimeout(() => {
      setIsExporting(false)
      setIsSent(true)
      setTimeout(() => {
        setIsSent(false)
        setShowEmailInput(false)
        setExportType(null)
        onClose()
      }, 2000)
    }, 2000)
  }

  const handlePDFPrint = () => {
     window.print()
     onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />
        
        <motion.div
           layout
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: 20 }}
           className="relative w-full max-w-lg glass rounded-[40px] border border-white/5 bg-surface p-8 space-y-8 overflow-hidden"
        >
           {/* Header */}
           <div className="flex justify-between items-start">
              <div className="space-y-1">
                 <h3 className="text-2xl font-display font-black tracking-tighter">Export Report</h3>
                 <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] font-black opacity-60">Compliance & Financial Ready</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-muted hover:text-text transition-all"
              >
                 <X className="w-5 h-5" />
              </button>
           </div>

           {/* Export Options */}
           <div className="grid grid-cols-1 gap-4">
              <AnimatePresence mode="wait">
                 {!showEmailInput ? (
                    <motion.div
                       key="options"
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: 20 }}
                       className="space-y-4"
                    >
                       {/* PDF Option */}
                       <button
                         onClick={handlePDFPrint}
                         className="w-full glass p-6 rounded-[32px] border border-accent/20 bg-accent/5 flex items-center justify-between group text-left hover:bg-accent/10 transition-all border-dashed"
                       >
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-[24px] bg-accent/20 flex items-center justify-center text-accent">
                                <FileText className="w-8 h-8" />
                             </div>
                             <div className="space-y-1">
                                <h4 className="font-display font-black text-lg text-text">PDF Report</h4>
                                <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-black opacity-60 italic">Tax-Ready Format · UAE FTA</p>
                             </div>
                          </div>
                          <Printer className="w-5 h-5 text-muted group-hover:text-accent transition-all" />
                       </button>

                       {/* Excel Option */}
                       <button
                         onClick={handleExcelExport}
                         disabled={isExporting}
                         className="w-full glass p-6 rounded-[32px] border border-white/10 flex items-center justify-between group text-left hover:bg-white/5 transition-all border-dashed"
                       >
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-muted group-hover:text-accent transition-all">
                                <FileSpreadsheet className="w-8 h-8" />
                             </div>
                             <div className="space-y-1">
                                <h4 className="font-display font-black text-lg text-text">Excel / CSV</h4>
                                <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-black opacity-60 italic">Raw Data · Accountant preferred</p>
                             </div>
                          </div>
                          {isExporting && exportType === 'excel' ? (
                             <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                          ) : (
                             <Download className="w-5 h-5 text-muted group-hover:text-text transition-all" />
                          )}
                       </button>

                       {/* Send to Accountant Option */}
                       <button
                         onClick={() => setShowEmailInput(true)}
                         className="w-full glass p-6 rounded-[32px] border border-accent2/20 bg-accent2/5 flex items-center justify-between group text-left hover:bg-accent2/10 transition-all border-dashed"
                       >
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-[24px] bg-accent2/20 flex items-center justify-center text-accent2">
                                <Mail className="w-8 h-8" />
                             </div>
                             <div className="space-y-1">
                                <h4 className="font-display font-black text-lg text-text">Send to Accountant</h4>
                                <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-black opacity-60 italic">Direct Delivery · Professional</p>
                             </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted group-hover:text-accent2 transition-all" />
                       </button>
                    </motion.div>
                 ) : (
                    <motion.form
                       key="email-form"
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       exit={{ opacity: 0, x: -20 }}
                       onSubmit={handleSendEmail}
                       className="glass p-8 rounded-[32px] border border-accent2/20 bg-accent2/5 space-y-6"
                    >
                       <div className="flex items-center gap-4">
                          <button 
                             type="button"
                             onClick={() => setShowEmailInput(false)}
                             className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-text transition-all"
                          >
                             <X className="w-4 h-4" />
                          </button>
                          <h4 className="font-display font-black text-lg text-text text-center flex-1 pr-8">Accountant Details</h4>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[8px] text-muted font-mono uppercase tracking-widest font-black opacity-60 px-1">Email Address</label>
                          <input 
                             required
                             type="email"
                             placeholder="accountant@firm.com"
                             value={accountantEmail}
                             onChange={(e) => setAccountantEmail(e.target.value)}
                             className="w-full bg-surface border border-white/10 rounded-xl px-5 py-4 text-xs font-display font-black text-text placeholder:text-white/20 focus:border-accent2 outline-none transition-all shadow-inner"
                          />
                       </div>

                       <button
                          disabled={isExporting}
                          className="w-full py-4 rounded-xl bg-accent2 text-white font-display font-black text-sm uppercase tracking-widest shadow-xl shadow-accent2/20 flex items-center justify-center gap-3 relative overflow-hidden group active:scale-95 transition-all disabled:opacity-50"
                       >
                          {isExporting ? (
                             <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Generating & Sending...</span>
                             </>
                          ) : isSent ? (
                             <>
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Report Sent!</span>
                             </>
                          ) : (
                             <>
                                <span>Confirm & Send</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
                             </>
                          )}
                          {isSent && <motion.div layoutId="success" className="absolute inset-0 bg-green-500/10" />}
                       </button>

                       <p className="text-[8px] text-muted font-mono uppercase tracking-widest font-black opacity-40 text-center">
                          A high-resolution PDF and raw CSV will be delivered securely to your accountant.
                       </p>
                    </motion.form>
                 )}
              </AnimatePresence>
           </div>

           {/* Preview Card */}
           <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-[9px] text-muted font-mono uppercase tracking-widest font-black">Report Summary</span>
                 <ShieldCheck className="w-4 h-4 text-accent" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <p className="text-[8px] text-muted font-mono uppercase tracking-widest font-black opacity-40">Period</p>
                    <p className="text-xs font-display font-black text-text">Q1 2026</p>
                 </div>
                 <div className="space-y-1 text-right">
                    <p className="text-[8px] text-muted font-mono uppercase tracking-widest font-black opacity-40">Total Distance</p>
                    <p className="text-xs font-display font-black text-text">8,420 km</p>
                 </div>
              </div>
           </div>

           {/* Footer Action */}
           <div className="flex justify-center flex-col items-center gap-4">
              <p className="text-[9px] text-muted font-mono uppercase tracking-widest font-black opacity-30 text-center max-w-[280px]">
                 All exports are localized for your region (UAE/International) and include mileage classification flags.
              </p>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ExportModal
