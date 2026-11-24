import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseFilePrintView } from '../reports/CourseFilePrintView';
import { FileText, Download, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';

export const StudentLabFile: React.FC = () => {
  const { students } = useApp();
  const [showPreview, setShowPreview] = useState(false);

  const sampleStudent = students.find((s) => s.roll === '2301044') || students[0];
  const verificationId = `XO-CSL101-${sampleStudent.roll}-7F3A`;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Lab file · CSL-101</h1>
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
            SANJIVANI UNIVERSITY
          </div>
          <div className="text-sm font-semibold text-ink">
            School of Engineering and Technology · Department of Computer Science
          </div>
          <h2 className="text-3xl font-serif font-bold text-ink pt-2">
            Laboratory Record
          </h2>
          <div className="text-sm font-semibold text-ink">
            CSL-101 · Programming in C Lab
          </div>
          <div className="text-xs font-mono text-muted">
            L-T-P-C 0-0-2-1 · Semester IV · Academic year 2026–27
          </div>
        </div>

        <div className="max-w-md mx-auto w-full text-xs border border-border rounded divide-y divide-border">
          <div className="p-3 flex justify-between">
            <span className="text-muted">Name</span>
            <span className="font-semibold text-ink">{sampleStudent.name}</span>
          </div>
          <div className="p-3 flex justify-between font-mono">
            <span className="text-muted">Roll number</span>
            <span className="font-bold text-ink">{sampleStudent.roll}</span>
          </div>
          <div className="p-3 flex justify-between">
            <span className="text-muted">Class and batch</span>
            <span className="text-ink">SY-B · Batch A</span>
          </div>
          <div className="p-3 flex justify-between">
            <span className="text-muted">Faculty in-charge</span>
            <span className="text-ink">Dr. Ramesh Kulkarni</span>
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
            onClick={() => setShowPreview(true)}
            className="text-teal hover:underline text-xs"
          >
            Open Full PDF Viewer →
          </button>
        </div>
      </div>

      {showPreview && <CourseFilePrintView onClose={() => setShowPreview(false)} />}
    </div>
  );
};
