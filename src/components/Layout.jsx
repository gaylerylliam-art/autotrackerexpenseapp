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
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white border-r border-slate-200/60 p-6 z-50">
        <div className="mb-8 px-2">
          <Link to="/" className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Logo type="icon" />
             </div>
             <div>
                <h1 className="text-xl font-display font-bold tracking-tight text-slate-900">AutoTrack</h1>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Vehicle Management</p>
             </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 h-12 rounded-2xl text-sm font-semibold transition-all group",
                isActive(item.path) 
                  ? "bg-primary/5 text-primary" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive(item.path) ? "text-primary stroke-[2.5]" : "text-slate-400 group-hover:text-slate-600")} />
              {item.name}
              {isActive(item.path) && (
                <motion.div layoutId="nav-dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
          
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-1">
             <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Fleet Management</p>
             <Link to="/fleet" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
                <LayoutGrid className="w-5 h-5 text-slate-400" />
                Fleet Overview
             </Link>
             <Link to="/organization" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
                <Landmark className="w-5 h-5 text-slate-400" />
                Organization
             </Link>
          </div>
        </nav>

        <div className="pt-6 border-t border-slate-100 space-y-3">
          <Link to="/settings" className="premium-card p-3 flex items-center gap-3 hover:border-primary/20 group">
             <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">John Wick</p>
                <p className="text-[10px] text-slate-400 font-medium">Pro Member</p>
             </div>
             <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-all" />
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 font-semibold text-sm hover:text-red-600 transition-all group">
             <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
             Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full">
        
        {/* Desktop Header */}
        <header className="hidden lg:flex h-20 items-center justify-between px-12 sticky top-0 bg-bg-page/80 backdrop-blur-md z-40 border-b border-slate-200/60">
           <div>
              <h2 className="text-xl font-bold text-slate-900">Welcome back, John!</h2>
              <p className="text-xs text-slate-500">Here's what's happening with your fleet today.</p>
           </div>

           <div className="flex items-center gap-6">
              <div className="relative group w-64">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                   placeholder="Search..." 
                   className="w-full h-10 bg-white border border-slate-200 rounded-xl px-12 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all" 
                 />
              </div>
              <div className="flex items-center gap-3 relative">
                 <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/20 transition-all relative shadow-sm"
                 >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
                    )}
                 </button>
                 <NotificationDropdown 
                    isOpen={isNotificationOpen} 
                    onClose={() => setIsNotificationOpen(false)} 
                 />
                 <button 
                   onClick={() => setIsExpenseModalOpen(true)}
                   className="h-10 px-6 btn-primary"
                 >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    Add Expense
                 </button>
              </div>
           </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center justify-between px-6 bg-white border-b border-slate-100 sticky top-0 z-40">
           <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                 <Logo type="icon" />
              </div>
              <h1 className="text-lg font-display font-bold text-slate-900 tracking-tight">AutoTrack</h1>
           </Link>
           <div className="flex items-center gap-4">
              <button className="text-slate-500">
                 <Bell className="w-5 h-5" />
              </button>
              <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-900">
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
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 flex items-center justify-between lg:hidden z-50 pb-safe">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "mobile-nav-item flex-1",
              isActive(item.path) ? "text-primary" : "text-slate-400"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive(item.path) && "stroke-[2.5]")} />
            <span className="text-[10px] font-bold tracking-tight uppercase">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* FAB for Mobile */}
      <button 
        onClick={() => setIsExpenseModalOpen(true)}
        className="fixed lg:hidden bottom-24 right-6 w-14 h-14 rounded-[20px] bg-primary text-white shadow-xl shadow-blue-500/30 flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all"
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
                  className="fixed right-0 top-0 bottom-0 w-72 bg-white z-[110] p-8 lg:hidden shadow-2xl"
               >
                  <div className="flex items-center justify-between mb-8">
                     <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Menu</p>
                     <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <X className="w-5 h-5" />
                     </button>
                  </div>
                  <nav className="space-y-4">
                     <Link to="/settings" className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-8">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                           <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900">John Wick</p>
                           <p className="text-[10px] text-slate-500">Settings & Profile</p>
                        </div>
                     </Link>
                     <div className="space-y-2">
                        <Link to="/fleet" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                           <LayoutGrid className="w-5 h-5 text-slate-400" />
                           Fleet Overview
                        </Link>
                        <Link to="/organization" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                           <Landmark className="w-5 h-5 text-slate-400" />
                           Organization Settings
                        </Link>
                        <Link to="/pricing" className="flex items-center gap-3 px-4 h-12 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                           <Zap className="w-5 h-5 text-amber-500" />
                           Upgrade Account
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

