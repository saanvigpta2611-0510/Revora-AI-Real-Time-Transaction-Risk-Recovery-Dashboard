import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, MessageSquare, Cpu, Target, Zap, LayoutDashboard, CheckCircle2, Activity, Play } from 'lucide-react';

const STATS = [
  { value: '1,000+', label: 'Transactions Processed' },
  { value: '32.4%', label: 'Recovery Rate' },
  { value: '₹36L+', label: 'Revenue Recovered' },
  { value: '0', label: 'Human Touchpoints' },
];

const HOW = [
  { n: '01', title: 'Failure Detected', desc: 'A payment fails. Revora captures the webhook event in under 100ms.' },
  { n: '02', title: 'AI Diagnosis', desc: 'Root cause classified across 8 failure types with 94% accuracy.' },
  { n: '03', title: 'Recovery Scored', desc: 'ML model assigns a recovery probability score to each transaction.' },
  { n: '04', title: 'Policy Validation', desc: 'Guardrails check retry limits, risk score, and customer history.' },
  { n: '05', title: 'Intervention Fired', desc: 'Smart retry, WhatsApp nudge, or email chaser dispatched automatically.' },
  { n: '06', title: 'Revenue Captured', desc: 'Payment recovered. Full audit trail written. Zero human involvement.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col bg-[#050505] text-white selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* ── HYPER-PREMIUM BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle animated grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] animate-[spin_120s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/80 to-[#050505]" />
        
        {/* Floating animated orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-10%] w-[30vw] h-[30vw] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 w-full px-6 pt-48 pb-32 flex flex-col items-center min-h-[95vh] justify-center">
        
        <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col items-center text-center">
          
          <div onClick={() => navigate('/intelligence')} className="group inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-sm font-semibold mb-10 backdrop-blur-md shadow-2xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">Revora Intelligence Core v2.0 is Live</span>
            <svg className="w-4 h-4 ml-1 text-purple-300 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white mb-6 py-2 drop-shadow-2xl">
            Stop losing revenue <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 animate-gradient-x inline-block mt-2">
              to failed payments.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-3xl mb-12 leading-relaxed">
            Revora detects failures, diagnoses root causes, scores recovery probability, and executes interventions — <span className="text-white font-semibold">entirely autonomously.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto relative z-20">
            <button onClick={() => navigate('/dashboard')} className="group relative overflow-hidden w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold text-lg transition-all duration-500 hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]">
              <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="bg-black/10 p-1.5 rounded-full relative z-10">
                <LayoutDashboard size={18} />
              </div>
              <span className="relative z-10">Launch Dashboard</span>
            </button>
            <button onClick={() => navigate('/intelligence')} className="group relative overflow-hidden w-full sm:w-auto flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]">
              <Cpu size={20} className="text-indigo-400 group-hover:animate-pulse relative z-10" />
              <span className="relative z-10">View AI Reasoning</span>
            </button>
          </div>
        </div>

        {/* Abstract Product UI Representation */}
        <div className="w-full max-w-5xl mx-auto mt-20 relative animate-fade-in-up delay-200 perspective-[2000px]">
          {/* Glowing backplate */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/40 via-purple-500/40 to-emerald-500/40 blur-[60px] rounded-[3rem] opacity-70 animate-pulse" style={{ animationDuration: '4s' }}></div>
          
          <div className="relative w-full h-[450px] bg-[#08080a]/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(79,70,229,0.2)] p-8 transform rotate-x-12 scale-[1.02] hover:rotate-x-0 hover:scale-[1.05] transition-all duration-1000 flex flex-col overflow-hidden group">
            
            {/* Top Shine */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:opacity-100 opacity-30 transition-opacity duration-1000"></div>

            {/* Fake UI Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-8">
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 h-8 bg-white/5 border border-white/10 rounded-full flex items-center px-4 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  <div className="w-16 h-2 bg-white/20 rounded-full"></div>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.8)] flex items-center justify-center animate-pulse">
                  <Activity size={16} className="text-white" />
                </div>
              </div>
            </div>
            
            {/* Fake UI Content */}
            <div className="flex gap-6 h-full pb-4">
              {/* Fake Chart */}
              <div className="flex-1 bg-gradient-to-b from-white/[0.04] to-transparent rounded-2xl border border-white/10 p-6 flex flex-col justify-end gap-3 relative overflow-hidden group/chart">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[60px] rounded-full pointer-events-none mix-blend-screen group-hover/chart:bg-indigo-400/30 transition-colors duration-700" />
                <div className="w-48 h-5 bg-white/20 rounded-md mb-auto relative z-10" />
                
                <div className="flex items-end justify-between h-40 relative z-10">
                  {[40, 60, 45, 80, 55, 65, 100].map((h, i) => (
                    <div key={i} className="w-[10%] relative group-hover/chart:scale-y-110 transition-transform origin-bottom duration-500" style={{ transitionDelay: `${i * 30}ms` }}>
                      <div className={`w-full rounded-t-md transition-all duration-500 ${i === 6 ? 'bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.8)] animate-pulse' : 'bg-indigo-500/30 hover:bg-indigo-500/60'}`} style={{ height: `${h}%` }}>
                        {i === 6 && (
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold py-1 px-2 rounded shadow-lg animate-bounce">₹3.2M</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fake Metrics Column */}
              <div className="w-72 flex flex-col gap-6 relative">
                {/* Floating elements */}
                <div className="absolute -left-12 top-1/4 w-10 h-10 bg-purple-500/20 rounded-full blur-xl animate-[ping_3s_infinite]" />
                <div className="absolute -right-8 bottom-1/3 w-16 h-16 bg-emerald-500/20 rounded-full blur-2xl animate-[pulse_4s_infinite]" />

                <div className="flex-1 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 rounded-2xl border border-indigo-500/30 p-6 flex flex-col justify-center relative overflow-hidden group/metric">
                   <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500/30 blur-2xl rounded-full group-hover/metric:scale-150 transition-transform duration-700" />
                   <div className="w-24 h-4 bg-indigo-400/40 rounded-sm mb-3 relative z-10" />
                   <h3 className="text-5xl font-bold text-white mb-3 relative z-10 tracking-tight group-hover/metric:text-transparent group-hover/metric:bg-clip-text group-hover/metric:bg-gradient-to-r group-hover/metric:from-indigo-300 group-hover/metric:to-purple-300 transition-all duration-500">32.4%</h3>
                   <div className="w-full h-2 bg-black/40 rounded-full relative z-10 overflow-hidden border border-white/5">
                     <div className="w-1/3 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] rounded-full animate-[pulse_2s_infinite]" />
                   </div>
                </div>
                
                <div className="flex-1 bg-white/[0.02] rounded-2xl border border-white/5 p-6 flex flex-col justify-center hover:bg-white/[0.05] transition-colors duration-500">
                   <div className="w-20 h-4 bg-white/10 rounded-sm mb-3" />
                   <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group/icon">
                       <div className="absolute inset-0 bg-purple-500/20 translate-y-full group-hover/icon:translate-y-0 transition-transform duration-300"></div>
                       <Zap size={20} className="text-purple-400 relative z-10" />
                     </div>
                     <div>
                       <div className="w-16 h-3 bg-white/20 rounded-sm mb-2" />
                       <div className="w-24 h-3 bg-white/5 rounded-sm" />
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="w-full px-6 py-32 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {STATS.map((s, i) => (
            <div key={i} className="relative group">
              <div className="absolute -inset-4 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <div className="relative">
                <p className="text-5xl lg:text-6xl font-bold text-white tracking-tighter mb-2">{s.value}</p>
                <p className="text-lg text-zinc-400 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES (BENTO BOX) ── */}
      <section className="w-full px-6 py-32 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">Built for Indian payments.</h2>
            <p className="text-xl text-zinc-400 font-medium">Deep integrations and context-aware models for UPI, card networks, and mandate complexities.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Bento Card 1 (Spans 2) */}
            <div className="md:col-span-2 bg-[#0c0c0e] border border-white/10 rounded-3xl p-10 flex flex-col justify-between group overflow-hidden relative card-hover">
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-500" />
              <div className="relative z-10 w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Cpu size={28} className="text-indigo-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3">Root Cause Diagnosis</h3>
                <p className="text-lg text-zinc-400 font-medium max-w-md">Classifies every failure in milliseconds — network error, expired card, bank refusal — before a human even knows.</p>
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-10 flex flex-col justify-between group overflow-hidden relative card-hover">
              <div className="absolute right-0 bottom-0 w-40 h-40 bg-purple-500/10 blur-[60px] rounded-full group-hover:bg-purple-500/20 transition-all duration-500" />
              <div className="relative z-10 w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Target size={28} className="text-purple-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-3">ML Recovery Scoring</h3>
                <p className="text-base text-zinc-400 font-medium">Predicts recovery probability. Low-score cases skipped to protect relationships.</p>
              </div>
            </div>

            {/* Bento Card 3 */}
            <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-10 flex flex-col justify-between group overflow-hidden relative card-hover">
              <div className="absolute right-0 bottom-0 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-500" />
              <div className="relative z-10 w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={28} className="text-emerald-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-3">Policy Guardrails</h3>
                <p className="text-base text-zinc-400 font-medium">Max retry limits, risk thresholds. Zero rogue retries.</p>
              </div>
            </div>

            {/* Bento Card 4 (Spans 2) */}
            <div className="md:col-span-2 bg-[#0c0c0e] border border-white/10 rounded-3xl p-10 flex flex-col justify-between group overflow-hidden relative card-hover">
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all duration-500" />
              <div className="relative z-10 w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare size={28} className="text-blue-400" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-3">Conversational Recovery</h3>
                <p className="text-lg text-zinc-400 font-medium max-w-md">Hinglish WhatsApp nudges for abandoned checkouts. Professional automated email chasers for B2B overdue invoices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="w-full px-6 py-32 bg-[#080808] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
          <div className="lg:w-1/3">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-6 sticky top-32">How it works.</h2>
            <p className="text-lg text-zinc-400 font-medium leading-relaxed sticky top-48">
              From the moment a payment fails to recovery, Revora handles the entire lifecycle autonomously.
            </p>
          </div>
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {HOW.map((h, i) => (
              <div key={i} className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:border-white/20">
                <p className="text-4xl font-bold text-white/60 mb-4">{h.n}</p>
                <h3 className="text-xl font-bold text-white mb-3">{h.title}</h3>
                <p className="text-base text-zinc-300 font-medium leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="w-full px-6 py-40 relative overflow-hidden flex flex-col items-center border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/10" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }} />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-6xl md:text-[5.5rem] font-black text-white tracking-tighter mb-8 leading-[0.95] drop-shadow-2xl">
            See Revora <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">in action.</span>
          </h2>
          <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            Simulate 1,000 real-world failed payments and watch the AI recover them autonomously in seconds.
          </p>
          <ul className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            {['No setup required', 'Full AI reasoning visible', 'Runs in seconds'].map((b, i) => (
              <li key={i} className="flex items-center justify-center gap-3 text-zinc-300 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full font-medium shadow-lg backdrop-blur-md">
                <CheckCircle2 size={18} className="text-emerald-400" /> {b}
              </li>
            ))}
          </ul>
          <button onClick={() => navigate('/dashboard')} className="group relative overflow-hidden flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold text-xl hover:scale-[1.02] transition-all duration-500 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(255,255,255,0.4)]">
            <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-transparent via-black/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="bg-black/10 p-2 rounded-full relative z-10">
               <Play size={20} className="fill-black" />
            </div>
            <span className="relative z-10">Run Live Simulation</span>
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full px-6 py-20 border-t border-white/5 bg-[#050505] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16 relative z-10">
          
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-md overflow-hidden flex items-center justify-center relative shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                <img src="/src/assets/logo.jpg" alt="Revora Logo" className="w-full h-full object-cover scale-[1.7] -translate-y-1" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Revora</span>
            </div>
            <p className="text-zinc-400 font-medium leading-relaxed max-w-sm mb-8">
              Autonomous AI revenue recovery infrastructure for modern enterprises. Stop losing money to failed payments today.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="flex flex-col gap-4">
              {['Dashboard', 'Transactions', 'Intelligence Core', 'Analytics', 'Integrations'].map((link) => (
                <li key={link}><a href="#" className="text-zinc-400 hover:text-white transition-colors font-medium text-sm">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="flex flex-col gap-4">
              {['Documentation', 'API Reference', 'Case Studies', 'Developer Blog', 'Help Center'].map((link) => (
                <li key={link}><a href="#" className="text-zinc-400 hover:text-white transition-colors font-medium text-sm">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="flex flex-col gap-4">
              {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'].map((link) => (
                <li key={link}><a href="#" className="text-zinc-400 hover:text-white transition-colors font-medium text-sm">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <p className="text-sm text-zinc-500 font-medium">© 2026 Revora AI. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">All Systems Operational</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
