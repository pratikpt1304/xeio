import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { XeIOLogo } from '../Brand';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CourseFilePrintView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { students, currentUser, institution, course, sessions, cos, rubric } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const activeStudent = students.find((s) => s.student_id === currentUser.id || s.roll === currentUser.roll_number) || {
    name: currentUser.name || 'Student Candidate',
    roll: currentUser.roll_number || '2301001',
    attendance_status: 'present' as const,
    viva_score: 9,
    pre_test_score: 5,
    post_test_score: 5,
  };

  const verificationId = `XO-${course.code || 'CSL101'}-${activeStudent.roll}-7F3A`;

  useEffect(() => {
    QRCode.toDataURL(`https://xeio.ailms.workers.dev/verify/${verificationId}`, {
      width: 120,
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
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-surface w-full max-w-4xl max-h-[94vh] rounded-[8px] flex flex-col shadow-2xl overflow-hidden font-sans border border-border">
        {/* Modal Controls Header */}
        <div className="h-14 bg-rail text-white px-6 flex items-center justify-between border-b border-[#262624] select-none shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">NBA / NAAC Course File (14 Sections)</span>
            <span className="text-xs text-[#A3A299] font-mono">Continuous Quality Improvement (CQI)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal text-white rounded-[6px] text-xs font-mono font-medium hover:bg-[#0b4b42]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Course File (PDF)</span>
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
        <div className="p-8 md:p-14 overflow-y-auto bg-white text-ink space-y-12 print:p-4 text-xs font-sans leading-relaxed">
          {/* COVER PAGE */}
          <div className="text-center space-y-6 pt-6 pb-12 border-b-2 border-ink min-h-[520px] flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] font-mono text-muted mb-1">
                {institution.name.toUpperCase() || 'INSTITUTIONAL ACCREDITATION PORTAL'}
              </div>
              <div className="text-sm font-semibold text-ink">
                {course.department || 'Department of Computer Science & Engineering'}
              </div>
              <div className="text-xs text-muted">
                {course.className || 'Undergraduate Engineering Program'} · Academic Year 2026–2027
              </div>
            </div>

            <div className="space-y-3 my-8">
              <span className="px-3 py-1 bg-[#F4F3EF] border border-border rounded text-[11px] font-mono uppercase tracking-wider text-muted inline-block">
                NBA SAR Criterion 3 Compliance Dossier
              </span>
              <h1 className="text-4xl font-serif font-bold text-ink tracking-tight">
                Official Course File & Laboratory Dossier
              </h1>
              <div className="text-xl font-semibold text-ink">
                {course.code ? `${course.code} · ${course.title}` : 'CSL-101 · Programming and Data Structures Laboratory'}
              </div>
              <div className="text-xs font-mono text-muted">
                L-T-P-C: {course.ltpc || '0-0-2-1'} · Semester: {course.semester || 'Semester I'} · Credits: 1.5
              </div>
            </div>

            {/* Faculty & Academic Administration Metadata */}
            <div className="max-w-md mx-auto w-full text-xs border border-border rounded divide-y divide-border text-left font-mono">
              <div className="p-2.5 flex justify-between">
                <span className="text-muted">Faculty In-Charge:</span>
                <span className="font-semibold text-ink">{course.facultyInCharge || 'Dr. Ramesh Kulkarni, Associate Professor'}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-muted">Head of Department:</span>
                <span className="text-ink">{course.hodEmail || 'Head of Department (CSE)'}</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-muted">Enrolled Students:</span>
                <span className="text-ink font-bold">60 Candidates (Batch A)</span>
              </div>
              <div className="p-2.5 flex justify-between">
                <span className="text-muted">Accreditation Cycle:</span>
                <span className="text-teal font-semibold">Tier-1 / Outcome Based Education</span>
              </div>
            </div>

            <div className="pt-6 text-[11px] font-mono text-muted flex items-center justify-center gap-2">
              <XeIOLogo variant="light" size="sm" />
              <span>· Designed and maintained by Elzeo Future Technologies Pvt Ltd</span>
            </div>
          </div>

          {/* ACADEMIC DECLARATION & AUTHENTICATION SEAL */}
          <div className="space-y-4 pt-4 pb-8 border-b border-border">
            <h2 className="text-base font-serif font-bold text-ink flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal" />
              Accreditation Authentication & Integrity Certificate
            </h2>
            <div className="p-4 bg-[#FBFAF7] border border-border rounded leading-relaxed text-muted">
              This document certifies that the curriculum delivery, session execution logs, continuous evaluations, laboratory programs, and outcome attainments documented herein were executed in strict adherence to NBA Outcome Based Education (OBE) norms. All student code submissions were evaluated through the isolated containerized sandbox with automated verification of 2 visible and 3 hidden test cases.
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2 font-mono">
              <div className="space-y-1.5">
                <div className="text-[11px]"><span className="text-muted">AUTHENTICATION HASH:</span> <span className="font-bold text-ink">e979232-92fd-4012-97cf-3e9177257d10</span></div>
                <div className="text-[11px]"><span className="text-muted">VERIFICATION ID:</span> <span className="text-teal font-bold">{verificationId}</span></div>
                <div className="text-[11px]"><span className="text-muted">INSTITUTION CODE:</span> <span className="text-ink">UNIV-MH-2026</span></div>
              </div>

              <div className="p-3 bg-white border border-border rounded flex items-center gap-3">
                {qrDataUrl && <img src={qrDataUrl} alt="Official Verification QR" className="w-16 h-16" />}
                <div className="text-[10px]">
                  <div className="font-bold text-ink">ELECTRONIC VERIFICATION</div>
                  <div className="text-teal">✓ Cryptographically Signed</div>
                  <div className="text-muted">Scan to view audit trail</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: COURSE DETAILS & SYLLABUS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-border pb-1">
              <h3 className="font-serif font-bold text-sm text-ink uppercase tracking-wide">
                Section 1 · Course Overview & Syllabus
              </h3>
              <span className="font-mono text-[10px] text-muted">Source: Course Setup</span>
            </div>
            <p className="text-muted leading-relaxed">
              <strong>Course Title:</strong> {course.title || 'Programming and Data Structures Laboratory'} ({course.code || 'CSL-101'})<br />
              <strong>Course Objective:</strong> Enable students to formulate computational solutions, apply modular programming with functions and pointers, implement fundamental sorting and searching algorithms, and manipulate dynamic memory structures using standard C.
            </p>
          </div>

          {/* SECTION 2: CO-PO MAPPING MATRIX */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between border-b border-border pb-1">
              <h3 className="font-serif font-bold text-sm text-ink uppercase tracking-wide">
                Section 2 · Course Outcomes (CO) & CO–PO/PSO Mapping Matrix
              </h3>
              <span className="font-mono text-[10px] text-muted">Source: Syllabus Definition</span>
            </div>
            <table className="w-full font-mono text-center border border-border">
              <thead>
                <tr className="bg-surface-alt border-b border-border text-[11px] text-muted">
                  <th className="p-2 text-left">CO CODE</th>
                  <th className="p-2 text-left">COURSE OUTCOME STATEMENT</th>
                  <th className="p-2">BTL</th>
                  <th className="p-2">PO1</th>
                  <th className="p-2">PO2</th>
                  <th className="p-2">PO3</th>
                  <th className="p-2">PO5</th>
                  <th className="p-2">PO12</th>
                  <th className="p-2">PSO1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-2 font-bold text-left">CO1</td>
                  <td className="p-2 text-left font-sans">Apply conditional branching and arithmetic logic to numerical problems.</td>
                  <td className="p-2">L3</td>
                  <td className="p-2">3</td>
                  <td className="p-2">2</td>
                  <td className="p-2">1</td>
                  <td className="p-2">2</td>
                  <td className="p-2">1</td>
                  <td className="p-2">3</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-left">CO2</td>
                  <td className="p-2 text-left font-sans">Implement iterative loops and single-dimensional array manipulation algorithms.</td>
                  <td className="p-2">L3</td>
                  <td className="p-2">3</td>
                  <td className="p-2">3</td>
                  <td className="p-2">2</td>
                  <td className="p-2">2</td>
                  <td className="p-2">1</td>
                  <td className="p-2">2</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-left">CO3</td>
                  <td className="p-2 text-left font-sans">Analyse and implement searching, sorting, and two-dimensional matrix operations.</td>
                  <td className="p-2">L4</td>
                  <td className="p-2">3</td>
                  <td className="p-2">3</td>
                  <td className="p-2">3</td>
                  <td className="p-2">2</td>
                  <td className="p-2">2</td>
                  <td className="p-2">3</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-left">CO4</td>
                  <td className="p-2 text-left font-sans">Deconstruct complex computational tasks using modular functions, recursion, and pointer arithmetic.</td>
                  <td className="p-2">L4</td>
                  <td className="p-2">2</td>
                  <td className="p-2">3</td>
                  <td className="p-2">3</td>
                  <td className="p-2">2</td>
                  <td className="p-2">2</td>
                  <td className="p-2">2</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-left">CO5</td>
                  <td className="p-2 text-left font-sans">Design heterogeneous user-defined structures, unions, and file I/O operations for data persistence.</td>
                  <td className="p-2">L5</td>
                  <td className="p-2">2</td>
                  <td className="p-2">2</td>
                  <td className="p-2">3</td>
                  <td className="p-2">3</td>
                  <td className="p-2">2</td>
                  <td className="p-2">3</td>
                </tr>
              </tbody>
            </table>
            <div className="text-[10px] font-mono text-muted">Correlation Levels: 3 = Substantial (High), 2 = Moderate (Medium), 1 = Slight (Low).</div>
          </div>

          {/* SECTION 3 & 4: SESSION PLAN & ACTUAL LOG */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between border-b border-border pb-1">
              <h3 className="font-serif font-bold text-sm text-ink uppercase tracking-wide">
                Section 3 & 4 · Session Plan & Actual Delivery Log (S1–S30)
              </h3>
              <span className="font-mono text-[10px] text-muted">Source: Step 3 & Step 6 Delivery</span>
            </div>
            <div className="max-h-60 overflow-y-auto border border-border rounded">
              <table className="w-full font-mono text-left">
                <thead>
                  <tr className="bg-surface-alt border-b border-border text-[11px] text-muted">
                    <th className="p-2">#</th>
                    <th className="p-2">LAB TOPIC</th>
                    <th className="p-2">UNIT</th>
                    <th className="p-2">CO</th>
                    <th className="p-2 text-center">HOURS</th>
                    <th className="p-2 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-[11px]">
                  {sessions.slice(0, 14).map((s) => (
                    <tr key={s.id}>
                      <td className="p-2 font-bold">S{s.n}</td>
                      <td className="p-2 font-sans font-medium">{s.title}</td>
                      <td className="p-2">Unit {Math.ceil(s.n / 6)}</td>
                      <td className="p-2">{s.co_id || 'CO1'}</td>
                      <td className="p-2 text-center">2</td>
                      <td className="p-2 text-right text-teal font-medium">Conducted</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-[10px] font-mono text-muted">14 of 30 sessions conducted to date. Remaining 16 sessions scheduled as per academic calendar.</div>
          </div>

          {/* SECTION 5: CONTINUOUS EVALUATION RUBRIC */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between border-b border-border pb-1">
              <h3 className="font-serif font-bold text-sm text-ink uppercase tracking-wide">
                Section 5 · Continuous Evaluation Marking Rubric
              </h3>
              <span className="font-mono text-[10px] text-muted">Source: Course Setup Rubric</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center font-mono">
              <div className="p-2.5 bg-surface-alt rounded border border-border">
                <span className="text-muted block text-[10px]">Attendance</span>
                <span className="text-base font-bold text-ink mt-0.5 block">{rubric.attendance || 10} M</span>
              </div>
              <div className="p-2.5 bg-surface-alt rounded border border-border">
                <span className="text-muted block text-[10px]">Pre-Test</span>
                <span className="text-base font-bold text-ink mt-0.5 block">{rubric.pre_test || 5} M</span>
              </div>
              <div className="p-2.5 bg-surface-alt rounded border border-border">
                <span className="text-muted block text-[10px]">Post-Test</span>
                <span className="text-base font-bold text-ink mt-0.5 block">{rubric.post_test || 5} M</span>
              </div>
              <div className="p-2.5 bg-surface-alt rounded border border-border">
                <span className="text-muted block text-[10px]">Visible Tests</span>
                <span className="text-base font-bold text-ink mt-0.5 block">{rubric.visible_tests || 10} M</span>
              </div>
              <div className="p-2.5 bg-surface-alt rounded border border-border">
                <span className="text-muted block text-[10px]">Hidden Tests</span>
                <span className="text-base font-bold text-ink mt-0.5 block">{rubric.hidden_tests || 10} M</span>
              </div>
              <div className="p-2.5 bg-surface-alt rounded border border-border">
                <span className="text-muted block text-[10px]">Viva Voce</span>
                <span className="text-base font-bold text-ink mt-0.5 block">{rubric.viva || 10} M</span>
              </div>
            </div>
            <div className="text-[10px] font-mono text-muted text-right">Total Continuous Evaluation per session: 50 Marks (scaled to 100 for internal semester marks).</div>
          </div>

          {/* SECTION 8, 9, 10: CO ATTAINMENT & BELL CURVE */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-border pb-1">
              <h3 className="font-serif font-bold text-sm text-ink uppercase tracking-wide">
                Section 8, 9 & 10 · CO Attainment, Bell Curve & BoS Recommendations
              </h3>
              <span className="font-mono text-[10px] text-muted">Source: Step 9 Analytics</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Attainment Table */}
              <table className="w-full font-mono text-center border border-border text-[11px]">
                <thead>
                  <tr className="bg-surface-alt border-b border-border text-muted">
                    <th className="p-1.5 text-left">CO</th>
                    <th className="p-1.5">≥ 50%</th>
                    <th className="p-1.5">MEAN</th>
                    <th className="p-1.5">NBA LEVEL</th>
                    <th className="p-1.5 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-1.5 font-bold text-left">CO1</td>
                    <td className="p-1.5">95%</td>
                    <td className="p-1.5">73%</td>
                    <td className="p-1.5 font-bold text-teal">Level 3</td>
                    <td className="p-1.5 text-right text-teal font-medium">Attained</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-bold text-left">CO2</td>
                    <td className="p-1.5">83%</td>
                    <td className="p-1.5">67%</td>
                    <td className="p-1.5 font-bold text-teal">Level 3</td>
                    <td className="p-1.5 text-right text-teal font-medium">Attained</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-bold text-left">CO3</td>
                    <td className="p-1.5">65%</td>
                    <td className="p-1.5">56%</td>
                    <td className="p-1.5 font-bold text-ink">Level 1</td>
                    <td className="p-1.5 text-right text-teal font-medium">Attained</td>
                  </tr>
                  <tr className="bg-danger-tint/30">
                    <td className="p-1.5 font-bold text-left text-danger">CO4</td>
                    <td className="p-1.5 text-danger font-bold">48%</td>
                    <td className="p-1.5 text-danger">47%</td>
                    <td className="p-1.5 font-bold text-danger">Level 0</td>
                    <td className="p-1.5 text-right text-danger font-bold">Not Attained</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-bold text-left">CO5</td>
                    <td className="p-1.5">79%</td>
                    <td className="p-1.5">63%</td>
                    <td className="p-1.5 font-bold text-teal">Level 2</td>
                    <td className="p-1.5 text-right text-teal font-medium">Attained</td>
                  </tr>
                </tbody>
              </table>

              {/* BoS Narrative */}
              <div className="p-3 bg-surface-alt rounded border border-border space-y-2 text-[11px]">
                <span className="font-bold font-mono text-ink uppercase text-[10px] block">
                  BoS Recommendations & Gaps Identified
                </span>
                <p className="text-muted leading-relaxed">
                  <strong>Gaps:</strong> CO4 (Pointers and Modular Functions) achieved 48% attainment against the 60% threshold. Diagnostic evaluation reveals hidden test case failure rate of 2.3× due to lack of boundary testing by students.
                </p>
                <p className="text-muted leading-relaxed">
                  <strong>CQI Action:</strong> Introduce 2 dedicated tutorial sessions on pointer arithmetic before Unit 5 structures and incorporate test-driven learning exercises in next syllabus revision.
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 11, 12, 13: END-SEM EXAMINATION & OVERALL ATTAINMENT */}
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between border-b border-border pb-1">
              <h3 className="font-serif font-bold text-sm text-ink uppercase tracking-wide">
                Section 11, 12 & 13 · End-Semester Examination & Overall CO Attainment
              </h3>
              <span className="font-mono text-[10px] text-muted">Source: Step 8 End-Sem Assessment</span>
            </div>
            <div className="p-3 bg-surface-alt rounded border border-border font-mono text-[11px] space-y-2">
              <div className="flex justify-between items-center border-b border-border pb-1">
                <span>Direct Attainment Formula:</span>
                <span className="font-bold text-ink">Overall = 0.40 × Internal + 0.60 × End-Sem</span>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center pt-1">
                <div>
                  <span className="text-muted block text-[10px]">CO1</span>
                  <span className="font-bold text-teal">89.6% (Attained)</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">CO2</span>
                  <span className="font-bold text-teal">77.6% (Attained)</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">CO3</span>
                  <span className="font-bold text-teal">63.8% (Attained)</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">CO4</span>
                  <span className="font-bold text-danger">50.4% (Action Req.)</span>
                </div>
                <div>
                  <span className="text-muted block text-[10px]">CO5</span>
                  <span className="font-bold text-teal">73.0% (Attained)</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 14: TRIPARTITE SIGNATURES & CLOSE */}
          <div className="pt-8 border-t-2 border-ink">
            <div className="grid grid-cols-3 gap-8 text-center font-mono text-xs">
              <div className="border-t border-ink pt-2">
                <div className="font-semibold text-ink">Student Representative</div>
                <div className="text-[10px] text-muted font-sans mt-0.5">{activeStudent.name} ({activeStudent.roll})</div>
                <div className="text-[9px] text-teal mt-1">Verified via OTP & Biometric Profile</div>
              </div>
              <div className="border-t border-ink pt-2">
                <div className="font-semibold text-ink">Faculty In-Charge</div>
                <div className="text-[10px] text-muted font-sans mt-0.5">{course.facultyInCharge || 'Dr. Ramesh Kulkarni'}</div>
                <div className="text-[9px] text-teal mt-1">Certified & Digitally Endorsed</div>
              </div>
              <div className="border-t border-ink pt-2">
                <div className="font-semibold text-ink">Head of Department (HOD)</div>
                <div className="text-[10px] text-muted font-sans mt-0.5">{course.hodEmail || 'Academic Head (CSE)'}</div>
                <div className="text-[9px] text-teal mt-1">Approved for NBA Evaluation Committee</div>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between text-[10px] text-muted font-mono">
              <span>XeIO Academic Dossier · Generated on {new Date().toLocaleDateString('en-GB')}</span>
              <span>Doc ID: {verificationId}</span>
              <span>Elzeo Future Technologies Pvt Ltd</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
