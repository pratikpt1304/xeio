import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CheckCircle2, AlertTriangle, Shield, Clock, Users, FileSpreadsheet, Lock } from 'lucide-react';

export const Step8Assessments: React.FC = () => {
  const { endSem, setEndSemStage, useAICredit } = useApp();
  const [selectedBatchTab, setSelectedBatchTab] = useState<'A' | 'B'>('A');

  const stages = [
    { num: 1, name: 'Rules', status: 'done' },
    { num: 2, name: 'Generate and approve', status: 'done', meta: '30/30' },
    { num: 3, name: 'HOD approval', status: 'done' },
    { num: 4, name: 'Schedule', status: 'done', meta: '2027-05-10' },
    { num: 5, name: 'Attendance and conduct', status: 'live' },
    { num: 6, name: 'Marks and attainment', status: 'pending' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 8 · RUN
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Assessments (End-sem practical)</h1>
            <p className="text-xs text-muted mt-1">
              Set the rules, generate 40 questions, approve 30, get HOD approval, schedule, activate after attendance, then publish marks and attainment.
            </p>
          </div>

          {/* Batch Selector */}
          <div className="flex items-center gap-1 bg-surface p-1 rounded-[6px] border border-border font-mono text-xs">
            <button
              onClick={() => setSelectedBatchTab('A')}
              className={`px-3 py-1 rounded transition-colors ${
                selectedBatchTab === 'A' ? 'bg-rail text-white font-medium' : 'text-muted hover:text-ink'
              }`}
            >
              Batch A
            </button>
            <button
              onClick={() => setSelectedBatchTab('B')}
              className={`px-3 py-1 rounded transition-colors ${
                selectedBatchTab === 'B' ? 'bg-rail text-white font-medium' : 'text-muted hover:text-ink'
              }`}
            >
              Batch B
            </button>
          </div>
        </div>
      </div>

      {/* 6 Stage Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {stages.map((st) => {
          const isCurrent = endSem.stage === st.num;
          return (
            <div
              key={st.num}
              onClick={() => setEndSemStage(st.num as any)}
              className={`p-3 rounded-[6px] border cursor-pointer transition-all ${
                isCurrent
                  ? 'bg-surface border-teal ring-1 ring-teal'
                  : st.num < endSem.stage
                  ? 'bg-surface border-border hover:border-muted'
                  : 'bg-surface-alt border-border opacity-60'
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-muted mb-0.5">
                Stage {st.num}
              </div>
              <div className="font-semibold text-xs text-ink leading-tight">{st.name}</div>
              <div className="mt-1 text-[11px] font-mono">
                {st.num === 5 && isCurrent ? (
                  <span className="text-teal font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
                    Live
                  </span>
                ) : st.meta ? (
                  <span className="text-muted">{st.meta}</span>
                ) : (
                  <span className="text-muted">done</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage 5: Attendance & Live AI Proctor Panel (Currently Live) */}
      {endSem.stage === 5 && (
        <div className="space-y-6">
          <div className="bg-surface p-5 rounded-[6px] border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div>
                <h3 className="font-semibold text-sm text-ink">
                  Test activated for 60 present students at 24 Nov, 10:00 am
                </h3>
                <p className="text-xs text-muted">
                  Absent students blocked from starting. Proctor flags never change marks automatically.
                </p>
              </div>

              <button
                onClick={() => setEndSemStage(6)}
                className="px-3 py-1.5 bg-danger text-white rounded-[6px] text-xs font-medium hover:bg-[#7e1717]"
              >
                End test and compute marks
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attendance Grid */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-ink">Attendance · Batch A end-sem</span>
                  <span className="text-muted">60 present · 3 absent</span>
                </div>

                <div className="grid grid-cols-10 gap-1 font-mono text-xs text-center">
                  {Array.from({ length: 60 }, (_, i) => {
                    const seat = i + 1;
                    const isAbsent = seat === 4 || seat === 17 || seat === 49;
                    return (
                      <div
                        key={seat}
                        className={`py-1.5 rounded border text-[11px] ${
                          isAbsent
                            ? 'bg-danger-tint text-danger border-danger/30'
                            : 'bg-teal-tint text-teal border-teal/30'
                        }`}
                      >
                        {seat.toString().padStart(2, '0')}
                      </div>
                    );
                  })}
                </div>
                <div className="text-[11px] text-muted">
                  Test active for 60 present students. Absent students cannot start.
                </div>
              </div>

              {/* AI Proctor Live Events Box */}
              <div className="bg-surface-alt p-4 rounded-[6px] border border-border space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-semibold text-ink flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal" />
                    AI proctor
                  </span>
                  <span className="text-teal font-semibold">Active</span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted">Students started:</span>
                    <span className="font-semibold text-ink">60/60 present</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Absent, blocked:</span>
                    <span className="font-semibold text-danger">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Fullscreen lockdown:</span>
                    <span className="text-teal font-semibold">Enforced</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Tab/window switch attempts:</span>
                    <span className="text-assist font-semibold">3 (2 students)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Multiple faces or no face:</span>
                    <span className="text-assist font-semibold">1 flag · seat 51</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Copy, paste and AI tools:</span>
                    <span className="text-teal font-semibold">Blocked · 4 attempts</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1">
                    <span className="text-muted">Submitted:</span>
                    <span className="font-semibold text-ink">0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 6: Marks List & Attainment */}
      {endSem.stage === 6 && (
        <div className="space-y-6">
          <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-semibold text-sm text-ink">
                  Test ended. Marks list and attainment are ready.
                </h3>
                <p className="text-xs text-muted">
                  Marks list as per rubric, end-sem attainment report, and the approved question set.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Appended to Course File Sections 11, 12 and 13!')}
                  className="px-4 py-1.5 bg-teal text-white rounded-[6px] text-xs font-medium hover:bg-[#0b4b42]"
                >
                  Add to course file
                </button>
                <button className="px-3 py-1.5 bg-surface text-ink border border-border rounded-[6px] text-xs font-medium hover:bg-surface-alt">
                  Download mark list (Excel)
                </button>
              </div>
            </div>

            {/* Marks Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border bg-surface-alt text-[11px] text-muted text-left">
                    <th className="p-2.5">ROLL</th>
                    <th className="p-2.5">QUESTIONS (CO)</th>
                    <th className="p-2.5 text-center">VISIBLE</th>
                    <th className="p-2.5 text-center">HIDDEN</th>
                    <th className="p-2.5 text-center">VIVA</th>
                    <th className="p-2.5 text-center">TOTAL</th>
                    <th className="p-2.5">INTEGRITY</th>
                    <th className="p-2.5 text-right">SUBMITTED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-surface-alt">
                    <td className="p-2.5 font-medium text-ink">2301001</td>
                    <td className="p-2.5 text-muted">A1 (CO1) · A4 (CO4)</td>
                    <td className="p-2.5 text-center">20/20</td>
                    <td className="p-2.5 text-center">30/30</td>
                    <td className="p-2.5 text-center">10/10</td>
                    <td className="p-2.5 text-center font-bold text-teal">60/60</td>
                    <td className="p-2.5 text-teal">clean</td>
                    <td className="p-2.5 text-right text-muted">12:11</td>
                  </tr>
                  <tr className="hover:bg-surface-alt">
                    <td className="p-2.5 font-medium text-ink">2301002</td>
                    <td className="p-2.5 text-muted">A8 (CO3) · A15 (CO5)</td>
                    <td className="p-2.5 text-center">20/20</td>
                    <td className="p-2.5 text-center">25/30</td>
                    <td className="p-2.5 text-center">9/10</td>
                    <td className="p-2.5 text-center font-bold text-teal">54/60</td>
                    <td className="p-2.5 text-teal">clean</td>
                    <td className="p-2.5 text-right text-muted">12:14</td>
                  </tr>
                  <tr className="hover:bg-surface-alt">
                    <td className="p-2.5 font-medium text-ink">2301007</td>
                    <td className="p-2.5 text-muted">A13 (CO3) · A18 (CO5)</td>
                    <td className="p-2.5 text-center">20/20</td>
                    <td className="p-2.5 text-center">20/30</td>
                    <td className="p-2.5 text-center">9/10</td>
                    <td className="p-2.5 text-center font-bold text-ink">49/60</td>
                    <td className="p-2.5 text-assist font-semibold">1 flag · reviewed</td>
                    <td className="p-2.5 text-right text-muted">11:58</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* End-sem CO attainment bars */}
            <div className="pt-4 border-t border-border">
              <div className="text-xs font-mono text-muted uppercase tracking-wider mb-2">
                End-sem CO attainment · Batch A
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="w-10 text-muted">CO1</span>
                  <div className="flex-1 bg-surface-alt h-4 rounded border border-border relative overflow-hidden">
                    <div className="bg-teal h-full" style={{ width: '86%' }}></div>
                    <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-danger" title="60% target line"></div>
                  </div>
                  <span className="w-12 font-bold text-ink">86%</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-10 text-muted">CO2</span>
                  <div className="flex-1 bg-surface-alt h-4 rounded border border-border relative overflow-hidden">
                    <div className="bg-teal h-full" style={{ width: '74%' }}></div>
                    <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-danger" title="60% target line"></div>
                  </div>
                  <span className="w-12 font-bold text-ink">74%</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-10 text-muted">CO3</span>
                  <div className="flex-1 bg-surface-alt h-4 rounded border border-border relative overflow-hidden">
                    <div className="bg-teal h-full" style={{ width: '63%' }}></div>
                    <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-danger" title="60% target line"></div>
                  </div>
                  <span className="w-12 font-bold text-ink">63%</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-10 text-muted">CO4</span>
                  <div className="flex-1 bg-surface-alt h-4 rounded border border-border relative overflow-hidden">
                    <div className="bg-assist h-full" style={{ width: '52%' }}></div>
                    <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-danger" title="60% target line"></div>
                  </div>
                  <span className="w-12 font-bold text-assist">52% (Below target)</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-10 text-muted">CO5</span>
                  <div className="flex-1 bg-surface-alt h-4 rounded border border-border relative overflow-hidden">
                    <div className="bg-teal h-full" style={{ width: '69%' }}></div>
                    <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-danger" title="60% target line"></div>
                  </div>
                  <span className="w-12 font-bold text-ink">69%</span>
                </div>
              </div>
              <div className="text-[11px] text-muted mt-2">
                CO4 (Functions and pointers) is below the 60% line in the end-sem as in internals; the gap holds across batches.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
