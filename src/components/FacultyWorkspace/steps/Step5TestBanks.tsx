import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Sparkles, CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';

export const Step5TestBanks: React.FC = () => {
  const { useAICredit } = useApp();
  const [selectedSession, setSelectedSession] = useState<number>(13);

  const sessionNumbers = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 5 · PREPARE
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Pre-test and post-test banks</h1>
            <p className="text-xs text-muted mt-1">
              Per session: 45 pre-test and 45 post-test questions, 15 per level (Easy, Medium, Hard). AI drafts, you approve.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-teal">14/30 active banks</span>
            <span className="text-xs font-mono text-muted">6 awaiting approval</span>
          </div>
        </div>
      </div>

      {/* Rules Banner Cards */}
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

      {/* 30 Session Chips */}
      <div className="bg-surface p-4 rounded-[6px] border border-border">
        <div className="text-xs font-mono text-muted uppercase tracking-wider mb-3">
          Select Session Bank
        </div>
        <div className="grid grid-cols-10 gap-1.5 font-mono text-xs text-center">
          {sessionNumbers.map((num) => {
            const isSelected = selectedSession === num;
            const isApproved = num <= 14;
            return (
              <button
                key={num}
                onClick={() => setSelectedSession(num)}
                className={`py-1.5 rounded transition-all ${
                  isSelected
                    ? 'bg-rail text-white font-semibold ring-2 ring-teal'
                    : isApproved
                    ? 'bg-teal-tint text-teal font-medium hover:bg-teal hover:text-white'
                    : 'bg-surface-alt text-muted hover:bg-paper'
                }`}
              >
                S{num}
              </button>
            );
          })}
        </div>
      </div>

      {/* S13 Banks Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base text-ink">S{selectedSession} · 1-D arrays</span>
            <span className="text-xs text-muted">AI draft. Sample questions shown below for switch/replace.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => useAICredit(`Regenerate S${selectedSession} question bank`)}
              className="px-3 py-1.5 bg-surface text-ink border border-border rounded-[6px] text-xs font-medium hover:bg-surface-alt flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate bank</span>
            </button>
            <button className="px-4 py-1.5 bg-teal text-white rounded-[6px] text-xs font-medium hover:bg-[#0b4b42]">
              Approve and activate
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pre-test bank sample */}
          <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="font-semibold text-sm text-ink">Pre-test bank</span>
                <span className="text-xs text-muted block">45 total · 15 Easy, 15 Medium, 15 Hard</span>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 bg-teal-tint text-teal rounded">
                2E 2M 1H per paper
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-surface-alt rounded-[6px] border border-border">
                <div className="flex items-center justify-between text-muted text-[11px] mb-1 font-mono">
                  <span>EASY · 15 IN BANK</span>
                  <button className="text-teal hover:underline">Replace</button>
                </div>
                <div className="font-medium text-ink mb-1.5">What is the index of the first element in a C array?</div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-muted">
                  <div className="text-teal font-medium">✓ A. 0</div>
                  <div>B. 1</div>
                  <div>C. -1</div>
                  <div>D. Undefined</div>
                </div>
              </div>

              <div className="p-3 bg-surface-alt rounded-[6px] border border-border">
                <div className="flex items-center justify-between text-muted text-[11px] mb-1 font-mono">
                  <span>MEDIUM · 15 IN BANK</span>
                  <button className="text-teal hover:underline">Replace</button>
                </div>
                <div className="font-medium text-ink mb-1.5">Which expression gives the number of elements in int a[20]?</div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-muted">
                  <div>A. sizeof(a)</div>
                  <div className="text-teal font-medium">✓ B. sizeof(a)/sizeof(a[0])</div>
                  <div>C. len(a)</div>
                  <div>D. a.length</div>
                </div>
              </div>
            </div>
          </div>

          {/* Post-test bank sample */}
          <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="font-semibold text-sm text-ink">Post-test bank</span>
                <span className="text-xs text-muted block">45 total · 15 Easy, 15 Medium, 15 Hard</span>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 bg-teal-tint text-teal rounded">
                1E 2M 2H per paper
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-surface-alt rounded-[6px] border border-border">
                <div className="flex items-center justify-between text-muted text-[11px] mb-1 font-mono">
                  <span>EASY · 15 IN BANK</span>
                  <button className="text-teal hover:underline">Replace</button>
                </div>
                <div className="font-medium text-ink mb-1.5">What is the time complexity of reversing an array of size n in-place?</div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-muted">
                  <div>A. O(1)</div>
                  <div className="text-teal font-medium">✓ B. O(n)</div>
                  <div>C. O(n^2)</div>
                  <div>D. O(log n)</div>
                </div>
              </div>

              <div className="p-3 bg-surface-alt rounded-[6px] border border-border">
                <div className="flex items-center justify-between text-muted text-[11px] mb-1 font-mono">
                  <span>HARD · 15 IN BANK</span>
                  <button className="text-teal hover:underline">Replace</button>
                </div>
                <div className="font-medium text-ink mb-1.5">To pass a 1D array to a function without copy overhead, C passes it as:</div>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-muted">
                  <div>A. Value copy</div>
                  <div className="text-teal font-medium">✓ B. Pointer to first element</div>
                  <div>C. Reference slice</div>
                  <div>D. Stack clone</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
