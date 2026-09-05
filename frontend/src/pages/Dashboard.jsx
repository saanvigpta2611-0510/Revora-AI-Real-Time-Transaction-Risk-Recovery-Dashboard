import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Cpu, Server, ShieldCheck, PieChart, Activity, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const API_BASE = 'http://localhost:8000/api';
function fmt(v) { const n = Number(v); if (!v || isNaN(n)) return '₹0'; if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`; if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`; return `₹${n.toFixed(0)}`; }
function fmtLabel(s) { return s ? String(s).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : ''; }

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_BASE}/metrics?t=${Date.now()}`),
      axios.get(`${API_BASE}/analytics/failure_types?t=${Date.now()}`)
    ]).then(([sRes, cRes]) => {
      setStats(sRes.data);
      setChart(cRes.data.sort((a, b) => b.total_amount - a.total_amount));
      setLoading(false);
    }).catch(console.error);
  }, []);

  const runSim = () => {
    setLoading(true);
    axios.post(`${API_BASE}/recovery/run`).then(() => window.location.reload()).catch(console.error);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 relative flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <Zap className="text-indigo-500 animate-pulse" size={24} />
      </div>
      <p className="text-lg font-medium text-zinc-400 animate-pulse">Running Revora Simulation Engine...</p>
    </div>
  );

  if (!stats) return null;
  const rr = stats.revenue_at_risk > 0 ? ((stats.ai_recovered / stats.revenue_at_risk) * 100).toFixed(1) : '0.0';

  return (
    <div className="w-full px-6 py-24 bg-[#050505] min-h-screen selection:bg-indigo-500/30">
      <div className="max-w-[1400px] mx-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Online
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">Live Operations</h1>
            <p className="text-lg text-zinc-400 font-medium max-w-xl">Real-time autonomous revenue recovery overview across all connected payment gateways.</p>
          </div>
          <button onClick={runSim} className="flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]">
            <Server size={18} /> Run New Simulation
          </button>
        </div>

        <div className="space-y-12">
          
          {/* ── KPI GRID ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-fade-in-up delay-100">
            {[
              { label: 'Revenue at Risk', val: fmt(stats.revenue_at_risk), color: 'text-white' },
              { label: 'AI Recovered', val: fmt(stats.ai_recovered), color: 'text-indigo-400' },
              { label: 'Recovery Rate', val: `${rr}%`, color: 'text-white' },
              { label: 'Transactions Processed', val: (stats.total_failed || 1000).toLocaleString(), color: 'text-white' },
            ].map((k, i) => (
              <div key={i} className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-4 relative z-10">{k.label}</p>
                <p className={`text-5xl font-bold tracking-tight relative z-10 ${k.color}`}>{k.val}</p>
              </div>
            ))}
          </div>

          {/* ── CHARTS ROW ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in-up delay-200">
            
            {/* Root Cause Chart */}
            <div className="xl:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
              <div className="relative z-10 mb-10">
                <h2 className="text-2xl font-bold text-white mb-2">Root Cause Impact</h2>
                <p className="text-base text-zinc-400 font-medium">Revenue at risk broken down by AI diagnosis</p>
              </div>
              <div className="h-[350px] relative z-10 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chart.slice(0, 6)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="failure_type" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A', fontWeight: 500 }} dy={15} tickFormatter={v => v.split('_')[0].toUpperCase()} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A', fontWeight: 500 }} tickFormatter={v => `₹${v / 1000}k`} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#fff', fontWeight: 600 }} formatter={(v) => [fmt(v), 'At Risk']} labelFormatter={fmtLabel} />
                    <Bar dataKey="total_amount" radius={[6, 6, 6, 6]} barSize={32}>
                      {chart.map((e, i) => <Cell key={i} fill={i === 0 ? '#4F46E5' : '#27272A'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Decision Funnel */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative z-10 mb-12">
                <h2 className="text-2xl font-bold text-white mb-2">AI Decision Funnel</h2>
                <p className="text-base text-zinc-400 font-medium">Policy engine execution flow</p>
              </div>
              
              <div className="space-y-8 relative z-10">
                {[
                  { label: 'Failures Detected', val: '1,000', pct: '100%' },
                  { label: 'Policy Approved', val: '920', pct: '92%' },
                  { label: 'Interventions Executed', val: '920', pct: '92%' },
                  { label: 'Successfully Recovered', val: '320', pct: '32%' },
                ].map((s, i) => (
                  <div key={i} className="space-y-3" style={{ opacity: 1 - i * 0.15 }}>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-medium text-zinc-400">{s.label}</span>
                      <span className="text-xl font-bold text-white">{s.val}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: s.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── BENTO NAVIGATION ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-300">
            {[
              { title: 'Agent Intelligence', desc: 'Trace the exact reasoning for every automated action.', icon: <Cpu size={28} className="text-indigo-400" />, path: '/intelligence' },
              { title: 'Transactions Audit', desc: 'View the master ledger of all processed events.', icon: <ShieldCheck size={28} className="text-purple-400" />, path: '/transactions' },
              { title: 'Deep Analytics', desc: 'Explore risk segmentation and recovery trends.', icon: <PieChart size={28} className="text-emerald-400" />, path: '/analytics' },
            ].map((f, i) => (
              <button key={i} onClick={() => navigate(f.path)}
                className="group text-left bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 hover:bg-[#111115] transition-all duration-300 relative overflow-hidden card-hover">
                <div className="absolute right-8 top-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                  <ArrowUpRight size={20} className="text-white" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-base text-zinc-400 font-medium leading-relaxed">{f.desc}</p>
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
