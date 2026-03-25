import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, ShieldCheck, Lock, CreditCard, HelpCircle, LogOut, ChevronRight, Globe, Moon, Eye, Smartphone, MoreVertical, CreditCard as Card, Share, Download, X, Scale, FileText, Trash2 } from 'lucide-react'

const Settings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    inApp: true,
  })

  const [privacy, setPrivacy] = useState({
    mfa: true,
    location: true,
    storage: false,
  })

  const togglePrivacy = (key) => setPrivacy(p => ({ ...p, [key]: !p[key] }))

  const [activeModal, setActiveModal] = useState(null) // 'terms', 'privacy', null

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Card */}
      <div className="flex items-center gap-6 p-6 glass rounded-3xl border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <button className="p-2 glass rounded-xl border border-white/10 hover:bg-white/[0.05]">
            <MoreVertical className="w-5 h-5 text-muted hover:text-text transition-colors" />
          </button>
        </div>
        <div className="w-20 h-20 rounded-full bg-surface3 border-4 border-accent/20 overflow-hidden ring-2 ring-accent/30 shadow-2xl transition-transform group-hover:scale-110">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&h=160&fit=crop" 
            alt="Ahmed" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-1 relative z-10">
          <h2 className="text-2xl font-display font-extrabold tracking-tightest">Ahmed <span className="text-accent">Al Mansouri</span></h2>
          <p className="text-xs text-muted font-mono uppercase tracking-widest leading-none">Pro Member since 2025</p>
          <div className="flex gap-4 mt-4">
            <div className="flex flex-col gap-0.5">
               <span className="text-[9px] text-muted font-mono uppercase tracking-widest font-bold">Vehicles</span>
               <span className="text-sm font-display font-black tracking-tightest">2 Active</span>
            </div>
            <div className="flex flex-col gap-0.5 border-l border-white/5 pl-4">
               <span className="text-[9px] text-muted font-mono uppercase tracking-widest font-bold">Workspace</span>
               <span className="text-sm font-display font-black tracking-tightest">Individual</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Plan Upsell */}
      <div className="bg-gradient-to-br from-accent to-accent2 p-6 rounded-3xl border border-white/20 shadow-[0_8px_32px_rgba(108,99,255,0.4)] relative overflow-hidden group">
        <div className="absolute -left-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 p-4 opacity-30 select-none">
          <TrendingUp className="w-20 h-20 text-white" />
        </div>
        <div className="space-y-4 relative z-10">
          <div className="space-y-1">
            <h4 className="font-display font-black text-xl text-white tracking-tightest uppercase italic">Unlock Fleet B2B</h4>
            <p className="text-white/80 text-sm max-w-[200px]">Manage team drivers, complex tax logs, and bulk expenses.</p>
          </div>
          <button className="px-5 py-2.5 bg-white text-accent rounded-xl font-display font-extrabold text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Section: Notifications */}
      <div className="space-y-4">
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent font-bold px-4 flex items-center gap-2">
          <Bell className="w-3 h-3" />
          Alert Preferences
        </h4>
        <div className="glass overflow-hidden rounded-3xl border border-white/5 divide-y divide-white/5">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => toggleNotification(key)}>
              <div className="space-y-1">
                <span className="text-sm font-display font-bold text-text capitalize tracking-tightest group-hover:text-accent transition-colors">{key} Notifications</span>
                <p className="text-[10px] text-muted font-mono uppercase tracking-widest leading-none">Status updates & reminders</p>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-all ${value ? 'bg-accent' : 'bg-surface3'}`}>
                <motion.div 
                  initial={false}
                  animate={{ x: value ? 24 : 0 }}
                  className="w-4 h-4 rounded-full bg-white shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Privacy & Data */}
      <div className="space-y-4">
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-accent2 font-bold px-4 flex items-center gap-2">
          <ShieldCheck className="w-3 h-3" />
          Data & Privacy
        </h4>
        <div className="glass overflow-hidden rounded-3xl border border-white/5 divide-y divide-white/5">
           <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center border border-white/5">
                  <Lock className="w-5 h-5 text-accent2" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-display font-bold text-text tracking-tightest group-hover:text-accent transition-colors">Biometric Authentication</span>
                  <p className="text-[10px] text-muted font-mono uppercase tracking-widest leading-none">Use Face ID or Touch ID</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-all bg-accent2`}>
                <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
              </div>
           </div>
           
           <div className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface2 flex items-center justify-center border border-white/5">
                  <Globe className="w-5 h-5 text-accent" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-display font-bold text-text tracking-tightest group-hover:text-accent transition-colors">Location Tracking</span>
                  <p className="text-[10px] text-muted font-mono uppercase tracking-widest leading-none">Gas station auto-detection</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-all bg-accent`}>
                <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
              </div>
           </div>
        </div>
      </div>

       {/* Footer Actions */}
       <div className="space-y-3 pb-8">
         <button className="w-full flex items-center justify-between p-5 glass rounded-2xl border border-white/5 text-muted hover:text-text hover:border-white/20 transition-all group">
            <div className="flex items-center gap-4">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-display font-bold tracking-tightest">Support & Help Center</span>
            </div>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
         </button>
         
         <button className="w-full flex items-center justify-between p-5 glass rounded-2xl border border-white/5 text-muted hover:text-accent4 group active:scale-95 transition-all">
            <div className="flex items-center gap-4 group-hover:gap-6 transition-all">
              <LogOut className="w-5 h-5 text-accent4" />
              <span className="text-sm font-display font-bold tracking-tightest text-accent4">Electronic Exit</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-60 transition-opacity whitespace-nowrap">Sign Out Globally</span>
         </button>

         <button className="w-full flex items-center justify-between p-5 glass rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 group active:scale-95 transition-all mt-4">
            <div className="flex items-center gap-4 group-hover:gap-6 transition-all">
              <Trash2 className="w-5 h-5" />
              <span className="text-sm font-display font-bold tracking-tightest">Delete Account Data</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-60 transition-opacity whitespace-nowrap">Permanent Hard Delete</span>
         </button>
       </div>

       {/* Legal links */}
       <div className="flex justify-center gap-8 py-4">
          <span onClick={() => setActiveModal('privacy')} className="text-[10px] font-mono text-muted uppercase tracking-widest cursor-pointer hover:text-accent hover:underline underline-offset-4 transition-all">Privacy</span>
          <span onClick={() => setActiveModal('terms')} className="text-[10px] font-mono text-muted uppercase tracking-widest cursor-pointer hover:text-accent hover:underline underline-offset-4 transition-all">Terms</span>
          <span className="text-[10px] font-mono text-muted uppercase tracking-widest cursor-pointer hover:text-accent hover:underline underline-offset-4 transition-all italic">v1.2.0</span>
       </div>

       {/* Legal Modals */}
       <AnimatePresence>
         {activeModal === 'terms' && (
           <motion.div 
             initial={{ opacity: 0, y: 100 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 100 }}
             className="fixed inset-0 z-50 flex flex-col bg-bg/95 backdrop-blur-3xl overflow-y-auto no-scrollbar"
           >
             <div className="sticky top-0 p-6 flex items-center justify-between bg-bg/80 backdrop-blur-xl border-b border-white/5 z-10 w-full max-w-lg mx-auto">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-accent2/20 flex items-center justify-center text-accent2 border border-accent2/30">
                      <Scale className="w-5 h-5" />
                   </div>
                   <h2 className="font-display font-black text-xl tracking-tightest">Terms & Conditions</h2>
                </div>
                <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-muted hover:text-text active:scale-95 transition-all">
                   <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="w-full max-w-lg mx-auto p-6 space-y-8 pb-32">
                <p className="text-muted text-xs font-mono uppercase tracking-widest">Effective Date: October 1, 2026</p>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent2 uppercase tracking-widest">1. Agreement to Terms</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">By downloading, accessing, or using AutoTrack, you agree to these Terms. If you do not agree, you must not use the app.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent2 uppercase tracking-widest">2. Description of Service</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">AutoTrack provides tools to:<br/>• Track vehicle expenses (fuel, tolls, maintenance, insurance, depreciation)<br/>• Generate financial insights and reports<br/>• Manage vehicles (individual and fleet)<br/><br/>The Service is provided for informational and organizational purposes only.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent2 uppercase tracking-widest">3. No Financial Advice</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">AutoTrack does NOT provide financial, tax, or investment advice. All calculations (including depreciation and forecasts) are <strong className="text-text">Estimates only</strong> and are <strong className="text-text">Not guaranteed to be accurate</strong>.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent2 uppercase tracking-widest">4. Subscriptions</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">If you subscribe, payment is charged via Apple App Store or Google Play Store. Subscriptions automatically renew unless canceled. You must manage them via your store account settings.<br/><br/><strong className="text-text">Cancellation:</strong> Takes effect at the end of the billing cycle.<br/><strong className="text-text">Refunds:</strong> Managed by Apple/Google policies. AutoTrack does not issue direct refunds.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent2 uppercase tracking-widest">5. User Content & Data</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">You are responsible for all data entered into AutoTrack and ensuring its accuracy. You grant us a license to process your data to provide app functionality.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent2 uppercase tracking-widest">6. Third-Party Integrations</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">AutoTrack may connect to Salik, Darb, or Aber. We are NOT affiliated with these services, do NOT control their systems, and are NOT responsible for their data accuracy.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent2 uppercase tracking-widest">7. Limitation of Liability</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">To the maximum extent permitted by law, AutoTrack is NOT liable for financial losses, incorrect calculations, missed maintenance or deadlines, or third-party data errors.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent2 uppercase tracking-widest">8. Termination & 9. Law</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">We may suspend or terminate access if Terms are violated or required by law. Users may delete accounts at any time.<br/><br/>These Terms are governed by the laws of the United Arab Emirates.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent2 uppercase tracking-widest">10. Contact</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">📧 legal@autotrack.io<br/>📍 Internet City, Dubai, UAE</p>
                   </div>
                </div>
             </div>
           </motion.div>
         )}

         {activeModal === 'privacy' && (
           <motion.div 
             initial={{ opacity: 0, y: 100 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 100 }}
             className="fixed inset-0 z-50 flex flex-col bg-bg/95 backdrop-blur-3xl overflow-y-auto no-scrollbar"
           >
             <div className="sticky top-0 p-6 flex items-center justify-between bg-bg/80 backdrop-blur-xl border-b border-white/5 z-10 w-full max-w-lg mx-auto">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30">
                      <FileText className="w-5 h-5" />
                   </div>
                   <h2 className="font-display font-black text-xl tracking-tightest">Privacy Policy</h2>
                </div>
                <button onClick={() => setActiveModal(null)} className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-muted hover:text-text active:scale-95 transition-all">
                   <X className="w-5 h-5" />
                </button>
             </div>
             
             <div className="w-full max-w-lg mx-auto p-6 space-y-8 pb-32">
                <p className="text-muted text-xs font-mono uppercase tracking-widest">Effective Date: October 1, 2026</p>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent uppercase tracking-widest">1. Overview</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">AutoTrack complies with the UAE Personal Data Protection Law (PDPL), Apple App Store Privacy Guidelines, and Google Play User Data Policy.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent uppercase tracking-widest">2. Data We Collect</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <ul className="list-disc list-inside text-sm text-muted leading-relaxed space-y-1">
                        <li><strong className="text-text">Personal:</strong> Name, Email, Phone number</li>
                        <li><strong className="text-text">Financial & Vehicle:</strong> Expenses, vehicle details, purchase cost (for depreciation)</li>
                        <li><strong className="text-text">Integration:</strong> Toll system data (if connected)</li>
                        <li><strong className="text-text">Usage:</strong> Device info, app interactions, logs</li>
                      </ul>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent uppercase tracking-widest">3. How We Use Data</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">We use data explicitly to provide core app functionality, sync expenses and integrations, generate insights and reports, improve user experience, and send notifications.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent uppercase tracking-widest">4. Data Sharing & 5. Retention</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">We do NOT sell personal data.<br/><br/>We may share data with service providers (cloud storage, analytics), third-party integrations (e.g. Toll systems, if the user connects), and legal authorities when required by law.<br/><br/>We retain data while your account is active or as required by law. After deletion, data may remain in backups temporarily.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent uppercase tracking-widest">6. User Rights & 7. Security</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">You can access, edit, delete your account, and request a data export at any time. Address requests to 📧 privacy@autotrack.io.<br/><br/>We use HTTPS encryption, secure storage, and strict access controls.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent uppercase tracking-widest">8. Children's Privacy</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">AutoTrack is NOT intended for users under 18. We do not knowingly collect data from children.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent uppercase tracking-widest">9. Third-Party & 10. Transfers</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">We use third-party services, but are not responsible for their privacy practices. Your data may be processed on secure servers outside your country.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="font-display font-black text-lg text-accent uppercase tracking-widest">11. Changes & 12. Contact</h3>
                   <div className="glass p-5 rounded-2xl border border-white/5 space-y-3">
                      <p className="text-sm text-muted leading-relaxed">We may update this Privacy Policy. Users will be notified of significant changes.<br/><br/>📧 privacy@autotrack.io<br/>📍 Internet City, Dubai, UAE</p>
                   </div>
                </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  )
}

export default Settings
