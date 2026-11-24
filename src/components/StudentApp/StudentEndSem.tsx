import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, CheckCircle2, AlertTriangle, Eye, Video, Mic, Monitor, Lock, Play } from 'lucide-react';

export const StudentEndSem: React.FC = () => {
  const [examStarted, setExamStarted] = useState(false);
  const [activeQ, setActiveQ] = useState<1 | 2>(1);
  const [code, setCode] = useState<string>(
`#include <stdio.h>

int main() {
    int n, a[100];
    if (scanf("%d", &n) != 1) return 0;
    // Implementation for Bubble Sort with Early Exit
    for (int i = 0; i < n; i++) scanf("%d", &a[i]);
    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
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
    for (int i = 0; i < n; i++) printf("%d%c", a[i], i == n - 1 ? '\\n' : ' ');
    return 0;
}`
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-paper select-none">
      {!examStarted ? (
        /* Secure Check and Waiting Room (PRD Page 26) */
        <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-ink">End-sem practical · CSL-101</h1>
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
                <span>Signed in with institutional SSO (@sanjivani.edu.in)</span>
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
                  Batch A practical exam is live. 2 questions drawn randomly from the approved 30.
                </div>
              </div>

              <button
                onClick={() => setExamStarted(true)}
                className="px-5 py-2 bg-teal text-white rounded-[6px] text-xs font-mono font-semibold hover:bg-[#0b4b42] flex items-center gap-1.5"
              >
                <span>Enter Proctored Exam Room →</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Proctored IDE (PRD Page 27) */
        <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#1B1B1A] text-white">
          {/* Top Bar with Proctor Status */}
          <div className="h-11 bg-[#141413] px-4 flex items-center justify-between border-b border-[#2E2E2C] text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white">End-sem practical · CSL-101 · Batch A</span>
              <button
                onClick={() => setActiveQ(1)}
                className={`px-2 py-0.5 rounded ${activeQ === 1 ? 'bg-[#2E2E2B] text-white' : 'text-muted'}`}
              >
                ● Question 1
              </button>
              <button
                onClick={() => setActiveQ(2)}
                className={`px-2 py-0.5 rounded ${activeQ === 2 ? 'bg-[#2E2E2B] text-white' : 'text-muted'}`}
              >
                ● Question 2
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-assist font-semibold">Time left 43:52</span>
              <span className="px-2 py-0.5 bg-teal/20 text-teal rounded text-[11px]">Proctored</span>
              <button
                onClick={() => setExamStarted(false)}
                className="px-3 py-1 bg-teal text-white rounded font-medium hover:bg-[#0b4b42]"
              >
                Submit Exam
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
              <span className="text-teal">Tab switches 0</span>
              <span className="text-teal">Copy/paste blocked</span>
              <span className="text-teal">AI tools blocked</span>
            </div>

            <div className="text-muted">Saved to server 0s ago</div>
          </div>

          {/* IDE Panels */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left 25% Question */}
            <div className="w-1/4 bg-[#1B1B1A] border-r border-[#2E2E2C] p-5 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-muted flex gap-2">
                  <span>CO3</span>
                  <span>Medium</span>
                  <span>2 visible · 3 hidden</span>
                </div>
                <h3 className="font-semibold text-white text-sm">A14 · Bubble sort with early exit</h3>
              </div>

              <p className="text-xs text-[#A3A299] leading-relaxed">
                Sort n integers in ascending order using bubble sort. Stop as soon as a full pass makes no swaps. Print the sorted array, then the number of passes made.
              </p>

              <div className="p-3 bg-[#11110F] rounded border border-[#2E2E2C] text-xs font-mono space-y-2">
                <div className="text-[11px] text-teal">Visible test 1: Passed</div>
                <div className="text-[11px] text-teal">Visible test 2: Passed</div>
                <div className="text-[11px] text-muted">Hidden tests: 3 pending submission</div>
              </div>
            </div>

            {/* Right 75% Editor */}
            <div className="flex-1 p-4 font-mono text-xs flex flex-col">
              <div className="text-[11px] text-muted mb-2">main.c · autosaves every 10s</div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-transparent text-[#E2E0D8] resize-none focus:outline-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
