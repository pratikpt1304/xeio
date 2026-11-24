import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Users, AlertTriangle, X } from 'lucide-react';

export const Step6SessionsLive: React.FC = () => {
  const { students, updateStudentAttendance, updateStudentViva, selectedStudentForDetail, setSelectedStudentForDetail } = useApp();
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 6 · RUN
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Sessions (live lab)</h1>
            <p className="text-xs text-muted mt-1">
              Live lab execution monitor, attendance gatekeeping, submission tracking, and real-time viva entry.
            </p>
          </div>

          {students.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAttendanceModal(true)}
                className="px-3 py-1.5 bg-surface text-ink border border-border rounded-[6px] text-xs font-mono font-medium hover:bg-surface-alt flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Attendance seat grid</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="bg-surface p-12 rounded-[6px] border border-dashed border-border text-center space-y-3 font-mono text-xs">
          <Users className="w-8 h-8 text-muted mx-auto" />
          <div className="font-semibold text-ink">No students enrolled in this session</div>
          <p className="text-muted max-w-md mx-auto">
            Please navigate to <strong>Step 2 (Batches)</strong> to add your section roster or share your batch class code with students.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Live Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
            <div className="p-4 bg-surface rounded border border-border">
              <span className="text-[11px] text-muted block uppercase">Enrolled Students</span>
              <span className="text-2xl font-bold text-ink mt-1 block">{students.length}</span>
            </div>
            <div className="p-4 bg-surface rounded border border-border">
              <span className="text-[11px] text-muted block uppercase">Present</span>
              <span className="text-2xl font-bold text-teal mt-1 block">
                {students.filter((s) => s.attendance_status === 'present').length}
              </span>
            </div>
            <div className="p-4 bg-surface rounded border border-border">
              <span className="text-[11px] text-muted block uppercase">Absent</span>
              <span className="text-2xl font-bold text-danger mt-1 block">
                {students.filter((s) => s.attendance_status === 'absent').length}
              </span>
            </div>
            <div className="p-4 bg-surface rounded border border-border">
              <span className="text-[11px] text-muted block uppercase">Passed Lab</span>
              <span className="text-2xl font-bold text-teal mt-1 block">
                {students.filter((s) => s.q1_status === 'all_passed').length}
              </span>
            </div>
          </div>

          {/* Seat Grid */}
          <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-semibold text-ink uppercase">Live Seat Grid</span>
              <span className="text-muted">Click any seat to inspect student progress</span>
            </div>

            <div className="grid grid-cols-10 gap-1.5 font-mono text-xs">
              {students.map((st) => (
                <button
                  key={st.student_id}
                  onClick={() => setSelectedStudentForDetail(st)}
                  className={`py-2 text-center rounded border font-semibold transition-all ${
                    st.attendance_status === 'absent'
                      ? 'bg-danger-tint text-danger border-danger/30'
                      : 'bg-teal-tint text-teal border-teal/40'
                  }`}
                >
                  #{st.seat_number}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudentForDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-[6px] border border-border p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <h3 className="font-semibold text-sm text-ink">{selectedStudentForDetail.name}</h3>
                <span className="text-muted text-[11px]">Roll: {selectedStudentForDetail.roll}</span>
              </div>
              <button onClick={() => setSelectedStudentForDetail(null)} className="text-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-muted uppercase text-[11px]">Viva Voce Score (Out of 10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={selectedStudentForDetail.viva_score}
                onChange={(e) => updateStudentViva(selectedStudentForDetail.student_id, parseInt(e.target.value) || 0)}
                className="w-24 p-2 bg-surface-alt border border-border rounded font-bold text-ink"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStudentForDetail(null)}
                className="px-4 py-1.5 bg-teal text-white rounded font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-[6px] border border-border p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <h3 className="font-semibold text-sm text-ink">Mark Attendance</h3>
              <button onClick={() => setShowAttendanceModal(false)} className="text-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
              {students.map((st) => (
                <button
                  key={st.student_id}
                  onClick={() => {
                    const next = st.attendance_status === 'present' ? 'absent' : 'present';
                    updateStudentAttendance(st.student_id, next);
                  }}
                  className={`p-2 rounded border text-center ${
                    st.attendance_status === 'present'
                      ? 'bg-teal-tint text-teal border-teal/40'
                      : 'bg-danger-tint text-danger border-danger/40'
                  }`}
                >
                  <div>#{st.seat_number}</div>
                  <div className="text-[10px] uppercase">{st.attendance_status}</div>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="px-4 py-1.5 bg-teal text-white rounded font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
