import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Users,
  Plus,
  Upload,
  Key,
  Mail,
  CheckCircle2,
  Send,
  Copy,
  Check,
  Eye,
  AlertCircle,
  Clock,
  X,
} from 'lucide-react';

export const Step2Batches: React.FC = () => {
  const {
    batches,
    addBatch,
    students,
    importRoster,
    sendStudentOnboardingEmail,
    resendAllOnboardingEmails,
    course,
  } = useApp();

  const [showAddBatch, setShowAddBatch] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchSlot, setBatchSlot] = useState('');
  const [batchRoom, setBatchRoom] = useState('');

  // Roster import states
  const [showImportModal, setShowImportModal] = useState(false);
  const [rosterText, setRosterText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  // Single student addition state
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [singleRoll, setSingleRoll] = useState('');
  const [singleName, setSingleName] = useState('');
  const [singleEmail, setSingleEmail] = useState('');
  const [singleError, setSingleError] = useState<string | null>(null);

  // Email template preview state
  const [previewStudent, setPreviewStudent] = useState<any | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim()) return;
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const coursePrefix = (course.code || 'CSL101').replace(/[^a-zA-Z0-9]/g, '');
    addBatch({
      name: batchName.trim(),
      class_code: `${coursePrefix}-${randomCode}`,
      slot: batchSlot.trim() || 'Wednesday 10:00–12:00',
      room: batchRoom.trim() || 'Lab 304',
      students_count: 0,
    });
    setBatchName('');
    setBatchSlot('');
    setBatchRoom('');
    setShowAddBatch(false);
  };

  const handleRosterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);

    const lines = rosterText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setImportError('Please enter at least one student line with an actual email address.');
      return;
    }

    // Validate that at least emails are present
    const invalidLines: string[] = [];
    lines.forEach((line) => {
      const parts = line.split(/[,;\t|]/).map((p) => p.trim());
      const hasEmail = parts.some((p) => isValidEmail(p));
      if (!hasEmail) {
        invalidLines.push(line);
      }
    });

    if (invalidLines.length > 0) {
      setImportError(
        `Invalid email format detected in ${invalidLines.length} line(s). Please include a valid email (e.g. 2301001, Aarav Sharma, aarav@college.edu).`
      );
      return;
    }

    importRoster(lines);
    setShowImportModal(false);
    setRosterText('');
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSingleError(null);

    if (!singleName.trim()) {
      setSingleError('Please enter student full name.');
      return;
    }
    if (!isValidEmail(singleEmail)) {
      setSingleError('Please enter a valid actual student email address (e.g. student@college.edu).');
      return;
    }

    const roll = singleRoll.trim() || `23010${(students.length + 1).toString().padStart(2, '0')}`;
    const line = `${roll}, ${singleName.trim()}, ${singleEmail.trim()}`;

    importRoster([line]);
    setShowSingleModal(false);
    setSingleRoll('');
    setSingleName('');
    setSingleEmail('');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const primaryBatch = batches[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 2 · PLAN
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Batches & Student Onboarding</h1>
            <p className="text-xs text-muted mt-1">
              Create batches, verify actual student email addresses, and automatically dispatch onboarding invitation codes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSingleModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface text-ink border border-border rounded-[6px] text-xs font-mono font-medium hover:bg-surface-alt transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Student</span>
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface text-ink border border-border rounded-[6px] text-xs font-mono font-medium hover:bg-surface-alt transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Roster CSV</span>
            </button>
            <button
              onClick={() => setShowAddBatch(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal text-white rounded-[6px] text-xs font-mono font-medium hover:bg-[#0b4b42] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Batch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Batch Cards */}
      {batches.length === 0 ? (
        <div className="bg-surface p-8 rounded-[8px] border border-dashed border-border text-center space-y-3 font-mono text-xs">
          <p className="text-muted">No lab batches created yet for this course.</p>
          <button
            onClick={() => setShowAddBatch(true)}
            className="px-4 py-2 bg-teal text-white rounded font-medium hover:bg-[#0b4b42]"
          >
            + Create First Batch
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batches.map((batch) => (
            <div key={batch.id} className="p-4 bg-surface rounded-[8px] border border-border space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-ink">{batch.name}</span>
                <span className="font-mono text-xs px-2.5 py-0.5 bg-teal-tint text-teal rounded-full font-medium">
                  {students.length} students enrolled
                </span>
              </div>
              <div className="text-xs text-muted space-y-1 font-mono">
                <div>
                  Slot: <strong className="text-ink">{batch.slot}</strong>
                </div>
                <div>
                  Room: <strong className="text-ink">{batch.room}</strong>
                </div>
                <div className="flex items-center gap-2 pt-1.5">
                  <Key className="w-3.5 h-3.5 text-teal" />
                  <span className="bg-surface-alt px-2 py-0.5 rounded border border-border text-ink font-bold tracking-wider">
                    {batch.class_code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(batch.class_code)}
                    className="p-1 hover:bg-surface-alt rounded text-muted hover:text-ink"
                    title="Copy Class Code"
                  >
                    {copiedCode === batch.class_code ? (
                      <Check className="w-3.5 h-3.5 text-teal" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-[11px] text-muted">(Class accession code)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student List & Onboarding Table */}
      <div className="bg-surface p-5 rounded-[8px] border border-border space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-teal" />
            <span className="font-semibold text-xs text-ink uppercase font-mono tracking-wider">
              Enrolled Students & Onboarding ({students.length})
            </span>
          </div>

          {students.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => resendAllOnboardingEmails()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal text-white rounded text-xs font-mono font-medium hover:bg-[#0b4b42] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Dispatch Emails to All ({students.length})</span>
              </button>
            </div>
          )}
        </div>

        {students.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-muted space-y-3">
            <Mail className="w-8 h-8 text-muted mx-auto opacity-50" />
            <div className="font-semibold text-ink">No students enrolled yet</div>
            <p className="max-w-md mx-auto text-muted">
              Add student roster with actual email IDs. Each student will receive an automated onboarding invitation with a secure accession code to access their lab IDE.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowSingleModal(true)}
                className="px-3.5 py-1.5 bg-surface-alt border border-border rounded text-ink hover:bg-paper"
              >
                + Add Single Student
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-3.5 py-1.5 bg-teal text-white rounded hover:bg-[#0b4b42]"
              >
                Upload Roster CSV
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-border bg-surface-alt text-[11px] text-muted">
                  <th className="p-2.5">SEAT</th>
                  <th className="p-2.5">ROLL NUMBER</th>
                  <th className="p-2.5">STUDENT NAME</th>
                  <th className="p-2.5">ACTUAL EMAIL ID</th>
                  <th className="p-2.5">ONBOARDING CODE</th>
                  <th className="p-2.5">INVITE STATUS</th>
                  <th className="p-2.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((st) => (
                  <tr key={st.student_id} className="hover:bg-surface-alt transition-colors">
                    <td className="p-2.5 text-muted">#{st.seat_number}</td>
                    <td className="p-2.5 font-bold text-ink">{st.roll}</td>
                    <td className="p-2.5 text-ink font-sans font-medium">{st.name}</td>
                    <td className="p-2.5 text-ink">
                      <span className="bg-surface-alt px-2 py-0.5 rounded border border-border text-[11px]">
                        {st.email}
                      </span>
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-teal bg-teal-tint px-2 py-0.5 rounded text-[11px]">
                          {st.onboarding_code || 'XEI-8492'}
                        </span>
                        <button
                          onClick={() => handleCopyCode(st.onboarding_code || 'XEI-8492')}
                          title="Copy Accession Code"
                          className="p-1 hover:bg-surface-alt rounded text-muted hover:text-ink"
                        >
                          {copiedCode === (st.onboarding_code || 'XEI-8492') ? (
                            <Check className="w-3 h-3 text-teal" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-tint text-teal rounded text-[10px] font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Invite Sent</span>
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewStudent(st)}
                          title="View Invitation Email Preview"
                          className="p-1 text-muted hover:text-teal rounded hover:bg-surface-alt"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => sendStudentOnboardingEmail(st.student_id)}
                          className="flex items-center gap-1 px-2 py-1 bg-surface border border-border rounded text-[11px] text-ink hover:bg-surface-alt transition-colors"
                        >
                          <Send className="w-3 h-3 text-teal" />
                          <span>Resend Email</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Single Student */}
      {showSingleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-[8px] border border-border p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-sm text-ink">Add Student with Actual Email ID</h3>
              <button onClick={() => setShowSingleModal(false)} className="text-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            {singleError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{singleError}</span>
              </div>
            )}

            <form onSubmit={handleSingleSubmit} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="text-muted block mb-1">Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g. 2301001"
                  value={singleRoll}
                  onChange={(e) => setSingleRoll(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded text-ink font-bold"
                />
              </div>
              <div>
                <label className="text-muted block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded text-ink"
                />
              </div>
              <div>
                <label className="text-muted block mb-1">
                  Actual Student Email Address <span className="text-teal">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aarav.sharma@university.edu"
                  value={singleEmail}
                  onChange={(e) => setSingleEmail(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded text-ink focus:outline-none focus:ring-1 focus:ring-teal"
                />
                <span className="text-[10px] text-muted block mt-1">
                  An automated onboarding code will be sent to this email.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowSingleModal(false)}
                  className="px-3 py-1.5 border border-border rounded text-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal text-white rounded font-medium hover:bg-[#0b4b42]"
                >
                  Enroll & Send Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Import Roster CSV */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-[8px] border border-border p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-semibold text-sm text-ink">Import Student Roster with Email IDs</h3>
                <p className="text-xs text-muted mt-0.5">
                  Paste records in <strong>Roll, Name, Email</strong> format.
                </p>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            {importError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            <form onSubmit={handleRosterSubmit} className="space-y-3 text-xs font-mono">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-muted">Roster Entries (1 per line)</label>
                  <button
                    type="button"
                    onClick={() =>
                      setRosterText(
                        `2301001, Aarav Sharma, aarav@university.edu\n2301002, Ananya Patel, ananya@university.edu\n2301003, Rohan Verma, rohan@university.edu`
                      )
                    }
                    className="text-teal hover:underline text-[11px]"
                  >
                    Insert Example
                  </button>
                </div>
                <textarea
                  rows={6}
                  required
                  placeholder={`2301001, Aarav Sharma, aarav@university.edu\n2301002, Ananya Patel, ananya@university.edu\n2301003, Rohan Verma, rohan@university.edu`}
                  value={rosterText}
                  onChange={(e) => setRosterText(e.target.value)}
                  className="w-full p-2.5 bg-surface-alt border border-border rounded font-mono text-xs text-ink focus:outline-none focus:ring-1 focus:ring-teal resize-none"
                />
              </div>

              <div className="p-3 bg-surface-alt rounded border border-border text-[11px] text-muted space-y-1">
                <div className="font-bold text-ink flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal" />
                  <span>Automated Student Onboarding Flow:</span>
                </div>
                <div>1. Each student is assigned a unique laboratory accession code (e.g. XEI-8492).</div>
                <div>2. Welcome emails with join links and credentials are sent to their actual emails.</div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-3 py-1.5 border border-border rounded text-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal text-white rounded font-medium hover:bg-[#0b4b42]"
                >
                  Import & Dispatch Onboarding Codes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Batch */}
      {showAddBatch && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-[8px] border border-border p-6 space-y-4 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-sm text-ink font-sans">Create Laboratory Batch</h3>
              <button onClick={() => setShowAddBatch(false)} className="text-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3">
              <div>
                <label className="text-muted block mb-1">Batch Name</label>
                <input
                  type="text"
                  placeholder="e.g. Batch A"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded text-ink font-medium"
                  required
                />
              </div>
              <div>
                <label className="text-muted block mb-1">Weekly Slot</label>
                <input
                  type="text"
                  placeholder="e.g. Wednesday 10:00–12:00"
                  value={batchSlot}
                  onChange={(e) => setBatchSlot(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded text-ink"
                />
              </div>
              <div>
                <label className="text-muted block mb-1">Room / Lab Number</label>
                <input
                  type="text"
                  placeholder="e.g. Turing Lab 304"
                  value={batchRoom}
                  onChange={(e) => setBatchRoom(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded text-ink"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddBatch(false)}
                  className="px-3 py-1.5 border border-border rounded text-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal text-white rounded font-medium hover:bg-[#0b4b42]"
                >
                  Create Batch & Generate Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Email Preview */}
      {previewStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-lg rounded-[8px] border border-border p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal" />
                <h3 className="font-semibold text-sm text-ink">Onboarding Email Preview</h3>
              </div>
              <button onClick={() => setPreviewStudent(null)} className="text-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-surface-alt p-4 rounded border border-border space-y-3 text-xs font-mono">
              <div className="border-b border-border pb-2 space-y-1">
                <div>
                  <span className="text-muted">To: </span>
                  <strong className="text-ink">{previewStudent.email}</strong>
                </div>
                <div>
                  <span className="text-muted">Subject: </span>
                  <strong className="text-teal">
                    Welcome to {course.title || 'Laboratory Course'} — Your Onboarding Code: {previewStudent.onboarding_code}
                  </strong>
                </div>
              </div>

              <div className="text-ink font-sans leading-relaxed space-y-2 pt-1">
                <p>Hello <strong>{previewStudent.name}</strong>,</p>
                <p>
                  Your faculty has enrolled you in <strong>{course.title || 'Laboratory Course'}</strong> ({course.code || 'CSL101'}, Batch {primaryBatch?.name || 'A'}).
                </p>
                <div className="my-3 p-3 bg-surface rounded border border-border font-mono text-center">
                  <div className="text-[11px] text-muted">YOUR ACCESSION CODE</div>
                  <div className="text-lg font-bold text-teal tracking-widest">{previewStudent.onboarding_code}</div>
                  <div className="text-[10px] text-muted mt-1">Class Code: {primaryBatch?.class_code}</div>
                </div>
                <p>
                  Visit <a href="https://xeio.ailms.workers.dev" className="text-teal underline font-mono">https://xeio.ailms.workers.dev</a>, select Student IDE, and enter your accession code to start your programming sessions.
                </p>
                <p className="text-muted text-[11px] pt-2 border-t border-border">
                  — XeIO AI Faculty Assistant · Elzeo Future Technologies Pvt Ltd
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewStudent(null)}
                className="px-3.5 py-1.5 border border-border rounded text-muted text-xs"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  sendStudentOnboardingEmail(previewStudent.student_id);
                  setPreviewStudent(null);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-teal text-white rounded text-xs font-medium hover:bg-[#0b4b42]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Email Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
