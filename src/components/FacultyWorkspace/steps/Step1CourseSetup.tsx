import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CheckCircle2, Clock, Send, Plus, Trash2 } from 'lucide-react';
import { CourseOutcome } from '../../../types';

export const Step1CourseSetup: React.FC = () => {
  const {
    course,
    updateCourse,
    cos,
    addCO,
    removeCO,
    copoMap,
    updateCOPOMapping,
    rubric,
    updateRubric,
    planStatus,
    sendPlanToHOD,
    hodPlanRemark,
  } = useApp();

  const [newCOCode, setNewCOCode] = useState('CO1');
  const [newCOStatement, setNewCOStatement] = useState('');
  const [newCOBtl, setNewCOBtl] = useState<CourseOutcome['btl']>('L3 Apply');
  const [showAddCO, setShowAddCO] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalRubricMarks = Object.values(rubric).reduce((a, b) => a + b, 0);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() || '');
  };

  const handleSendToHOD = () => {
    setValidationError(null);
    if (!course.code?.trim()) {
      setValidationError('Please enter a valid Course Code (e.g. CSL-101).');
      return;
    }
    if (!course.title?.trim()) {
      setValidationError('Please enter a Course Title (e.g. Data Structures & Algorithms Lab).');
      return;
    }
    if (!isValidEmail(course.hodEmail || '')) {
      setValidationError('Please provide an actual, valid HOD email address (e.g. hod.cse@university.edu).');
      return;
    }
    if (cos.length === 0) {
      setValidationError('Please add at least one Course Outcome (CO) before submitting to HOD.');
      return;
    }
    sendPlanToHOD();
  };

  const handleAddCOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCOStatement.trim()) return;
    addCO({
      code: newCOCode,
      statement: newCOStatement.trim(),
      btl: newCOBtl,
      target_percentage: 60,
    });
    setNewCOCode(`CO${cos.length + 2}`);
    setNewCOStatement('');
    setShowAddCO(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 1 · PLAN
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Course setup</h1>
            <p className="text-xs text-muted mt-1">
              Enter course details, define Course Outcomes (COs) with Bloom levels, map to POs, and configure the session marking rubric.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {planStatus === 'approved' ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-tint text-teal rounded-[6px] text-xs font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>HOD Approved</span>
              </div>
            ) : planStatus === 'sent' ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-alt border border-border text-muted rounded-[6px] text-xs font-medium">
                <Clock className="w-4 h-4" />
                <span>Sent to HOD (Awaiting review)</span>
              </div>
            ) : (
              <button
                onClick={handleSendToHOD}
                className="flex items-center gap-1.5 px-4 py-2 bg-teal text-white rounded-[6px] text-xs font-medium hover:bg-[#0b4b42] transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send course plan to HOD</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-[6px] text-xs flex items-center justify-between">
          <span>{validationError}</span>
          <button onClick={() => setValidationError(null)} className="text-red-600 hover:text-red-800 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Editable Course Details Card */}
      <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
        <div className="text-xs font-mono text-muted uppercase tracking-wider">Course Details</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <label className="text-muted block text-[11px] mb-1">Course code</label>
            <input
              type="text"
              placeholder="e.g. CSL-101"
              value={course.code}
              onChange={(e) => updateCourse({ code: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-surface-alt border border-border rounded text-ink font-semibold focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
          <div>
            <label className="text-muted block text-[11px] mb-1">Course title</label>
            <input
              type="text"
              placeholder="e.g. Programming in C Lab"
              value={course.title}
              onChange={(e) => updateCourse({ title: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-surface-alt border border-border rounded text-ink focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
          <div>
            <label className="text-muted block text-[11px] mb-1">L-T-P-C</label>
            <input
              type="text"
              placeholder="0-0-2-1"
              value={course.ltpc}
              onChange={(e) => updateCourse({ ltpc: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-surface-alt border border-border rounded text-ink focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
          <div>
            <label className="text-muted block text-[11px] mb-1">Semester</label>
            <input
              type="text"
              placeholder="e.g. IV · 2026–27"
              value={course.semester}
              onChange={(e) => updateCourse({ semester: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-surface-alt border border-border rounded text-ink focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
          <div>
            <label className="text-muted block text-[11px] mb-1">Department</label>
            <input
              type="text"
              placeholder="Computer Science"
              value={course.department}
              onChange={(e) => updateCourse({ department: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-surface-alt border border-border rounded text-ink focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
          <div>
            <label className="text-muted block text-[11px] mb-1">Class / Section</label>
            <input
              type="text"
              placeholder="e.g. SY-B"
              value={course.className}
              onChange={(e) => updateCourse({ className: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-surface-alt border border-border rounded text-ink focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
          <div>
            <label className="text-muted block text-[11px] mb-1">Faculty In-Charge</label>
            <input
              type="text"
              placeholder="Faculty Name"
              value={course.facultyInCharge}
              onChange={(e) => updateCourse({ facultyInCharge: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-surface-alt border border-border rounded text-ink focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
          <div>
            <label className="text-muted block text-[11px] mb-1">HOD Email</label>
            <input
              type="email"
              placeholder="hod@university.edu"
              value={course.hodEmail}
              onChange={(e) => updateCourse({ hodEmail: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-surface-alt border border-border rounded text-ink focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
        </div>
      </div>

      {/* Course Outcomes & Bloom's Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface p-5 rounded-[6px] border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-muted uppercase tracking-wider">
              Course Outcomes (COs)
            </div>
            <button
              onClick={() => setShowAddCO(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-surface-alt border border-border rounded text-xs font-mono text-ink hover:bg-paper"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Outcome</span>
            </button>
          </div>

          {cos.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted border border-dashed border-border rounded font-mono">
              No Course Outcomes defined yet. Click "Add Outcome" to specify your learning outcomes.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {cos.map((co) => (
                <div key={co.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="font-mono font-semibold text-ink w-8">{co.code}</span>
                    <span className="text-ink leading-relaxed">{co.statement}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-surface-alt border border-border rounded font-mono text-[11px] text-muted">
                      {co.btl}
                    </span>
                    <button
                      onClick={() => removeCO(co.id)}
                      className="p-1 text-muted hover:text-danger rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add CO Inline Form */}
          {showAddCO && (
            <form onSubmit={handleAddCOSubmit} className="p-3 bg-surface-alt rounded border border-border space-y-3 text-xs">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="CO Code"
                  value={newCOCode}
                  onChange={(e) => setNewCOCode(e.target.value)}
                  className="w-20 p-2 bg-surface border border-border rounded font-mono"
                  required
                />
                <select
                  value={newCOBtl}
                  onChange={(e: any) => setNewCOBtl(e.target.value)}
                  className="p-2 bg-surface border border-border rounded font-mono"
                >
                  <option value="L1 Remember">L1 Remember</option>
                  <option value="L2 Understand">L2 Understand</option>
                  <option value="L3 Apply">L3 Apply</option>
                  <option value="L4 Analyse">L4 Analyse</option>
                  <option value="L5 Evaluate">L5 Evaluate</option>
                  <option value="L6 Create">L6 Create</option>
                </select>
              </div>
              <textarea
                placeholder="Outcome statement describing what students will be able to do..."
                value={newCOStatement}
                onChange={(e) => setNewCOStatement(e.target.value)}
                className="w-full p-2 bg-surface border border-border rounded"
                rows={2}
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCO(false)}
                  className="px-3 py-1 border border-border rounded text-muted"
                >
                  Cancel
                </button>
                <button type="submit" className="px-3 py-1 bg-teal text-white rounded font-medium">
                  Save Outcome
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Manual CO-PO Map */}
        <div className="bg-surface p-5 rounded-[6px] border border-border overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-mono text-muted uppercase tracking-wider">
              CO–PO map
            </div>
            <span className="text-[10px] font-mono text-muted">
              0=None · 1=Low · 2=Med · 3=High
            </span>
          </div>
          {copoMap.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted font-mono">
              Add Course Outcomes to manually map CO–PO correlation levels (0–3).
            </div>
          ) : (
            <table className="w-full text-xs font-mono text-center">
              <thead>
                <tr className="border-b border-border text-[11px] text-muted">
                  <th className="py-1 text-left font-normal">CO</th>
                  <th className="py-1 font-normal">PO1</th>
                  <th className="py-1 font-normal">PO2</th>
                  <th className="py-1 font-normal">PO3</th>
                  <th className="py-1 font-normal">PSO1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {copoMap.map((row) => (
                  <tr key={row.co_code}>
                    <td className="py-1.5 text-left font-medium text-ink">{row.co_code}</td>
                    {['PO1', 'PO2', 'PO3', 'PSO1'].map((po) => {
                      const val = row.po_scores[po] ?? 0;
                      return (
                        <td key={po} className="py-1.5">
                          <select
                            aria-label={`${row.co_code} ${po} mapping`}
                            value={val}
                            onChange={(e) =>
                              updateCOPOMapping(row.co_code, po, parseInt(e.target.value, 10) || 0)
                            }
                            className={`px-1.5 py-0.5 rounded text-[11px] font-mono cursor-pointer border focus:outline-none focus:ring-1 focus:ring-teal ${
                              val > 0
                                ? 'bg-teal-tint text-teal border-teal/30 font-semibold'
                                : 'bg-surface-alt text-muted border-border'
                            }`}
                          >
                            <option value={0}>0</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Marking Rubric & Approval */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-muted uppercase tracking-wider">
              Marking rubric (per session, 50 raw)
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                totalRubricMarks === 50 ? 'bg-teal-tint text-teal' : 'bg-danger-tint text-danger'
              }`}
            >
              Total: {totalRubricMarks} / 50
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {Object.entries(rubric).map(([k, val]) => (
              <div key={k} className="flex justify-between items-center py-1 border-b border-border">
                <span className="capitalize text-ink">{k.replace('_', ' ')}</span>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={val}
                  onChange={(e) => updateRubric({ ...rubric, [k]: parseInt(e.target.value) || 0 })}
                  className="w-16 px-2 py-1 bg-surface-alt border border-border rounded text-right text-ink font-bold"
                />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted">Scaled to 100 in official institutional transcripts.</p>
        </div>

        <div className="bg-surface p-5 rounded-[6px] border border-border flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-muted uppercase tracking-wider mb-2">
              HOD Approval Status
            </div>
            <div className="p-3 bg-surface-alt rounded border border-border text-xs font-mono">
              Status: <strong className="text-ink uppercase">{planStatus}</strong>
              {hodPlanRemark && <div className="text-muted mt-1 italic">"{hodPlanRemark}"</div>}
            </div>
          </div>
          <div className="text-xs text-muted pt-4 border-t border-border">
            Once approved by the HOD, session schedules unlock for students.
          </div>
        </div>
      </div>
    </div>
  );
};
