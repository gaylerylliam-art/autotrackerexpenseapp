import React from 'react'
import { motion } from 'framer-motion'
import { 
  Check, Zap, Building2, Car, Shield, BarChart, MapPin, Globe, 
  ArrowRight, Sparkles, ShieldCheck, Activity, Database, 
  TrendingUp, Navigation, Star, Layers, Cpu, Radio
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const plans = [
  {
    name: 'Starter Node',
    price: '0',
    description: 'Entry-level asset telemetry',
    features: [
      '1 active vehicle cluster',
      'Manual log injection',
      'Basic fiscal reports',
      'Standard AI validation',
      'Standard PDF export'
    ],
    cta: 'Start Free',
    highlight: false,
    icon: Radio,
    color: 'text-slate-400',
    bg: 'bg-slate-50'
  },
  {
    name: 'Pro Sentinel',
    price: '29',
    description: 'High-fidelity individual logic',
    features: [
      'Up to 3 active vehicle nodes',
      'Full deep-intel insights',
      'Depreciation matrix tracking',
      'Mileage segmentation (B2B/B2C)',
      'Automated gateway sync',
      'High-res Excel/PDF export'
    ],
    cta: 'Go Pro',
    highlight: true,
    icon: Sparkles,
    color: 'text-primary',
    bg: 'bg-blue-50'
  },
  {
    name: 'Fleet Cluster',
    price: '79',
    description: 'Enterprise operational scale',
    features: [
      'Unlimited vehicle Provisioning',
      'Operator manifest management',
      'Global fleet dashboard',
      'Cost allocation per segment',
      'Direct API integrations',
      'Advanced auditing tools'
    ],
    cta: 'Scale Fleet',
    highlight: false,
    icon: Layers,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50'
  }
]

const Pricing = () => {
  return (
    <div className="space-y-20 pb-24 max-w-[1400px] mx-auto">
      
      {/* 1. Header Section */}
      <div className="space-y-6 text-center pt-12">
         <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-blue-100" />
            <span className="text-[10px] text-primary font-black uppercase tracking-[0.4em] italic leading-none">Fiscal Scaling Protocol</span>
            <div className="h-px w-12 bg-blue-100" />
         </div>
         <h1 className="text-6xl font-display font-black tracking-tighter text-text-main italic uppercase leading-none">Scale your <span className="text-primary italic">Intelligence.</span></h1>
         <p className="text-text-helper text-lg font-bold italic max-w-2xl mx-auto leading-relaxed opacity-60">Provision the optimal operational tier for your tracking requirements, from individual assets to global enterprise clusters.</p>
      </div>

      {/* 2. Pricing Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 items-stretch">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className={cn(
              "relative saas-card p-10 flex flex-col space-y-10 group",
              plan.highlight ? "ring-2 ring-primary bg-white shadow-elevated z-10 scale-105" : "bg-white/80 border-slate-100"
            )}
          >
            {plan.highlight && (
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-primary/20 z-20">
                 Most Popular Provision
               </div>
            )}

            <div className="space-y-4">
               <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:rotate-12 group-hover:scale-110",
                  plan.highlight ? "bg-primary text-white border-primary/10 shadow-lg shadow-primary/10" : "bg-slate-50 text-text-helper border-slate-100"
               )}>
                  <plan.icon className="w-7 h-7 stroke-[2.5]" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-2xl font-display font-black tracking-tighter italic uppercase text-text-main leading-none">{plan.name}</h3>
                  <p className="text-text-helper text-[10px] font-bold uppercase tracking-widest opacity-60 italic leading-none">{plan.description}</p>
               </div>
            </div>

            <div className="flex flex-col gap-1">
               <div className="flex items-baseline gap-2">
                  <span className="text-[14px] font-black text-primary italic">AED</span>
                  <span className="text-6xl font-display font-black tracking-tighter text-text-main italic leading-none">{plan.price}</span>
               </div>
               <span className="text-text-subtle text-[10px] uppercase font-black tracking-widest italic opacity-60 ml-1">Per Operations Cycle</span>
            </div>

            <div className="space-y-5 flex-1 pt-6 border-t border-slate-50">
               {plan.features.map((feature, idx) => (
                 <div key={idx} className="flex items-start gap-4">
                    <div className={cn("mt-1 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-all", 
                       plan.highlight ? "bg-primary/10 border-primary/10 text-primary" : "bg-slate-50 border-slate-100 text-text-subtle"
                    )}>
                       <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className={cn(
                      "text-[13px] font-bold italic leading-relaxed",
                      plan.highlight ? "text-text-main" : "text-text-helper"
                    )}>{feature}</span>
                 </div>
               ))}
            </div>

            <button className={cn(
              "w-full h-16 rounded-2xl text-[10px] uppercase font-black tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-3 italic group/btn",
              plan.highlight 
                ? "bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:scale-[1.02]" 
                : "bg-slate-50 text-text-main border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-lg"
            )}>
              {plan.cta}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* 3. Enterprise Banner */}
      <div className="saas-card overflow-hidden group p-12 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
         
         <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            <div className="space-y-6 max-w-2xl">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                     <Building2 className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-3xl font-display font-black tracking-tighter italic uppercase leading-none">Enterprise <span className="text-primary italic">Node Cluster</span></h4>
                     <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] leading-none italic opacity-80">Global Logistics Protocol</p>
                  </div>
               </div>
               <p className="text-base text-slate-300 leading-relaxed font-bold italic opacity-80">
                  White-labeling, custom national API integrations, and high-priority SLA logic. Provision a custom cluster tailored to global fleet intelligence requirements.
               </p>
            </div>
            
            <button className="h-18 px-12 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic shadow-2xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
               Contact Operations Hub
            </button>
         </div>
      </div>
    </div>
  )
}

export default Pricing
