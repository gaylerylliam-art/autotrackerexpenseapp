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
  const { currentOrg } = useOrganization()
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
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-x-hidden selection:bg-white/20 selection:text-white">
      
      {/* 1. Desktop Sidebar (Glassmorphic) */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-white/5 backdrop-blur-3xl border-r border-white/10 p-7 z-50 overflow-hidden shadow-[20px_0_50px_rgba(0,0,0,0.1)]">
        {/* Sidebar Glows */}
        <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-accent/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mb-10 mt-2 relative z-10">
          <Link to="/">
            <Logo type="full" variant="light" />
          </Link>
        </div>

        {/* Organization Switcher (Glass) */}
        <div className="mb-8 relative z-10 space-y-2">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Connectivity Node</span>
          <button 
            onClick={() => setIsOrgMenuOpen(!isOrgMenuOpen)}
            className="w-full h-12 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3 transition-all text-white text-left group"
          >
            <div className="w-6 h-6 rounded-md bg-accent/20 flex items-center justify-center text-accent font-bold text-[10px]">
              {currentOrg?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[12px] font-semibold truncate leading-none mb-0.5">{currentOrg?.name || 'Loading...'}</p>
              <p className="text-[9px] text-white/40 font-bold truncate uppercase leading-none mb-0 opacity-80">{currentOrg?.role || 'Admin'}</p>
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
                  ? "bg-white text-primary shadow-[0_8px_20px_rgba(0,0,0,0.1)]" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("w-4.5 h-4.5 transition-colors", isActive(item.path) ? "text-primary stroke-[2.5]" : "text-white/30 group-hover:text-white")} />
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
              <p className="text-[9px] text-white/30 font-bold uppercase leading-none mb-0">Identity Verified</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/20" />
          </Link>
        </div>
      </aside>

      {/* 2. Content Shell */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        
        {/* Ambient Page Glows */}
        <div className="absolute top-[-300px] right-[-300px] w-[800px] h-[800px] bg-white/5 blur-[160px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none z-0" />

        {/* Desktop Header (Glass) */}
        <header className="hidden lg:flex h-20 items-center justify-between px-10 sticky top-0 bg-white/5 backdrop-blur-xl border-b border-white/5 z-40">
          <div>
            <h1 className="text-[22px] mb-0 text-white">System Monitor</h1>
            <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Connectivity: Operational · Core: Alpha-7</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-white transition-colors" />
              <input 
                placeholder="Query data registry..." 
                className="w-full h-10 pl-11 pr-4 bg-white/5 border border-white/10 rounded-xl text-[13px] text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-white/20 focus:ring-4 focus:ring-white/5 transition-all font-medium" 
              />
            </div>
            <div className="flex items-center gap-4 relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-accent border-2 border-primary" />
                )}
              </button>
              <NotificationDropdown 
                isOpen={isNotificationOpen} 
                onClose={() => setIsNotificationOpen(false)} 
              />
              <button 
                onClick={() => setIsExpenseModalOpen(true)}
                className="h-10 px-6 rounded-xl bg-white text-primary font-bold text-[13px] hover:bg-opacity-90 active:scale-95 shadow-lg shadow-black/10 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Record Nexus
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Header (True Glass) */}
        <header className="lg:hidden h-16 flex items-center justify-between px-5 bg-white/10 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Logo type="icon" variant="light" className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-[17px] font-bold text-white leading-none">
                {navItems.find(i => isActive(i.path))?.name || 'Monitor'}
              </span>
              <span className="text-[9px] text-white/40 font-bold mt-1 uppercase tracking-[0.2em] leading-none">System Active</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center text-white/50">
              <Search className="w-5.5 h-5.5" />
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="w-10 h-10 flex items-center justify-center text-white ml-2">
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 relative z-10 px-5 py-6 lg:p-10 max-w-7xl mx-auto w-full pb-32 lg:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Outlet context={{ setIsExpenseModalOpen, setIsVehicleModalOpen }} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation (Floating Glass) */}
      <div className="fixed bottom-6 left-6 right-6 lg:hidden z-50">
        <nav className="h-16 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[24px] px-6 flex items-center justify-between shadow-2xl shadow-black/20">
          {navItems.slice(0, 4).map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 transition-all h-full justify-center relative",
                isActive(item.path) ? "text-white" : "text-white/40"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive(item.path) && "stroke-[2.5]")} />
              <span className="text-[9px] font-bold tracking-tight uppercase">{item.name}</span>
              {isActive(item.path) && (
                <motion.div layoutId="nav-glow" className="absolute -bottom-1 w-1 h-1 bg-accent rounded-full shadow-[0_0_10px_rgba(0,198,255,1)]" />
              )}
            </Link>
          ))}
          <button 
            onClick={() => setIsExpenseModalOpen(true)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-xl active:scale-90 transition-all ml-2"
          >
            <Plus className="w-7 h-7 stroke-[3]" />
          </button>
        </nav>
      </div>

      {/* Mobile Sidebar Overlay (Glass) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-slate-900/40 backdrop-blur-3xl z-[110] p-8 lg:hidden shadow-2xl border-l border-white/10"
            >
              <div className="flex items-center justify-between mb-10">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] leading-none">Infrastructure</p>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-6">
                <Link to="/settings" className="flex items-center gap-4 p-5 bg-white/5 rounded-[24px] mb-10 border border-white/10 border-t-white/20">
                  <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden border border-white/20">
                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-white leading-none">John Wick</p>
                    <p className="text-[10px] text-accent font-black uppercase tracking-widest mt-1.5 underline decoration-accent/30 decoration-2">Administrator</p>
                  </div>
                </Link>
                <div className="space-y-3">
                  <Link to="/fleet" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-5 h-14 rounded-2xl text-[14px] font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all">
                    <LayoutGrid className="w-6 h-6 text-white/30" />
                    Fleet Intelligence
                  </Link>
                  <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-5 h-14 rounded-2xl text-[14px] font-bold text-accent hover:bg-accent/10 transition-all">
                    <Zap className="w-6 h-6" />
                    Ascend Account
                  </Link>
                  <button onClick={() => {}} className="flex items-center gap-4 px-5 h-14 rounded-2xl text-[14px] font-bold text-rose-400 hover:bg-rose-500/10 w-full text-left mt-12">
                    <LogOut className="w-6 h-6 opaicy-50" />
                    Terminate Connection
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
