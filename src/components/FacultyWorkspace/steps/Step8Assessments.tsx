import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CheckCircle2,
  AlertTriangle,
  Shield,
  Clock,
  Users,
  FileSpreadsheet,
  Lock,
  Sparkles,
  Calendar,
  MapPin,
  Check,
  Send,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { INITIAL_40_ENDSEM_QUESTIONS, EndSemCandidateQuestion } from '../../../data/endSemQuestions';

export const Step8Assessments: React.FC = () => {
  const { endSem, setEndSemStage, batches, course } = useApp();
  const [selectedBatchTab, setSelectedBatchTab] = useState<string>(batches[0]?.name || 'Batch 1');
  const [questions, setQuestions] = useState<EndSemCandidateQuestion[]>(INITIAL_40_ENDSEM_QUESTIONS);
  const [diffFilter, setDiffFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [coFilter, setCoFilter] = useState<string>('All');
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  // Stage 1 Rules State
  const [rules, setRules] = useState({
    questionsPerStudent: 2,
    durationMin: 120,
    visibleTestCases: 2,
    hiddenTestCases: 3,
    marksPerVisible: 5,
    marksPerHidden: 5,
    vivaMarks: 10,
    easyCount: 12,
    medCount: 16,
    hardCount: 12,
  });

  // Stage 3 HOD remark state
  const [hodRemark, setHodRemark] = useState('Reviewed and approved. Questions map cleanly to syllabus and CO requirements.');
  const [isHodApproved, setIsHodApproved] = useState(endSem.stage > 3);

  // Stage 4 Schedule State
  const [schedule, setSchedule] = useState({
    date: '2026-11-28',
    startTime: '10:00',
    endTime: '12:00',
    venue: 'Computing Lab 3 (Workstations 1–60)',
    proctorName: 'Prof. S. R. Patil',
  });

  // Stage 5 Attendance State (60 seats)
  const [seatAttendance, setSeatAttendance] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    for (let i = 1; i <= 60; i++) {
      // Seats 4, 17, 49 are absent initially
      initial[i] = !(i === 4 || i === 17 || i === 49);
    }
    return initial;
  });

  const toggleSeatAttendance = (seat: number) => {
    setSeatAttendance((prev) => ({
      ...prev,
      [seat]: !prev[seat],
    }));
  };

  const presentCount = Object.values(seatAttendance).filter(Boolean).length;
  const absentCount = 60 - presentCount;

  // Question selection in Stage 2
  const toggleQuestionSelection = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, selected: !q.selected } : q))
    );
  };

  const selectRecommended30 = () => {
    // Select first 10 Easy, 12 Medium, 8 Hard
    let e = 0, m = 0, h = 0;
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.difficulty === 'Easy' && e < 10) {
          e++;
          return { ...q, selected: true };
        }
        if (q.difficulty === 'Medium' && m < 12) {
          m++;
          return { ...q, selected: true };
        }
        if (q.difficulty === 'Hard' && h < 8) {
          h++;
          return { ...q, selected: true };
        }
        return { ...q, selected: false };
      })
    );
  };

  const selectedCount = questions.filter((q) => q.selected).length;

  const filteredQuestions = questions.filter((q) => {
    if (diffFilter !== 'All' && q.difficulty !== diffFilter) return false;
    if (coFilter !== 'All' && q.co !== coFilter) return false;
    return true;
  });

  const stages = [
    { num: 1, name: 'Rules', status: endSem.stage > 1 ? 'done' : endSem.stage === 1 ? 'live' : 'pending' },
    { num: 2, name: 'Generate and approve', status: endSem.stage > 2 ? 'done' : endSem.stage === 2 ? 'live' : 'pending', meta: `${selectedCount}/30` },
    { num: 3, name: 'HOD approval', status: endSem.stage > 3 ? 'done' : endSem.stage === 3 ? 'live' : 'pending' },
    { num: 4, name: 'Schedule', status: endSem.stage > 4 ? 'done' : endSem.stage === 4 ? 'live' : 'pending' },
    { num: 5, name: 'Attendance and conduct', status: endSem.stage > 5 ? 'done' : endSem.stage === 5 ? 'live' : 'pending' },
    { num: 6, name: 'Marks and attainment', status: endSem.stage === 6 ? 'live' : 'pending' },
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
            {batches.length > 0 ? (
              batches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBatchTab(b.name)}
                  className={`px-3 py-1 rounded transition-colors ${
                    selectedBatchTab === b.name ? 'bg-rail text-white font-medium' : 'text-muted hover:text-ink'
                  }`}
                >
                  {b.name}
                </button>
              ))
            ) : (
              <span className="px-3 py-1 text-muted text-[11px]">No batches</span>
            )}
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
                ) : st.num < endSem.stage ? (
                  <span className="text-teal">✓ done</span>
                ) : (
                  <span className="text-muted">pending</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= STAGE 1: RULES ================= */}
      {endSem.stage === 1 && (
        <div className="bg-surface p-6 rounded-[6px] border border-border space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-semibold text-sm text-ink">Stage 1 · Assessment Rules & Structure</h3>
              <p className="text-xs text-muted">
                Define the question selection parameters, test case weights, duration, and AI proctoring rules.
              </p>
            </div>
            <button
              onClick={() => setEndSemStage(2)}
              className="px-4 py-1.5 bg-teal text-white rounded-[6px] text-xs font-medium hover:bg-[#0b4b42]"
            >
              Save & Proceed to Question Pool →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Box 1: Question Pool Mix */}
            <div className="p-4 bg-surface-alt rounded border border-border space-y-3 font-mono">
              <span className="font-bold text-ink uppercase text-[11px]">Candidate Pool Structure (40 Questions)</span>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Easy Questions:</span>
                  <input
                    type="number"
                    value={rules.easyCount}
                    onChange={(e) => setRules({ ...rules, easyCount: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-surface border border-border rounded text-center font-bold text-ink"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Medium Questions:</span>
                  <input
                    type="number"
                    value={rules.medCount}
                    onChange={(e) => setRules({ ...rules, medCount: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-surface border border-border rounded text-center font-bold text-ink"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Hard Questions:</span>
                  <input
                    type="number"
                    value={rules.hardCount}
                    onChange={(e) => setRules({ ...rules, hardCount: Number(e.target.value) })}
                    className="w-16 px-2 py-1 bg-surface border border-border rounded text-center font-bold text-ink"
                  />
                </div>
                <div className="pt-2 border-t border-border flex justify-between font-bold">
                  <span>Approved Pool Required:</span>
                  <span className="text-teal">30 Questions</span>
                </div>
              </div>
            </div>

            {/* Box 2: Test Cases & Marks */}
            <div className="p-4 bg-surface-alt rounded border border-border space-y-3 font-mono">
              <span className="font-bold text-ink uppercase text-[11px]">Test Cases & Marks Per Question</span>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Questions per student:</span>
                  <span className="font-bold text-ink">2 questions</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Visible test cases (2):</span>
                  <span className="font-bold text-ink">5 marks each (10)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Hidden test cases (3):</span>
                  <span className="font-bold text-ink">5 marks each (15)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Viva Voce per student:</span>
                  <span className="font-bold text-ink">10 marks</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between font-bold">
                  <span>Total End-Sem Marks:</span>
                  <span className="text-teal">60 Marks</span>
                </div>
              </div>
            </div>

            {/* Box 3: Exam Duration & Security */}
            <div className="p-4 bg-surface-alt rounded border border-border space-y-3 font-mono">
              <span className="font-bold text-ink uppercase text-[11px]">Security & Proctoring</span>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Exam Duration:</span>
                  <span className="font-bold text-ink">120 Minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Fullscreen Lockdown:</span>
                  <span className="text-teal font-semibold">Enabled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Webcam Face Detection:</span>
                  <span className="text-teal font-semibold">1 Face Enforced</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted">Clipboard (Copy/Paste):</span>
                  <span className="text-teal font-semibold">Blocked</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between font-bold">
                  <span>Autosave Frequency:</span>
                  <span className="text-ink">Every 10 seconds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 2: GENERATE AND APPROVE 30 FROM 40 ================= */}
      {endSem.stage === 2 && (
        <div className="bg-surface p-6 rounded-[6px] border border-border space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-sm text-ink">Stage 2 · Candidate Questions Pool (40 Generated)</h3>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    selectedCount === 30 ? 'bg-teal-tint text-teal' : 'bg-assist-tint text-assist'
                  }`}
                >
                  {selectedCount} of 30 Approved
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5">
                Select exactly 30 questions across all units (CO1–CO5) to submit for HOD digital approval.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={selectRecommended30}
                className="px-3 py-1.5 bg-surface-alt border border-border text-ink rounded text-xs font-mono hover:bg-paper"
              >
                Select Recommended 30
              </button>
              <button
                disabled={selectedCount !== 30}
                onClick={() => setEndSemStage(3)}
                className={`px-4 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                  selectedCount === 30
                    ? 'bg-teal text-white hover:bg-[#0b4b42]'
                    : 'bg-muted/30 text-muted cursor-not-allowed'
                }`}
              >
                Submit 30 for HOD Approval →
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-muted">Difficulty:</span>
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    diffFilter === d ? 'bg-rail text-white' : 'bg-surface-alt text-muted hover:text-ink'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted">Outcome:</span>
              {(['All', 'CO1', 'CO2', 'CO3', 'CO4', 'CO5'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCoFilter(c)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    coFilter === c ? 'bg-rail text-white' : 'bg-surface-alt text-muted hover:text-ink'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Questions Grid/List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedQId === q.id;
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-[6px] border transition-all ${
                    q.selected
                      ? 'bg-surface border-teal ring-1 ring-teal/30'
                      : 'bg-surface-alt border-border opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={q.selected}
                        onChange={() => toggleQuestionSelection(q.id)}
                        className="mt-1 h-4 w-4 rounded border-border text-teal focus:ring-teal cursor-pointer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-ink">{q.code}</span>
                          <span className="text-xs font-medium text-ink">{q.title}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono mt-1 text-muted">
                          <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-ink">
                            {q.co}
                          </span>
                          <span>{q.btl}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded font-medium ${
                              q.difficulty === 'Easy'
                                ? 'bg-teal-tint text-teal'
                                : q.difficulty === 'Medium'
                                ? 'bg-assist-tint text-assist'
                                : 'bg-danger-tint text-danger'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                      className="text-muted hover:text-ink p-1"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Statement & Test Cases Preview */}
                  <div className="mt-2 text-xs text-muted leading-relaxed pl-6">
                    <p>{q.statement}</p>
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border space-y-2 font-mono text-[11px]">
                        <div>
                          <span className="text-ink font-semibold">Input:</span> {q.inputFormat}
                        </div>
                        <div>
                          <span className="text-ink font-semibold">Output:</span> {q.outputFormat}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="p-2 bg-paper rounded border border-border">
                            <span className="text-[10px] uppercase font-bold text-teal block">
                              Visible Tests ({q.visible_test_cases.length})
                            </span>
                            <div className="text-[10px] text-muted truncate">
                              In: {q.visible_test_cases[0]?.input.replace('\n', ' ')}
                            </div>
                          </div>
                          <div className="p-2 bg-paper rounded border border-border">
                            <span className="text-[10px] uppercase font-bold text-assist block">
                              Hidden Tests ({q.hidden_test_cases.length})
                            </span>
                            <div className="text-[10px] text-muted truncate">
                              In: {q.hidden_test_cases[0]?.input.replace('\n', ' ')}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= STAGE 3: HOD APPROVAL ================= */}
      {endSem.stage === 3 && (
        <div className="bg-surface p-6 rounded-[6px] border border-border space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-semibold text-sm text-ink">Stage 3 · Head of Department (HOD) Approval</h3>
              <p className="text-xs text-muted">
                Official academic review of the 30-question end-sem practical pool for {course.code || 'Course'}.
              </p>
            </div>
            {isHodApproved ? (
              <span className="px-3 py-1 bg-teal-tint text-teal rounded text-xs font-mono font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Approved by HOD
              </span>
            ) : (
              <span className="px-3 py-1 bg-assist-tint text-assist rounded text-xs font-mono font-bold">
                Awaiting Digital Approval
              </span>
            )}
          </div>

          {/* Breakdown Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono text-xs">
            <div className="p-3 bg-surface-alt rounded border border-border">
              <span className="text-muted block text-[11px]">Approved Questions</span>
              <span className="text-xl font-bold text-ink mt-1 block">30 / 30</span>
              <span className="text-[10px] text-teal">Complete</span>
            </div>
            <div className="p-3 bg-surface-alt rounded border border-border">
              <span className="text-muted block text-[11px]">Difficulty Mix</span>
              <span className="text-sm font-bold text-ink mt-1 block">10 E · 12 M · 8 H</span>
              <span className="text-[10px] text-muted">Balanced</span>
            </div>
            <div className="p-3 bg-surface-alt rounded border border-border">
              <span className="text-muted block text-[11px]">Syllabus Coverage</span>
              <span className="text-xl font-bold text-teal mt-1 block">100%</span>
              <span className="text-[10px] text-muted">All 5 COs Covered</span>
            </div>
            <div className="p-3 bg-surface-alt rounded border border-border">
              <span className="text-muted block text-[11px]">Test Cases</span>
              <span className="text-sm font-bold text-ink mt-1 block">60 Vis · 90 Hid</span>
              <span className="text-[10px] text-muted">Validated</span>
            </div>
          </div>

          {/* HOD Review Box */}
          <div className="p-5 bg-paper rounded border border-border space-y-4">
            <span className="font-bold text-xs text-ink uppercase font-mono block">
              Head of Department Endorsement & Sign-Off
            </span>
            <div className="space-y-1">
              <label className="text-xs text-muted block">HOD Remarks / Academic Council Minutes Reference:</label>
              <textarea
                value={hodRemark}
                onChange={(e) => setHodRemark(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-surface border border-border rounded text-xs text-ink font-mono focus:outline-none focus:border-teal"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-muted font-mono">
                Signing Authority: {course.hodEmail || 'hod@university.edu'} · Computer Science & Engineering
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsHodApproved(true);
                    setEndSemStage(4);
                  }}
                  className="px-4 py-2 bg-teal text-white rounded-[6px] text-xs font-semibold hover:bg-[#0b4b42] flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Grant HOD Digital Seal & Proceed to Schedule →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 4: SCHEDULE ================= */}
      {endSem.stage === 4 && (
        <div className="bg-surface p-6 rounded-[6px] border border-border space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-semibold text-sm text-ink">Stage 4 · Examination Scheduling & Lab Allocation</h3>
              <p className="text-xs text-muted">
                Lock the exam slot, assign lab workstations, and verify student attendance eligibility.
              </p>
            </div>
            <button
              onClick={() => setEndSemStage(5)}
              className="px-4 py-1.5 bg-teal text-white rounded-[6px] text-xs font-medium hover:bg-[#0b4b42] flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Schedule & Initialize Attendance Gate →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-surface-alt rounded border border-border space-y-4 font-mono">
              <span className="font-bold text-ink uppercase text-[11px] block">Slot & Hall Particulars</span>

              <div className="space-y-3">
                <div>
                  <label className="text-muted block text-[11px] mb-1">Exam Date:</label>
                  <div className="flex items-center gap-2 bg-surface p-2 rounded border border-border text-ink">
                    <Calendar className="w-4 h-4 text-muted" />
                    <input
                      type="date"
                      value={schedule.date}
                      onChange={(e) => setSchedule({ ...schedule, date: e.target.value })}
                      className="bg-transparent focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-muted block text-[11px] mb-1">Start Time:</label>
                    <input
                      type="time"
                      value={schedule.startTime}
                      onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value })}
                      className="w-full bg-surface p-2 rounded border border-border text-ink"
                    />
                  </div>
                  <div>
                    <label className="text-muted block text-[11px] mb-1">End Time:</label>
                    <input
                      type="time"
                      value={schedule.endTime}
                      onChange={(e) => setSchedule({ ...schedule, endTime: e.target.value })}
                      className="w-full bg-surface p-2 rounded border border-border text-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-muted block text-[11px] mb-1">Lab Venue:</label>
                  <div className="flex items-center gap-2 bg-surface p-2 rounded border border-border text-ink">
                    <MapPin className="w-4 h-4 text-muted" />
                    <input
                      type="text"
                      value={schedule.venue}
                      onChange={(e) => setSchedule({ ...schedule, venue: e.target.value })}
                      className="bg-transparent focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-alt rounded border border-border space-y-4 font-mono">
              <span className="font-bold text-ink uppercase text-[11px] block">Pre-Flight Eligibility Check</span>

              <div className="divide-y divide-border text-[11px]">
                <div className="py-2 flex justify-between items-center">
                  <span>Batch Roster Enrolled:</span>
                  <span className="font-bold text-ink">60 Students</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span>Attendance Threshold (≥ 75%):</span>
                  <span className="text-teal font-semibold">57 Eligible · 3 Below 75%</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span>Question Randomization:</span>
                  <span className="text-teal font-semibold">2 Randomized per seat</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span>Proctor Snapshot Sync:</span>
                  <span className="text-teal font-semibold">Webcam + Screen Ready</span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span>Safe Exam Environment:</span>
                  <span className="text-teal font-semibold">Fullscreen Lockdown Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 5: ATTENDANCE & LIVE CONDUCT ================= */}
      {endSem.stage === 5 && (
        <div className="space-y-6">
          <div className="bg-surface p-5 rounded-[6px] border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div>
                <h3 className="font-semibold text-sm text-ink">
                  Test activated for {presentCount} present students · {schedule.venue}
                </h3>
                <p className="text-xs text-muted">
                  Click any seat to toggle attendance status. Absent students cannot start the test.
                </p>
              </div>

              <button
                onClick={() => setEndSemStage(6)}
                className="px-3.5 py-1.5 bg-danger text-white rounded-[6px] text-xs font-medium hover:bg-[#7e1717]"
              >
                End test and compute marks
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attendance Grid */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-ink">Workstation Allocation · {selectedBatchTab}</span>
                  <span className="text-muted">
                    <span className="text-teal font-bold">{presentCount} present</span> ·{' '}
                    <span className="text-danger font-bold">{absentCount} absent</span>
                  </span>
                </div>

                <div className="grid grid-cols-10 gap-1.5 font-mono text-xs text-center select-none">
                  {Array.from({ length: 60 }, (_, i) => {
                    const seat = i + 1;
                    const isPresent = seatAttendance[seat];
                    return (
                      <div
                        key={seat}
                        onClick={() => toggleSeatAttendance(seat)}
                        title={`Seat ${seat}: ${isPresent ? 'Present (Click to mark Absent)' : 'Absent (Click to mark Present)'}`}
                        className={`py-2 rounded border text-[11px] font-bold cursor-pointer transition-all hover:scale-105 ${
                          isPresent
                            ? 'bg-teal-tint text-teal border-teal/40'
                            : 'bg-danger-tint text-danger border-danger/40'
                        }`}
                      >
                        {seat.toString().padStart(2, '0')}
                      </div>
                    );
                  })}
                </div>
                <div className="text-[11px] text-muted font-mono flex items-center justify-between">
                  <span>Seats in teal are present & authorized to compile. Red seats are blocked.</span>
                  <span className="text-ink">Click seat to toggle</span>
                </div>
              </div>

              {/* AI Proctor Live Events Box */}
              <div className="bg-surface-alt p-4 rounded-[6px] border border-border space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-semibold text-ink flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal" />
                    AI proctor
                  </span>
                  <span className="text-teal font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
                    Active
                  </span>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted">Students started:</span>
                    <span className="font-semibold text-ink">{presentCount}/{presentCount} present</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Absent, blocked:</span>
                    <span className="font-semibold text-danger">{absentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Fullscreen lockdown:</span>
                    <span className="text-teal font-semibold">Enforced</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Tab/window switch attempts:</span>
                    <span className="text-assist font-semibold">2 (Seats #12, #44)</span>
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
                    <span className="text-muted">Autosaves executed:</span>
                    <span className="font-semibold text-ink">340/min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 6: MARKS & ATTAINMENT ================= */}
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
                  onClick={() => alert('Appended to Course File Sections 11, 12, 13, and 14!')}
                  className="px-4 py-1.5 bg-teal text-white rounded-[6px] text-xs font-medium hover:bg-[#0b4b42]"
                >
                  Add to course file
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-surface text-ink border border-border rounded-[6px] text-xs font-medium hover:bg-surface-alt"
                >
                  Export Mark List (PDF)
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
                End-sem CO attainment · {selectedBatchTab}
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
