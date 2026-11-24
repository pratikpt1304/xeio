import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Plus,
  Sparkles,
  BookOpen,
  CheckSquare,
  MessageSquare,
  HelpCircle,
  Code2,
  CheckCircle2,
  Edit2,
  Trash2,
  X,
  Mail,
  Calendar,
  Clock,
  Send,
  Eye,
} from 'lucide-react';
import { ClassroomItem } from '../../../types';

export const Step7Classroom: React.FC = () => {
  const {
    classroomItems,
    addClassroomItem,
    updateClassroomItem,
    removeClassroomItem,
    useAICredit,
    batches,
    students,
    resendAllOnboardingEmails,
    sessions,
    course,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassroomItem | null>(null);

  // Form states
  const [taskKind, setTaskKind] = useState<'task' | 'resource' | 'announcement'>('task');
  const [taskType, setTaskType] = useState<'quiz' | 'fill_in_code' | 'predict_output' | 'debug' | 'coding' | 'poll'>('predict_output');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskWeek, setTaskWeek] = useState('Week 1 · Lab Introduction');
  const [taskDue, setTaskDue] = useState('Friday 23:59');

  const activeBatch = batches[0];
  const classCode = activeBatch?.class_code || `${course.code || 'CSL101'}-LAB`;

  // Get unique week labels from items or default weeks
  const availableWeeks = Array.from(
    new Set([
      'Week 1 · Lab Introduction',
      'Week 2 · Control Flow & Loops',
      'Week 3 · Arrays & Matrices',
      'Week 4 · Functions & Recursion',
      'Week 5 · Pointers & Memory',
      ...classroomItems.map((i) => i.week_label),
    ])
  );

  const handleOpenAddModal = (defaultWeek?: string) => {
    setTaskKind('task');
    setTaskType('predict_output');
    setTaskTitle('');
    setTaskDesc('');
    setTaskWeek(defaultWeek || availableWeeks[0]);
    setTaskDue('Friday 23:59');
    setEditingItem(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (item: ClassroomItem) => {
    setEditingItem(item);
    setTaskKind(item.kind);
    setTaskType(item.task_type || 'predict_output');
    setTaskTitle(item.title);
    setTaskDesc(item.description);
    setTaskWeek(item.week_label);
    setTaskDue(item.due_date || 'Friday 23:59');
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingItem) {
      // Updation flow
      updateClassroomItem(editingItem.id, {
        kind: taskKind,
        task_type: taskKind === 'task' ? taskType : undefined,
        title: taskTitle.trim(),
        description: taskDesc.trim() || 'In-class interactive activity.',
        week_label: taskWeek,
        due_date: taskDue,
      });
    } else {
      // Creation flow
      addClassroomItem({
        week_label: taskWeek,
        kind: taskKind,
        task_type: taskKind === 'task' ? taskType : undefined,
        title: taskTitle.trim(),
        description: taskDesc.trim() || 'Newly added in-class learning item. Visible to enrolled students.',
        due_date: taskDue,
        stats: '0/65 completed',
      });
    }

    setShowAddModal(false);
    setEditingItem(null);
  };

  const getItemIcon = (item: ClassroomItem) => {
    if (item.kind === 'resource') return <BookOpen className="w-4 h-4 text-ink" />;
    if (item.kind === 'announcement') return <MessageSquare className="w-4 h-4 text-teal" />;
    switch (item.task_type) {
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-teal" />;
      case 'coding':
        return <Code2 className="w-4 h-4 text-teal" />;
      case 'debug':
        return <CheckSquare className="w-4 h-4 text-amber-600" />;
      case 'fill_in_code':
        return <Code2 className="w-4 h-4 text-blue-600" />;
      default:
        return <CheckSquare className="w-4 h-4 text-teal" />;
    }
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
            <h1 className="text-2xl font-semibold text-ink">Classroom & Tasks</h1>
            <p className="text-xs text-muted mt-1">
              Timeline of course weeks. Create, edit, and update in-class tasks, coding snippets, and resources with full student synchronization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (useAICredit('Draft AI Classroom Task')) {
                  setTaskTitle('Tracing Pointer Arithmetic and Array Boundaries');
                  setTaskDesc('Analyze memory offsets when incrementing integer pointers across a 2D matrix.');
                  setTaskKind('task');
                  setTaskType('predict_output');
                  setShowAddModal(true);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rail text-white rounded-[6px] text-xs font-medium hover:bg-[#262624]"
            >
              <Sparkles className="w-3.5 h-3.5 text-assist" />
              <span>Draft task with Assist</span>
            </button>
            <button
              onClick={() => handleOpenAddModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white rounded-[6px] text-xs font-medium hover:bg-[#0b4b42]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Class Meta Banner */}
      <div className="bg-surface p-4 rounded-[6px] border border-border flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-muted">Class Code:</span>
          <span className="font-semibold text-ink bg-surface-alt px-2.5 py-1 rounded border border-border tracking-wider">
            {classCode}
          </span>
          <span className="text-muted border-l border-border pl-3">
            <strong className="text-ink">{students.length}</strong> students enrolled ·{' '}
            <strong className="text-teal">{students.filter((s) => s.invite_status === 'sent').length}</strong> invites dispatched
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => resendAllOnboardingEmails()}
            className="flex items-center gap-1.5 text-teal hover:underline font-sans text-xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Resend Onboarding Emails</span>
          </button>
          <span className="px-2.5 py-1 bg-teal-tint text-teal rounded font-medium text-[11px]">
            Active Semester
          </span>
        </div>
      </div>

      {/* Weekly Stacks */}
      <div className="space-y-6">
        {availableWeeks.map((weekLabel, weekIdx) => {
          const items = classroomItems.filter((i) => i.week_label === weekLabel);

          return (
            <div key={weekLabel} className="bg-surface rounded-[8px] border border-border p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-ink font-mono text-sm">{weekLabel}</span>
                  {weekIdx === 0 && (
                    <span className="px-1.5 py-0.5 bg-teal-tint text-teal text-[10px] rounded font-mono font-medium">
                      Current Week
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleOpenAddModal(weekLabel)}
                  className="flex items-center gap-1 text-[11px] font-mono text-teal hover:underline"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add to this week</span>
                </button>
              </div>

              {items.length === 0 ? (
                <div className="p-4 bg-surface-alt/50 rounded border border-dashed border-border text-center text-xs text-muted font-mono">
                  No tasks or materials in this week yet.{' '}
                  <button
                    onClick={() => handleOpenAddModal(weekLabel)}
                    className="text-teal hover:underline ml-1"
                  >
                    + Add task
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 bg-surface-alt/60 hover:bg-surface-alt rounded-[6px] border border-border flex items-center justify-between gap-4 transition-colors group"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-surface rounded border border-border mt-0.5 shadow-sm">
                          {getItemIcon(item)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-ink truncate">{item.title}</span>
                            <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-surface border border-border text-muted uppercase">
                              {item.kind === 'task' ? item.task_type || 'task' : item.kind}
                            </span>
                          </div>
                          <div className="text-[11px] text-muted mt-1 line-clamp-2 leading-relaxed">
                            {item.description}
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-muted">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Due: {item.due_date || 'Friday 23:59'}
                            </span>
                            <span>•</span>
                            <span className="text-teal font-medium">{item.stats || '0/65 completed'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Updation / Edit Action Buttons */}
                      <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          title="Update / Edit Task"
                          className="flex items-center gap-1 px-2.5 py-1 bg-surface border border-border rounded text-xs font-mono text-ink hover:bg-surface-alt hover:border-teal transition-colors shadow-sm"
                        >
                          <Edit2 className="w-3 h-3 text-teal" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => removeClassroomItem(item.id)}
                          title="Delete Task"
                          className="p-1.5 text-muted hover:text-red-500 rounded hover:bg-surface border border-transparent hover:border-border transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Task Creation & Updation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-[8px] border border-border p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-base text-ink">
                {editingItem ? 'Update Classroom Task' : 'Create New Classroom Item'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted hover:text-ink p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono text-muted uppercase mb-1">Item Kind</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['task', 'resource', 'announcement'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setTaskKind(k)}
                      className={`py-1.5 px-3 rounded border text-center capitalize transition-colors ${
                        taskKind === k
                          ? 'bg-teal-tint text-teal border-teal font-semibold'
                          : 'border-border text-muted hover:bg-surface-alt'
                      }`}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {taskKind === 'task' && (
                <div>
                  <label className="block font-mono text-muted uppercase mb-1">Task Type</label>
                  <select
                    value={taskType}
                    onChange={(e: any) => setTaskType(e.target.value)}
                    className="w-full p-2 bg-surface-alt border border-border rounded text-ink font-mono focus:outline-none focus:ring-1 focus:ring-teal"
                  >
                    <option value="predict_output">Predict the Output</option>
                    <option value="quiz">Interactive MCQ Quiz</option>
                    <option value="fill_in_code">Fill in the Code</option>
                    <option value="debug">Bug Fix / Debug Snippet</option>
                    <option value="coding">Lab Coding Challenge</option>
                    <option value="poll">Class Poll & Feedback</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-mono text-muted uppercase mb-1">Assign to Week</label>
                <select
                  value={taskWeek}
                  onChange={(e) => setTaskWeek(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded text-ink font-mono focus:outline-none focus:ring-1 focus:ring-teal"
                >
                  {availableWeeks.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-muted uppercase mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tracing recursive stack frames in binary search"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded text-ink focus:outline-none focus:ring-1 focus:ring-teal font-medium"
                />
              </div>

              <div>
                <label className="block font-mono text-muted uppercase mb-1">
                  Description / Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain instructions, edge cases, or background reading for students..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded text-ink focus:outline-none focus:ring-1 focus:ring-teal resize-none"
                />
              </div>

              <div>
                <label className="block font-mono text-muted uppercase mb-1">Due Date & Time</label>
                <input
                  type="text"
                  placeholder="e.g. Friday 23:59 or 28 Feb 17:00"
                  value={taskDue}
                  onChange={(e) => setTaskDue(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded text-ink font-mono focus:outline-none focus:ring-1 focus:ring-teal"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                {editingItem ? (
                  <button
                    type="button"
                    onClick={() => {
                      removeClassroomItem(editingItem.id);
                      setShowAddModal(false);
                      setEditingItem(null);
                    }}
                    className="flex items-center gap-1 text-red-500 hover:underline font-mono text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Item</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingItem(null);
                    }}
                    className="px-3.5 py-1.5 border border-border rounded text-muted hover:text-ink transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-teal text-white rounded font-medium hover:bg-[#0b4b42] transition-colors shadow-sm"
                  >
                    {editingItem ? 'Save Updates' : 'Post to Classroom'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
