import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { XeIOLogo } from '../Brand';
import { X, Printer } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CourseFilePrintView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { students, currentUser, institution, course, sessions } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const activeStudent = students.find((s) => s.student_id === currentUser.id || s.roll === currentUser.roll_number) || {
    name: currentUser.name || 'Student',
    roll: currentUser.roll_number || '2301001',
    attendance_status: 'absent' as const,
    viva_score: 0,
    pre_test_score: 0,
    post_test_score: 0,
  };

  const verificationId = `XO-${course.code || 'COURSE'}-${activeStudent.roll}-7F3A`;

  useEffect(() => {
    QRCode.toDataURL(`https://xeio.elzeo.in/verify/${verificationId}`, {
      width: 110,
      margin: 1,
      color: { dark: '#141413', light: '#FFFFFF' },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [verificationId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface w-full max-w-4xl max-h-[92vh] rounded-[8px] flex flex-col shadow-2xl overflow-hidden font-sans border border-border">
        {/* Modal Controls Header */}
        <div className="h-14 bg-rail text-white px-6 flex items-center justify-between border-b border-[#262624] select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Course File Preview · Printable View</span>
            <span className="text-xs text-[#A3A299] font-mono">NBA / NAAC Compliance Format</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white rounded-[6px] text-xs font-mono font-medium hover:bg-[#0b4b42]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#A3A299] hover:text-white p-1 rounded hover:bg-[#262624]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 md:p-14 overflow-y-auto bg-white text-ink space-y-12 print:p-0">
          {/* Page 1: Title Page */}
          <div className="text-center space-y-6 pt-8 pb-12 border-b border-border min-h-[500px] flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] font-mono text-muted mb-2">
                {institution.name.toUpperCase()}
              </div>
              <div className="text-sm font-semibold text-ink">
                {course.department || 'Academic Department'}
              </div>
              <div className="text-xs text-muted">
                {course.className || 'Department of Computer Science'}
              </div>
            </div>

            <div className="space-y-3 my-8">
              <h1 className="text-4xl font-serif font-bold text-ink tracking-tight">
                Laboratory Record
              </h1>
              <div className="text-xl font-semibold text-ink">
                {course.code ? `${course.code} · ${course.title}` : 'Laboratory Course'}
              </div>
              <div className="text-xs font-mono text-muted">
                L-T-P-C {course.ltpc || '0-0-2-1'} · {course.semester || 'Current Academic Semester'}
              </div>
            </div>

            {/* Student metadata table */}
            <div className="max-w-md mx-auto w-full text-xs border border-border rounded divide-y divide-border text-left">
              <div className="p-2.5 flex justify-between">
                <span className="text-muted">Name</span>
                <span className="font-semibold text-ink">{activeStudent.name}</span>
              </div>
              <div className="p-2.5 flex justify-between font-mono">
                <span className="text-muted">Roll number</span>
                <span className="font-bold text-ink">{activeStudent.roll}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-muted">Class and batch</span>
                <span className="text-ink">{course.className || 'General Section'}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-muted">Faculty in-charge</span>
                <span className="text-ink">{course.facultyInCharge || 'Faculty In-Charge'}</span>
              </div>
            </div>

            <div className="pt-6 text-[11px] font-mono text-muted flex items-center justify-center gap-2">
              <XeIOLogo variant="light" size="sm" />
              <span>· Designed and maintained by Elzeo Future Technologies Pvt Ltd</span>
            </div>
          </div>

          {/* Page 2: Declaration with Marks, Attendance and QR Code */}
          <div className="space-y-6 pt-6 pb-12 border-b border-border">
            <h2 className="text-lg font-serif font-bold text-ink border-b border-border pb-2">
              Declaration and Academic Attainment
            </h2>

            <div className="p-4 bg-[#FBFAF7] border border-border rounded text-xs text-muted leading-relaxed">
              I hereby declare that this lab record contains authentic work completed by me during the scheduled sessions of {course.code || 'this course'} {course.title}. No unapproved generative tools or unauthorized collaborations were utilized. All programs were submitted and tested through the XeIO sandbox.
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-muted w-32">INTERNAL MARKS:</span>
                  <span className="text-lg font-bold text-teal">
                    {activeStudent.viva_score + activeStudent.pre_test_score + activeStudent.post_test_score} / 100
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted w-32">LAB ATTENDANCE:</span>
                  <span className="text-lg font-bold text-ink">
                    {activeStudent.attendance_status === 'present' ? '100%' : '0%'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted w-32">SESSIONS:</span>
                  <span className="text-sm font-semibold text-ink">
                    {activeStudent.attendance_status === 'present' ? '1 Attended' : '0 Attended'}
                  </span>
                </div>
              </div>

              {/* QR Verification Seal */}
              <div className="p-4 bg-white border border-border rounded flex items-center gap-4 text-xs font-mono">
                {qrDataUrl && <img src={qrDataUrl} alt="Authentic Verification QR" className="w-20 h-20" />}
                <div>
                  <div className="font-bold text-ink">OFFICIAL SEAL</div>
                  <div className="text-[10px] text-muted">ID: {verificationId}</div>
                  <div className="text-[10px] text-teal mt-1">✓ Electronically Certified</div>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-6 pt-12 text-center text-xs font-mono">
              <div className="border-t border-ink pt-2">
                <div>Student Signature</div>
                <div className="text-[10px] text-muted font-sans">{activeStudent.name}</div>
              </div>
              <div className="border-t border-ink pt-2">
                <div>Faculty In-Charge</div>
                <div className="text-[10px] text-muted font-sans">{course.facultyInCharge || 'Faculty In-Charge'}</div>
              </div>
              <div className="border-t border-ink pt-2">
                <div>Head of Department</div>
                <div className="text-[10px] text-muted font-sans">{course.hodEmail || 'Head of Department'}</div>
              </div>
            </div>
          </div>

          {/* Page 3: Program Submissions Record */}
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-ink">
              Index of Completed Laboratory Sessions
            </h2>

            {sessions.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-muted bg-[#FBFAF7] rounded border border-border">
                No laboratory sessions recorded yet.
              </div>
            ) : (
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-border bg-[#FBFAF7] text-[11px] text-muted">
                    <th className="p-2">#</th>
                    <th className="p-2">SESSION TOPIC</th>
                    <th className="p-2">CO</th>
                    <th className="p-2 text-center">TESTS</th>
                    <th className="p-2 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sessions.map((s) => (
                    <tr key={s.id}>
                      <td className="p-2">S{s.n}</td>
                      <td className="p-2 font-sans font-medium text-ink">{s.title}</td>
                      <td className="p-2">{s.co_id || 'CO1'}</td>
                      <td className="p-2 text-center text-teal">0/5 Passed</td>
                      <td className="p-2 text-right text-muted">Scheduled</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-border flex items-center justify-between text-xs text-muted font-mono">
            <span>XeIO · Course File System</span>
            <span>{institution.name}</span>
            <span>Elzeo Future Technologies Pvt Ltd</span>
          </div>
        </div>
      </div>
    </div>
  );
};
