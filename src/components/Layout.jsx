import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Home, ClipboardList, PenTool, BarChart2, User, Plus, Car, Receipt, TrendingUp, Building2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import WorkspaceSwitcher from './WorkspaceSwitcher'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const Layout = () => {
  const location = useLocation()
  
  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Receipt, path: '/expenses', label: 'Expenses' },
    { icon: Plus, path: '/add', label: 'Add', fab: true },
    { icon: Car, path: '/vehicles', label: 'Garage' },
    { icon: TrendingUp, path: '/reports', label: 'Reports' }
  ]

  return (
    <div className="flex flex-col min-h-screen pb-24 sm:pb-0 sm:pl-16 bg-bg overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 glass px-6 py-4 flex items-center justify-between border-b border-white/5 sm:glass sm:rounded-none sm:border-x-0">
        <WorkspaceSwitcher />
        <div className="flex items-center gap-4">
           <NavLink 
            to="/organization" 
            className={({ isActive }) => cn(
              "p-2 rounded-full border border-white/5 transition-all",
              isActive ? "bg-accent/20 border-accent/20 text-accent shadow-[0_0_12px_rgba(108,99,255,0.4)]" : "bg-white/[0.03] text-muted hover:bg-white/[0.06] hover:text-text cursor-pointer"
            )}
           >
              <Building2 className="w-5 h-5" />
           </NavLink>
           <div className="w-9 h-9 rounded-full bg-surface3 border border-white/10 overflow-hidden ring-2 ring-accent/20 cursor-pointer hover:ring-accent/40 transition-all">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" 
              alt="User" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistence Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-[60] glass h-20 px-4 flex items-center justify-between border-t border-white/5 sm:hidden">
        {navItems.map((item, index) => {
          if (item.fab) {
            return (
              <div key={index} className="relative -top-6 flex flex-col items-center">
                <button 
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent to-accent2 shadow-[0_4px_20px_rgba(108,99,255,0.4)] flex items-center justify-center text-white active:scale-90 transition-all border-4 border-bg"
                >
                  <Plus className="w-8 h-8" />
                </button>
                <div className="text-[10px] font-mono text-muted mt-1 uppercase tracking-wider font-black">LOG</div>
              </div>
            )
          }
          
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[50px] transition-all relative px-2",
                isActive ? "text-accent" : "text-muted hover:text-text"
              )}
            >
              <item.icon className={cn("w-6 h-6 transition-all", isActive && "scale-110 drop-shadow-lg")} />
              <span className="text-[8px] font-mono uppercase tracking-[0.2em] font-black">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="nav-active" 
                  className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-accent"
                />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Side Navigation (Desktop) */}
      <nav className="fixed left-0 top-0 bottom-0 z-50 w-16 glass hidden sm:flex flex-col items-center py-8 border-r border-white/5">
        <div className="mb-12">
            {/* Minimalist Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent to-accent2 flex items-center justify-center text-white shadow-lg">
               <span className="font-display font-black text-lg">A</span>
            </div>
        </div>
        <div className="flex flex-col gap-8 flex-1">
          {navItems.filter(i => !i.fab).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "p-3 rounded-xl transition-all relative group",
                isActive ? "bg-accent/10 text-accent ring-1 ring-accent/20" : "text-muted hover:bg-white/[0.03] hover:text-text"
              )}
            >
              <item.icon className="w-6 h-6" />
              <div className="absolute left-16 px-3 py-2 bg-surface2 border border-white/10 rounded-lg text-xs font-mono uppercase tracking-widest text-text opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                {item.label}
              </div>
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="side-nav-active" 
                  className="absolute left-0 w-1 h-6 bg-accent rounded-r-full -ml-px top-1/2 -translate-y-1/2 shadow-[0_0_12px_rgba(108,99,255,0.6)]"
                />
              )}
            </NavLink>
          ))}
        </div>
        <button className="w-10 h-10 rounded-xl bg-accent shadow-[0_4px_12px_rgba(108,99,255,0.3)] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all mb-4">
          <Plus className="w-6 h-6" />
        </button>
      </nav>
    </div>
  )
}

export default Layout
