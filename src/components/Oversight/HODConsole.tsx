import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { XeIOLogo, ElzeoLogo, FooterBranding } from '../Brand';
import { CheckCircle2, Clock, AlertTriangle, Send, FileCheck, Shield, ChevronRight } from 'lucide-react';

export const HODConsole: React.FC<{ onSignOut: () => void }> = ({ onSignOut }) => {
  const { planStatus, hodPlanDecision, hodPlanRemark, course, cos, batches } = useApp();
  const [activeTab, setActiveTab] = useState<'approvals' | 'courses' | 'live' | 'final_marks'>('approvals');
  const [remarkText, setRemarkText] = useState('');
  const [selectedItem, setSelectedItem] = useState<'plan' | 'endsem' | 'finalmarks'>('plan');

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Top Header */}
      <header className="h-14 bg-rail text-white px-6 flex items-center justify-between border-b border-[#262624] select-none">
        <div className="flex items-center gap-4">
          <XeIOLogo variant="dark" suffix="HOD" size="md" />
          <span className="text-xs font-mono text-muted">Academic Department Oversight</span>
        </div>

        <nav className="flex items-center gap-1 font-mono text-xs">
          {(['approvals', 'courses', 'live', 'final_marks'] as const).map((tab) => {
            const labels = {
              approvals: `Approvals (${planStatus === 'sent' ? 1 : 0})`,
              courses: `Courses (${course.code ? 1 : 0})`,
              live: `Live Monitor (${batches.length > 0 ? 1 : 0})`,
              final_marks: 'Final Marks Pipeline',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded transition-colors ${
                  activeTab === tab ? 'bg-[#262624] text-white font-semibold' : 'text-[#A3A299] hover:text-white'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#A3A299]">Prof. Sunita Deshmukh</span>
          <span className="text-[#3A3935]">|</span>
          <button onClick={onSignOut} className="text-[#A3A299] hover:text-white hover:underline text-[11px]">
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto space-y-6">
        {/* Approvals Tab (PRD Page 29) */}
        {activeTab === 'approvals' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Queue */}
            <div className="bg-surface p-4 rounded-[6px] border border-border space-y-3">
              <div className="text-xs font-mono text-muted uppercase tracking-wider flex justify-between">
                <span>Pending Approvals</span>
                <span className="text-teal font-semibold">3 items</span>
              </div>

              <div className="space-y-2">
                {planStatus === 'sent' ? (
                  <div
                    onClick={() => setSelectedItem('plan')}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      selectedItem === 'plan' ? 'bg-surface-alt border-teal ring-1 ring-teal' : 'border-border hover:bg-surface-alt'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-muted uppercase">Course plan</div>
                    <div className="font-semibold text-xs text-ink">{course.code || 'Course'} · {course.title || 'Laboratory Course'}</div>
                    <div className="text-[11px] text-muted mt-0.5">{course.facultyInCharge || 'Faculty'} · {cos.length} COs, Rubric 50 marks</div>
                  </div>
                ) : (
                  <div className="p-4 bg-surface-alt rounded border border-border text-center text-xs font-mono text-muted">
                    No items pending HOD approval
                  </div>
                )}
              </div>
            </div>

            {/* Right Review Detail Panel */}
            <div className="md:col-span-2 bg-surface p-6 rounded-[6px] border border-border space-y-5">
              <div>
                <div className="text-xs font-mono text-muted uppercase tracking-wider mb-1">
                  Course plan and mark scheme review
                </div>
                <h2 className="text-xl font-semibold text-ink">
                  {course.code ? `${course.code} · ${course.title}` : 'Laboratory Course Plan'}
                </h2>
                <div className="text-xs text-muted font-mono mt-0.5">
                  {course.facultyInCharge || 'Faculty'} · {cos.length} COs with Bloom levels · CO–PO map
                </div>
              </div>

              {/* Rubric Review Table */}
              <div className="border border-border rounded overflow-hidden">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="bg-surface-alt border-b border-border text-[11px] text-muted text-left">
                      <th className="p-2.5">RUBRIC COMPONENT</th>
                      <th className="p-2.5">EARNED IN EACH SESSION</th>
                      <th className="p-2.5 text-right">MARKS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="p-2.5 font-medium text-ink">Attendance</td>
                      <td className="p-2.5 text-muted">Present in the session</td>
                      <td className="p-2.5 text-right font-bold">10</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-ink">Pre-test</td>
                      <td className="p-2.5 text-muted">5 MCQs, one attempt, before the lab</td>
                      <td className="p-2.5 text-right font-bold">5</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-ink">Post-test</td>
                      <td className="p-2.5 text-muted">5 MCQs, same day, after hidden tests pass</td>
                      <td className="p-2.5 text-right font-bold">5</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-ink">Visible test cases</td>
                      <td className="p-2.5 text-muted">2 per question</td>
                      <td className="p-2.5 text-right font-bold">10</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-ink">Hidden test cases</td>
                      <td className="p-2.5 text-muted">3 per question</td>
                      <td className="p-2.5 text-right font-bold">10</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium text-ink">Viva</td>
                      <td className="p-2.5 text-muted">Out of 10 per session</td>
                      <td className="p-2.5 text-right font-bold">10</td>
                    </tr>
                    <tr className="bg-surface-alt font-bold">
                      <td className="p-2.5">Total</td>
                      <td className="p-2.5 text-teal">Scaled to 100 in reports</td>
                      <td className="p-2.5 text-right text-teal">50</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Assist Checks Box */}
              <div className="p-4 bg-surface-alt rounded border border-border space-y-2 text-xs font-mono">
                <div className="font-semibold text-ink">Assist checks:</div>
                <div className="space-y-1 text-teal text-[11px]">
                  <div>✓ Every CO has at least 4 sessions</div>
                  <div>✓ Bloom levels span L2 to L6 progressively</div>
                  <div>✓ Session plan avoids all university calendar holidays</div>
                  <div>✓ Rubric matches the department template and sums to 50</div>
                </div>
              </div>

              {/* Remarks Box & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Remarks to faculty (Required to decline)
                  </label>
                  <textarea
                    value={remarkText}
                    onChange={(e) => setRemarkText(e.target.value)}
                    placeholder="Enter approval remark or reason for declining..."
                    className="w-full p-2.5 bg-surface text-ink text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-teal"
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      hodPlanDecision('approved', remarkText || 'Course plan approved. Meets curriculum standards.');
                      alert('Course Plan Approved! Faculty can now conduct live sessions.');
                    }}
                    className="px-4 py-2 bg-teal text-white rounded text-xs font-mono font-medium hover:bg-[#0b4b42]"
                  >
                    Approve course plan
                  </button>
                  <button
                    onClick={() => {
                      if (!remarkText) {
                        alert('A remark is required to decline.');
                        return;
                      }
                      hodPlanDecision('declined', remarkText);
                      alert('Course plan returned to faculty as draft.');
                    }}
                    className="px-4 py-2 bg-surface text-danger border border-danger/30 rounded text-xs font-mono font-medium hover:bg-danger-tint"
                  >
                    Decline with remarks
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Overview Tab */}
        {activeTab === 'courses' && (
          <div className="bg-surface p-6 rounded-[6px] border border-border space-y-4">
            <h2 className="text-lg font-semibold text-ink">Department Lab Courses (CSE)</h2>
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-border bg-surface-alt text-[11px] text-muted">
                  <th className="p-3">COURSE</th>
                  <th className="p-3">COORDINATOR</th>
                  <th className="p-3 text-center">SESSIONS CONDUCTED</th>
                  <th className="p-3 text-center">AVERAGE MARKS</th>
                  <th className="p-3 text-center">ATTAINMENT</th>
                  <th className="p-3 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {course.code ? (
                  <tr>
                    <td className="p-3 font-semibold text-ink">{course.code} {course.title}</td>
                    <td className="p-3 text-muted">{course.facultyInCharge || 'Faculty'}</td>
                    <td className="p-3 text-center">{batches.length} Batches</td>
                    <td className="p-3 text-center text-teal font-bold">{planStatus}</td>
                    <td className="p-3 text-center text-teal">{cos.length} COs</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 bg-teal-tint text-teal rounded text-[11px]">Active</span>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-xs text-muted font-mono">
                      No lab courses registered in department yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Live Lab Monitor Tab */}
        {activeTab === 'live' && (
          <div className="bg-surface p-6 rounded-[6px] border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">Active Labs in Department</h2>
                <p className="text-xs text-muted">Real-time attendance, test status and proctor flags (Read-only)</p>
              </div>
              <span className="px-2 py-0.5 bg-surface-alt text-muted rounded text-xs font-mono font-medium flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${batches.length > 0 ? 'bg-teal animate-pulse' : 'bg-[#73726B]'}`}></span>
                {batches.length > 0 ? '1 Lab Running' : '0 Labs Running'}
              </span>
            </div>

            {batches.length > 0 ? (
              <div className="p-4 bg-surface-alt rounded border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-ink">{course.code || 'Course'} · {batches[0].name}</div>
                  <div className="text-xs text-muted font-mono mt-0.5">
                    {batches[0].room} · {batches[0].students_count} Students Enrolled
                  </div>
                </div>
                <span className="text-xs font-mono text-teal">Monitor healthy</span>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted font-mono bg-surface-alt rounded border border-border">
                No active department lab sessions running at this time.
              </div>
            )}
          </div>
        )}

        {/* Final Marks Pipeline Tab */}
        {activeTab === 'final_marks' && (
          <div className="bg-surface p-6 rounded-[6px] border border-border space-y-4">
            <h2 className="text-lg font-semibold text-ink">Final Marks Pipeline</h2>
            <div className="p-4 bg-surface-alt rounded border border-border text-xs font-mono space-y-2">
              <div className="font-semibold text-ink">Pipeline Status: Faculty Submitted → HOD Approved → CoE Accepted</div>
              <div className="text-muted">Final marks will populate automatically upon completion of laboratory sessions and the End-sem practical exam.</div>
            </div>
          </div>
        )}
      </main>

      <FooterBranding />
    </div>
  );
};
