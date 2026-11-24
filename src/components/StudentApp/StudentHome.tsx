import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Award, CheckCircle, Code, Clock, ArrowRight, BookOpen } from 'lucide-react';

export const StudentHome: React.FC<{ onGoToLab: () => void }> = ({ onGoToLab }) => {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Student Welcome Banner */}
      <div className="bg-surface p-6 rounded-[6px] border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-mono text-muted uppercase tracking-wider mb-1">
            Student Dashboard · Sanjivani University
          </div>
          <h1 className="text-2xl font-semibold text-ink">Welcome back, Aarav</h1>
          <p className="text-xs text-muted mt-1 font-mono">
            Roll: 2301044 · SY-B Batch A · CSL-101 Programming in C Lab
          </p>
        </div>

        <button
          onClick={onGoToLab}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-[6px] text-xs font-mono font-medium hover:bg-[#0b4b42] transition-colors self-start md:self-auto"
        >
          <span>Open Today's Lab (S13)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards: Attendance, Marks, Streak, Next Lab */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
        <div className="bg-surface p-4 rounded-[6px] border border-border">
          <span className="text-[11px] text-muted block uppercase">Internal so far</span>
          <span className="text-3xl font-bold text-teal mt-1 block">86</span>
          <span className="text-[10px] text-muted block mt-1">out of 100 scaled</span>
        </div>

        <div className="bg-surface p-4 rounded-[6px] border border-border">
          <span className="text-[11px] text-muted block uppercase">Attendance</span>
          <span className="text-3xl font-bold text-ink mt-1 block">96%</span>
          <span className="text-[10px] text-teal block mt-1">13/13 attended</span>
        </div>

        <div className="bg-surface p-4 rounded-[6px] border border-border">
          <span className="text-[11px] text-muted block uppercase">Lab Streak</span>
          <span className="text-3xl font-bold text-assist mt-1 block">12 🔥</span>
          <span className="text-[10px] text-muted block mt-1">consecutive passes</span>
        </div>

        <div className="bg-surface p-4 rounded-[6px] border border-border">
          <span className="text-[11px] text-muted block uppercase">Next Deadline</span>
          <span className="text-xl font-bold text-ink mt-2 block">23:59</span>
          <span className="text-[10px] text-muted block mt-1">S13 Post-test closes</span>
        </div>
      </div>

      {/* Academic Lab Calendar Grid */}
      <div className="bg-surface p-6 rounded-[6px] border border-border space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted" />
            <span className="font-semibold text-xs text-ink uppercase font-mono">
              February 2027 Lab Schedule
            </span>
          </div>
          <span className="text-xs font-mono text-teal">Batch A: Wednesdays 10:00–12:00</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-surface-alt rounded border border-border">
            <div className="text-[11px] text-muted">03 FEB · S7-S8</div>
            <div className="font-semibold text-ink mt-1">while and do-while</div>
            <div className="text-[10px] text-teal mt-2">✓ 100% Passed · Attended</div>
          </div>

          <div className="p-3 bg-surface-alt rounded border border-border">
            <div className="text-[11px] text-muted">10 FEB · S9-S10</div>
            <div className="font-semibold text-ink mt-1">Nested loops & Patterns</div>
            <div className="text-[10px] text-teal mt-2">✓ 100% Passed · Attended</div>
          </div>

          <div className="p-3 bg-surface-alt rounded border border-border">
            <div className="text-[11px] text-muted">17 FEB · S11-S12</div>
            <div className="font-semibold text-ink mt-1">break & continue</div>
            <div className="text-[10px] text-teal mt-2">✓ 100% Passed · Attended</div>
          </div>

          <div className="p-3 bg-teal-tint/40 rounded border border-teal ring-1 ring-teal">
            <div className="text-[11px] text-teal font-semibold flex items-center justify-between">
              <span>TODAY · 24 FEB</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
            </div>
            <div className="font-bold text-ink mt-1">S13 1-D arrays & S14</div>
            <div className="text-[10px] text-teal mt-2">Session Active · Lab 304</div>
          </div>
        </div>
      </div>
    </div>
  );
};
