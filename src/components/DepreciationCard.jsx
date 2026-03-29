import React, { useEffect, useState } from 'react'
import * as controller from '../modules/depreciation/depreciation.controller'
import { DollarSign, AlertCircle, History } from 'lucide-react'

/**
 * DEPRECIATION CARD COMPONENT
 * Renders high-fidelity financial asset valuation data for a vehicle.
 * Used in VehicleProfile.jsx and Dashboard widgets.
 */

const DepreciationCard = ({ vehicleId }) => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDepreciation = async () => {
      setLoading(true)
      const data = await controller.getBriefing(vehicleId)
      setSummary(data)
      setLoading(false)
    }
    if (vehicleId) fetchDepreciation()
  }, [vehicleId])

  if (loading) return (
    <div className="premium-card p-8 animate-pulse">
      <div className="h-6 w-32 bg-slate-100 rounded mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-slate-50 rounded-2xl" />
        <div className="h-20 bg-slate-50 rounded-2xl" />
      </div>
    </div>
  )

  if (!summary || summary.status !== 'ok') {
    return (
       <div className="premium-card p-8 flex flex-col items-center justify-center text-center gap-4 border-dashed border-2 border-slate-200 bg-slate-50/50">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
             <AlertCircle className="w-6 h-6" />
          </div>
          <div>
             <h4 className="font-bold text-slate-900">Depreciation Unavailable</h4>
             <p className="text-xs text-slate-500 max-w-[200px]">Update purchase price and start date to enable valuation tracking.</p>
          </div>
          <button className="text-xs font-bold text-primary hover:underline">Update Asset Info</button>
       </div>
    )
  }

  return (
    <div className="premium-card p-8 bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 shadow-xl shadow-blue-500/5 group hover:border-primary/20 transition-all">
       <div className="flex items-center justify-between mb-8">
          <div>
             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                Asset Valuation
             </h3>
             <p className="text-xs text-slate-500 font-medium italic">Calculated: {summary.method}</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             Live Tracking
          </div>
       </div>

       <div className="grid grid-cols-2 gap-6 mb-8">
          <StatBox label="Current Value" value={summary.currentValue} subtext={`AED ${(summary.monthlyDepreciation).toLocaleString()}/mo Loss`} primary />
          <StatBox label="Accumulated Loss" value={summary.accumulatedDepreciation} subtext={`${summary.elapsedMonths} Months Old`} />
       </div>

       <div className="pt-6 border-t border-slate-200/60 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
             <span>Progression</span>
             <span>{Math.round((summary.accumulatedDepreciation / summary.purchasePrice) * 100)}% Depreciated</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/40">
             <div 
               className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-1000" 
               style={{ width: `${(summary.accumulatedDepreciation / summary.purchasePrice) * 100}%` }}
             />
          </div>
       </div>
       
       <div className="mt-8 flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <History className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Cost of Ownership</p>
                <h4 className="text-xl font-display font-bold text-slate-900">AED {summary.tcoIncludingDepreciation.toLocaleString()}</h4>
             </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-primary transition-all">
             <AlertCircle className="w-4 h-4" />
          </button>
       </div>
    </div>
  )
}

const StatBox = ({ label, value, subtext, primary }) => (
  <div className={primary ? "space-y-1" : "space-y-1"}>
    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{label}</p>
    <h4 className={primary ? "text-2xl font-display font-bold text-slate-900" : "text-xl font-display font-bold text-slate-700"}>
       AED {value.toLocaleString()}
    </h4>
    <p className="text-[10px] text-slate-500 font-semibold">{subtext}</p>
  </div>
)

export default DepreciationCard
