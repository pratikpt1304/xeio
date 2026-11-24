import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Users, AlertTriangle, X, CheckCircle2, Sparkles, Send, Eye } from 'lucide-react';

export const Step6SessionsLive: React.FC = () => {
  const {
    students,
    updateStudentAttendance,
    updateStudentViva,
    selectedStudentForDetail,
    setSelectedStudentForDetail,
    sessions,
    importRoster,
    useAICredit,
  } = useApp();

  const [selectedSessionNum, setSelectedSessionNum] = useState<number>(13);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [filterStruggling, setFilterStruggling] = useState(false);

  const currentSession = sessions.find((s) => s.n === selectedSessionNum) || sessions[12] || sessions[0];

  const handleEnrollSampleBatch = () => {
    const defaultRoster = Array.from({ length: 60 }, (_, i) => {
      const rollNum = (2301001 + i).toString();
      return `Student ${i + 1} (${rollNum})`;
    });
    importRoster(defaultRoster);
  };

  const presentCount = students.filter((s) => s.attendance_status === 'present').length;
  const absentCount = students.filter((s) => s.attendance_status === 'absent').length;
  const passedCount = students.filter((s) => s.q1_status === 'all_passed' || s.runs_count > 2).length;
  const strugglingCount = students.filter((s) => s.flags.length > 0 || (s.runs_count > 3 && s.q1_status !== 'all_passed')).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 6 · RUN
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Sessions (live lab)</h1>
            <p className="text-xs text-muted mt-1">
              Live lab execution monitor, attendance gatekeeping, submission tracking, and real-time viva entry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {students.length > 0 && (
              <button
                onClick={() => setShowAttendanceModal(true)}
                className="px-3 py-1.5 bg-surface text-ink border border-border rounded-[6px] text-xs font-mono font-medium hover:bg-surface-alt flex items-center gap-1.5 shadow-sm"
              >
                <Users className="w-3.5 h-3.5 text-teal" />
                <span>Attendance seat grid</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 30 Session Chips (PRD Section 5.6 Page 14) */}
      <div className="bg-surface p-4 rounded-[6px] border border-border space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-muted uppercase tracking-wider text-[11px]">
            Batch A Sessions — Click to open live monitor
          </span>
          <span className="text-muted text-[11px]">
            dark = completed • teal ring = active • light = upcoming
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 font-mono text-xs text-center">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => {
            const isSelected = selectedSessionNum === num;
            const isCompleted = num < 13;
            const isToday = num === 13;

            return (
              <button
                key={num}
                onClick={() => setSelectedSessionNum(num)}
                className={`py-1.5 rounded transition-all text-xs ${
                  isSelected
                    ? 'bg-rail text-white font-bold ring-2 ring-teal shadow-sm'
                    : isToday
                    ? 'bg-teal text-white font-semibold'
                    : isCompleted
                    ? 'bg-[#2A2926] text-white font-medium'
                    : 'bg-surface-alt border border-border text-muted hover:border-ink hover:text-ink'
                }`}
              >
                S{num}
              </button>
            );
          })}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="bg-surface p-12 rounded-[6px] border border-dashed border-border text-center space-y-4 font-mono text-xs">
          <Users className="w-10 h-10 text-muted mx-auto" />
          <div>
            <div className="font-semibold text-ink text-sm">No students currently enrolled in this session</div>
            <p className="text-muted max-w-md mx-auto mt-1">
              Navigate to <strong>Step 2 (Batches)</strong> to import a roster or click below to populate the standard 60-student lab roster.
            </p>
          </div>
          <button
            onClick={handleEnrollSampleBatch}
            className="px-4 py-2 bg-teal text-white rounded font-medium hover:bg-[#0b4b42] inline-flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            <span>Enroll Batch A Roster (60 Students)</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Session Info Banner */}
          {currentSession && (
            <div className="bg-surface p-4 rounded-[6px] border border-border flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-ink">
                  S{currentSession.n} · {currentSession.topic}
                </span>
                <span className="text-muted">{currentSession.date}</span>
                <span className="px-2 py-0.5 rounded bg-teal-tint text-teal font-semibold animate-pulse">
                  ● Live now
                </span>
              </div>
              <div className="text-muted">
                Attendance: {presentCount} present · {absentCount} absent
              </div>
            </div>
          )}

          {/* Live Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center font-mono">
            <div className="p-3.5 bg-surface rounded border border-border">
              <span className="text-[11px] text-muted block uppercase">Present</span>
              <span className="text-xl font-bold text-ink mt-1 block">
                {presentCount}/{students.length}
              </span>
            </div>
            <div className="p-3.5 bg-surface rounded border border-border">
              <span className="text-[11px] text-muted block uppercase">Pre-test Done</span>
              <span className="text-xl font-bold text-teal mt-1 block">
                {Math.max(0, presentCount - 1)}/{students.length}
              </span>
            </div>
            <div className="p-3.5 bg-surface rounded border border-border">
              <span className="text-[11px] text-muted block uppercase">Pre-test Avg</span>
              <span className="text-xl font-bold text-ink mt-1 block">3.8 / 5</span>
            </div>
            <div className="p-3.5 bg-surface rounded border border-border">
              <span className="text-[11px] text-muted block uppercase">Visible Passed</span>
              <span className="text-xl font-bold text-teal mt-1 block">{passedCount}</span>
            </div>
            <div className="p-3.5 bg-surface rounded border border-border">
              <span className="text-[11px] text-muted block uppercase">Struggling</span>
              <span className="text-xl font-bold text-assist mt-1 block">{strugglingCount}</span>
            </div>
          </div>

          {/* Seat Grid & Action Row */}
          <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div>
                <span className="font-semibold text-ink uppercase">Live Monitor — Seat Grid (60 Seats)</span>
                <span className="text-muted ml-2 text-[11px]">Click any seat to inspect student submission & viva</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterStruggling(!filterStruggling)}
                  className={`px-2.5 py-1 rounded border text-[11px] transition-colors ${
                    filterStruggling
                      ? 'bg-assist text-white border-assist font-semibold'
                      : 'bg-surface text-muted border-border hover:text-ink'
                  }`}
                >
                  {filterStruggling ? 'Showing Struggling Only' : 'Filter Struggling'}
                </button>
              </div>
            </div>

            {/* 60 Seats Matrix */}
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-1.5 font-mono text-xs">
              {students.map((st) => {
                const isAbsent = st.attendance_status === 'absent';
                const isStruggling = st.flags.length > 0;
                const isPassed = st.q1_status === 'all_passed';

                if (filterStruggling && !isStruggling) return null;

                return (
                  <button
                    key={st.student_id}
                    onClick={() => setSelectedStudentForDetail(st)}
                    className={`py-2 px-1 text-center rounded border font-semibold transition-all hover:scale-105 ${
                      isAbsent
                        ? 'bg-danger-tint text-danger border-danger/30'
                        : isStruggling
                        ? 'bg-assist-tint text-assist border-assist/40 ring-1 ring-assist'
                        : isPassed
                        ? 'bg-teal-tint text-teal border-teal/40'
                        : 'bg-surface-alt text-ink border-border hover:border-teal'
                    }`}
                  >
                    <div className="text-[11px]">#{st.seat_number}</div>
                    <div className="text-[9px] uppercase font-sans font-normal truncate mt-0.5">
                      {isAbsent ? 'Abs' : isPassed ? 'Done' : 'Code'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Seat Grid Legend */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-muted pt-3 border-t border-border">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-surface-alt border border-border inline-block" />
                <span>Coding</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-teal-tint border border-teal/40 inline-block" />
                <span>Passed</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-assist-tint border border-assist/40 inline-block" />
                <span>Struggling</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-danger-tint border border-danger/40 inline-block" />
                <span>Absent</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal (PRD Page 14) */}
      {selectedStudentForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-xl rounded-[6px] border border-border p-6 space-y-4 font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-border pb-3">
              <div>
                <h3 className="font-semibold text-base text-ink">{selectedStudentForDetail.name}</h3>
                <span className="text-muted text-[11px]">
                  Roll: {selectedStudentForDetail.roll} · Seat #{selectedStudentForDetail.seat_number} · Batch A
                </span>
              </div>
              <button
                onClick={() => setSelectedStudentForDetail(null)}
                className="text-muted hover:text-ink p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Student Stats Summary */}
            <div className="grid grid-cols-4 gap-2 text-center p-3 bg-surface-alt rounded border border-border">
              <div>
                <div className="text-[10px] text-muted uppercase">Attendance</div>
                <div className="font-bold text-ink mt-0.5">13/13 (100%)</div>
              </div>
              <div>
                <div className="text-[10px] text-muted uppercase">Pre-test Avg</div>
                <div className="font-bold text-teal mt-0.5">4.5 / 5</div>
              </div>
              <div>
                <div className="text-[10px] text-muted uppercase">Internal So Far</div>
                <div className="font-bold text-ink mt-0.5">86 / 100</div>
              </div>
              <div>
                <div className="text-[10px] text-muted uppercase">Learner Tier</div>
                <div className="font-bold text-teal mt-0.5">Fast</div>
              </div>
            </div>

            {/* Submission Code Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted uppercase font-semibold">Latest Code Submission</span>
                <span className="text-teal font-medium">Verdict: Accepted (5/5 tests passed)</span>
              </div>
              <pre className="p-3 bg-[#1B1B1A] text-[#E2E0D8] rounded text-[11px] overflow-x-auto font-mono">
{`#include <stdio.h>

int main() {
    int n, a[100];
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    for (int i = n - 1; i >= 0; i--) {
        printf("%d%c", a[i], i == 0 ? '\\n' : ' ');
    }
    return 0;
}`}
              </pre>
            </div>

            {/* Viva Voce Marking Input */}
            <div className="p-3 bg-surface-alt rounded border border-border flex items-center justify-between">
              <div>
                <label className="block text-ink font-semibold text-xs">
                  Viva Voce Score (Session Rubric: 10 marks)
                </label>
                <span className="text-muted text-[11px]">
                  Oral evaluation by faculty examiner during lab session
                </span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                value={selectedStudentForDetail.viva_score}
                onChange={(e) =>
                  updateStudentViva(
                    selectedStudentForDetail.student_id,
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-16 p-2 bg-surface border border-border rounded text-center font-bold text-base text-ink focus:border-teal"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setSelectedStudentForDetail(null)}
                className="px-4 py-2 bg-rail text-white rounded font-medium hover:bg-[#262624]"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal (Seat Grid) */}
      {showAttendanceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-[6px] border border-border p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <h3 className="font-semibold text-base text-ink">Lab Attendance Seat Grid</h3>
                <span className="text-muted text-[11px]">Click any seat to toggle Present / Absent</span>
              </div>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="text-muted hover:text-ink p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto p-1">
              {students.map((st) => (
                <button
                  key={st.student_id}
                  onClick={() => {
                    const next = st.attendance_status === 'present' ? 'absent' : 'present';
                    updateStudentAttendance(st.student_id, next);
                  }}
                  className={`p-2 rounded border text-center transition-all ${
                    st.attendance_status === 'present'
                      ? 'bg-teal-tint text-teal border-teal/40'
                      : 'bg-danger-tint text-danger border-danger/40'
                  }`}
                >
                  <div className="font-bold">#{st.seat_number}</div>
                  <div className="text-[9px] uppercase mt-0.5">{st.attendance_status}</div>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-muted text-[11px]">
                {presentCount} Present · {absentCount} Absent
              </span>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="px-4 py-2 bg-teal text-white rounded font-medium hover:bg-[#0b4b42]"
              >
                Confirm Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
