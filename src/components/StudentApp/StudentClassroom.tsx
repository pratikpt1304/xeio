import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, BookOpen, HelpCircle, Check, Code2 } from 'lucide-react';

export const StudentClassroom: React.FC = () => {
  const { classroomItems } = useApp();
  const [answeredTasks, setAnsweredTasks] = useState<Record<string, number | string>>({});

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Classroom</h1>
        <p className="text-xs text-muted mt-1 font-mono">
          Weekly learning items, tasks, lab manuals and announcements posted by Dr. Ramesh Kulkarni.
        </p>
      </div>

      <div className="space-y-6">
        {/* Week of 8 Feb */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-1 text-xs font-mono">
            <span className="font-semibold text-ink">Week of 8 Feb · Unit 2 Loops</span>
            <span className="text-teal">Completed</span>
          </div>

          <div className="space-y-2">
            {classroomItems.filter((i) => i.week_label === 'Week of 8 Feb').map((item) => (
              <div key={item.id} className="p-4 bg-surface rounded-[6px] border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-ink">{item.title}</div>
                  <div className="text-[11px] text-muted mt-0.5">{item.description}</div>
                </div>
                <span className="px-2 py-0.5 bg-teal-tint text-teal rounded text-xs font-mono">
                  Submitted (Score 5/5)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Week of 15 Feb */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-1 text-xs font-mono">
            <span className="font-semibold text-ink">Week of 15 Feb · Unit 2 Loops</span>
            <span className="text-muted">Due 22 Feb</span>
          </div>

          <div className="space-y-3">
            {/* Interactive Debug Task */}
            <div className="p-5 bg-surface rounded-[6px] border border-border space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-assist" />
                  <span className="font-semibold text-xs text-ink">Debug the code · 1-D arrays</span>
                </div>
                <span className="text-xs font-mono text-muted">In-class task · 3 snippets</span>
              </div>

              <div className="p-3 bg-[#1B1B1A] rounded font-mono text-xs text-[#E2E0D8]">
                <code>
                  {`int sum = 0;\nfor (int i = 0; i <= n; i++) {\n    sum += arr[i]; // What is the defect when size is n?\n}`}
                </code>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="font-medium text-ink">Select the identified defect:</div>
                <div className="space-y-1">
                  <button
                    onClick={() => setAnsweredTasks({ ...answeredTasks, debug1: 1 })}
                    className={`w-full p-2 text-left rounded border text-xs font-mono flex items-center justify-between ${
                      answeredTasks['debug1'] === 1 ? 'bg-teal-tint border-teal text-teal font-semibold' : 'border-border text-ink hover:bg-surface-alt'
                    }`}
                  >
                    <span>A. Off-by-one out-of-bounds access at i = n</span>
                    {answeredTasks['debug1'] === 1 && <Check className="w-3.5 h-3.5 text-teal" />}
                  </button>
                  <button
                    onClick={() => setAnsweredTasks({ ...answeredTasks, debug1: 2 })}
                    className={`w-full p-2 text-left rounded border text-xs font-mono flex items-center justify-between ${
                      answeredTasks['debug1'] === 2 ? 'bg-teal-tint border-teal text-teal font-semibold' : 'border-border text-ink hover:bg-surface-alt'
                    }`}
                  >
                    <span>B. Integer overflow on variable sum</span>
                    {answeredTasks['debug1'] === 2 && <Check className="w-3.5 h-3.5 text-teal" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Reference Resource */}
            <div className="p-4 bg-surface rounded-[6px] border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-teal" />
                <div>
                  <div className="font-semibold text-xs text-ink">Lab manual: Arrays and strings</div>
                  <div className="text-[11px] text-muted">PDF guide covering 1D/2D arrays memory models.</div>
                </div>
              </div>
              <button className="px-3 py-1 bg-surface-alt text-ink border border-border rounded text-xs font-mono hover:bg-paper">
                Open PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
