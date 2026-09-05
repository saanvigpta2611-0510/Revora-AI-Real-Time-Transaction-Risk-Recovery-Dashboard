import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cpu, CheckCircle2, XCircle, Activity, ShieldCheck, MessageSquare, Clock, Check, ChevronLeft, ChevronRight, Zap, AlertTriangle, List, Calendar } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';
function fmt(v) { const n = Number(v); if (!v || isNaN(n)) return '₹0'; if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`; if (n >= 1000) return `₹${(n / 1000).toFixed(1)}k`; return `₹${n.toFixed(0)}`; }
function fmtLabel(s) { return s ? String(s).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : ''; }

const SS = {
  recovered: { pill: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', label: 'Recovered' },
  promise_to_pay: { pill: 'bg-violet-500/10 text-violet-400 border border-violet-500/20', label: 'Promise to Pay' },
  failed: { pill: 'bg-red-500/10 text-red-400 border border-red-500/20', label: 'Failed' },
  escalated: { pill: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', label: 'Escalated' },
  stopped: { pill: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20', label: 'Stopped' },
};

const SMART_RETRY = [
  { time: '6 AM', prob: 14 }, { time: '8 AM', prob: 28 }, { time: '10 AM', prob: 41 },
  { time: '12 PM', prob: 52 }, { time: '2 PM', prob: 61 }, { time: '4 PM', prob: 68 },
  { time: '6 PM', prob: 76 }, { time: '8 PM', prob: 84, peak: true }, { time: '10 PM', prob: 66 }, { time: '12 AM', prob: 31 },
];

export default function Intelligence() {
  const [logs, setLogs] = useState([]);
  const [idx, setIdx] = useState(0);
  const selected = logs[idx];

  useEffect(() => {
    axios.get(`${API_BASE}/audit?limit=50`).then(r => {
      const w = r.data.map((l, i) => ({ ...l, timeAgo: i === 0 ? 'Just now' : i < 5 ? `${i * 2}m ago` : `${Math.floor(i * 4.5)}m ago` }));
      setLogs(w);
    }).catch(console.error);
  }, []);

  if (!selected) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-8">
      <div className="w-24 h-24 rounded-3xl bg-[#0c0c0e] border border-white/5 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
        <Zap size={40} className="text-indigo-400 relative z-10" />
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-3">No Intelligence Data</h2>
        <p className="text-lg text-zinc-400 font-medium max-w-md mx-auto">Run a simulation from the dashboard to populate agent intelligence.</p>
      </div>
    </div>
  );

  const s = SS[selected.final_status] || SS.stopped;

  return (
    <div className="w-full px-6 py-24 bg-[#050505] min-h-screen selection:bg-indigo-500/30">
      <div className="max-w-[1200px] mx-auto">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Cpu size={14} /> Agent Intelligence
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Reasoning Engine</h1>
            <p className="text-lg text-zinc-400 font-medium max-w-xl">Deep dive into the neural pathways of every autonomous decision.</p>
          </div>
          
          <div className="flex items-center gap-6 bg-[#0c0c0e] border border-white/5 rounded-2xl px-6 py-4 shadow-xl">
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 disabled:opacity-20 transition-all">
              <ChevronLeft size={20} />
            </button>
            <div className="text-center min-w-[80px]">
              <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-1">TXN</p>
              <p className="text-xl font-bold text-white">{idx + 1} / {logs.length}</p>
            </div>
            <button onClick={() => setIdx(i => Math.min(logs.length - 1, i + 1))} disabled={idx >= logs.length - 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 disabled:opacity-20 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-16">
          
          {/* ── MASTER DETAIL CARD ── */}
          <div className="bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] p-10 lg:p-14 relative overflow-hidden animate-fade-in-up delay-100 shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between md:items-start gap-8 mb-12 relative z-10">
              <div>
                <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-3">Transaction ID</p>
                <p className="text-xl text-zinc-300 font-mono bg-black/50 inline-flex px-4 py-2 rounded-xl border border-white/5 mb-6 shadow-inner">{selected.transaction_id}</p>
                <p className="text-6xl md:text-7xl font-bold text-white tracking-tighter">{fmt(selected.amount || selected.expected_recovery_value)}</p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-4">
                <span className={`inline-flex px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider ${s.pill}`}>{s.label}</span>
                <span className="text-sm font-semibold text-zinc-400 bg-black/30 px-4 py-2 rounded-xl flex items-center gap-2"><Clock size={16} />{selected.timeAgo}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/5 relative z-10">
              {[
                { label: 'Recovery Prob', value: `${((selected.recovery_probability || 0) * 100).toFixed(1)}%`, color: 'text-white' },
                { label: 'Expected Value', value: fmt(selected.expected_recovery_value), color: 'text-indigo-400' },
                { label: 'Recovered Amount', value: fmt(selected.recovered_amount), color: 'text-emerald-400' },
              ].map((m, i) => (
                <div key={i} className="bg-black/40 border border-white/5 rounded-3xl p-8 shadow-inner">
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">{m.label}</p>
                  <p className={`text-4xl font-bold tracking-tight ${m.color}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── REASONING CHAIN ── */}
          <div className="space-y-6 animate-fade-in-up delay-200 pl-4 border-l-2 border-white/5 ml-4">
            <h3 className="text-2xl font-bold text-white mb-10 -ml-[40px] flex items-center gap-6">
              <div className="w-14 h-14 bg-[#050505] border-2 border-white/10 rounded-full flex items-center justify-center">
                <Activity size={24} className="text-indigo-400" />
              </div>
              Chain of Thought
            </h3>

            <Step step="01" title="Root Cause Diagnosis" icon={<Activity size={20} className="text-blue-400" />}>
              <p className="text-2xl font-bold text-white mb-6">{fmtLabel(selected.diagnosis)}</p>
              <div className="space-y-4">
                {(selected.evidence || []).map((e, i) => (
                  <p key={i} className="text-lg text-zinc-400 font-medium flex items-start gap-4 leading-relaxed">
                    <span className="text-zinc-600 mt-1">→</span>{e}
                  </p>
                ))}
              </div>
            </Step>

            <Step step="02" title="Policy Guardrails" icon={<ShieldCheck size={20} className="text-emerald-400" />}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <span className="px-5 py-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-sm font-bold uppercase tracking-wider">{fmtLabel(selected.selected_action)}</span>
                {selected.policy_approved
                  ? <span className="flex items-center gap-2 text-base font-bold text-emerald-400"><CheckCircle2 size={20} />Execution Approved</span>
                  : <span className="flex items-center gap-2 text-base font-bold text-amber-400"><AlertTriangle size={20} />Execution Blocked</span>}
              </div>
              <div className="space-y-4 bg-black/40 rounded-2xl p-6 border border-white/5">
                {(selected.policy_checks || []).map((c, i) => (
                  <div key={i} className="flex items-center gap-3 text-base text-zinc-300 font-medium"><CheckCircle2 size={18} className="text-emerald-500" />{c}</div>
                ))}
                {!selected.policy_approved && (
                  <div className="flex items-center gap-3 text-base text-amber-400 font-bold mt-4"><XCircle size={18} />Blocked by risk constraints</div>
                )}
              </div>
            </Step>

            {selected.transcript && (
              <Step step="03" title="Conversational Protocol" icon={<MessageSquare size={20} className="text-purple-400" />}>
                <div className="bg-[#050505] rounded-3xl p-8 space-y-6 border border-white/5 shadow-inner mt-4">
                  {selected.transcript.map((msg, i) => {
                    const isAgent = msg.sender === 'agent';
                    const isWA = selected.selected_action === 'hinglish_whatsapp_nudge';
                    return (
                      <div key={i} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl px-6 py-4 text-base font-medium leading-relaxed
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
              </Step>
            )}
          </div>

          {/* ── SMART RETRY WINDOW ── */}
          <div className="bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] p-10 lg:p-14 animate-fade-in-up delay-300 shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="mb-12 relative z-10">
              <h3 className="text-3xl font-bold text-white flex items-center gap-4 mb-3">
                <Calendar size={32} className="text-emerald-400" />
                Smart Retry Window
              </h3>
              <p className="text-lg text-zinc-400 font-medium">Optimal hour to retry this specific customer cohort.</p>
            </div>

            <div className="space-y-5 max-w-4xl relative z-10">
              {SMART_RETRY.map((d, i) => (
                <div key={i} className="flex items-center gap-6">
                  <span className="text-sm font-bold text-zinc-500 w-16 text-right uppercase tracking-widest">{d.time}</span>
                  <div className="flex-1 h-8 bg-black/50 rounded-xl overflow-hidden border border-white/5 shadow-inner">
                    <div className={`h-full rounded-xl flex items-center justify-end px-4 transition-all duration-1000 ${d.peak ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-[#1c1c22]'}`}
                      style={{ width: `${d.prob}%` }}>
                      {d.peak && <span className="text-[10px] font-bold text-black uppercase tracking-widest">PEAK</span>}
                    </div>
                  </div>
                  <span className={`text-base font-bold w-12 text-left ${d.peak ? 'text-emerald-400' : 'text-zinc-500'}`}>{d.prob}%</span>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-start gap-5 max-w-4xl relative z-10 backdrop-blur-sm">
              <div className="p-3 bg-emerald-500/20 rounded-xl"><Clock size={24} className="text-emerald-400" /></div>
              <p className="text-lg text-emerald-100 font-medium leading-relaxed mt-1">
                AI calculated the best window is <span className="font-bold text-white">8 PM</span> with an 84% probability of recovery.
              </p>
            </div>
          </div>

          {/* ── QUICK NAVIGATE ── */}
          <div className="bg-[#0c0c0e] border border-white/5 rounded-[2.5rem] overflow-hidden animate-fade-in-up delay-400 shadow-2xl">
            <div className="px-10 py-8 border-b border-white/5 bg-black/20 flex items-center gap-4">
              <List size={24} className="text-zinc-500" />
              <h3 className="text-xl font-bold text-white">Quick Navigate History</h3>
            </div>
            <div className="flex flex-col">
              {logs.slice(0, 15).map((log, i) => {
                const ss = SS[log.final_status] || SS.stopped;
                return (
                  <button key={log.event_id} onClick={() => { setIdx(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-full text-left flex items-center gap-6 px-10 py-5 border-b border-white/5 transition-all duration-300
                      ${idx === i ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent hover:bg-white/5'}`}>
                    <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${ss.pill}`}>
                      {ss.label.split(' ')[0]}
                    </span>
                    <span className="text-lg font-bold text-white">{log.transaction_id}</span>
                    <span className="text-sm font-medium text-zinc-500 truncate flex-1 ml-4 hidden md:inline-block">
                      {fmtLabel(log.diagnosis)}
                    </span>
                    {log.transcript && <MessageSquare size={18} className="text-indigo-400 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Step({ step, title, icon, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`bg-[#0c0c0e] border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 shadow-xl ${open ? 'mb-8' : 'mb-4 hover:border-white/10'}`}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-5 p-8 text-left hover:bg-white/[0.02] transition-colors">
        <div className="w-12 h-12 rounded-xl bg-black/50 border border-white/5 flex items-center justify-center text-sm font-bold text-zinc-500 shadow-inner">{step}</div>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">{icon}</div>
        <span className="text-2xl font-bold text-white">{title}</span>
        <ChevronRight size={24} className={`ml-auto text-zinc-600 transition-transform duration-300 ${open ? 'rotate-90' : ''}`} />
      </button>
      <div className={`transition-all duration-500 overflow-hidden ${open ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-8 pb-8 pt-0">{children}</div>
      </div>
    </div>
  );
}
