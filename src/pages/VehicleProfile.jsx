import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, ChevronLeft, Calendar, FileText, Settings, CreditCard, Fuel, TrendingUp, Activity, MapPin, Wrench, PenTool, Shield, AlertCircle, History, ArrowUpRight, DollarSign } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const vehicleData = {
  make: 'BMW',
  model: 'X5',
  variant: 'M Sport 2024',
  plate: 'P 12345',
  color: 'Sapphire Black',
  engine: '3.0L B58 Turbo Inline-6',
  odometer: '87,420 km',
  totalSpent: 12450,
  costPerKm: 0.14,
  fuelEfficiency: '11.2 L/100km',
  nextService: '4,580 km',
  health: 98,
}

const costBreakdown = [
  { name: 'Fuel', value: 5200, color: '#6C63FF' },
  { name: 'Service', value: 3400, color: '#4CAF50' },
  { name: 'Tolls', value: 1850, color: '#FF9800' },
  { name: 'Insurance', value: 2000, color: '#FF5252' },
]

const efficiencyHistory = [
  { month: 'Jan', value: 11.5 },
  { month: 'Feb', value: 11.2 },
  { month: 'Mar', value: 10.8 },
  { month: 'Apr', value: 11.4 },
  { month: 'May', value: 11.2 },
]

const recentServices = [
  { date: 'Feb 15, 2026', type: 'Brake Pads', cost: 'AED 850', provider: 'Al Futtaim', odometer: '82,100 km' },
  { date: 'Dec 12, 2025', type: 'Oil & Filter', cost: 'AED 450', provider: 'Dynatrade', odometer: '75,400 km' },
  { date: 'Sep 20, 2025', type: 'Tyre Rotation', cost: 'AED 200', provider: 'Orange Auto', odometer: '65,000 km' },
]

const VehicleProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-muted hover:text-text active:scale-90 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
           <button className="p-2 rounded-xl glass border border-white/5 text-muted hover:text-accent transition-colors">
              <History className="w-5 h-5" />
           </button>
           <button className="p-2 rounded-xl glass border border-white/5 text-muted hover:text-accent transition-colors">
              <Settings className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden glass p-8 rounded-[48px] border border-white/10 shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full -mr-32 -mt-32 blur-3xl" />
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4">
               <div>
                  <h1 className="text-4xl font-display font-black tracking-tightest leading-tight">
                    {vehicleData.make} <span className="text-text/60 italic">{vehicleData.model}</span>
                  </h1>
                  <p className="text-[10px] text-accent font-mono font-black uppercase tracking-widest leading-none mt-1">{vehicleData.variant}</p>
               </div>
               <div className="flex flex-wrap gap-4">
                  <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                     <span className="text-[10px] font-mono text-muted uppercase font-black">Plate</span>
                     <span className="text-sm font-display font-black tracking-tightest text-text italic underline decoration-accent/20">{vehicleData.plate}</span>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
                     <span className="text-[10px] font-mono text-muted uppercase font-black">Condition</span>
                     <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-accent2 shadow-[0_0_8px_rgba(76,175,80,0.5)]" />
                        <span className="text-xs font-display font-black tracking-tightest text-accent2">EXCELLENT</span>
                     </div>
                  </div>
               </div>
            </div>
            <div className="w-20 h-20 rounded-3xl glass border border-accent/20 flex items-center justify-center text-accent shadow-lg shadow-accent/10">
               <Car className="w-12 h-12" />
            </div>
         </div>

         {/* Grid Stats */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/5 font-body">
            <div className="space-y-1">
               <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60">Total Cost</span>
               <p className="text-xl font-display font-black tracking-tightest text-text">AED {vehicleData.totalSpent.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
               <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60">Cost / KM</span>
               <p className="text-xl font-display font-black tracking-tightest text-accent">AED {vehicleData.costPerKm}</p>
            </div>
            <div className="space-y-1">
               <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60">Avg Consumption</span>
               <p className="text-xl font-display font-black tracking-tightest text-text">{vehicleData.fuelEfficiency}</p>
            </div>
            <div className="space-y-1">
               <span className="text-[9px] text-muted font-mono font-black uppercase tracking-widest opacity-60">Odometer</span>
               <p className="text-xl font-display font-black tracking-tightest text-text">{vehicleData.odometer}</p>
            </div>
         </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Cost Distribution */}
         <div className="glass p-8 rounded-[40px] border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="font-display font-black text-lg tracking-tightest leading-none text-text italic">Cost Analysis</h3>
               <TrendingUp className="w-5 h-5 text-accent opacity-50" />
            </div>
            <div className="h-44 flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={costBreakdown}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {costBreakdown.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                     <Tooltip 
                       contentStyle={{ borderRadius: '20px', backgroundColor: '#0A0A0B', border: '1px solid #1A1A1E' }}
                     />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono">
               {costBreakdown.map((c) => (
                  <div key={c.name} className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                     <span className="text-[9px] text-muted uppercase tracking-widest font-black leading-none">{c.name}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Consumption Trend */}
         <div className="glass p-8 rounded-[40px] border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="font-display font-black text-lg tracking-tightest leading-none text-text">Consumption Efficiency</h3>
               <Fuel className="w-5 h-5 text-accent3 opacity-50" />
            </div>
            <div className="h-44">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={efficiencyHistory}>
                     <defs>
                        <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#FF9800" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#FF9800" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Tooltip 
                        contentStyle={{ borderRadius: '20px', backgroundColor: '#0A0A0B', border: '1px solid #1A1A1E' }}
                     />
                     <Area type="monotone" dataKey="value" stroke="#FF9800" fillOpacity={1} fill="url(#colorEfficiency)" strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="space-y-1">
               <p className="text-[10px] text-muted font-mono uppercase tracking-widest font-black leading-none italic">Trend: Optimizing</p>
               <p className="text-[9px] text-accent3 font-mono uppercase tracking-widest font-black opacity-60">7% improvement this quarter</p>
            </div>
         </div>
      </div>

      {/* Timeline Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Toll Activity Heatmap Placeholder */}
         <div className="glass p-6 rounded-[32px] border border-white/5 space-y-6 md:col-span-1">
            <div className="flex items-center justify-between">
               <h4 className="font-display font-black text-sm tracking-tightest leading-none text-text uppercase">Toll Footprint</h4>
               <MapPin className="w-4 h-4 text-accent4 opacity-50" />
            </div>
            <div className="space-y-4">
               {[
                 { gate: 'Al Garhoud', usage: 'High', color: 'bg-accent4' },
                 { gate: 'Al Maktoum', usage: 'Med', color: 'bg-accent3' },
                 { gate: 'Mamzar South', usage: 'Low', color: 'bg-accent2' },
               ].map((gate) => (
                 <div key={gate.gate} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                       <span className="text-[10px] text-muted font-mono font-black uppercase tracking-widest leading-none">{gate.gate}</span>
                       <span className={`text-[9px] font-mono font-black uppercase tracking-widest leading-none bg-white/5 px-2 py-0.5 rounded italic opacity-60`}>{gate.usage}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${gate.color} opacity-40`} style={{ width: gate.usage === 'High' ? '80%' : gate.usage === 'Med' ? '40%' : '15%' }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Maintenance History */}
         <div className="glass p-6 rounded-[32px] border border-white/5 space-y-6 md:col-span-2">
            <div className="flex items-center justify-between">
               <h4 className="font-display font-black text-sm tracking-tightest leading-none text-text uppercase">Recent Service Tokens</h4>
               <History className="w-4 h-4 text-accent2 opacity-50" />
            </div>
            <div className="grid gap-3 font-body">
               {recentServices.map((service, idx) => (
                 <div key={idx} className="glass p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-accent2/10 border border-accent2/20 flex items-center justify-center text-accent2">
                          <Wrench className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-display font-black text-sm tracking-tightest group-hover:text-accent2 transition-colors">{service.type}</p>
                          <p className="text-[9px] text-muted font-mono uppercase tracking-widest font-black leading-none italic">{service.provider} • {service.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-display font-black text-xs text-text">{service.cost}</p>
                       <p className="text-[8px] text-accent font-mono uppercase font-black opacity-40 leading-none">{service.odometer}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
      
      {/* Action Bar */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-40">
         <div className="glass p-4 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-4 bg-bg/80 backdrop-blur-2xl">
            <button className="flex-1 px-6 py-4 bg-accent text-white rounded-2xl font-display font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
               <Fuel className="w-4 h-4" />
               Log Fuel
            </button>
            <button className="flex-1 px-6 py-4 glass text-text rounded-2xl font-display font-black text-xs uppercase tracking-[0.2em] border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
               <AlertCircle className="w-4 h-4" />
               Report Issue
            </button>
         </div>
      </div>
    </div>
  )
}

export default VehicleProfile
