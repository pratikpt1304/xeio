import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Sparkles, Check, AlertCircle, Plus, Upload, CheckCircle2 } from 'lucide-react';

export const Step4LabQuestions: React.FC = () => {
  const { useAICredit } = useApp();
  const [activeUnit, setActiveUnit] = useState('U3 Arrays and strings');

  const units = [
    'U1 Basics',
    'U2 Loops',
    'U3 Arrays and strings',
    'U4 Functions and pointers',
    'U5 Structures and files',
  ];

  const [s13Selected, setS13Selected] = useState<string[]>(['q-1', 'q-2']);
  const [s14Selected, setS14Selected] = useState<string[]>(['q-5', 'q-6']);

  const toggleSelectS13 = (id: string, canSelect: boolean) => {
    if (!canSelect) return;
    if (s13Selected.includes(id)) {
      setS13Selected(s13Selected.filter((x) => x !== id));
    } else if (s13Selected.length < 2) {
      setS13Selected([...s13Selected, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 4 · PREPARE
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Lab questions</h1>
            <p className="text-xs text-muted mt-1">
              Assist drafts 4 candidates per session. Keep any 2, or add your own. Every question's reference solution is validated before approval.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-teal">14 of 30 sessions have 2 questions</span>
            <button
              onClick={() => useAICredit('Draft questions for next 5 sessions')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rail text-white rounded-[6px] text-xs font-medium hover:bg-[#262624]"
            >
              <Sparkles className="w-3.5 h-3.5 text-assist" />
              <span>Draft for next 5 sessions</span>
            </button>
          </div>
        </div>
      </div>

      {/* Unit Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-border text-xs">
        {units.map((u) => (
          <button
            key={u}
            onClick={() => setActiveUnit(u)}
            className={`px-3 py-2 border-b-2 font-medium transition-colors ${
              activeUnit === u
                ? 'border-rail text-ink font-semibold'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      {/* S13 Section */}
      <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-ink text-sm">S13 · 24 Feb</span>
            <span className="text-sm font-semibold text-ink">1-D arrays</span>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 bg-teal-tint text-teal rounded">
            {s13Selected.length} of 2 selected
          </span>
        </div>

        {/* 4 Candidate Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Candidate 1 */}
          <div
            onClick={() => toggleSelectS13('q-1', true)}
            className={`p-4 rounded-[6px] border cursor-pointer transition-all ${
              s13Selected.includes('q-1')
                ? 'border-teal bg-surface ring-1 ring-teal'
                : 'border-border bg-surface hover:border-muted'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={s13Selected.includes('q-1')}
                  readOnly
                  className="rounded text-teal focus:ring-teal"
                />
                <span className="font-semibold text-xs text-ink">1-D arrays · Core exercise</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-surface-alt border border-border rounded text-muted">
                Easy · CO3 · L2
              </span>
            </div>
            <p className="text-xs text-muted mb-2">
              Reverse an array of n integers and print space-separated.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted">2 visible + 3 hidden test cases</span>
              <span className="text-teal flex items-center gap-1">
                <Check className="w-3 h-3" /> Checks passed
              </span>
            </div>
          </div>

          {/* Candidate 2 */}
          <div
            onClick={() => toggleSelectS13('q-2', true)}
            className={`p-4 rounded-[6px] border cursor-pointer transition-all ${
              s13Selected.includes('q-2')
                ? 'border-teal bg-surface ring-1 ring-teal'
                : 'border-border bg-surface hover:border-muted'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={s13Selected.includes('q-2')}
                  readOnly
                  className="rounded text-teal focus:ring-teal"
                />
                <span className="font-semibold text-xs text-ink">1-D arrays · Applied problem</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-surface-alt border border-border rounded text-muted">
                Medium · CO3 · L3
              </span>
            </div>
            <p className="text-xs text-muted mb-2">
              Find second largest distinct integer in array of size n.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted">2 visible + 3 hidden test cases</span>
              <span className="text-teal flex items-center gap-1">
                <Check className="w-3 h-3" /> Checks passed
              </span>
            </div>
          </div>

          {/* Candidate 3 */}
          <div
            onClick={() => toggleSelectS13('q-3', true)}
            className={`p-4 rounded-[6px] border cursor-pointer transition-all ${
              s13Selected.includes('q-3')
                ? 'border-teal bg-surface ring-1 ring-teal'
                : 'border-border bg-surface hover:border-muted'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={s13Selected.includes('q-3')}
                  readOnly
                  className="rounded text-teal focus:ring-teal"
                />
                <span className="font-semibold text-xs text-ink">1-D arrays · Edge-case challenge</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-surface-alt border border-border rounded text-muted">
                Hard · CO3 · L4
              </span>
            </div>
            <p className="text-xs text-muted mb-2">
              Rotate array k positions without extra buffer memory.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted">2 visible + 3 hidden test cases</span>
              <span className="text-teal flex items-center gap-1">
                <Check className="w-3 h-3" /> Checks passed
              </span>
            </div>
          </div>

          {/* Candidate 4: Failing check candidate (PRD rule: greyed out, cannot approve) */}
          <div className="p-4 rounded-[6px] border border-border bg-[#F5F4F0] opacity-60 cursor-not-allowed">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" disabled className="rounded text-muted" />
                <span className="font-semibold text-xs text-muted line-through">1-D arrays · Debug and fix</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-border rounded text-muted">
                Medium · CO3
              </span>
            </div>
            <p className="text-xs text-muted mb-2">
              Fix buffer overflow in circular shift implementation.
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-danger">
              <span>2 visible + 3 hidden</span>
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Reference failed hidden test 2
              </span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-2 flex items-center gap-2 text-xs">
          <button
            onClick={() => useAICredit('Assist pick best 2 for S13')}
            className="px-3 py-1.5 bg-surface-alt border border-border rounded-[6px] font-medium text-ink hover:bg-paper"
          >
            Assist pick best 2
          </button>
          <button className="px-3 py-1.5 bg-surface-alt border border-border rounded-[6px] font-medium text-ink hover:bg-paper">
            Write own question
          </button>
          <button className="px-3 py-1.5 bg-surface-alt border border-border rounded-[6px] font-medium text-ink hover:bg-paper">
            Upload own
          </button>
        </div>
      </div>

      {/* S14 Section */}
      <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-ink text-sm">S14 · 24 Feb</span>
            <span className="text-sm font-semibold text-ink">Searching</span>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 bg-teal-tint text-teal rounded">
            2 of 2 selected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-[6px] border border-teal bg-surface ring-1 ring-teal">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-ink">Searching · Core exercise</span>
              <span className="text-[10px] font-mono text-muted">Easy · L3</span>
            </div>
            <p className="text-muted text-[11px] mb-2">Linear search with first occurrence index report.</p>
            <div className="text-[11px] text-teal font-mono">✓ Checks passed (all 5 cases)</div>
          </div>

          <div className="p-4 rounded-[6px] border border-teal bg-surface ring-1 ring-teal">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-ink">Searching · Applied problem</span>
              <span className="text-[10px] font-mono text-muted">Medium · L3</span>
            </div>
            <p className="text-muted text-[11px] mb-2">Binary search on ascending sorted arrays.</p>
            <div className="text-[11px] text-teal font-mono">✓ Checks passed (all 5 cases)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
