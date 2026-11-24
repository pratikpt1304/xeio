import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { XeIOLogo, ElzeoLogo } from '../Brand';
import { X, Printer, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CourseFilePrintView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { students, cos, rubric } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const sampleStudent = students.find((s) => s.roll === '2301044') || students[0];
  const verificationId = `XO-CSL101-${sampleStudent.roll}-7F3A`;

  useEffect(() => {
    // Generate valid verification QR Code
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
      <div className="bg-surface w-full max-w-4xl max-h-[92vh] rounded-[6px] border border-border flex flex-col overflow-hidden shadow-2xl">
        {/* Top Control Bar */}
        <div className="p-4 bg-paper border-b border-border flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-ink">
              Laboratory Record & NBA Course File Preview
            </span>
            <span className="text-xs font-mono text-muted">({verificationId})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rail text-white rounded text-xs font-mono hover:bg-[#262624]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-muted hover:text-ink rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area (Exact IBM Plex Serif and styling from PRD page 20) */}
        <div className="p-10 overflow-y-auto bg-white text-[#141413] space-y-12 font-sans select-text">
          {/* Page 1: Title Page */}
          <div className="text-center space-y-6 pt-8 pb-12 border-b border-border min-h-[500px] flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] font-mono text-muted mb-2">
                SANJIVANI UNIVERSITY
              </div>
              <div className="text-sm font-semibold text-ink">
                School of Engineering and Technology
              </div>
              <div className="text-xs text-muted">
                Department of Computer Science and Engineering
              </div>
            </div>

            <div className="space-y-3 my-8">
              <h1 className="text-4xl font-serif font-bold text-ink tracking-tight">
                Laboratory Record
              </h1>
              <div className="text-xl font-semibold text-ink">
                CSL-101 · Programming in C Lab
              </div>
              <div className="text-xs font-mono text-muted">
                L-T-P-C 0-0-2-1 · Semester IV · Academic year 2026–27
              </div>
            </div>

            {/* Student metadata table */}
            <div className="max-w-md mx-auto w-full text-xs border border-border rounded divide-y divide-border text-left">
              <div className="p-2.5 flex justify-between">
                <span className="text-muted">Name</span>
                <span className="font-semibold text-ink">{sampleStudent.name}</span>
              </div>
              <div className="p-2.5 flex justify-between font-mono">
                <span className="text-muted">Roll number</span>
                <span className="font-bold text-ink">{sampleStudent.roll}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-muted">Class and batch</span>
                <span className="text-ink">SY-B · Batch A</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-muted">Faculty in-charge</span>
                <span className="text-ink">Dr. Ramesh Kulkarni</span>
              </div>
            </div>

            <div className="pt-6 text-[11px] font-mono text-muted flex items-center justify-center gap-2">
              <XeIOLogo variant="light" size="sm" />
              <span>· Designed and maintained by Elzeo Future Technologies Pvt Ltd, India</span>
            </div>
          </div>

          {/* Page 2: Declaration with Marks, Attendance and QR Code */}
          <div className="space-y-6 pt-6 pb-12 border-b border-border">
            <h2 className="text-lg font-serif font-bold text-ink border-b border-border pb-2">
              Declaration and Academic Attainment
            </h2>

            <div className="p-4 bg-[#FBFAF7] border border-border rounded text-xs text-muted leading-relaxed">
              I hereby declare that this lab record contains authentic work completed by me during the scheduled sessions of CSL-101 Programming in C Lab. No unapproved generative tools or unauthorized collaborations were utilized. All programs were submitted and tested through the XeIO sandbox.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Internal Marks Summary */}
              <div className="border border-border rounded p-4 text-xs font-mono space-y-2">
                <div className="flex justify-between border-b border-border pb-1">
                  <span className="text-muted">Internal Score (Scaled)</span>
                  <span className="font-bold text-teal text-base">86 / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Lab Attendance</span>
                  <span className="font-semibold text-ink">96% (13/13 Sessions)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Pre-Test Average</span>
                  <span className="text-ink">4.5 / 5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Post-Test Average</span>
                  <span className="text-ink">5.0 / 5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Viva Voce Average</span>
                  <span className="text-ink">9.0 / 10.0</span>
                </div>
              </div>

              {/* QR Code Verification Block */}
              <div className="flex items-center gap-4 p-4 border border-border rounded bg-[#FBFAF7]">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Verification QR" className="w-24 h-24 border border-border rounded" />
                ) : (
                  <div className="w-24 h-24 bg-border animate-pulse rounded" />
                )}
                <div className="text-xs font-mono space-y-1">
                  <div className="font-bold text-ink">NBA / NAAC Audit Code</div>
                  <div className="text-[11px] text-teal">{verificationId}</div>
                  <div className="text-[10px] text-muted leading-tight font-sans">
                    Scan with any device or visit audit verification portal to validate submission hashes.
                  </div>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-6 pt-12 text-center text-xs font-mono">
              <div className="border-t border-ink pt-2">
                <div>Student Signature</div>
                <div className="text-[10px] text-muted font-sans">Aarav Sharma</div>
              </div>
              <div className="border-t border-ink pt-2">
                <div>Faculty In-Charge</div>
                <div className="text-[10px] text-muted font-sans">Dr. Ramesh Kulkarni</div>
              </div>
              <div className="border-t border-ink pt-2">
                <div>Head of Department</div>
                <div className="text-[10px] text-muted font-sans">Prof. Sunita Deshmukh</div>
              </div>
            </div>
          </div>

          {/* Page 3: Program Submissions Record */}
          <div className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-ink">
              Index of Completed Laboratory Sessions
            </h2>

            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-border bg-[#FBFAF7] text-[11px] text-muted">
                  <th className="p-2">#</th>
                  <th className="p-2">SESSION TOPIC</th>
                  <th className="p-2">CO</th>
                  <th className="p-2">DATE</th>
                  <th className="p-2 text-center">TESTS</th>
                  <th className="p-2 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-2">S1</td>
                  <td className="p-2 font-sans font-medium text-ink">Input and Output, format specifiers</td>
                  <td className="p-2">CO1</td>
                  <td className="p-2 text-muted">06 Jan 2027</td>
                  <td className="p-2 text-center text-teal">5/5 Passed</td>
                  <td className="p-2 text-right text-teal font-semibold">Completed</td>
                </tr>
                <tr>
                  <td className="p-2">S2</td>
                  <td className="p-2 font-sans font-medium text-ink">Arithmetic and logical operators</td>
                  <td className="p-2">CO1</td>
                  <td className="p-2 text-muted">06 Jan 2027</td>
                  <td className="p-2 text-center text-teal">5/5 Passed</td>
                  <td className="p-2 text-right text-teal font-semibold">Completed</td>
                </tr>
                <tr>
                  <td className="p-2">S13</td>
                  <td className="p-2 font-sans font-medium text-ink">1-D arrays, reverse and max/min elements</td>
                  <td className="p-2">CO3</td>
                  <td className="p-2 text-muted">24 Feb 2027</td>
                  <td className="p-2 text-center text-teal">5/5 Passed</td>
                  <td className="p-2 text-right text-teal font-semibold">Accepted</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-border flex items-center justify-between text-xs text-muted font-mono">
            <span>XeIO · Course File System</span>
            <span>Page 1 of 38 · Sanjivani University</span>
            <span>Elzeo Future Technologies Pvt Ltd</span>
          </div>
        </div>
      </div>
    </div>
  );
};
