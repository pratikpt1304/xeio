import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, ArrowRight } from 'lucide-react';

export const StudentHome: React.FC<{ onGoToLab: () => void }> = ({ onGoToLab }) => {
  const { currentUser, institution, course, sessions, students } = useApp();

  const currentStudent = students.find((s) => s.student_id === currentUser.id || s.roll === currentUser.roll_number);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Student Welcome Banner */}
      <div className="bg-surface p-6 rounded-[6px] border border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-mono text-muted uppercase tracking-wider mb-1">
            Student Portal · {institution.name}
          </div>
          <h1 className="text-2xl font-semibold text-ink">Welcome, {currentUser.name}</h1>
          <p className="text-xs text-muted mt-1 font-mono">
            {course.title ? (
              <span>Roll: {currentUser.roll_number || 'Enrolled'} · {course.code} {course.title}</span>
            ) : (
              <span>Enter a batch class code to enroll in a lab course</span>
            )}
          </p>
        </div>

        <button
          onClick={onGoToLab}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal text-white rounded-[6px] text-xs font-mono font-medium hover:bg-[#0b4b42] transition-colors self-start md:self-auto"
        >
          <span>Open Lab IDE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards: Attendance, Marks, Streak, Next Lab */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
        <div className="bg-surface p-4 rounded-[6px] border border-border">
          <span className="text-[11px] text-muted block uppercase">Internal Score</span>
          <span className="text-3xl font-bold text-teal mt-1 block">
            {currentStudent ? currentStudent.viva_score + currentStudent.pre_test_score + currentStudent.post_test_score : 0}
          </span>
          <span className="text-[10px] text-muted block mt-1">out of 100 scaled</span>
        </div>

        <div className="bg-surface p-4 rounded-[6px] border border-border">
          <span className="text-[11px] text-muted block uppercase">Attendance</span>
          <span className="text-3xl font-bold text-ink mt-1 block">
            {currentStudent && currentStudent.attendance_status === 'present' ? '100%' : '0%'}
          </span>
          <span className="text-[10px] text-teal block mt-1">
            {currentStudent && currentStudent.attendance_status === 'present' ? '1 attended' : '0 attended'}
          </span>
        </div>

        <div className="bg-surface p-4 rounded-[6px] border border-border">
          <span className="text-[11px] text-muted block uppercase">Lab Streak</span>
          <span className="text-3xl font-bold text-assist mt-1 block">
            0 🔥
          </span>
          <span className="text-[10px] text-muted block mt-1">consecutive passes</span>
        </div>

        <div className="bg-surface p-4 rounded-[6px] border border-border">
          <span className="text-[11px] text-muted block uppercase">Upcoming Lab</span>
          <span className="text-xl font-bold text-ink mt-2 block">
            {sessions.length > 0 ? `Session ${sessions[0].n}` : 'None'}
          </span>
          <span className="text-[10px] text-muted block mt-1">
            {sessions.length > 0 ? sessions[0].title : 'No sessions scheduled'}
          </span>
        </div>
      </div>

      {/* Academic Lab Calendar Grid */}
      <div className="bg-surface p-6 rounded-[6px] border border-border space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted" />
            <span className="font-semibold text-xs text-ink uppercase font-mono">
              Academic Lab Schedule
            </span>
          </div>
          <span className="text-xs font-mono text-muted">
            {course.code || 'Course'}
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted font-mono">
            No lab sessions scheduled yet. Once your faculty generates the session calendar, your lab schedule will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
            {sessions.slice(0, 4).map((s) => (
              <div key={s.id} className="p-3 bg-surface-alt rounded border border-border">
                <div className="text-[11px] text-muted">Session {s.n} · {s.date || 'TBD'}</div>
                <div className="font-semibold text-ink mt-1 truncate">{s.title}</div>
                <div className="text-[10px] text-teal mt-2">Scheduled</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
