import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileText, Download, CheckCircle2, Clock, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import { CourseFilePrintView } from '../../reports/CourseFilePrintView';

export const Step9Reports: React.FC = () => {
  const { courseFileSections, students, useAICredit } = useApp();
  const [activeTab, setActiveTab] = useState<'course_file' | 'internal_report' | 'student_lab_files'>('course_file');
  const [showPrintModal, setShowPrintModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 9 · COMPLETE
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Reports</h1>
            <p className="text-xs text-muted mt-1">
              Course file, internal mark report and student lab files, current to the minute.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white rounded-[6px] text-xs font-medium hover:bg-[#0b4b42]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Course File (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border text-xs font-mono">
        <button
          onClick={() => setActiveTab('course_file')}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'course_file'
              ? 'border-teal text-teal font-semibold'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          Course file (14 sections)
        </button>

        <button
          onClick={() => setActiveTab('internal_report')}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'internal_report'
              ? 'border-teal text-teal font-semibold'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          Internal mark report
        </button>

        <button
          onClick={() => setActiveTab('student_lab_files')}
          className={`px-4 py-2 border-b-2 font-medium transition-colors ${
            activeTab === 'student_lab_files'
              ? 'border-teal text-teal font-semibold'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          Student lab files
        </button>
      </div>

      {/* Tab 1: Course File 14 Sections */}
      {activeTab === 'course_file' && (
        <div className="bg-surface rounded-[6px] border border-border overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-[11px] text-muted text-left font-mono">
                <th className="p-3 w-12 text-center">#</th>
                <th className="p-3">COURSE FILE SECTION</th>
                <th className="p-3 w-48">SOURCE</th>
                <th className="p-3 w-36 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courseFileSections.map((sec) => (
                <tr key={sec.num} className="hover:bg-surface-alt">
                  <td className="p-3 font-mono text-center text-muted">{sec.num}</td>
                  <td className="p-3 font-medium text-ink">{sec.title}</td>
                  <td className="p-3 text-muted text-[11px]">{sec.source}</td>
                  <td className="p-3 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                        sec.status === 'Ready'
                          ? 'bg-teal-tint text-teal'
                          : sec.status.startsWith('To date')
                          ? 'bg-surface-alt border border-border text-ink'
                          : 'bg-[#F4F3EF] text-muted'
                      }`}
                    >
                      {sec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Internal Mark Report & Attainment */}
      {activeTab === 'internal_report' && (
        <div className="space-y-6">
          {/* Top 4 Attainment Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono">
            <div className="bg-surface p-4 rounded-[6px] border border-border">
              <span className="text-[11px] text-muted block uppercase">Overall attainment</span>
              <span className="text-2xl font-bold text-teal mt-1 block">82%</span>
              <span className="text-[10px] text-teal bg-teal-tint px-2 py-0.5 rounded mt-1 inline-block">Attained</span>
            </div>
            <div className="bg-surface p-4 rounded-[6px] border border-border">
              <span className="text-[11px] text-muted block uppercase">COs attained</span>
              <span className="text-2xl font-bold text-ink mt-1 block">4/5</span>
              <span className="text-[10px] text-muted block mt-1">60% of students at ≥ 50%</span>
            </div>
            <div className="bg-surface p-4 rounded-[6px] border border-border">
              <span className="text-[11px] text-muted block uppercase">Slow learners</span>
              <span className="text-2xl font-bold text-danger mt-1 block">7</span>
              <span className="text-[10px] text-muted block mt-1">overall below 40%</span>
            </div>
            <div className="bg-surface p-4 rounded-[6px] border border-border">
              <span className="text-[11px] text-muted block uppercase">Fast learners</span>
              <span className="text-2xl font-bold text-teal mt-1 block">14</span>
              <span className="text-[10px] text-muted block mt-1">overall 80% and above</span>
            </div>
          </div>

          {/* Attainment Table & Bell Curve */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface p-5 rounded-[6px] border border-border overflow-x-auto">
              <div className="text-xs font-mono text-muted uppercase tracking-wider mb-3">
                CO-Wise Attainment Summary
              </div>
              <table className="w-full text-xs font-mono text-center">
                <thead>
                  <tr className="border-b border-border text-[11px] text-muted">
                    <th className="py-2 text-left">CO</th>
                    <th className="py-2">≥ 50%</th>
                    <th className="py-2">MEAN</th>
                    <th className="py-2">SLOW</th>
                    <th className="py-2">FAST</th>
                    <th className="py-2 text-right">RESULT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-2 text-left font-semibold text-ink">CO1</td>
                    <td className="py-2">95%</td>
                    <td className="py-2">73%</td>
                    <td className="py-2">2</td>
                    <td className="py-2">41</td>
                    <td className="py-2 text-right text-teal font-medium">Attained</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-left font-semibold text-ink">CO2</td>
                    <td className="py-2">83%</td>
                    <td className="py-2">67%</td>
                    <td className="py-2">4</td>
                    <td className="py-2">26</td>
                    <td className="py-2 text-right text-teal font-medium">Attained</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-left font-semibold text-ink">CO3</td>
                    <td className="py-2">65%</td>
                    <td className="py-2">56%</td>
                    <td className="py-2">19</td>
                    <td className="py-2">13</td>
                    <td className="py-2 text-right text-teal font-medium">Attained</td>
                  </tr>
                  <tr className="bg-danger-tint/30">
                    <td className="py-2 text-left font-semibold text-danger">CO4</td>
                    <td className="py-2 text-danger font-bold">48%</td>
                    <td className="py-2 text-danger">47%</td>
                    <td className="py-2 text-danger">35</td>
                    <td className="py-2">1</td>
                    <td className="py-2 text-right text-danger font-bold">Not attained</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-left font-semibold text-ink">CO5</td>
                    <td className="py-2">79%</td>
                    <td className="py-2">63%</td>
                    <td className="py-2">9</td>
                    <td className="py-2">20</td>
                    <td className="py-2 text-right text-teal font-medium">Attained</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bell Curve Simulation Box */}
            <div className="bg-surface p-5 rounded-[6px] border border-border flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-muted mb-2">
                  <span>Overall distribution</span>
                  <span className="text-ink">mean 61% · sd 14.0</span>
                </div>
                
                {/* SVG Bell Curve */}
                <div className="h-32 w-full flex items-center justify-center">
                  <svg viewBox="0 0 200 80" className="w-full h-full">
                    {/* Shaded Areas */}
                    <path
                      d="M 10 75 Q 70 75 90 40 Q 110 5 125 40 Q 145 75 190 75 Z"
                      fill="#E6F0EC"
                      stroke="#0E5E52"
                      strokeWidth="2"
                    />
                    {/* Target line 60% */}
                    <line x1="120" y1="10" x2="120" y2="75" stroke="#9F1D1D" strokeDasharray="3,3" strokeWidth="1.5" />
                    <text x="122" y="25" fill="#9F1D1D" fontSize="7" fontFamily="monospace">60% Target</text>
                  </svg>
                </div>
              </div>

              <div className="pt-3 border-t border-border text-[11px] text-muted">
                Normal distribution across enrolled batch students. Target threshold 60% aligns with NBA criteria.
              </div>
            </div>
          </div>

          {/* Assist Insights & Suggestions for BoS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-surface p-5 rounded-[6px] border border-border space-y-2">
              <div className="font-semibold text-ink flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-4 h-4 text-assist" />
                <span>Gaps identified by Assist</span>
              </div>
              <p className="text-muted leading-relaxed">
                CO4 (functions and pointers): 48% of students reached 50%; 35 below 40%. Hidden test cases fail 2.3× more often than visible ones in Units 3–4; students test only the happy path.
              </p>
            </div>

            <div className="bg-surface p-5 rounded-[6px] border border-border space-y-2">
              <div className="font-semibold text-ink flex items-center gap-1.5 font-mono">
                <Sparkles className="w-4 h-4 text-teal" />
                <span>Suggestions for Board of Studies (BoS)</span>
              </div>
              <p className="text-muted leading-relaxed">
                Add 2 guided lab sessions on pointers before Unit 5 structures, and introduce a testing-mindset exercise in Unit 2. Move dynamic memory allocation to theory course; keep lab on pointer arithmetic.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Student Lab Files */}
      {activeTab === 'student_lab_files' && (
        <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <span className="font-semibold text-xs text-ink uppercase font-mono">
                Student Lab Records (NBA/NAAC Audit Ready)
              </span>
              <p className="text-xs text-muted">
                Each record includes signed title page, QR verification code, attendance %, and full program submissions.
              </p>
            </div>

            <button className="px-3 py-1.5 bg-surface-alt border border-border rounded text-xs font-mono hover:bg-paper">
              Download all as ZIP
            </button>
          </div>

          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-[11px] text-muted text-left">
                <th className="p-2.5">ROLL</th>
                <th className="p-2.5">STUDENT NAME</th>
                <th className="p-2.5 text-center">ATTENDANCE</th>
                <th className="p-2.5 text-center">MARKS / 100</th>
                <th className="p-2.5">VERIFICATION ID</th>
                <th className="p-2.5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.slice(0, 10).map((st) => (
                <tr key={st.student_id} className="hover:bg-surface-alt">
                  <td className="p-2.5 font-semibold text-ink">{st.roll}</td>
                  <td className="p-2.5 text-ink">{st.name}</td>
                  <td className="p-2.5 text-center text-teal">96%</td>
                  <td className="p-2.5 text-center font-bold text-ink">86</td>
                  <td className="p-2.5 text-muted text-[11px]">XO-CSL101-{st.roll}-7F3A</td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={() => setShowPrintModal(true)}
                      className="text-teal hover:underline"
                    >
                      View / PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Print / Export Modal */}
      {showPrintModal && (
        <CourseFilePrintView onClose={() => setShowPrintModal(false)} />
      )}
    </div>
  );
};
