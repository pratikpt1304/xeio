import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Calendar, Sparkles } from 'lucide-react';

export const Step3SessionPlan: React.FC<{ onOpenSession: (sessionId: string) => void }> = ({ onOpenSession }) => {
  const { sessions, generateSessions } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 3 · PLAN
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Session plan and calendar</h1>
            <p className="text-xs text-muted mt-1">
              Lab dates generated from the academic calendar. Each session links to its Course Outcome, Bloom level, and pre/post test windows.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-teal font-medium">{sessions.length} sessions active</span>
            {sessions.length === 0 && (
              <button
                onClick={generateSessions}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white rounded-[6px] font-medium hover:bg-[#0b4b42]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Sessions Plan</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="bg-surface p-10 rounded-[6px] border border-dashed border-border text-center space-y-3 font-mono text-xs">
          <Calendar className="w-8 h-8 text-muted mx-auto" />
          <p className="text-muted">No session calendar generated yet.</p>
          <button
            onClick={generateSessions}
            className="px-4 py-2 bg-teal text-white rounded font-medium hover:bg-[#0b4b42]"
          >
            Generate 15 Lab Sessions from Calendar
          </button>
        </div>
      ) : (
        <div className="bg-surface rounded-[6px] border border-border overflow-hidden">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-[11px] text-muted">
                <th className="p-3">#</th>
                <th className="p-3">DATE</th>
                <th className="p-3">TOPIC</th>
                <th className="p-3">CO · BTL</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-surface-alt">
                  <td className="p-3 font-semibold text-ink">S{s.n}</td>
                  <td className="p-3 text-muted">{s.date}</td>
                  <td className="p-3 text-ink font-medium">{s.topic}</td>
                  <td className="p-3 text-muted">{s.co_id} · {s.btl}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenSession(s.id)}
                      className="text-teal hover:underline"
                    >
                      Open Live →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
