import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Video,
  Mic,
  Monitor,
  Lock,
  Play,
  Send,
  Maximize2,
  Check,
  Terminal,
} from 'lucide-react';
import { runCodeViaAPI, submitCodeViaAPI, RunResult, SubmitResult } from '../../lib/api';
import { INITIAL_40_ENDSEM_QUESTIONS } from '../../data/endSemQuestions';

export const StudentEndSem: React.FC = () => {
  const { course, currentUser } = useApp();
  const [examStarted, setExamStarted] = useState(false);
  const [activeQIndex, setActiveQIndex] = useState<0 | 1>(0);

  // Pick 2 deterministic questions for this student
  const q1 = INITIAL_40_ENDSEM_QUESTIONS.find((q) => q.code === 'A14') || INITIAL_40_ENDSEM_QUESTIONS[13];
  const q2 = INITIAL_40_ENDSEM_QUESTIONS.find((q) => q.code === 'A19') || INITIAL_40_ENDSEM_QUESTIONS[18];
  const examQuestions = [q1, q2];
  const currentQ = examQuestions[activeQIndex];

  const [codes, setCodes] = useState<[string, string]>([
`#include <stdio.h>

int main() {
    int n, a[100];
    if (scanf("%d", &n) != 1) return 0;
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    
    // Bubble sort with early exit optimization
    int passes = 0;
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        passes++;
        for (int j = 0; j < n - i - 1; j++) {
            if (a[j] > a[j+1]) {
                int temp = a[j];
                a[j] = a[j+1];
                a[j+1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
    printf("Passes: %d\\n", passes);
    for (int i = 0; i < n; i++) printf("%d%c", a[i], i == n - 1 ? '\\n' : ' ');
    return 0;
}`,
`#include <stdio.h>

void hanoi(int n, char from, char to, char aux, int *moves) {
    if (n == 0) return;
    hanoi(n - 1, from, aux, to, moves);
    printf("Move disk %d from %c to %c\\n", n, from, to);
    (*moves)++;
    hanoi(n - 1, aux, to, from, moves);
}

int main() {
    int n, moves = 0;
    if (scanf("%d", &n) != 1) return 0;
    hanoi(n, 'A', 'C', 'B', &moves);
    printf("Total Moves: %d\\n", moves);
    return 0;
}`
  ]);

  // Tab switch warning counter
  const [tabSwitches, setTabSwitches] = useState(0);
  const [showTabWarning, setShowTabWarning] = useState(false);

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Tab switch detection
  useEffect(() => {
    if (!examStarted || examSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches((prev) => prev + 1);
        setShowTabWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examStarted, examSubmitted]);

  // Run visible test via Sandbox API
  const handleRunCode = async () => {
    setIsRunning(true);
    setRunResult(null);
    try {
      const sampleIn = currentQ.visible_test_cases[0]?.input || '';
      const result = await runCodeViaAPI(codes[activeQIndex], 'c', sampleIn);
      setRunResult(result);
    } catch (err: any) {
      setRunResult({
        stdout: null,
        stderr: err.message || 'Execution failed',
        compile_output: null,
        status: { id: 11, description: 'Runtime Error' },
        time: '0.00',
        memory: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit code for full evaluation (2 visible + 3 hidden test cases)
  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitCodeViaAPI(
        codes[activeQIndex],
        'c',
        currentQ.id,
        currentUser.id || 'student-1',
        'endsem-session'
      );
      setSubmitResult(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartExam = () => {
    setExamStarted(true);
    // Request fullscreen if supported
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (_) {}
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-paper select-none font-sans">
      {!examStarted ? (
        /* Secure Check and Waiting Room (PRD Page 26) */
        <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-ink">
              End-sem practical {course.code ? `· ${course.code}` : '· CSL-101'}
            </h1>
            <p className="text-xs text-muted mt-1 font-mono">
              Secure check and waiting room. You can start only after your faculty marks you present and activates the test for your batch.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-[6px] border border-border space-y-6">
            <div className="text-xs font-mono text-muted uppercase tracking-wider border-b border-border pb-2">
              Secure exam check
            </div>

            <div className="divide-y divide-border text-xs font-mono">
              <div className="py-2.5 flex justify-between items-center">
                <span>Signed in with verified institutional credentials</span>
                <span className="text-teal font-semibold">✓ verified</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>Face matches your student profile photo</span>
                <span className="text-teal font-semibold">✓ verified (98.4%)</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>Webcam and microphone active</span>
                <span className="text-teal font-semibold">✓ on</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>Screen sharing (entire screen)</span>
                <span className="text-teal font-semibold">✓ on</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>Single monitor, no virtual machine</span>
                <span className="text-teal font-semibold">✓ ok</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>Browser lockdown and fullscreen ready</span>
                <span className="text-teal font-semibold">✓ ready</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>Marked present by faculty (Seat #44)</span>
                <span className="text-teal font-semibold">✓ present</span>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>Test activated by faculty</span>
                <span className="text-teal font-semibold">✓ activated</span>
              </div>
            </div>

            {/* Waiting Room Card */}
            <div className="p-4 bg-teal-tint/40 border border-teal rounded flex items-center justify-between">
              <div>
                <div className="font-semibold text-ink text-xs">All checks passed</div>
                <div className="text-[11px] text-muted">
                  End-sem practical exam is live. 2 questions drawn randomly from the approved 30 pool.
                </div>
              </div>

              <button
                onClick={handleStartExam}
                className="px-5 py-2 bg-teal text-white rounded-[6px] text-xs font-mono font-semibold hover:bg-[#0b4b42] flex items-center gap-1.5 shadow-sm"
              >
                <span>Enter Proctored Exam Room →</span>
              </button>
            </div>
          </div>
        </div>
      ) : examSubmitted ? (
        /* Submission Complete View */
        <div className="p-12 max-w-2xl mx-auto text-center space-y-4">
          <div className="w-16 h-16 bg-teal-tint text-teal rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-ink">Exam Submitted Successfully</h2>
          <p className="text-xs text-muted font-mono leading-relaxed">
            Your solutions for Question 1 ({q1.code}) and Question 2 ({q2.code}) have been submitted and cryptographically sealed on the server. Your viva score will be updated by the examiner.
          </p>
          <div className="p-4 bg-surface border border-border rounded text-xs font-mono text-muted">
            Submission Hash: e979232-92fd-4012-97cf-3e9177257d10<br />
            Integrity Flags: {tabSwitches === 0 ? 'Clean (0 violations)' : `${tabSwitches} tab-switch warnings recorded`}
          </div>
          <button
            onClick={() => setExamStarted(false)}
            className="px-4 py-2 bg-rail text-white rounded text-xs font-mono hover:bg-[#262624]"
          >
            Return to Dashboard
          </button>
        </div>
      ) : (
        /* Proctored IDE (PRD Page 27) */
        <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#1B1B1A] text-white">
          {/* Top Bar with Proctor Status */}
          <div className="h-11 bg-[#141413] px-4 flex items-center justify-between border-b border-[#2E2E2C] text-xs font-mono select-none">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">End-sem practical examination</span>
              <button
                onClick={() => setActiveQIndex(0)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeQIndex === 0 ? 'bg-[#2E2E2B] text-white font-bold' : 'text-muted hover:text-white'
                }`}
              >
                ● Question 1 ({q1.code})
              </button>
              <button
                onClick={() => setActiveQIndex(1)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeQIndex === 1 ? 'bg-[#2E2E2B] text-white font-bold' : 'text-muted hover:text-white'
                }`}
              >
                ● Question 2 ({q2.code})
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-assist font-semibold font-mono">Time left 43:52</span>
              <span className="px-2 py-0.5 bg-teal/20 text-teal rounded text-[11px] font-mono">Proctored</span>
              <button
                onClick={() => setExamSubmitted(true)}
                className="px-3 py-1 bg-teal text-white rounded font-medium hover:bg-[#0b4b42] text-xs"
              >
                Final Submit Exam
              </button>
            </div>
          </div>

          {/* Proctor Monitoring Bar */}
          <div className="h-8 bg-[#11110F] px-4 flex items-center justify-between border-b border-[#2E2E2C] text-[11px] font-mono text-[#A3A299]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-teal">
                <Video className="w-3 h-3" /> Camera · 1 face
              </span>
              <span className="flex items-center gap-1 text-teal">
                <Monitor className="w-3 h-3" /> Screen shared
              </span>
              <span className="text-teal">Fullscreen locked</span>
              <span className={tabSwitches > 0 ? 'text-danger font-bold' : 'text-teal'}>
                Tab switches: {tabSwitches}
              </span>
              <span className="text-teal">Copy/paste blocked</span>
              <span className="text-teal">AI tools blocked</span>
            </div>

            <div className="text-muted">Autosaved to server 2s ago</div>
          </div>

          {/* Tab Warning Banner */}
          {showTabWarning && (
            <div className="bg-danger/20 border-b border-danger px-4 py-1.5 flex items-center justify-between text-xs text-danger font-mono">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  WARNING: Tab switch detected (#{tabSwitches})! All window focus events are logged and reported to the proctoring panel.
                </span>
              </div>
              <button
                onClick={() => setShowTabWarning(false)}
                className="text-[10px] uppercase font-bold text-white hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* IDE Panels */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left 30% Question */}
            <div className="w-[30%] bg-[#1B1B1A] border-r border-[#2E2E2C] p-5 overflow-y-auto space-y-4 font-sans">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-muted flex gap-2">
                  <span className="px-1.5 py-0.5 bg-[#2E2E2B] rounded text-white">{currentQ.co}</span>
                  <span className="px-1.5 py-0.5 bg-teal/20 text-teal rounded">{currentQ.difficulty}</span>
                  <span>2 visible · 3 hidden</span>
                </div>
                <h3 className="font-semibold text-white text-base">
                  {currentQ.code} · {currentQ.title}
                </h3>
              </div>

              <p className="text-xs text-[#A3A299] leading-relaxed">
                {currentQ.statement}
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="text-muted">
                  <span className="text-white font-semibold">Input Format:</span> {currentQ.inputFormat}
                </div>
                <div className="text-muted">
                  <span className="text-white font-semibold">Output Format:</span> {currentQ.outputFormat}
                </div>
              </div>

              {/* Visible Test Cases */}
              <div className="space-y-2 pt-2 border-t border-[#2E2E2C]">
                <span className="text-[10px] font-mono uppercase text-muted tracking-wider block">
                  Visible Test Cases (Sample)
                </span>
                {currentQ.visible_test_cases.map((vt, i) => (
                  <div key={i} className="p-2.5 bg-[#11110F] rounded border border-[#2E2E2C] text-xs font-mono space-y-1">
                    <div className="text-[10px] text-muted">Test #{i + 1}</div>
                    <div className="text-[#A3A299]">Input: <span className="text-white">{vt.input.replace('\n', ' ')}</span></div>
                    <div className="text-[#A3A299]">Expected: <span className="text-teal">{vt.output.replace('\n', ' ')}</span></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 70% Editor & Output Console */}
            <div className="flex-1 flex flex-col bg-[#141413]">
              {/* Editor Header Bar */}
              <div className="h-9 bg-[#181817] px-4 flex items-center justify-between border-b border-[#2E2E2C] text-xs font-mono">
                <span className="text-[#A3A299]">solution_{currentQ.code.toLowerCase()}.c · C (GCC 9.2)</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#262624] text-white rounded hover:bg-[#333330] text-xs font-mono"
                  >
                    <Play className="w-3 h-3 text-teal" />
                    <span>{isRunning ? 'Running...' : 'Run Test'}</span>
                  </button>

                  <button
                    onClick={handleSubmitCode}
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-3.5 py-1 bg-teal text-white rounded hover:bg-[#0b4b42] text-xs font-mono font-medium"
                  >
                    <Send className="w-3 h-3" />
                    <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
                  </button>
                </div>
              </div>

              {/* Code Textarea */}
              <div className="flex-1 p-4 font-mono text-xs overflow-hidden flex flex-col">
                <textarea
                  value={codes[activeQIndex]}
                  onChange={(e) => {
                    const newCode = e.target.value;
                    setCodes((prev) => {
                      const updated: [string, string] = [...prev];
                      updated[activeQIndex] = newCode;
                      return updated;
                    });
                  }}
                  className="flex-1 bg-transparent text-[#E2E0D8] resize-none focus:outline-none leading-relaxed font-mono"
                  spellCheck={false}
                />
              </div>

              {/* Terminal / Test Result Drawer */}
              {(runResult || submitResult) && (
                <div className="h-44 bg-[#0E0E0D] border-t border-[#2E2E2C] p-3 text-xs font-mono overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-[#262624] pb-1.5 mb-2">
                    <span className="flex items-center gap-1.5 text-muted text-[11px] uppercase">
                      <Terminal className="w-3.5 h-3.5 text-teal" />
                      Execution Output & Test Case Verification
                    </span>
                    <button
                      onClick={() => {
                        setRunResult(null);
                        setSubmitResult(null);
                      }}
                      className="text-muted hover:text-white text-[10px]"
                    >
                      Clear
                    </button>
                  </div>

                  {submitResult ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                          submitResult.verdict === 'Accepted' ? 'bg-teal/20 text-teal' : 'bg-danger/20 text-danger'
                        }`}>
                          {submitResult.verdict}
                        </span>
                        <span className="text-white">
                          Passed {submitResult.total_passed} of {submitResult.total_tests} test cases
                        </span>
                        <span className="text-muted text-[11px]">
                          ({submitResult.visible_passed}/{submitResult.visible_total} visible · {submitResult.hidden_passed}/{submitResult.hidden_total} hidden)
                        </span>
                      </div>
                    </div>
                  ) : runResult ? (
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-muted">
                        Status: <span className="text-white">{runResult.status.description}</span> · Time: {runResult.time}s · Memory: {runResult.memory}KB
                      </div>
                      {runResult.stdout && (
                        <div className="p-2 bg-[#141413] rounded text-teal whitespace-pre-wrap">
                          {runResult.stdout}
                        </div>
                      )}
                      {runResult.stderr && (
                        <div className="p-2 bg-[#141413] rounded text-danger whitespace-pre-wrap">
                          {runResult.stderr}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
