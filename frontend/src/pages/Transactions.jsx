import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, XCircle, Clock, MessageSquare, ShieldCheck, Activity, Check, Search, Hash, ShieldAlert } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';
function fmt(v) { const n = Number(v); if (!v || isNaN(n)) return '₹0'; if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`; if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`; return `₹${n.toFixed(0)}`; }
function fmtLabel(s) { return s ? String(s).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : ''; }

const STATUS_FILTERS = ['All', 'recovered', 'failed', 'escalated', 'stopped', 'promise_to_pay'];

const SS = {
  recovered: { pill: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-500', label: 'Recovered' },
  promise_to_pay: { pill: 'bg-violet-500/10 text-violet-400 border border-violet-500/20', dot: 'bg-violet-500', label: 'Promise to Pay' },
  failed: { pill: 'bg-red-500/10 text-red-400 border border-red-500/20', dot: 'bg-red-500', label: 'Failed' },
  escalated: { pill: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-500', label: 'Escalated' },
  stopped: { pill: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20', dot: 'bg-zinc-500', label: 'Stopped' },
};

export default function Transactions() {
  const [logs, setLogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/audit?limit=100&t=${Date.now()}`).then(r => {
      const w = r.data.map((l, i) => ({ ...l, timeAgo: i === 0 ? 'Just now' : i < 5 ? `${i * 2}m ago` : `${Math.floor(i * 4.5)}m ago` }));
      setLogs(w);
      if (w.length > 0) setSelected(w[0]);
    }).catch(console.error);
  }, []);

  const filtered = logs.filter(l => {
    const matchStatus = filter === 'All' || l.final_status === filter;
    const matchSearch = !search || l.transaction_id.toLowerCase().includes(search.toLowerCase()) || fmtLabel(l.diagnosis).toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const s = selected ? (SS[selected.final_status] || SS.stopped) : null;

  return (
    <div className="w-full px-6 py-24 bg-[#050505] min-h-screen selection:bg-indigo-500/30">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* ── LEFT COLUMN: MASTER LIST ── */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8 animate-fade-in-up">
          
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Transactions</h1>
            <p className="text-base text-zinc-400 font-medium">Complete audit ledger.</p>
          </div>

          <div className="flex flex-col gap-4 sticky top-24 z-10 bg-[#050505] pb-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search size={18} className="text-zinc-500" />
              </div>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search ID or diagnosis..."
                className="w-full h-14 pl-12 pr-4 bg-[#0c0c0e] border border-white/10 rounded-2xl text-base text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {STATUS_FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200
                    ${filter === f ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-[#0c0c0e] text-zinc-500 border border-white/5 hover:text-white hover:bg-white/5'}`}>
                  {f === 'All' ? 'All' : fmtLabel(f)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filtered.map((log) => {
              const ss = SS[log.final_status] || SS.stopped;
              const isActive = selected?.event_id === log.event_id;
              return (
                <button key={log.event_id} onClick={() => setSelected(log)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 card-hover
                    ${isActive ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.15)]' : 'bg-[#0c0c0e] border-white/5 hover:border-white/10'}`}>
                  
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] ${ss.dot}`} style={{ color: ss.dot.replace('bg-', '') }} />
                      <span className="text-base font-bold text-white">{log.transaction_id}</span>
                    </div>
                    <span className="text-xs font-semibold text-zinc-500 whitespace-nowrap">{log.timeAgo}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-400 truncate pr-4">{fmtLabel(log.diagnosis)}</span>
                    {log.transcript && <MessageSquare size={16} className="text-indigo-400 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
                <Search size={32} className="text-zinc-600" />
                <p className="text-base text-zinc-500 font-medium">No transactions match.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: DETAIL VIEW ── */}
        <div className="w-full lg:w-2/3 animate-fade-in-up delay-200">
          <div className="sticky top-24">
            {selected && s ? (
              <div className="bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-8 mb-10">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Hash size={16} className="text-zinc-500" />
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Transaction Details</p>
                    </div>
                    <p className="text-lg text-zinc-300 font-mono bg-black/40 inline-flex px-4 py-2 rounded-xl border border-white/5 mb-4 shadow-inner">{selected.transaction_id}</p>
                    <p className="text-5xl lg:text-6xl font-bold text-white tracking-tighter">{fmt(selected.amount || (selected.recovery_probability > 0 ? Math.round(selected.expected_recovery_value / selected.recovery_probability) : selected.expected_recovery_value))}</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-3">
                    <span className={`inline-flex px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${s.pill}`}>{s.label}</span>
                    <span className="text-sm font-semibold text-zinc-400 bg-black/20 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/5"><Clock size={14} />{selected.timeAgo}</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-white/5 relative z-10 mb-10">
                  {[
                    { label: 'Recovery Prob', value: `${((selected.recovery_probability || 0) * 100).toFixed(1)}%` },
                    { label: 'Expected Value', value: fmt(selected.expected_recovery_value) },
                    { label: 'Recovered', value: fmt(selected.recovered_amount) },
                  ].map((m, i) => (
                    <div key={i} className="bg-black/30 border border-white/5 rounded-2xl p-6 shadow-inner">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{m.label}</p>
                      <p className="text-2xl font-bold text-white">{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* Diagnosis */}
                <div className="pt-8 border-t border-white/5 relative z-10 mb-10">
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-3 mb-4">
                    <Activity size={18} className="text-indigo-400" /> Root Cause Diagnosis
                  </h3>
                  <p className="text-2xl font-bold text-white mb-4">{fmtLabel(selected.diagnosis)}</p>
                  <div className="bg-black/20 rounded-2xl p-6 border border-white/5 space-y-3">
                    {(selected.evidence || []).map((e, i) => (
                      <p key={i} className="text-base text-zinc-300 font-medium flex items-start gap-3">
                        <span className="text-zinc-600">→</span>{e}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Policy Guardrails */}
                <div className="pt-8 border-t border-white/5 relative z-10 mb-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-3">
                      <ShieldCheck size={18} className="text-emerald-400" /> Policy Guardrails
                    </h3>
                    <span className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold uppercase tracking-wider">{fmtLabel(selected.selected_action)}</span>
                  </div>
                  <div className="space-y-3">
                    {(selected.policy_checks || []).map((c, i) => (
                      <div key={i} className="flex items-center gap-3 text-base text-zinc-300 font-medium"><CheckCircle2 size={18} className="text-emerald-500" />{c}</div>
                    ))}
                    {!selected.policy_approved && (
                      <div className="flex items-center gap-3 text-base text-amber-400 font-bold mt-4"><XCircle size={18} />Blocked by risk constraints</div>
                    )}
                  </div>
                </div>

                {/* Transcript */}
                {selected.transcript && (
                  <div className="pt-8 border-t border-white/5 relative z-10">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-3 mb-6">
                      <MessageSquare size={18} className="text-purple-400" /> Agent Conversation
                    </h3>
                    <div className="bg-[#050505] rounded-3xl p-8 space-y-6 border border-white/5 shadow-inner">
                      {selected.transcript.map((msg, i) => {
                        const isAgent = msg.sender === 'agent';
                        const isWA = selected.selected_action === 'hinglish_whatsapp_nudge';
                        return (
                          <div key={i} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-base font-medium leading-relaxed
                              ${isAgent
                                ? isWA ? 'bg-[#005C4B] text-white rounded-br-sm' : 'bg-indigo-600 text-white rounded-br-sm'
                                : 'bg-[#16161a] text-zinc-300 border border-white/5 rounded-bl-sm'}`}>
                              {msg.message}
                              {isAgent && <div className="flex justify-end mt-2"><Check size={14} className="text-white/60" /></div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center gap-6 shadow-2xl">
                <div className="w-20 h-20 rounded-3xl bg-black/50 border border-white/5 flex items-center justify-center">
                  <ShieldAlert size={32} className="text-zinc-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">No Transaction Selected</h3>
                  <p className="text-base text-zinc-500 font-medium">Select a transaction from the ledger to view details.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
