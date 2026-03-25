import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Maintenance from './pages/Maintenance'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Vehicles from './pages/Vehicles'
import Tolls from './pages/Tolls'
import Layout from './components/Layout'

import Organization from './pages/Organization'
import Onboarding from './pages/Onboarding'

import VehicleProfile from './pages/VehicleProfile'

function App() {
  return (
    <Router>
      <div className="bg-bg min-h-screen text-text font-body selection:bg-accent/30 overflow-x-hidden">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/:id" element={<VehicleProfile />} />
            <Route path="tolls" element={<Tolls />} />
            <Route path="organization" element={<Organization />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
