import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, FileText, Upload, Download, Trash2, Search, 
  Filter, Car, Calendar, AlertCircle, CheckCircle2, 
  ExternalLink, Eye, MoreVertical, Plus, Loader2,
  Terminal, Radio, Activity, Shield, Info, Lock, Navigation
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { supabase } from '../utils/supabase'
import { useOrganization } from '../context/OrganizationContext'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const CATEGORIES = [
  { id: 'All', label: 'All Documents' },
  { id: 'Registration', label: 'Registration' },
  { id: 'Insurance', label: 'Insurance' },
  { id: 'Maintenance', label: 'Service Logs' },
  { id: 'Contracts', label: 'Contracts' },
]

const DocumentCard = ({ doc, onDelete }) => {
  const isExpired = doc.expiry_date && new Date(doc.expiry_date) < new Date()
  const isExpiringSoon = doc.expiry_date && !isExpired && (new Date(doc.expiry_date) - new Date()) < (30 * 24 * 60 * 60 * 1000)

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="saas-card group p-6 hover:translate-y-[-2px] transition-all cursor-pointer"
    >
      <div className="flex flex-col h-full space-y-6">
         <div className="flex justify-between items-start">
            <div className="flex gap-4">
               <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-blue-50 transition-colors">
                  <FileText className="w-6 h-6" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">{doc.name}</h3>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{doc.category}</span>
                     <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{doc.vehicles?.name || 'General'}</span>
                  </div>
               </div>
            </div>
            <div className={cn(
               "px-3 h-6 rounded-full flex items-center gap-1.5 border text-[10px] font-bold",
               isExpired ? "bg-red-50 text-red-600 border-red-100" : isExpiringSoon ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
            )}>
               <div className={cn("w-1.5 h-1.5 rounded-full", isExpired ? "bg-red-500" : isExpiringSoon ? "bg-amber-500" : "bg-emerald-500")} />
               {isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : 'Active'}
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100/60 font-body">
            <div className="space-y-1">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expiry Date</span>
               <p className="text-sm font-bold text-slate-900">
                  {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : 'No expiry'}
               </p>
            </div>
            <div className="space-y-1 text-right">
               <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Security</span>
               <p className="text-sm font-bold text-slate-900 flex items-center justify-end gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Encrypted
               </p>
            </div>
         </div>

         <div className="flex items-center justify-between pt-2">
            <button className="flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-primary transition-colors italic">
               <Eye className="w-4 h-4" />
               Preview
            </button>
            <div className="flex items-center gap-2">
               <button className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white transition-all shadow-sm">
                  <Download className="w-4 h-4" />
               </button>
               <button onClick={() => onDelete(doc.id)} className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-sm">
                  <Trash2 className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>
    </motion.div>
  )
}

const Vault = () => {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const { currentOrg } = useOrganization()

  useEffect(() => {
    fetchDocs()
    
    const channel = supabase.channel('vault-sync')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'documents',
        filter: currentOrg ? `organization_id=eq.${currentOrg.id}` : undefined
      }, () => fetchDocs(false))
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [currentOrg])

  const fetchDocs = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      let query = supabase
        .from('documents')
        .select('*, vehicles(name)')
        .order('created_at', { ascending: false })
      
      if (currentOrg) {
        query = query.eq('organization_id', currentOrg.id)
      }

      const { data, error } = await query
      
      if (error) throw error
      setDocs(data || [])
    } catch (err) {
      console.error('Vault sync failed:', err)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    try {
       const { error } = await supabase.from('documents').delete().eq('id', id)
       if (error) throw error
       fetchDocs(false)
    } catch (err) {
       console.error('Failed to delete:', err.message)
    }
  }

  const filteredDocs = docs.filter(doc => (
    (activeTab === 'All' || doc.category === activeTab) &&
    (doc.name.toLowerCase().includes(search.toLowerCase()) || doc.category.toLowerCase().includes(search.toLowerCase()))
  ))

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
         <div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Document Vault</h1>
            <div className="flex items-center gap-3 mt-1">
               <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <p className="text-xs text-slate-500 font-medium">Securely stored and encrypted</p>
               </div>
               <span className="w-1 h-1 rounded-full bg-slate-300" />
               <p className="text-xs text-slate-500 font-medium">{docs.length} documents</p>
            </div>
         </div>
         
         <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group w-full sm:w-72">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
               <input 
                 placeholder="Search documents..." 
                 className="w-full h-11 bg-white border border-slate-200 rounded-xl pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                 value={search}
                 onChange={e => setSearch(e.target.value)}
               />
            </div>
            <button 
               className="h-11 px-6 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
            >
               <Upload className="w-4 h-4" /> 
               Upload Document
            </button>
         </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar scrollbar-hide">
         {CATEGORIES.map((cat) => (
         <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={cn(
               "px-6 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap",
               activeTab === cat.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
            )}
         >
            {cat.label}
         </button>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {loading ? (
            <div className="col-span-full h-80 flex flex-col items-center justify-center gap-4">
               <Loader2 className="w-10 h-10 text-primary animate-spin" />
               <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Loading Vault...</p>
            </div>
         ) : (
            <>
               <AnimatePresence mode="popLayout">
                  {filteredDocs.map(doc => (
                    <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} />
                  ))}
               </AnimatePresence>
               {filteredDocs.length === 0 && (
                  <div className="col-span-full premium-card h-80 border-dashed border-2 flex flex-col items-center justify-center gap-6 opacity-60 hover:opacity-100 transition-all cursor-pointer border-slate-200 bg-slate-50/50 group">
                     <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:border-primary transition-all">
                        <Plus className="w-6 h-6 text-slate-400 group-hover:text-primary" />
                     </div>
                     <div className="space-y-1 text-center">
                        <p className="text-lg font-bold text-slate-600">No documents found</p>
                        <p className="text-xs text-slate-400 font-medium">Click to upload your first document</p>
                     </div>
                  </div>
               )}
            </>
         )}
      </div>

      <div className="flex items-center justify-center py-8 opacity-40 hover:opacity-100 transition-all">
         <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <Lock className="w-4 h-4 text-emerald-500" />
            256-bit Encrypted Storage · Monitoring {docs.length} assets
         </div>
      </div>
    </div>
  )
}

export default Vault;
