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
       <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-primary bg-gradient-to-b from-primary via-primary to-secondary p-6 z-50 shadow-2xl overflow-hidden">
         {/* Sidebar Glows */}
         <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />
         
         <div className="mb-10 px-2 mt-2 relative z-10">
            <Link to="/" className="flex items-center gap-4 group/logo">
               <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-xl group-hover/logo:scale-110 transition-transform">
                  <Logo type="icon" className="text-white" />
               </div>
               <div>
                  <h1 className="text-xl font-display font-black tracking-tighter text-white uppercase italic leading-none">Auto<span className="text-accent italic">Tracker</span></h1>
                  <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.4em] mt-1 leading-none italic">SaaS Edition</p>
               </div>
            </Link>
         </div>

         {/* Organization Switcher */}
         <div className="mb-8 relative z-10">
            <button 
               onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
               className="w-full h-14 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center gap-3 transition-all text-white text-left group"
            >
               <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent font-black text-xs">
                  {currentOrg?.name?.[0] || 'A'}
               </div>
               <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] font-black uppercase tracking-widest truncate">{currentOrg?.name || 'Loading Node...'}</p>
                  <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest mt-0.5 truncate">{currentOrg?.role || 'Admin'}</p>
               </div>
               <ChevronRight className={cn("w-4 h-4 text-white/40 transition-transform", isOrgMenuOpen && "rotate-90")} />
            </button>

            <AnimatePresence>
               {isOrgMenuOpen && (
                  <motion.div 
                     initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                     className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 z-[60] overflow-hidden"
                  >
                     {organizations.map(org => (
                        <button 
                           key={org.id}
                           onClick={() => { selectOrg(org); setIsOrgMenuOpen(false); }}
                           className={cn(
                              "w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all hover:bg-primary/5",
                              currentOrg?.id === org.id ? "bg-primary/5" : ""
                           )}
                        >
                           <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">
                              {org.name[0]}
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-black text-text-main truncate uppercase tracking-widest">{org.name}</p>
                              <p className="text-[8px] text-text-helper font-bold truncate uppercase">{org.role}</p>
                           </div>
                        </button>
                     ))}
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         <nav className="flex-1 space-y-1 relative z-10">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group italic",
                  isActive(item.path) 
                    ? "bg-white text-primary shadow-xl shadow-black/10" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive(item.path) ? "text-primary stroke-[2.5]" : "text-white/40 group-hover:text-white")} />
                {item.name}
              </Link>
            ))}
           
            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-1">
               <p className="px-4 text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-3 italic">Enterprise Stack</p>
               <Link to="/fleet" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:bg-white/5 hover:text-white transition-all italic">
                  <LayoutGrid className="w-5 h-5 text-white/40 group-hover:text-white" />
                  Fleet Control
               </Link>
               <Link to="/pricing" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-accent hover:bg-white/5 transition-all italic animate-pulse">
                  <Zap className="w-5 h-5" />
                  Scale Account
               </Link>
            </div>
         </nav>

         <div className="pt-6 border-t border-white/10 relative z-10">
            <Link to="/settings" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-all group">
               <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden border border-white/20">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate italic leading-none">John Wick</p>
                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-1 italic">Authorized</p>
               </div>
               <ChevronRight className="w-4 h-4 text-white/40" />
            </Link>
         </div>
       </aside>

       {/* 2. Main Content Area */}
       <div className="flex-1 flex flex-col min-h-screen max-w-full">
         
         {/* Desktop Header */}
         <header className="hidden lg:flex h-24 items-center justify-between px-12 sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-blue-50">
            <div>
               <h2 className="text-xl font-display font-black text-text-main tracking-tighter uppercase italic">Control Panel</h2>
               <p className="text-[10px] text-text-helper font-black uppercase tracking-[0.2em] italic mt-1 font-body">Node status: <span className="text-emerald-500">Operational</span></p>
            </div>

            <div className="flex items-center gap-8 font-body">
               <div className="relative group w-80">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle group-focus-within:text-primary transition-colors" />
                  <input 
                    placeholder="QUERY DATA REGISTRY..." 
                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-2xl px-14 text-[10px] font-black tracking-widest focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:italic uppercase" 
                  />
               </div>
               <div className="flex items-center gap-4 relative">
                  <button 
                   onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                   className="h-12 w-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-text-subtle hover:text-primary transition-all relative shadow-sm"
                  >
                     <Bell className="w-5 h-5" />
                     {unreadCount > 0 && (
                       <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-accent" />
                     )}
                  </button>
                  <NotificationDropdown 
                     isOpen={isNotificationOpen} 
                     onClose={() => setIsNotificationOpen(false)} 
                  />
                  <button 
                    onClick={() => setIsExpenseModalOpen(true)}
                    className="h-12 px-8 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 hover:opacity-90 active:scale-95 transition-all italic shadow-lg shadow-primary/20"
                  >
                     <Plus className="w-4 h-4 stroke-[3]" />
                     Add Ledger Entry
                  </button>
               </div>
            </div>
         </header>

         {/* Mobile Header */}
         <header className="lg:hidden h-18 flex items-center justify-between px-6 bg-white border-b border-border sticky top-0 z-40">
            <Link to="/" className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Logo type="icon" className="scale-75 text-white" />
               </div>
               <h1 className="text-lg font-display font-black text-text-main tracking-tighter uppercase italic">Auto<span className="text-primary">Tracker</span></h1>
            </Link>
            <div className="flex items-center gap-4">
               <button className="text-text-subtle">
                  <Bell className="w-5 h-5" />
               </button>
               <button onClick={() => setIsMobileMenuOpen(true)} className="text-text-main">
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
       <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-blue-50 px-6 flex items-center justify-between lg:hidden z-50 pb-safe font-body">
         {navItems.slice(0, 4).map((item) => (
           <Link 
             key={item.path} 
             to={item.path}
             className={cn(
               "mobile-nav-item flex-1 italic flex flex-col items-center gap-1",
               isActive(item.path) ? "text-primary" : "text-text-subtle"
             )}
           >
             <item.icon className={cn("w-6 h-6", isActive(item.path) && "stroke-[2.5]")} />
             <span className="text-[9px] font-black tracking-[0.2em] uppercase">{item.name}</span>
           </Link>
         ))}
       </nav>

       {/* FAB for Mobile */}
       <button 
         onClick={() => setIsExpenseModalOpen(true)}
         className="fixed lg:hidden bottom-24 right-6 w-14 h-14 rounded-[22px] bg-primary text-white shadow-2xl shadow-primary/30 flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all"
       >
         <Plus className="w-7 h-7 stroke-[3]" />
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
