import React, { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, Wallet, Wrench, BarChart3, Car, Plus, 
  Settings, User, Bell, Search, ShieldCheck, 
  ChevronRight, LogOut, Menu, X, Landmark, 
  FileText, History, LayoutGrid, Zap
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Logo from './Logo'
import AddExpenseModal from './AddExpenseModal'
import AddVehicleModal from './AddVehicleModal'
import NotificationDropdown from './NotificationDropdown'
import { useNotifications } from '../context/NotificationContext'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const Layout = () => {
  const location = useLocation()
  const { unreadCount } = useNotifications()
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Expenses', path: '/expenses', icon: Wallet },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Vehicles', path: '/vehicles', icon: Car },
  ]

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-bg-page flex flex-col lg:flex-row relative">
      
       {/* 1. Desktop Sidebar */}
       <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white border-r border-border p-6 z-50">
         <div className="mb-10 px-2 mt-2">
           <Link to="/" className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-text-main flex items-center justify-center text-white shadow-xl shadow-black/10">
                 <Logo type="icon" className="grayscale invert" />
              </div>
              <div>
                 <h1 className="text-xl font-display font-black tracking-tighter text-text-main uppercase italic leading-none">Auto<span className="opacity-30">Track</span></h1>
                 <p className="text-[9px] text-text-helper font-black uppercase tracking-[0.4em] mt-1 leading-none italic">Mobility OS</p>
              </div>
           </Link>
         </div>

         <nav className="flex-1 space-y-1">
           {navItems.map((item) => (
             <Link 
               key={item.path} 
               to={item.path}
               className={cn(
                 "flex items-center gap-3 px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group italic",
                 isActive(item.path) 
                   ? "bg-bg-page text-text-main border border-border" 
                   : "text-text-helper hover:bg-bg-page hover:text-text-main"
               )}
             >
               <item.icon className={cn("w-5 h-5", isActive(item.path) ? "text-text-main stroke-[2.5]" : "text-text-subtle group-hover:text-text-main")} />
               {item.name}
               {isActive(item.path) && (
                 <motion.div layoutId="nav-dot" className="ml-auto w-1 h-1 rounded-full bg-text-main" />
               )}
             </Link>
           ))}
          
           <div className="mt-8 pt-8 border-t border-border flex flex-col gap-1">
              <p className="px-4 text-[9px] font-black text-text-helper uppercase tracking-[0.4em] mb-3 italic">Enterprise Stack</p>
              <Link to="/fleet" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-text-helper hover:bg-bg-page hover:text-text-main transition-all italic">
                 <LayoutGrid className="w-5 h-5 text-text-subtle" />
                 Global Fleet
              </Link>
              <Link to="/organization" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-text-helper hover:bg-bg-page hover:text-text-main transition-all italic">
                 <Landmark className="w-5 h-5 text-text-subtle" />
                 Organization
              </Link>
           </div>
         </nav>

         <div className="pt-6 border-t border-border space-y-3">
           <Link to="/settings" className="saas-card p-3 flex items-center gap-3 hover:border-text-main/10 group bg-white">
              <div className="w-10 h-10 rounded-full bg-bg-page overflow-hidden border border-border">
                 <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black text-text-main uppercase tracking-tighter italic leading-none">John Wick</p>
                 <p className="text-[9px] text-text-helper font-bold uppercase tracking-widest mt-1 italic">PRO_NODE</p>
              </div>
              <ChevronRight className="w-4 h-4 text-text-subtle group-hover:text-text-main transition-all" />
           </Link>
           <button className="flex items-center gap-3 px-4 py-3 w-full text-text-helper font-black text-[10px] uppercase tracking-[0.2em] hover:text-accent transition-all group italic">
              <LogOut className="w-5 h-5 text-text-subtle group-hover:text-accent transition-colors" />
              Terminate
           </button>
         </div>
       </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full">
        
        {/* Desktop Header */}
        <header className="hidden lg:flex h-24 items-center justify-between px-12 sticky top-0 bg-bg-page/80 backdrop-blur-md z-40 border-b border-border">
           <div>
              <h2 className="text-xl font-bold text-text-main tracking-tighter uppercase italic">Welcome back, John!</h2>
              <p className="text-[10px] text-text-helper font-black uppercase tracking-[0.2em] italic mt-1">Status: All mobility nodes synchronized</p>
           </div>

           <div className="flex items-center gap-8">
              <div className="relative group w-80">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle" />
                 <input 
                   placeholder="QUERY DATA REGISTRY..." 
                   className="w-full h-12 bg-white border border-border rounded-2xl px-14 text-[10px] font-black tracking-widest focus:outline-none focus:border-text-main transition-all placeholder:italic uppercase" 
                 />
              </div>
              <div className="flex items-center gap-4 relative">
                 <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="h-12 w-12 rounded-2xl bg-white border border-border flex items-center justify-center text-text-subtle hover:text-text-main transition-all relative shadow-sm"
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
                   className="h-12 px-8 bg-text-main text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-4 hover:opacity-90 active:scale-95 transition-all italic"
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
              <div className="w-9 h-9 rounded-xl bg-text-main flex items-center justify-center text-white shadow-lg shadow-black/10">
                 <Logo type="icon" className="grayscale invert scale-75" />
              </div>
              <h1 className="text-lg font-display font-black text-text-main tracking-tighter uppercase italic">Auto<span className="opacity-30">Track</span></h1>
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
        <main className="flex-1 p-6 lg:p-12 pb-28 lg:pb-12 max-w-7xl mx-auto w-full transition-all duration-300">
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
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-border px-6 flex items-center justify-between lg:hidden z-50 pb-safe">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "mobile-nav-item flex-1 italic",
              isActive(item.path) ? "text-text-main" : "text-text-subtle"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive(item.path) && "stroke-[2.5]")} />
            <span className="text-[9px] font-black tracking-[0.2em] uppercase mt-1">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* FAB for Mobile */}
      <button 
        onClick={() => setIsExpenseModalOpen(true)}
        className="fixed lg:hidden bottom-24 right-6 w-14 h-14 rounded-[22px] bg-text-main text-white shadow-2xl shadow-black/20 flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all text-white"
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
                  className="fixed right-0 top-0 bottom-0 w-72 bg-white z-[110] p-8 lg:hidden shadow-2xl border-l border-border"
               >
                  <div className="flex items-center justify-between mb-8">
                     <p className="text-[10px] font-black text-text-helper uppercase tracking-[0.4em] italic">Navigation</p>
                     <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-bg-page flex items-center justify-center text-text-helper">
                        <X className="w-5 h-5" />
                     </button>
                  </div>
                  <nav className="space-y-4">
                     <Link to="/settings" className="flex items-center gap-3 p-4 bg-bg-page rounded-2xl mb-8 border border-border">
                        <div className="w-10 h-10 rounded-full bg-border overflow-hidden border border-border">
                           <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" className="w-full h-full object-cover grayscale" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-text-main uppercase tracking-tighter italic leading-none">John Wick</p>
                           <p className="text-[9px] text-text-helper font-bold uppercase tracking-widest mt-1 italic">PRO_NODE</p>
                        </div>
                     </Link>
                     <div className="space-y-2">
                        <Link to="/fleet" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-text-helper hover:bg-bg-page italic">
                           <LayoutGrid className="w-5 h-5 text-text-subtle" />
                           Global Fleet
                        </Link>
                        <Link to="/organization" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-text-helper hover:bg-bg-page italic">
                           <Landmark className="w-5 h-5 text-text-subtle" />
                           Organization
                        </Link>
                        <Link to="/pricing" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-text-helper hover:bg-bg-page italic">
                           <Zap className="w-5 h-5 text-accent" />
                           Asset Expansion
                        </Link>
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

