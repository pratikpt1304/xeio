import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseFilePrintView } from '../reports/CourseFilePrintView';
import { Download, ShieldCheck, Printer } from 'lucide-react';

export const StudentLabFile: React.FC = () => {
  const { students, currentUser, institution, course } = useApp();
  const [showPreview, setShowPreview] = useState(false);

  const activeStudent = students.find((s) => s.student_id === currentUser.id || s.roll === currentUser.roll_number) || {
    name: currentUser.name,
    roll: currentUser.roll_number || '2301001',
    batch: 'Batch A',
  };

  const verificationId = `XO-${course.code || 'COURSE'}-${activeStudent.roll}-7F3A`;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Lab File · {course.code || 'Course'}</h1>
          <p className="text-xs text-muted mt-1 font-mono">
            As of today. The final file is issued after the last working day and is needed to appear for the final practical.
          </p>
        </div>

        <button
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-rail text-white rounded-[6px] text-xs font-mono font-medium hover:bg-[#262624]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Lab File Sheet Card Preview */}
      <div className="bg-surface p-8 rounded-[6px] border border-border space-y-8 font-sans">
        <div className="text-center space-y-3 pb-6 border-b border-border">
          <div className="text-xs uppercase font-mono tracking-wider text-muted">
            {institution.name.toUpperCase()}
          </div>
          <div className="text-sm font-semibold text-ink">
            {course.department || 'Academic Department'}
          </div>
          <h2 className="text-3xl font-serif font-bold text-ink pt-2">
            Laboratory Record
          </h2>
          <div className="text-sm font-semibold text-ink">
            {course.code ? `${course.code} · ${course.title}` : 'Laboratory Course'}
          </div>
          <div className="text-xs font-mono text-muted">
            L-T-P-C {course.ltpc || '0-0-2-1'} · {course.semester || 'Current Semester'}
          </div>
        </div>

        <div className="max-w-md mx-auto w-full text-xs border border-border rounded divide-y divide-border">
          <div className="p-3 flex justify-between">
            <span className="text-muted">Name</span>
            <span className="font-semibold text-ink">{activeStudent.name}</span>
          </div>
          <div className="p-3 flex justify-between font-mono">
            <span className="text-muted">Roll number</span>
            <span className="font-bold text-ink">{activeStudent.roll}</span>
          </div>
          <div className="p-3 flex justify-between">
            <span className="text-muted">Class and batch</span>
            <span className="text-ink">{course.className || 'General Section'}</span>
          </div>
          <div className="p-3 flex justify-between">
            <span className="text-muted">Faculty in-charge</span>
            <span className="text-ink">{course.facultyInCharge || 'Faculty In-Charge'}</span>
          </div>
        </div>

        <div className="p-4 bg-surface-alt border border-border rounded flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal" />
            <div>
              <div className="font-bold text-ink">QR Verification ID: {verificationId}</div>
              <div className="text-[11px] text-muted">Signed electronically by Faculty and HOD</div>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-paper border border-border text-ink rounded text-xs hover:bg-surface"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      {showPreview && (
        <CourseFilePrintView onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};
