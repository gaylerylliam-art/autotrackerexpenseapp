import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Core Pages
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Maintenance from './pages/Maintenance'
import Vault from './pages/Vault'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Vehicles from './pages/Vehicles'
import Tolls from './pages/Tolls'
import Trips from './pages/Trips'
import Fleet from './pages/Fleet'
import Organization from './pages/Organization'
import Onboarding from './pages/Onboarding'
import Auth from './pages/Auth'
import Pricing from './pages/Pricing'
import NotFound from './pages/NotFound'
import VehicleProfile from './pages/VehicleProfile'

// Components
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import SplashScreen from './components/SplashScreen'
import { NotificationProvider } from './context/NotificationContext'

function App() {
  const [showSplash, setShowSplash] = React.useState(true)

  React.useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash')
    if (hasSeenSplash) setShowSplash(false)
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    sessionStorage.setItem('hasSeenSplash', 'true')
  }

  return (
    <Router>
      <NotificationProvider>
        <div className="min-h-screen text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden relative bg-slate-50">
          <AnimatePresence mode="wait">
            {showSplash && (
              <SplashScreen key="splash" onComplete={handleSplashComplete} />
            )}
          </AnimatePresence>

          {!showSplash && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.5, ease: 'easeOut' }}
              key="app-content"
              className="flex flex-col min-h-screen"
            >
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={
                  <ProtectedRoute>
                     <Onboarding />
                  </ProtectedRoute>
                } />

                <Route element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="fleet" element={<Fleet />} />
                  <Route path="expenses" element={<Expenses />} />
                  <Route path="maintenance" element={<Maintenance />} />
                  <Route path="vault" element={<Vault />} />
                  <Route path="tolls" element={<Tolls />} />
                  <Route path="trips" element={<Trips />} />
                  <Route path="vehicles" element={<Vehicles />} />
                  <Route path="vehicles/:id" element={<VehicleProfile />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="organization" element={<Organization />} />
                  <Route path="pricing" element={<Pricing />} />
                  <Route path="dashboard" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </motion.div>
          )}
        </div>
      </NotificationProvider>
    </Router>
  )
}

export default App
