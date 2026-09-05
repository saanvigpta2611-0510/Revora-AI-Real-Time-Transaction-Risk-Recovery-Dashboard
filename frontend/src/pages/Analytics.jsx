import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { RefreshCw, Clock, PhoneCall, Mail, AlertTriangle, PauseCircle, Users, BarChart3, TrendingUp } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';
function fmt(v) { const n = Number(v); if (!v || isNaN(n)) return '₹0'; if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`; if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`; return `₹${n.toFixed(0)}`; }
function fmtLabel(s) { return s ? String(s).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : ''; }

const RISK_SEGMENTS = [
  { name: 'High Value / Low Risk', count: 124, value: 4820000, color: '#10B981', pct: 89 },
  { name: 'Medium Risk', count: 382, value: 9240000, color: '#F59E0B', pct: 62 },
  { name: 'High Risk / Churnable', count: 186, value: 3410000, color: '#EF4444', pct: 38 },
  { name: 'B2B Overdue', count: 34, value: 18700000, color: '#8B5CF6', pct: 74 },
  { name: 'Checkout Abandoned', count: 274, value: 5630000, color: '#6366F1', pct: 81 },
];

const SMART_RETRY = [
  { time: '8AM', prob: 12 }, { time: '10AM', prob: 28 }, { time: '12PM', prob: 45 }, { time: '2PM', prob: 52 },
  { time: '4PM', prob: 61 }, { time: '6PM', prob: 76 }, { time: '8PM', prob: 84 }, { time: '10PM', prob: 67 }, { time: 'Mid', prob: 32 },
];

const ACTIONS = [
  { icon: <RefreshCw size={24} className="text-blue-400" />, label: 'Immediate Retry', pct: '23%', count: '230', desc: 'Transient failures retried within 5 minutes of failure.' },
  { icon: <Clock size={24} className="text-emerald-400" />, label: 'Smart Delay Retry', pct: '29%', count: '290', desc: 'Retried at predicted optimal salary-day time window.' },
  { icon: <PhoneCall size={24} className="text-green-400" />, label: 'Hinglish WA Nudge', pct: '18%', count: '180', desc: 'Conversational Hinglish recovery for abandoned checkouts.' },
  { icon: <Mail size={24} className="text-purple-400" />, label: 'B2B Email Chaser', pct: '9%', count: '90', desc: 'Automated professional chasers for B2B overdue invoices.' },
  { icon: <AlertTriangle size={24} className="text-amber-400" />, label: 'Escalated to Human', pct: '13%', count: '130', desc: 'High-risk or high-value transactions flagged for manual review.' },
  { icon: <PauseCircle size={24} className="text-zinc-400" />, label: 'Stopped by AI', pct: '8%', count: '80', desc: 'AI determined intervention would cause more harm than good.' },
];

export default function Analytics() {
  const [chartData, setChartData] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE}/analytics/failure_types?t=${Date.now()}`).then(r => {
      setChartData(r.data.sort((a, b) => b.total_amount - a.total_amount));
    }).catch(console.error);
  }, []);

  return (
    <div className="w-full px-6 py-24 bg-[#050505] min-h-screen selection:bg-indigo-500/30">
      <div className="max-w-[1400px] mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-400 text-xs font-bold uppercase tracking-wider mb-6">
            <BarChart3 size={14} /> Analytics Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Deep Analytics</h1>
          <p className="text-lg text-zinc-400 font-medium max-w-2xl">Risk patterns, recovery strategies, and intervention outcomes analyzed across the entire dataset.</p>
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-24 animate-fade-in-up delay-100">
          <div className="xl:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-10 relative z-10">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Recovery by Root Cause</h3>
                <p className="text-base text-zinc-400 font-medium">Revenue at risk vs recovered per failure category</p>
              </div>
              <div className="flex gap-6 text-sm font-semibold text-zinc-400 bg-white/5 px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-md">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />At Risk</span>
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />Recovered</span>
              </div>
            </div>
            <div className="h-[350px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="failure_type" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A', fontWeight: 500 }} dy={15} tickFormatter={fmtLabel} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A', fontWeight: 500 }} dx={-5} tickFormatter={v => `₹${v / 1000}k`} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#fff', fontWeight: 600 }} formatter={(v, n) => [fmt(v), n]} labelFormatter={fmtLabel} />
                  <Bar dataKey="total_amount" name="At Risk" fill="#27272A" radius={[4, 4, 4, 4]} barSize={24} />
                  <Bar dataKey="recovered_amount" name="Recovered" fill="#3B82F6" radius={[4, 4, 4, 4]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10 mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Smart Retry Timing</h3>
              <p className="text-base text-zinc-400 font-medium">AI-predicted peak recovery window</p>
            </div>
            <div className="h-[250px] relative z-10 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SMART_RETRY} margin={{ top: 10, right: 0, left: -25, bottom: 25 }}>
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A', fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717A', fontWeight: 500 }} tickFormatter={v => `${v}%`} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#fff', fontWeight: 600 }} formatter={(v) => [`${v}%`, 'Prob.']} />
                  <Bar dataKey="prob" radius={[4, 4, 4, 4]} barSize={20}>
                    {SMART_RETRY.map((e, i) => <Cell key={i} fill={e.prob === 84 ? '#10B981' : '#27272A'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center gap-4 relative z-10">
              <div className="p-2 bg-emerald-500/20 rounded-lg"><Clock size={20} className="text-emerald-400" /></div>
              <p className="text-sm text-emerald-100 font-medium">Best window: <span className="font-bold text-white">8 PM</span> (84% probability)</p>
            </div>
          </div>
        </div>

        {/* ── RISK SEGMENTATION ── */}
        <div className="mb-24 animate-fade-in-up delay-200">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-3 flex items-center gap-3">
              <Users size={28} className="text-zinc-500" />
              Customer Risk Segmentation
            </h2>
            <p className="text-lg text-zinc-400 font-medium">AI-classified cohorts by failure pattern and recovery potential.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            {RISK_SEGMENTS.map((seg, i) => {
              const isSel = selectedSegment?.name === seg.name;
              return (
                <button key={i} onClick={() => setSelectedSegment(isSel ? null : seg)}
                  className={`text-left rounded-3xl p-8 transition-all duration-300 border relative overflow-hidden group
                    ${isSel ? 'border-white/20 bg-[#16161a] scale-[1.02] shadow-2xl' : 'border-white/5 bg-[#0c0c0e] hover:bg-[#111115] hover:border-white/10'}`}>
                  {isSel && <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${seg.color}, transparent)` }} />}
                  
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ background: seg.color, color: seg.color }} />
                    <p className="text-lg font-bold text-white">{seg.pct}%</p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-500 mb-2 uppercase tracking-wide relative z-10">{seg.name}</p>
                  <p className="text-3xl font-bold text-white mb-2 relative z-10">{seg.count}</p>
                  <p className="text-sm text-zinc-400 font-medium mb-6 relative z-10">{fmt(seg.value)} at risk</p>
                  
                  <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden relative z-10">
                    <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_currentColor]" style={{ width: `${seg.pct}%`, background: seg.color, color: seg.color }} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className={`transition-all duration-500 overflow-hidden ${selectedSegment ? 'max-h-[400px] opacity-100 mt-8' : 'max-h-0 opacity-0'}`}>
            {selectedSegment && (
              <div className="bg-[#111115] border border-white/10 rounded-3xl p-10 flex flex-col xl:flex-row xl:items-center justify-between gap-10 shadow-2xl">
                <div className="space-y-3">
                  <h4 className="text-2xl font-bold text-white">{selectedSegment.name}</h4>
                  <p className="text-lg text-zinc-400 font-medium">Recommended Strategy: <span className="font-bold text-white px-3 py-1 bg-white/10 rounded-lg ml-2">{selectedSegment.action || 'Autonomous Protocol'}</span></p>
                </div>
                <div className="flex flex-wrap gap-12">
                  {[
                    { label: 'Customers', value: selectedSegment.count.toLocaleString() },
                    { label: 'Revenue At Risk', value: fmt(selectedSegment.value) },
                    { label: 'Recovery Rate', value: `${selectedSegment.pct}%` },
                  ].map((m, i) => (
                    <div key={i} className="space-y-2">
                      <p className="text-3xl font-bold text-white tracking-tight">{m.value}</p>
                      <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── AGENT ACTION BREAKDOWN ── */}
        <div className="pt-24 border-t border-white/5 animate-fade-in-up delay-300">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight mb-3 flex items-center gap-3">
              <TrendingUp size={28} className="text-zinc-500" />
              Intervention Strategies
            </h2>
            <p className="text-lg text-zinc-400 font-medium">Distribution of automated actions executed by the policy engine.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {ACTIONS.map((a, i) => (
              <div key={i} className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-8 hover:bg-[#111115] hover:border-white/10 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    {a.icon}
                  </div>
                  <p className="text-3xl font-bold text-white">{a.pct}</p>
                </div>
                <p className="text-xl font-bold text-white mb-3">{a.label}</p>
                <p className="text-base text-zinc-400 font-medium leading-relaxed mb-6">{a.desc}</p>
                <div className="pt-6 border-t border-white/5">
                  <p className="text-sm font-semibold text-zinc-500"><span className="text-white mr-2">{a.count}</span> transactions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
