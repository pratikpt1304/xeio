import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Sparkles, CheckCircle2, RefreshCw, ShieldCheck, Check } from 'lucide-react';

export const Step5TestBanks: React.FC = () => {
  const { sessions, approveSession, useAICredit } = useApp();
  const [selectedSessionNum, setSelectedSessionNum] = useState<number>(13);
  const [activeTab, setActiveTab] = useState<'pre' | 'post'>('pre');

  const currentSession = sessions.find((s) => s.n === selectedSessionNum) || sessions[0];
  const activeSessionsCount = sessions.filter((s) => s.status === 'active').length;

  const currentBankItems = currentSession
    ? activeTab === 'pre'
      ? currentSession.pre_bank
      : currentSession.post_bank
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 5 · PREPARE
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Pre-test and post-test banks</h1>
            <p className="text-xs text-muted mt-1">
              Per session: 45 pre-test and 45 post-test questions, 15 per level (Easy, Medium, Hard). AI drafts, you approve.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-teal bg-teal-tint px-2.5 py-1 rounded">
              {activeSessionsCount} of {sessions.length || 30} active banks
            </span>
            <span className="text-xs font-mono text-muted">
              {Math.max(0, (sessions.length || 30) - activeSessionsCount)} awaiting approval
            </span>
          </div>
        </div>
      </div>

      {/* Rules Banner Cards (PRD Section 5.5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="bg-surface p-4 rounded-[6px] border border-border">
          <div className="text-muted text-[11px] uppercase mb-1">Pre-test · before the lab</div>
          <div className="font-semibold text-sm text-ink mb-1">2E · 2M · 1H</div>
          <p className="text-muted text-[11px] font-sans">
            5 questions drawn per student; one attempt; closes when lab starts.
          </p>
        </div>

        <div className="bg-surface p-4 rounded-[6px] border border-border">
          <div className="text-muted text-[11px] uppercase mb-1">Post-test · same day</div>
          <div className="font-semibold text-sm text-ink mb-1">1E · 2M · 2H</div>
          <p className="text-muted text-[11px] font-sans">
            5 questions; opens after all hidden test cases pass; closes 23:59.
          </p>
        </div>

        <div className="bg-surface p-4 rounded-[6px] border border-border">
          <div className="text-muted text-[11px] uppercase mb-1 flex items-center justify-between">
            <span>Pre/post overlap</span>
            <ShieldCheck className="w-4 h-4 text-teal" />
          </div>
          <div className="font-semibold text-sm text-teal mb-1">0</div>
          <p className="text-muted text-[11px] font-sans">
            Zero matching or near-identical questions between pre and post banks.
          </p>
        </div>
      </div>

      {/* 30 Session Chips Grid */}
      <div className="bg-surface p-4 rounded-[6px] border border-border">
        <div className="text-xs font-mono text-muted uppercase tracking-wider mb-3">
          Select Session Bank
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 font-mono text-xs text-center">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => {
            const isSelected = selectedSessionNum === num;
            const targetSession = sessions.find((s) => s.n === num);
            const isApproved = targetSession ? targetSession.status === 'active' : num <= 14;

            return (
              <button
                key={num}
                onClick={() => setSelectedSessionNum(num)}
                className={`py-1.5 rounded transition-all ${
                  isSelected
                    ? 'bg-rail text-white font-semibold ring-2 ring-teal'
                    : isApproved
                    ? 'bg-teal-tint text-teal font-medium hover:bg-teal hover:text-white'
                    : 'bg-surface-alt border border-border text-muted hover:border-ink hover:text-ink'
                }`}
              >
                S{num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Session Bank Detail */}
      {currentSession ? (
        <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-ink text-base">
                  S{currentSession.n} · {currentSession.topic}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#2A2926]/5 text-muted">
                  {currentSession.co_id} · {currentSession.btl}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                AI draft. Replace any question, then approve to activate. Sample questions shown are for this bank.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {currentSession.status === 'draft' ? (
                <button
                  onClick={() => approveSession(currentSession.id)}
                  className="px-4 py-2 bg-teal text-white rounded-[6px] text-xs font-mono font-medium hover:bg-[#0b4b42] flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve and activate</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-tint text-teal rounded-[6px] text-xs font-mono font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Bank Approved & Active</span>
                </span>
              )}
            </div>
          </div>

          {/* Pre vs Post Bank Toggle */}
          <div className="flex items-center gap-4 text-xs font-mono border-b border-border pb-2">
            <button
              onClick={() => setActiveTab('pre')}
              className={`pb-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'pre'
                  ? 'border-teal text-teal'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              Pre-test bank (45 items · 2E, 2M, 1H per paper)
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className={`pb-2 border-b-2 font-semibold transition-colors ${
                activeTab === 'post'
                  ? 'border-teal text-teal'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              Post-test bank (45 items · 1E, 2M, 2H per paper)
            </button>
          </div>

          {/* Bank Items List Preview */}
          <div className="space-y-3 font-mono text-xs">
            {currentBankItems.slice(0, 6).map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded border border-border bg-surface-alt/40 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">Q{idx + 1}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                      item.level === 'Easy'
                        ? 'bg-teal-tint text-teal'
                        : item.level === 'Medium'
                        ? 'bg-assist-tint text-assist'
                        : 'bg-danger-tint text-danger'
                    }`}>
                      {item.level}
                    </span>
                    <span className="text-muted text-[11px]">{item.stem}</span>
                  </div>

                  <div className="text-[11px] text-muted space-x-3 pl-6">
                    <span>Correct Answer: {item.options[item.answer]}</span>
                  </div>
                </div>

                <button
                  onClick={() => useAICredit(`Regenerate question ${idx + 1}`)}
                  className="text-muted hover:text-ink text-[11px] flex items-center gap-1 shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace</span>
                </button>
              </div>
            ))}

            <div className="text-center pt-2 text-[11px] font-mono text-muted">
              + {Math.max(0, currentBankItems.length - 6)} more vetted questions in this bucket
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface p-10 rounded-[6px] border border-dashed border-border text-center font-mono text-xs text-muted">
          Please generate the session plan in Step 3 to view and approve test banks.
        </div>
      )}
    </div>
  );
};
