import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Calendar, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export const Step3SessionPlan: React.FC<{ onOpenSession: (sessionId: string) => void }> = ({ onOpenSession }) => {
  const { sessions, generateSessions, approveSession } = useApp();
  const [filter, setFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [makeupReserved, setMakeupReserved] = useState(true);

  const activeCount = sessions.filter((s) => s.status === 'active').length;
  const filteredSessions = sessions.filter((s) => {
    if (filter === 'active') return s.status === 'active';
    if (filter === 'draft') return s.status === 'draft';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 3 · PLAN
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Session plan and calendar</h1>
            <p className="text-xs text-muted mt-1">
              Lab dates generated from the academic calendar. Each session links to its Course Outcome, Bloom level, and pre/post test windows.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {sessions.length > 0 ? (
              <span className="text-teal font-medium bg-teal-tint px-2.5 py-1 rounded">
                {activeCount} of {sessions.length} sessions active in calendar
              </span>
            ) : (
              <button
                onClick={generateSessions}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white rounded-[6px] font-medium hover:bg-[#0b4b42]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate 30 Sessions Plan</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-surface p-12 rounded-[6px] border border-dashed border-border text-center space-y-4 font-mono text-xs">
          <Calendar className="w-10 h-10 text-muted mx-auto" />
          <div>
            <div className="font-semibold text-ink text-sm">No session calendar generated yet</div>
            <p className="text-muted mt-1 max-w-md mx-auto">
              Click below to generate 15 lab periods × 2 sessions = 30 sessions (S1–S30) with syllabus topics, CO-BTL mapping, and pre/post-test windows.
            </p>
          </div>
          <button
            onClick={generateSessions}
            className="px-4 py-2 bg-teal text-white rounded font-medium hover:bg-[#0b4b42] inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate 30 Lab Sessions from Calendar</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Calendar Control Bar (PRD Page 12) */}
          <div className="bg-surface p-4 rounded-[6px] border border-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-4 text-muted">
              <span>Academic calendar 2026–27</span>
              <span>•</span>
              <span>Batch A Wednesdays 10:00–12:00</span>
              <label className="flex items-center gap-2 text-ink cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={makeupReserved}
                  onChange={(e) => setMakeupReserved(e.target.checked)}
                  className="rounded text-teal focus:ring-teal"
                />
                <span>Reserve last period for makeup</span>
              </label>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-surface-alt p-0.5 rounded border border-border text-[11px]">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filter === 'all' ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                All (30)
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filter === 'active' ? 'bg-surface text-teal font-semibold shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                Active in calendar ({activeCount})
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filter === 'draft' ? 'bg-surface text-ink shadow-sm' : 'text-muted hover:text-ink'
                }`}
              >
                Awaiting approval ({sessions.length - activeCount})
              </button>
            </div>
          </div>

          {/* 30 Sessions Table */}
          <div className="bg-surface rounded-[6px] border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-alt text-[11px] text-muted">
                    <th className="p-3">#</th>
                    <th className="p-3">LAB DATE</th>
                    <th className="p-3">TOPIC</th>
                    <th className="p-3">CO · BTL</th>
                    <th className="p-3">PRE-TEST WINDOW</th>
                    <th className="p-3">POST-TEST WINDOW</th>
                    <th className="p-3 text-center">STATUS</th>
                    <th className="p-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSessions.map((s) => {
                    const isActive = s.status === 'active';
                    return (
                      <tr key={s.id} className="hover:bg-surface-alt transition-colors">
                        <td className="p-3 font-semibold text-ink">S{s.n}</td>
                        <td className="p-3 text-ink font-medium whitespace-nowrap">{s.date}</td>
                        <td className="p-3 text-ink">
                          <span className="font-medium">{s.topic}</span>
                          {s.questions.length > 0 && (
                            <span className="block text-[10px] text-muted font-sans mt-0.5">
                              {s.questions.filter((q) => q.is_selected).length} of {s.questions.length} questions selected
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-muted whitespace-nowrap">
                          <span className="px-1.5 py-0.5 bg-[#2A2926]/5 rounded text-ink font-medium">
                            {s.co_id}
                          </span>{' '}
                          · {s.btl}
                        </td>
                        <td className="p-3 text-muted text-[11px] whitespace-nowrap">
                          {s.pre_open} – {s.pre_close}
                        </td>
                        <td className="p-3 text-muted text-[11px] whitespace-nowrap">
                          after hidden pass – {s.post_close}
                        </td>
                        <td className="p-3 text-center">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-teal-tint text-teal font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-[#2A2926]/10 text-muted font-medium">
                              <Clock className="w-3 h-3" />
                              <span>Draft</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-2 whitespace-nowrap">
                          {!isActive && (
                            <button
                              onClick={() => approveSession(s.id)}
                              className="text-[11px] px-2 py-1 bg-teal text-white rounded hover:bg-[#0b4b42]"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => onOpenSession(s.id)}
                            className="text-teal hover:underline font-medium"
                          >
                            Open Live →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
