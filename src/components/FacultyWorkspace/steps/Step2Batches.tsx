import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Users, Plus, Upload, Key } from 'lucide-react';

export const Step2Batches: React.FC = () => {
  const { batches, addBatch, students, importRoster } = useApp();
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchSlot, setBatchSlot] = useState('');
  const [batchRoom, setBatchRoom] = useState('');
  const [rosterText, setRosterText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim()) return;
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    addBatch({
      name: batchName.trim(),
      class_code: `CSL101-${randomCode}`,
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
    const names = rosterText
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (names.length > 0) {
      importRoster(names);
      setShowImportModal(false);
      setRosterText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider mb-1">
          STEP 2 · PLAN
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Batches & Roster</h1>
            <p className="text-xs text-muted mt-1">
              Create batches (&le;65 students each) and import the student section roster.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface text-ink border border-border rounded-[6px] text-xs font-mono font-medium hover:bg-surface-alt"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import roster</span>
            </button>
            <button
              onClick={() => setShowAddBatch(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rail text-white rounded-[6px] text-xs font-mono font-medium hover:bg-[#262624]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create batch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Batch Cards */}
      {batches.length === 0 ? (
        <div className="bg-surface p-8 rounded-[6px] border border-dashed border-border text-center space-y-3 font-mono text-xs">
          <p className="text-muted">No lab batches created yet.</p>
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
            <div key={batch.id} className="p-4 bg-surface rounded-[6px] border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-ink">{batch.name}</span>
                <span className="font-mono text-xs px-2 py-0.5 bg-teal-tint text-teal rounded">
                  {students.length} students enrolled
                </span>
              </div>
              <div className="text-xs text-muted space-y-1 font-mono">
                <div>Slot: <strong className="text-ink">{batch.slot}</strong></div>
                <div>Room: <strong className="text-ink">{batch.room}</strong></div>
                <div className="flex items-center gap-1.5 pt-1">
                  <Key className="w-3 h-3 text-muted" />
                  <span className="bg-surface-alt px-1.5 py-0.5 rounded border border-border text-ink">
                    {batch.class_code}
                  </span>
                  <span className="text-[11px] text-muted">(Class code for students)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student List */}
      <div className="bg-surface p-5 rounded-[6px] border border-border space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted" />
            <span className="font-semibold text-xs text-ink uppercase font-mono">
              Enrolled Students ({students.length})
            </span>
          </div>
          <span className="text-xs font-mono text-muted">Max batch capacity: 65</span>
        </div>

        {students.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-muted">
            No students enrolled. Click "Import roster" to add students.
          </div>
        ) : (
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-border bg-surface-alt text-[11px] text-muted">
                <th className="p-2.5">SEAT</th>
                <th className="p-2.5">ROLL</th>
                <th className="p-2.5">STUDENT NAME</th>
                <th className="p-2.5 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((st) => (
                <tr key={st.student_id} className="hover:bg-surface-alt">
                  <td className="p-2.5 text-muted">#{st.seat_number}</td>
                  <td className="p-2.5 font-bold text-ink">{st.roll}</td>
                  <td className="p-2.5 text-ink">{st.name}</td>
                  <td className="p-2.5 text-right text-teal">Enrolled</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Batch Modal */}
      {showAddBatch && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-[6px] border border-border p-6 space-y-4 font-mono text-xs">
            <h3 className="font-semibold text-sm text-ink">Create Lab Batch</h3>
            <form onSubmit={handleCreateBatch} className="space-y-3">
              <div>
                <label className="text-muted block mb-1">Batch Name</label>
                <input
                  type="text"
                  placeholder="e.g. Batch A"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded"
                  required
                />
              </div>
              <div>
                <label className="text-muted block mb-1">Slot Timing</label>
                <input
                  type="text"
                  placeholder="e.g. Wednesday 10:00–12:00"
                  value={batchSlot}
                  onChange={(e) => setBatchSlot(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded"
                />
              </div>
              <div>
                <label className="text-muted block mb-1">Room / Lab</label>
                <input
                  type="text"
                  placeholder="e.g. Lab 304"
                  value={batchRoom}
                  onChange={(e) => setBatchRoom(e.target.value)}
                  className="w-full p-2 bg-surface-alt border border-border rounded"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBatch(false)}
                  className="px-3 py-1.5 border border-border rounded text-muted"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-teal text-white rounded font-medium">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Roster Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-[6px] border border-border p-6 space-y-4 font-mono text-xs">
            <h3 className="font-semibold text-sm text-ink">Import Student Names</h3>
            <p className="text-muted text-[11px]">Enter student names (one per line):</p>
            <form onSubmit={handleRosterSubmit} className="space-y-3">
              <textarea
                placeholder="Student Name 1&#10;Student Name 2&#10;Student Name 3"
                value={rosterText}
                onChange={(e) => setRosterText(e.target.value)}
                className="w-full p-2 bg-surface-alt border border-border rounded font-mono"
                rows={6}
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-3 py-1.5 border border-border rounded text-muted"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-1.5 bg-teal text-white rounded font-medium">
                  Import Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
