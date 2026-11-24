import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Sparkles, Check, CheckCircle2, Plus, Upload, ChevronRight, AlertCircle } from 'lucide-react';

export const Step4LabQuestions: React.FC = () => {
  const { sessions, toggleQuestionSelection, approveSession, useAICredit } = useApp();
  const [activeUnit, setActiveUnit] = useState('U3 Arrays and strings');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('s-13');

  const units = [
    'U1 Basics',
    'U2 Loops',
    'U3 Arrays and strings',
    'U4 Functions and pointers',
    'U5 Structures and files',
  ];

  // Map unit to CO
  const unitToCo: Record<string, string> = {
    'U1 Basics': 'CO1',
    'U2 Loops': 'CO2',
    'U3 Arrays and strings': 'CO3',
    'U4 Functions and pointers': 'CO4',
    'U5 Structures and files': 'CO5',
  };

  const sessionsInUnit = sessions.filter((s) => s.co_id === unitToCo[activeUnit]);
  const currentSession = sessions.find((s) => s.id === selectedSessionId) || sessionsInUnit[0] || sessions[0];
  const selectedQuestions = currentSession?.questions.filter((q) => q.is_selected) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 4 · PREPARE
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Lab questions</h1>
            <p className="text-xs text-muted mt-1">
              Assist drafts 4 candidates per session. Keep any 2, or add your own. Every question's reference solution is validated before approval.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-teal">
              {sessions.filter((s) => s.questions.filter((q) => q.is_selected).length === 2).length} of {sessions.length} sessions have 2 questions
            </span>
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
      <div className="flex items-center gap-1 border-b border-border text-xs overflow-x-auto">
        {units.map((u) => (
          <button
            key={u}
            onClick={() => {
              setActiveUnit(u);
              const targetSessions = sessions.filter((s) => s.co_id === unitToCo[u]);
              if (targetSessions.length > 0) setSelectedSessionId(targetSessions[0].id);
            }}
            className={`px-3 py-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
              activeUnit === u
                ? 'border-rail text-ink font-semibold'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      {/* Session Pills within Unit */}
      {sessionsInUnit.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-muted text-[11px] uppercase mr-1">Sessions:</span>
          {sessionsInUnit.map((s) => {
            const isCurrent = currentSession?.id === s.id;
            const has2 = s.questions.filter((q) => q.is_selected).length === 2;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSessionId(s.id)}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-rail text-white font-semibold shadow-sm'
                    : has2
                    ? 'bg-surface border border-border text-ink hover:bg-surface-alt'
                    : 'bg-surface-alt border border-dashed border-border text-muted hover:text-ink'
                }`}
              >
                <span>S{s.n} · {s.topic.length > 18 ? s.topic.slice(0, 18) + '...' : s.topic}</span>
                {has2 && <Check className="w-3 h-3 text-teal" />}
              </button>
            );
          })}
        </div>
      )}

      {currentSession ? (
        <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-ink text-sm">
                S{currentSession.n} · {currentSession.date}
              </span>
              <span className="text-sm font-semibold text-ink">{currentSession.topic}</span>
              <span className="text-xs font-mono px-1.5 py-0.5 bg-[#2A2926]/5 rounded text-muted">
                {currentSession.co_id} · {currentSession.btl}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded font-medium ${
                  selectedQuestions.length === 2
                    ? 'bg-teal-tint text-teal'
                    : 'bg-assist-tint text-assist'
                }`}
              >
                {selectedQuestions.length} of 2 selected
              </span>

              {currentSession.status === 'draft' && selectedQuestions.length === 2 && (
                <button
                  onClick={() => approveSession(currentSession.id)}
                  className="px-3 py-1 bg-teal text-white rounded text-xs font-mono font-medium hover:bg-[#0b4b42]"
                >
                  Approve S{currentSession.n}
                </button>
              )}
            </div>
          </div>

          {/* 4 Candidate Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSession.questions.map((q) => {
              const isSelected = q.is_selected;
              return (
                <div
                  key={q.id}
                  onClick={() => toggleQuestionSelection(currentSession.id, q.id)}
                  className={`p-4 rounded-[6px] border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal bg-surface ring-1 ring-teal'
                      : 'border-border bg-surface hover:border-muted'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-teal focus:ring-teal"
                      />
                      <span className="text-xs font-bold text-ink">{q.title}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted mb-3 leading-relaxed font-sans">
                    {q.statement}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-muted pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.2 rounded font-medium ${
                        q.difficulty === 'Easy' ? 'bg-teal-tint text-teal' : q.difficulty === 'Medium' ? 'bg-assist-tint text-assist' : 'bg-danger-tint text-danger'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span>{q.co_id} · {currentSession.btl}</span>
                      <span>2V + 3H tests</span>
                    </div>

                    <div className="flex items-center gap-1 text-teal">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>checks passed</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Question Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentSession.questions.length >= 2) {
                    toggleQuestionSelection(currentSession.id, currentSession.questions[0].id);
                    toggleQuestionSelection(currentSession.id, currentSession.questions[1].id);
                  }
                }}
                className="px-3 py-1.5 bg-surface text-ink border border-border rounded hover:bg-surface-alt font-medium"
              >
                Assist pick best 2
              </button>
              <button className="px-3 py-1.5 bg-surface text-ink border border-border rounded hover:bg-surface-alt font-medium">
                Write own question
              </button>
              <button className="px-3 py-1.5 bg-surface text-ink border border-border rounded hover:bg-surface-alt font-medium">
                Upload own
              </button>
            </div>

            <span className="text-muted text-[11px]">
              Validated against GCC 13 C17 and Python 3.12
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-surface p-10 rounded-[6px] border border-dashed border-border text-center font-mono text-xs text-muted">
          No session selected. Please generate the session plan in Step 3.
        </div>
      )}
    </div>
  );
};
