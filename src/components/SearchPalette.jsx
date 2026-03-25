import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Receipt, Car, PenTool, FileText, ChevronRight, CornerDownLeft, Command, Globe, Clock, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const mockData = [
  { id: 'e1', type: 'Expense', title: 'ADNOC Fuel - Al Quoz', detail: 'AED 180 • Fuel', path: '/expenses', icon: Receipt, color: 'text-accent2' },
  { id: 'v1', type: 'Vehicle', title: 'Tesla Model 3', detail: 'DXB-L-12345 • Active', path: '/vehicles', icon: Car, color: 'text-accent' },
  { id: 's1', type: 'Service', title: 'Engine Oil Change', detail: 'Interval: 5,000 km', path: '/maintenance', icon: PenTool, color: 'text-accent3' },
  { id: 'i1', type: 'Invoice', title: 'Michelin Tyre Receipt', detail: 'AED 2,400 • Feb 20, 2026', path: '/expenses', icon: FileText, color: 'text-white' },
  { id: 'e2', type: 'Expense', title: 'Salik Re-charge', detail: 'AED 100 • Tolls', path: '/tolls', icon: Receipt, color: 'text-accent2' },
  { id: 'v2', type: 'Vehicle', title: 'Land Cruiser 300', detail: 'SHJ-E-9999 • Standby', path: '/vehicles', icon: Car, color: 'text-accent' },
]

const SearchPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const filteredResults = query.trim() === '' 
    ? mockData.slice(0, 4) 
    : mockData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.type.toLowerCase().includes(query.toLowerCase()) ||
        item.detail.toLowerCase().includes(query.toLowerCase())
      )

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredResults.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const selected = filteredResults[selectedIndex]
        if (selected) {
          handleSelect(selected.path)
        }
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredResults, selectedIndex])

  const handleSelect = (path) => {
    onClose()
    navigate(path)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-xl glass border border-white/10 rounded-[32px] shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-4 p-6 border-b border-white/5 bg-white/[0.02]">
               <Search className="w-6 h-6 text-accent" />
               <input 
                 ref={inputRef}
                 value={query}
                 onChange={(e) => {
                   setQuery(e.target.value)
                   setSelectedIndex(0)
                 }}
                 placeholder="Search expenses, vehicles, services..."
                 className="flex-1 bg-transparent border-none outline-none font-display font-medium text-lg text-text placeholder:text-muted"
               />
               <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-[10px] font-mono font-black text-muted uppercase">Esc</span>
               </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-3 no-scrollbar">
               {filteredResults.length === 0 ? (
                 <div className="py-12 flex flex-col items-center justify-center text-muted gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5">
                       <Search className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="font-display font-black text-sm uppercase tracking-widest leading-none">Intelligence Exhausted</p>
                    <p className="text-[10px] font-mono italic opacity-50 underline decoration-accent/20">No matching tokens found in current workspace.</p>
                 </div>
               ) : (
                 <div className="space-y-1">
                   <div className="px-3 mb-2">
                     <span className="text-[9px] font-mono font-black text-muted uppercase tracking-[0.2em]">{query ? 'Search Results' : 'Recent Actions'}</span>
                   </div>
                   {filteredResults.map((item, index) => (
                     <button
                       key={item.id}
                       onClick={() => handleSelect(item.path)}
                       onMouseEnter={() => setSelectedIndex(index)}
                       className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group
                         ${selectedIndex === index ? 'bg-accent shadow-[0_8px_32px_rgba(108,99,255,0.4)] text-white' : 'hover:bg-white/[0.05] text-muted hover:text-text'}
                       `}
                     >
                        <div className="flex items-center gap-4 font-body">
                           <div className={`p-2 rounded-xl transition-colors ${selectedIndex === index ? 'bg-white/20' : 'bg-surface2 border border-white/5'}`}>
                              <item.icon className={`w-5 h-5 ${selectedIndex === index ? 'text-white' : item.color}`} />
                           </div>
                           <div className="text-left space-y-0.5">
                              <p className={`font-display font-black text-sm ${selectedIndex === index ? 'text-white' : 'text-text'}`}>{item.title}</p>
                              <div className="flex items-center gap-2">
                                 <span className={`text-[9px] font-mono uppercase tracking-widest font-black ${selectedIndex === index ? 'text-white/80' : 'text-accent'}`}>{item.type}</span>
                                 <span className="opacity-20">•</span>
                                 <span className={`text-[10px] font-mono ${selectedIndex === index ? 'text-white/60' : 'text-muted'}`}>{item.detail}</span>
                              </div>
                           </div>
                        </div>
                        {selectedIndex === index && (
                           <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                              <CornerDownLeft className="w-4 h-4 opacity-60" />
                           </motion.div>
                        )}
                        {selectedIndex !== index && (
                           <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        )}
                     </button>
                   ))}
                 </div>
               )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/20">
               <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                     <div className="w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-muted">↑</div>
                     <div className="w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-muted">↓</div>
                     <span className="text-[10px] font-mono text-muted uppercase font-black">Navigate</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <div className="w-7 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-muted">↵</div>
                     <span className="text-[10px] font-mono text-muted uppercase font-black">Select</span>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <Globe className="w-3 h-3 text-accent" />
                  <span className="text-[9px] font-mono text-muted font-black opacity-40 uppercase tracking-widest">Global Intelligence v4.2</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default SearchPalette
