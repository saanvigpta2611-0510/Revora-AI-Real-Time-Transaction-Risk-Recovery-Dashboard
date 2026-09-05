import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Play, Loader2, Sparkles, Activity } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const navItems = [
  { to: '/', label: 'Home', exact: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/intelligence', label: 'Intelligence' },
  { to: '/analytics', label: 'Analytics' },
];

export default function Layout() {
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [testModalOpen, setTestModalOpen] = React.useState(false);
  const [testAmount, setTestAmount] = React.useState(1500);
  const [testType, setTestType] = React.useState('insufficient_funds');

  const runRecovery = async () => {
    setLoading(true); setProgress(0);
    const iv = setInterval(() => setProgress(p => Math.min(p + Math.random() * 9, 93)), 180);
    try {
      await axios.post(`${API_BASE}/recovery/run`);
      clearInterval(iv); setProgress(100);
      navigate('/dashboard');
    } catch (e) { console.error(e); clearInterval(iv); }
    setTimeout(() => { setLoading(false); setProgress(0); }, 700);
  };

  const injectTest = async () => {
    setLoading(true);
    setTestModalOpen(false);
    try {
      await axios.post(`${API_BASE}/recovery/inject`, { amount: Number(testAmount), failure_type: testType });
      navigate('/transactions');
      window.location.reload(); // Quick way to ensure the new tx shows up
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased selection:bg-indigo-500/30">

      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.05] bg-black/40 backdrop-blur-2xl">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)] group-hover:shadow-[0_0_25px_rgba(79,70,229,0.7)] transition-all relative">
              <img src="/src/assets/logo.jpg" alt="Revora Logo" className="w-full h-full object-cover scale-[1.7] -translate-y-1" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Revora</span>
          </NavLink>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} end={item.exact}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-white/10 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'}`
                }>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setTestModalOpen(true)} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white shadow-sm">
              Simulate Live Transaction
            </button>
            <button onClick={runRecovery} disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                ${loading
                  ? 'bg-zinc-800 text-zinc-400 cursor-wait'
                  : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:scale-105'}`}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="fill-black" />}
              {loading ? 'Processing...' : 'Run Simulation'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }} />
        )}
      </nav>

      <div className="pt-16">
        <Outlet />
      </div>

      {testModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-bold text-white mb-4">Simulate Live Transaction</h3>
            <p className="text-sm text-zinc-400 mb-6">Manually trigger a failed transaction and watch the AI handle it in real-time.</p>
            
            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Transaction Amount (₹)</label>
              <input type="number" value={testAmount} onChange={e => setTestAmount(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors" />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Simulated Root Cause</label>
              <select value={testType} onChange={e => setTestType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer">
                <option value="insufficient_funds" className="bg-zinc-900 text-white">Insufficient Funds (Low Risk)</option>
                <option value="network_error" className="bg-zinc-900 text-white">Bank Network Error (Medium Risk)</option>
                <option value="b2b_receivable_overdue" className="bg-zinc-900 text-white">B2B Invoice Overdue (High Value)</option>
                <option value="high_risk" className="bg-zinc-900 text-white">Fraud / High Risk (Policy Blocked)</option>
                <option value="checkout_abandoned" className="bg-zinc-900 text-white">Checkout Abandoned</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setTestModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={injectTest} className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-[0_0_15px_rgba(79,70,229,0.4)]">Trigger AI Recovery</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
