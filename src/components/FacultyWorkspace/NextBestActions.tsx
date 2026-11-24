import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calendar } from 'lucide-react';

interface NextBestActionsProps {
  onSelectStep: (step: number) => void;
}

export const NextBestActions: React.FC<NextBestActionsProps> = ({ onSelectStep }) => {
  const { planStatus, sendPlanToHOD, course, batches, sessions } = useApp();

  return (
    <aside className="w-80 bg-paper border-l border-border p-5 space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)] sticky top-14 select-none">
      {/* Next Best Actions Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <Sparkles className="w-3.5 h-3.5 text-assist" />
            <span>Next best actions</span>
          </div>
          <span className="text-[11px] font-mono text-muted">Guidance</span>
        </div>

        <div className="space-y-3">
          {/* Action 1: Course Setup */}
          {!course.code ? (
            <div className="bg-surface p-3.5 rounded-[6px] border border-border">
              <div className="font-semibold text-xs text-ink mb-1">Set up course details</div>
              <p className="text-[11px] text-muted mb-2.5 leading-normal">
                Define course code, title, LTPC credits, and syllabus in Step 1.
              </p>
              <button
                onClick={() => onSelectStep(1)}
                className="w-full py-1.5 px-3 bg-teal text-white rounded-[6px] text-xs font-medium hover:bg-[#0b4b42] transition-colors"
              >
                Go to Step 1
              </button>
            </div>
          ) : (
            <div className="bg-surface p-3.5 rounded-[6px] border border-border">
              <div className="font-semibold text-xs text-ink mb-1">Send course plan to HOD</div>
              <p className="text-[11px] text-muted mb-2.5 leading-normal">
                Course details, COs, and rubric (reported out of 100).
              </p>
              <button
                onClick={() => {
                  sendPlanToHOD();
                  onSelectStep(1);
                }}
                disabled={planStatus === 'approved'}
                className={`w-full py-1.5 px-3 rounded-[6px] text-xs font-medium transition-colors ${
                  planStatus === 'approved'
                    ? 'bg-teal-tint text-teal cursor-default'
                    : 'bg-teal text-white hover:bg-[#0b4b42]'
                }`}
              >
                {planStatus === 'approved' ? '✓ Plan Approved' : planStatus === 'sent' ? 'Sent to HOD' : 'Send to HOD'}
              </button>
            </div>
          )}

          {/* Action 2: Batches & Roster */}
          {batches.length === 0 ? (
            <div className="bg-surface p-3.5 rounded-[6px] border border-border">
              <div className="font-semibold text-xs text-ink mb-1">Create student batches</div>
              <p className="text-[11px] text-muted mb-2.5 leading-normal">
                Set up lab batches (e.g. Batch A, Batch B) and import student rosters.
              </p>
              <button
                onClick={() => onSelectStep(2)}
                className="w-full py-1.5 px-3 bg-surface-alt text-ink border border-border rounded-[6px] text-xs font-medium hover:bg-paper transition-colors"
              >
                Go to Step 2
              </button>
            </div>
          ) : (
            <div className="bg-surface p-3.5 rounded-[6px] border border-border">
              <div className="font-semibold text-xs text-ink mb-1">Batches configured ({batches.length})</div>
              <p className="text-[11px] text-muted mb-2.5 leading-normal">
                Share batch class codes with students to enroll into the IDE.
              </p>
              <button
                onClick={() => onSelectStep(2)}
                className="w-full py-1.5 px-3 bg-surface-alt text-ink border border-border rounded-[6px] text-xs font-medium hover:bg-paper transition-colors"
              >
                Manage Batches
              </button>
            </div>
          )}

          {/* Action 3: Session Plan */}
          {sessions.length === 0 ? (
            <div className="bg-surface p-3.5 rounded-[6px] border border-border">
              <div className="font-semibold text-xs text-ink mb-1">Plan lab sessions</div>
              <p className="text-[11px] text-muted mb-2.5 leading-normal">
                Generate the 14-session calendar from your course syllabus in Step 3.
              </p>
              <button
                onClick={() => onSelectStep(3)}
                className="w-full py-1.5 px-3 bg-surface-alt text-ink border border-border rounded-[6px] text-xs font-medium hover:bg-paper transition-colors"
              >
                Go to Step 3
              </button>
            </div>
          ) : (
            <div className="bg-surface p-3.5 rounded-[6px] border border-border">
              <div className="font-semibold text-xs text-ink mb-1">Live Lab Execution</div>
              <p className="text-[11px] text-muted mb-2.5 leading-normal">
                Open active session for live monitor, attendance, and code tracking.
              </p>
              <button
                onClick={() => onSelectStep(6)}
                className="w-full py-1.5 px-3 bg-teal text-white rounded-[6px] text-xs font-medium hover:bg-[#0b4b42] transition-colors"
              >
                Open Sessions
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Today's Agenda Box */}
      <div className="bg-rail text-white p-4 rounded-[6px] text-xs font-mono space-y-2.5">
        <div className="text-[10px] text-[#A3A299] uppercase tracking-wider flex items-center justify-between">
          <span>ACADEMIC SCHEDULE</span>
          <Calendar className="w-3 h-3 text-[#A3A299]" />
        </div>
        <div className="text-[11px] text-[#A3A299] leading-relaxed">
          {sessions.length > 0
            ? `${sessions.length} sessions scheduled in the academic calendar.`
            : 'No lab sessions scheduled for today. Complete Step 1–3 to schedule your lab sessions.'}
        </div>
      </div>
    </aside>
  );
};
