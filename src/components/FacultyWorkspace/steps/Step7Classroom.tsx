import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Plus, Sparkles, BookOpen, CheckSquare, MessageSquare, HelpCircle, Code2, CheckCircle2 } from 'lucide-react';

export const Step7Classroom: React.FC = () => {
  const { classroomItems, addClassroomItem, useAICredit } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskKind, setNewTaskKind] = useState<'task' | 'resource' | 'announcement'>('task');
  const [taskType, setTaskType] = useState<'quiz' | 'fill_in_code' | 'predict_output' | 'debug' | 'coding' | 'poll'>('predict_output');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    addClassroomItem({
      week_label: 'Week of 22 Feb',
      kind: newTaskKind,
      task_type: newTaskKind === 'task' ? taskType : undefined,
      title: newTaskTitle,
      description: 'Newly added in-class learning item. Visible to enrolled students.',
      stats: '0/60 completed',
    });
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 7 · RUN
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Classroom</h1>
            <p className="text-xs text-muted mt-1">
              Moodle-style timeline of weeks; each week stacks tasks, resources and announcements, added inline.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (useAICredit('Draft AI Classroom Task')) {
                  setShowAddModal(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rail text-white rounded-[6px] text-xs font-medium hover:bg-[#262624]"
            >
              <Sparkles className="w-3.5 h-3.5 text-assist" />
              <span>Draft task with Assist</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface text-ink border border-border rounded-[6px] text-xs font-medium hover:bg-surface-alt"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Class Meta Banner */}
      <div className="bg-surface p-4 rounded-[6px] border border-border flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-muted">Class code: </span>
          <span className="font-semibold text-ink bg-surface-alt px-2 py-0.5 rounded border border-border">
            CSL101-SYB-7Q4K
          </span>
          <span className="text-muted ml-3">122 students joined · 3 invites pending</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-teal hover:underline font-sans">Resend 3 invites</button>
          <span className="px-2.5 py-1 bg-teal-tint text-teal rounded font-medium">Jump to this week</span>
        </div>
      </div>

      {/* Weekly Timeline */}
      <div className="space-y-6">
        {/* Week of 8 Feb */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-1 text-xs">
            <span className="font-semibold text-ink font-mono text-sm">Week of 8 Feb</span>
            <span className="text-muted font-mono text-[11px]">Unit 2 Loops · Completed</span>
          </div>

          <div className="space-y-2">
            {classroomItems.filter((i) => i.week_label === 'Week of 8 Feb').map((item) => (
              <div key={item.id} className="p-3.5 bg-surface rounded-[6px] border border-border flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-surface-alt rounded border border-border text-teal mt-0.5">
                    {item.task_type === 'quiz' ? <HelpCircle className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-ink">{item.title}</div>
                    <div className="text-[11px] text-muted mt-0.5">{item.description}</div>
                  </div>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <span className="text-teal font-medium">{item.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Week of 15 Feb */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-1 text-xs">
            <span className="font-semibold text-ink font-mono text-sm">Week of 15 Feb</span>
            <span className="text-muted font-mono text-[11px]">Unit 2 Loops</span>
          </div>

          <div className="space-y-2">
            {classroomItems.filter((i) => i.week_label === 'Week of 15 Feb').map((item) => (
              <div key={item.id} className="p-3.5 bg-surface rounded-[6px] border border-border flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-surface-alt rounded border border-border text-ink mt-0.5">
                    {item.kind === 'resource' ? <BookOpen className="w-4 h-4" /> : <CheckSquare className="w-4 h-4 text-assist" />}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-ink">{item.title}</div>
                    <div className="text-[11px] text-muted mt-0.5">{item.description}</div>
                  </div>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <span className="text-muted">{item.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Week of 22 Feb (This Week) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-teal font-mono text-sm">Week of 22 Feb</span>
              <span className="px-1.5 py-0.2 bg-teal-tint text-teal text-[10px] rounded font-mono">This week</span>
            </div>
            <span className="text-muted font-mono text-[11px]">Unit 3 Arrays and strings</span>
          </div>

          <div className="p-4 bg-surface rounded-[6px] border border-dashed border-border text-center">
            <p className="text-xs text-muted mb-2">Add task, interactive snippet, or announcement inline</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-surface-alt border border-border rounded-[6px] text-xs font-medium text-ink hover:bg-paper"
            >
              + Add task, resource or announcement
            </button>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-[6px] border border-border p-6 space-y-4">
            <h3 className="font-semibold text-base text-ink">Add Classroom Item</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono text-muted uppercase mb-1">Item Kind</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['task', 'resource', 'announcement'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setNewTaskKind(k)}
                      className={`py-1.5 px-3 rounded border text-center capitalize ${
                        newTaskKind === k ? 'bg-teal-tint text-teal border-teal font-semibold' : 'border-border text-muted'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {newTaskKind === 'task' && (
                <div>
                  <label className="block font-mono text-muted uppercase mb-1">Task Type</label>
                  <select
                    value={taskType}
                    onChange={(e: any) => setTaskType(e.target.value)}
                    className="w-full p-2 bg-surface-alt border border-border rounded text-ink"
                  >
                    <option value="predict_output">Predict the output</option>
                    <option value="quiz">Interactive MCQ Quiz</option>
                    <option value="fill_in_code">Fill in the code</option>
                    <option value="debug">Debug snippet</option>
                    <option value="coding">Coding assignment</option>
                    <option value="poll">Class Poll</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-mono text-muted uppercase mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tracing loop bounds in nested matrices"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded text-ink"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-border rounded text-muted hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal text-white rounded font-medium hover:bg-[#0b4b42]"
                >
                  Post to Classroom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
