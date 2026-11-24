import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

interface NextBestActionsProps {
  onSelectStep: (step: number) => void;
}

export const NextBestActions: React.FC<NextBestActionsProps> = ({ onSelectStep }) => {
  const { planStatus, sendPlanToHOD, useAICredit } = useApp();

  return (
    <aside className="w-80 bg-paper border-l border-border p-5 space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)] sticky top-14 select-none">
      {/* Next Best Actions Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <Sparkles className="w-3.5 h-3.5 text-assist" />
            <span>Next best actions</span>
          </div>
          <span className="text-[11px] font-mono text-muted">5 suggested</span>
        </div>

        <div className="space-y-3">
          {/* Action 1: Send course plan to HOD */}
          <div className="bg-surface p-3.5 rounded-[6px] border border-border">
            <div className="font-semibold text-xs text-ink mb-1">Send course plan to HOD</div>
            <p className="text-[11px] text-muted mb-2.5 leading-normal">
              Details, COs, CO–PO map and rubric (50 marks, reported out of 100).
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
              {planStatus === 'approved' ? '✓ Plan Approved' : planStatus === 'sent' ? 'Sent to HOD' : 'Send now'}
            </button>
          </div>

          {/* Action 2: Open today's session S13 */}
          <div className="bg-surface p-3.5 rounded-[6px] border border-border">
            <div className="font-semibold text-xs text-ink mb-1">Open today's session S13</div>
            <p className="text-[11px] text-muted mb-2.5 leading-normal">
              Attendance first: auto-marked 59 present, 4 late, 0 absent. 4 students skipped the pre-test.
            </p>
            <button
              onClick={() => onSelectStep(6)}
              className="w-full py-1.5 px-3 bg-teal text-white rounded-[6px] text-xs font-medium hover:bg-[#0b4b42] transition-colors"
            >
              Open S13
            </button>
          </div>

          {/* Action 3: Activate S15–S20 in calendar */}
          <div className="bg-surface p-3.5 rounded-[6px] border border-border">
            <div className="font-semibold text-xs text-ink mb-1">Activate S15–S20 in the calendar</div>
            <p className="text-[11px] text-muted mb-2.5 leading-normal">
              6 sessions need 2 questions picked and 6 banks need approval. Pre-test for S15 opens Tuesday 18:00.
            </p>
            <button
              onClick={() => {
                useAICredit('Batch Question Drafting for S15-S20');
                onSelectStep(4);
              }}
              className="w-full py-1.5 px-3 bg-surface-alt text-ink border border-border rounded-[6px] text-xs font-medium hover:bg-paper transition-colors"
            >
              Approve all
            </button>
          </div>

          {/* Action 4: Add predict-the-output task this week */}
          <div className="bg-surface p-3.5 rounded-[6px] border border-border">
            <div className="font-semibold text-xs text-ink mb-1">Add a predict-the-output task this week</div>
            <p className="text-[11px] text-muted mb-2.5 leading-normal">
              S13 1-D arrays: hidden-case failures suggest weak tracing of loop bounds.
            </p>
            <button
              onClick={() => onSelectStep(7)}
              className="w-full py-1.5 px-3 bg-surface-alt text-ink border border-border rounded-[6px] text-xs font-medium hover:bg-paper transition-colors"
            >
              Add to timeline
            </button>
          </div>

          {/* Action 5: Draft questions for 10 sessions */}
          <div className="bg-surface p-3.5 rounded-[6px] border border-border">
            <div className="font-semibold text-xs text-ink mb-1">Draft questions for 10 sessions</div>
            <p className="text-[11px] text-muted mb-2.5 leading-normal">
              Units 4–5 open in 5 weeks.
            </p>
            <button
              onClick={() => {
                useAICredit('Draft 10 sessions questions');
                onSelectStep(4);
              }}
              className="w-full py-1.5 px-3 bg-surface-alt text-ink border border-border rounded-[6px] text-xs font-medium hover:bg-paper transition-colors"
            >
              Draft
            </button>
          </div>
        </div>
      </div>

      {/* Today's Agenda Box */}
      <div className="bg-rail text-white p-4 rounded-[6px] text-xs font-mono space-y-2.5">
        <div className="text-[10px] text-[#A3A299] uppercase tracking-wider flex items-center justify-between">
          <span>TODAY · WED 24 FEB</span>
          <Calendar className="w-3 h-3 text-[#A3A299]" />
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="text-[#A3A299]">09:59 Pre-test S13–S14 closed</div>
          <div className="text-white font-medium">10:00 Batch A · S13 1-D arrays, S14 Searching</div>
          <div className="text-[#A3A299]">14:00 Batch B · S13–S14</div>
          <div className="text-[#A3A299]">23:59 Post-test S13–S14 closes</div>
        </div>
      </div>
    </aside>
  );
};
