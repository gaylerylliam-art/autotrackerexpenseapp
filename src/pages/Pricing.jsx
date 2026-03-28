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
    name: 'Standard Node',
    price: '0',
    description: 'Entry-level asset telemetry',
    features: [
      '1 active vehicle cluster',
      'Manual log injection',
      'Basic fiscal reports',
      'Standard AI validation',
      'Manual toll entry only',
      'Standard PDF export'
    ],
    cta: 'Operational',
    highlight: false,
    icon: Radio
  },
  {
    name: 'Pro Sentinel',
    price: '29',
    description: 'High-fidelity individual logic',
    features: [
      'Up to 3 active vehicle nodes',
      'Full deep-intel insights',
      'Unit composite analysis',
      'Depreciation matrix tracking',
      'Mileage segmentation (B2B/B2C)',
      'Automated gateway sync',
      'High-res Excel/PDF export',
      'Cloud sequence sync'
    ],
    cta: 'Provision Pro Account',
    highlight: true,
    icon: Sparkles
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
      'Reimbursement audit log',
      'Automated fiscal segmentation',
      'Direct API integrations',
      'Advanced auditing tools'
    ],
    cta: 'Start Fleet Sequence',
    highlight: false,
    icon: Layers
  }
]

const Pricing = () => {
  return (
    <div className="space-y-16 pb-24">
      
      {/* 1. Strategy Header (Fina Style) */}
      <div className="space-y-8 text-center max-w-4xl mx-auto pt-12">
         <div className="flex items-center justify-center gap-6 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="text-[11px] text-primary font-mono font-black uppercase tracking-[0.5em] italic glow-text">Fiscal Scaling Protocol</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
         </div>
         <h1 className="text-7xl font-display font-black tracking-tighter leading-[0.85] text-white italic uppercase">Scale your <span className="text-primary glow-text">Fleet Intelligence.</span></h1>
         <p className="text-text-muted text-lg font-semibold italic max-w-2xl mx-auto leading-relaxed opacity-60">Provision the optimal operational tier for your tracking requirements, from individual assets to global enterprise clusters.</p>
      </div>

      {/* 2. Provisioning Cards (Fina Glass Tiers) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch px-4">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            whileHover={{ y: -12 }}
            className={cn(
              "relative saas-card p-12 flex flex-col space-y-12 group transition-all duration-700 overflow-hidden border border-white/10",
              plan.highlight ? "border-primary shadow-glow scale-105 z-10" : "hover:border-primary/40 bg-white/5"
            )}
          >
            {/* Decorative Glow Background */}
            <div className={cn("absolute -right-20 -top-20 w-80 h-80 rounded-full blur-[100px] opacity-10 transition-opacity group-hover:opacity-20", 
               plan.highlight ? "bg-primary" : "bg-white"
            )} />

            {plan.highlight && (
               <div className="absolute top-0 right-0 p-12 opacity-[0.05] scale-150 rotate-12 transition-transform duration-1000 group-hover:scale-125 pointer-events-none">
                  <Sparkles className="w-64 h-64 text-primary" />
               </div>
            )}
            
            {!plan.highlight && (
               <div className="absolute top-0 right-0 p-12 opacity-[0.02] scale-150 rotate-12 transition-transform duration-1000 group-hover:scale-125 pointer-events-none">
                  <plan.icon className="w-64 h-64 text-white" />
               </div>
            )}

            {plan.highlight && (
              <div className="absolute top-8 right-8 px-5 py-2 rounded-full bg-primary text-white text-[9px] font-display font-black uppercase tracking-widest italic shadow-glow">
                Optimal Provision
              </div>
            )}

            <div className="space-y-4 relative z-10">
               <div className="flex items-center gap-4 mb-6">
                  <div className={cn("w-14 h-14 rounded-[18px] flex items-center justify-center border border-white/10 shadow-premium group-hover:rotate-12 transition-transform",
                     plan.highlight ? "bg-primary text-white" : "bg-white/5 text-text-muted"
                  )}>
                     <plan.icon className="w-7 h-7 stroke-[2.5]" />
                  </div>
               </div>
               <h3 className="text-3xl font-display font-black tracking-tighter italic uppercase text-white leading-none">{plan.name}</h3>
               <p className="text-text-muted text-[10px] font-mono font-bold uppercase tracking-widest opacity-40 italic leading-none">{plan.description}</p>
            </div>

            <div className="flex items-baseline gap-3 relative z-10">
               <span className="text-[12px] font-mono text-text-muted uppercase font-black opacity-40 italic">AED</span>
               <span className="text-7xl font-mono font-black tracking-tighter text-white italic leading-none">{plan.price}</span>
               <span className="text-text-muted font-mono text-[10px] uppercase font-black opacity-20 italic">/ cycle</span>
            </div>

            <div className="space-y-6 flex-1 relative z-10">
               {plan.features.map((feature, idx) => (
                 <div key={idx} className="flex items-start gap-5 group/item">
                    <div className={cn("mt-1 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border transition-all", 
                       plan.highlight ? "bg-primary/20 border-primary/20 text-primary" : "bg-white/5 border-white/10 text-white/20"
                    )}>
                       <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span className="text-xs text-text-muted font-semibold italic group-hover/item:text-white transition-colors leading-relaxed">{feature}</span>
                 </div>
               ))}
            </div>

            <button className={cn(
              "btn-glass w-full h-18 text-xs uppercase font-black tracking-widest italic group/btn relative z-10",
              plan.highlight ? "btn-primary shadow-glow hover:scale-105" : "hover:bg-white/10 hover:border-white/20"
            )}>
              {plan.cta}
              <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* 3. Terminal Enterprise Cluster (Fina Strategy) */}
      <div className="saas-card overflow-hidden group shadow-glow">
         <div className="p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-16 relative">
            {/* Mesh Back */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-30" />
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full opacity-30" />
            
            <div className="space-y-8 relative z-10 max-w-3xl">
               <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-[28px] bg-primary flex items-center justify-center text-white shadow-glow group-hover:rotate-12 transition-transform">
                     <Building2 className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <div className="space-y-3">
                     <h4 className="text-4xl font-display font-black text-white tracking-tighter italic uppercase leading-none">Enterprise <span className="text-primary glow-text">Custom Node</span></h4>
                     <div className="flex items-center gap-4">
                        <span className="text-[11px] text-primary font-mono font-black uppercase tracking-[0.4em] leading-none italic opacity-80">Global Logistics Protocol</span>
                        <div className="w-2 h-2 rounded-full bg-white/20" />
                        <div className="badge badge-maintenance h-6 px-4">SLA-GRADE</div>
                     </div>
                  </div>
               </div>
               <p className="text-base text-text-muted leading-relaxed font-semibold italic">
                  Does your organization require white-labeling, custom national API integrations, or high-priority SLA logic? Provision a custom cluster tailored to global fleet intelligence requirements. Full auditor access included.
               </p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                  {[
                     { label: 'White-Label UI', icon: Shield },
                     { label: 'Cloud API Webhooks', icon: Radio },
                     { label: 'Custom Compliance', icon: Database }
                  ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4 text-[10px] font-display font-black uppercase tracking-widest text-white italic opacity-40 group-hover:opacity-100 transition-opacity">
                        <item.icon className="w-5 h-5 text-primary" />
                        {item.label}
                     </div>
                  ))}
               </div>
            </div>
            
            <div className="shrink-0 relative z-10 w-full lg:w-auto">
               <button className="btn-primary w-full lg:w-auto h-20 px-16 text-sm shadow-glow hover:scale-105 active:scale-95 transition-all">
                  Contact Sales Node
               </button>
            </div>
         </div>
      </div>
    </div>
  )
}

export default Pricing
