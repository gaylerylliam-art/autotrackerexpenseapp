import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, Wallet, Wrench, BarChart3, Car, Plus, 
  Settings, User, Bell, Search, ShieldCheck, 
  ChevronRight, LogOut, Menu, X, Landmark, 
  FileText, History, LayoutGrid, Zap, Navigation
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Logo from './Logo'
import AddExpenseModal from './AddExpenseModal'
import AddVehicleModal from './AddVehicleModal'
import NotificationDropdown from './NotificationDropdown'
import { useNotifications } from '../context/NotificationContext'
import { useOrganization } from '../context/OrganizationContext'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const Layout = () => {
  const location = useLocation()
  const { unreadCount } = useNotifications()
  const { organizations, currentOrg, selectOrg } = useOrganization()
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isOrgMenuOpen, setIsOrgMenuOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Movement', path: '/trips', icon: Navigation },
    { name: 'Ledger', path: '/expenses', icon: Wallet },
    { name: 'Assets', path: '/vehicles', icon: Car },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Vault', path: '/vault', icon: ShieldCheck },
  ]

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-bg-page flex flex-col lg:flex-row relative">
      
       {/* 1. Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-primary bg-gradient-to-br from-[#0A66C2] to-[#00C6FF] p-7 z-50 shadow-[10px_0_30px_rgba(10,102,194,0.15)] overflow-hidden">
         {/* Sidebar Glows */}
         <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-white/20 blur-[120px] rounded-full pointer-events-none" />
         <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
         
          <div className="mb-10 mt-2 relative z-10">
            <Link to="/">
               <Logo type="full" variant="light" />
            </Link>
          </div>

         {/* Organization Switcher */}
         <div className="mb-8 relative z-10 space-y-2">
            <span className="caption text-white/40 ml-1">Current Node</span>
            <button 
               onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
               className="w-full h-12 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3 transition-all text-white text-left group"
            >
               <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center text-accent font-bold text-[10px]">
                  {currentOrg?.name?.[0] || 'A'}
               </div>
               <div className="flex-1 overflow-hidden">
                  <p className="text-[12px] font-semibold truncate leading-none mb-0.5">{currentOrg?.name || 'Loading...'}</p>
                  <p className="text-[10px] text-white/40 font-medium truncate uppercase leading-none mb-0 opacity-80">{currentOrg?.role || 'Admin'}</p>
               </div>
               <ChevronRight className={cn("w-3.5 h-3.5 text-white/40 transition-transform", isOrgMenuOpen && "rotate-90")} />
            </button>
         </div>

         <nav className="flex-1 space-y-1 relative z-10">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 h-11 rounded-xl text-[13px] font-medium transition-all group",
                  isActive(item.path) 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("w-4.5 h-4.5", isActive(item.path) ? "text-primary stroke-[2]" : "text-white/40 group-hover:text-white")} />
                {item.name}
              </Link>
            ))}
         </nav>

         <div className="pt-6 border-t border-white/10 relative z-10">
            <Link to="/settings" className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group">
               <div className="w-9 h-9 rounded-full bg-white/10 overflow-hidden border border-white/20">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white leading-none mb-1 truncate">John Wick</p>
                  <p className="text-[10px] text-white/40 font-medium uppercase leading-none mb-0">Authorized</p>
               </div>
               <ChevronRight className="w-4 h-4 text-white/40" />
            </Link>
         </div>
       </aside>

       {/* 2. Main Content Area */}
       <div className="flex-1 flex flex-col min-h-screen">
         
         {/* Desktop Header */}
         <header className="hidden lg:flex h-20 items-center justify-between px-10 sticky top-0 bg-white border-b border-slate-100 z-40">
            <div>
               <h2 className="mb-0">Control Panel</h2>
               <p className="caption mb-0 normal-case tracking-normal">System operational · Node: Alpha-7</p>
            </div>

            <div className="flex items-center gap-6">
               <div className="relative group w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    placeholder="Search operations..." 
                    className="input-field pl-11 text-[13px] font-medium placeholder:font-normal" 
                  />
               </div>
               <div className="flex items-center gap-4 relative">
                  <button 
                   onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                   className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-all relative"
                  >
                     <Bell className="w-5 h-5" />
                     {unreadCount > 0 && (
                       <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-accent" />
                     )}
                  </button>
                  <NotificationDropdown 
                     isOpen={isNotificationOpen} 
                     onClose={() => setIsNotificationOpen(false)} 
                  />
                  <button 
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="btn-primary h-10 px-6 text-[13px]"
                  >
                     <Plus className="w-4 h-4" />
                     Add Ledger
                  </button>
               </div>
            </div>
         </header>

         {/* Mobile Header (SaaS Minimal) */}
         <header className="lg:hidden h-14 flex items-center justify-between px-5 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
            <div className="flex items-center gap-3">
               <Logo type="icon" variant="dark" className="w-10 h-10" />
               <div className="flex flex-col">
                  <span className="text-[17px] font-semibold text-text-primary leading-none">
                     {navItems.find(i => isActive(i.path))?.name || 'Dashboard'}
                  </span>
                  <span className="text-[10px] text-text-secondary font-medium mt-0.5">Alpha-7 Node</span>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <button className="w-9 h-9 flex items-center justify-center text-slate-400">
                  <Search className="w-5 h-5" />
               </button>
               <button onClick={() => setIsNotificationOpen(!isNotificationOpen)} className="w-9 h-9 flex items-center justify-center text-slate-400 relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent border-2 border-white" />}
               </button>
               <button onClick={() => setIsMobileMenuOpen(true)} className="w-9 h-9 flex items-center justify-center text-slate-600 ml-1">
                  <Menu className="w-6 h-6" />
               </button>
            </div>
         </header>

         {/* Viewport content */}
         <main className="flex-1 p-6 lg:p-12 pb-28 lg:pb-12 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
               <motion.div
                 key={location.pathname}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.2 }}
               >
                  <Outlet context={{ setIsExpenseModalOpen, setIsVehicleModalOpen }} />
               </motion.div>
            </AnimatePresence>
         </main>
       </div>

       {/* 3. Bottom Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 flex items-center justify-between lg:hidden z-50 pb-safe">
          {navItems.slice(0, 4).map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 transition-all h-full justify-center",
                isActive(item.path) ? "text-primary" : "text-text-secondary/60"
              )}
            >
              <item.icon className={cn("w-5.5 h-5.5", isActive(item.path) && "stroke-[2]")} />
              <span className="text-[10px] font-medium tracking-tight h-3 overflow-hidden">{item.name}</span>
            </Link>
          ))}
        </nav>
 
        {/* Floating Action Button (FAB) - 56px Circular */}
        <button 
          onClick={() => setIsExpenseModalOpen(true)}
          className="fixed lg:hidden bottom-20 right-6 w-14 h-14 rounded-full bg-text-primary text-white shadow-xl shadow-slate-900/20 flex items-center justify-center z-50 hover:bg-slate-800 active:scale-95 transition-all"
        >
          <Plus className="w-8 h-8 stroke-[2.5]" />
        </button>

       {/* Mobile Sidebar Overlay */}
       <AnimatePresence>
          {isMobileMenuOpen && (
             <>
                <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden"
                   onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div 
                   initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                   className="fixed right-0 top-0 bottom-0 w-72 bg-white z-[110] p-8 lg:hidden shadow-2xl border-l border-blue-50"
                >
                   <div className="flex items-center justify-between mb-8">
                      <p className="text-[10px] font-black text-text-helper uppercase tracking-[0.4em] italic leading-none">Navigation</p>
                      <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-text-helper">
                         <X className="w-5 h-5" />
                      </button>
                   </div>
                   <nav className="space-y-4">
                      <Link to="/settings" className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-8 border border-blue-50">
                         <div className="w-10 h-10 rounded-full bg-border overflow-hidden border border-blue-100">
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" className="w-full h-full object-cover grayscale" />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-text-main uppercase tracking-tighter italic leading-none">John Wick</p>
                            <p className="text-[9px] text-text-helper font-bold uppercase tracking-widest mt-1 italic leading-none">Authorized</p>
                         </div>
                      </Link>
                      <div className="space-y-2">
                         <Link to="/fleet" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-text-helper hover:bg-slate-50 italic">
                            <LayoutGrid className="w-5 h-5 text-text-subtle" />
                            Fleet Control
                         </Link>
                         <Link to="/pricing" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:bg-slate-50 italic">
                            <Zap className="w-5 h-5" />
                            Scale Account
                         </Link>
                         <button onClick={() => { /* Logout logic */ }} className="flex items-center gap-3 px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:bg-red-50 italic w-full text-left">
                            <LogOut className="w-5 h-5" />
                            Terminate
                         </button>
                      </div>
                   </nav>
                </motion.div>
             </>
          )}
       </AnimatePresence>
       
       {/* Modals */}
       <AddExpenseModal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} />
       <AddVehicleModal isOpen={isVehicleModalOpen} onClose={() => setIsVehicleModalOpen(false)} />
    </div>
  )
}

export default Layout
