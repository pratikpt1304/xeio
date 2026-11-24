import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { XeIOLogo, ElzeoLogo, FooterBranding } from '../Brand';
import { Role } from '../../types';
import { Download, CheckCircle2, RotateCcw, AlertTriangle, Building, BookOpen } from 'lucide-react';

export const OversightConsole: React.FC<{
  role: 'dean' | 'coe' | 'vc';
  onSignOut: () => void;
}> = ({ role, onSignOut }) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'courses' | 'internals'>('internals');
  const [internalList, setInternalList] = useState([
    {
      course: 'ITL-204 Python Programming Lab',
      dept: 'Information Technology',
      approvedBy: 'hod.it · 18 Feb',
      students: 96,
      mean: 74.2,
      below40: 1,
      status: 'Accepted into results',
    },
    {
      course: 'MEL-218 CAD Lab',
      dept: 'Mechanical Engineering',
      approvedBy: 'hod.mech · 20 Feb',
      students: 72,
      mean: 69.8,
      below40: 2,
      status: 'Accepted into results',
    },
    {
      course: 'ETL-205 Embedded C Lab',
      dept: 'Electronics and Telecommunication',
      approvedBy: 'awaiting HOD',
      students: 80,
      mean: 0,
      below40: 0,
      status: 'Awaiting HOD approval',
    },
    {
      course: 'CSL-101 Programming in C Lab',
      dept: 'Computer Science and Engineering',
      approvedBy: 'hod.cse · 24 Feb',
      students: 120,
      mean: 82.0,
      below40: 7,
      status: 'HOD Approved (Ready for CoE fetch)',
    },
  ]);

  const handleFetchApproved = () => {
    alert('Fetched newly HOD-approved internal course files from all engineering departments.');
  };

  const handleAcceptCourse = (index: number) => {
    const updated = [...internalList];
    updated[index].status = 'Accepted into results';
    setInternalList(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Header */}
      <header className="h-14 bg-rail text-white px-6 flex items-center justify-between border-b border-[#262624] select-none">
        <div className="flex items-center gap-4">
          <XeIOLogo variant="dark" suffix={role.toUpperCase()} size="md" />
          <span className="text-xs font-mono text-muted">
            {role === 'dean' ? 'School of Engineering and Technology' : 'Sanjivani University · Controller of Examinations'}
          </span>
        </div>

        <nav className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab('monitor')}
            className={`px-3 py-1.5 rounded ${activeTab === 'monitor' ? 'bg-[#262624] text-white font-semibold' : 'text-[#A3A299]'}`}
          >
            Monitor
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1.5 rounded ${activeTab === 'courses' ? 'bg-[#262624] text-white font-semibold' : 'text-[#A3A299]'}`}
          >
            All Courses
          </button>
          <button
            onClick={() => setActiveTab('internals')}
            className={`px-3 py-1.5 rounded ${activeTab === 'internals' ? 'bg-[#262624] text-white font-semibold' : 'text-[#A3A299]'}`}
          >
            Internal Marks {role === 'coe' ? '(Action)' : '(View)'}
          </button>
        </nav>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#A3A299] capitalize">{role} Console</span>
          <span className="text-[#3A3935]">|</span>
          <button onClick={onSignOut} className="text-[#A3A299] hover:text-white hover:underline text-[11px]">
            Sign out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto space-y-6">
        {/* Internals Tab (PRD Page 30) */}
        {activeTab === 'internals' && (
          <div className="bg-surface p-6 rounded-[6px] border border-border space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-semibold text-ink">Internal marks</h2>
                <p className="text-xs text-muted font-mono mt-0.5">
                  Only HOD-approved internals can be fetched into results. Accepted internals are locked.
                </p>
              </div>

              {role === 'coe' && (
                <button
                  onClick={handleFetchApproved}
                  className="px-4 py-2 bg-teal text-white rounded-[6px] text-xs font-mono font-medium hover:bg-[#0b4b42]"
                >
                  Fetch HOD-approved internals
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-alt text-[11px] text-muted">
                    <th className="p-3">COURSE</th>
                    <th className="p-3">DEPARTMENT</th>
                    <th className="p-3">APPROVED BY</th>
                    <th className="p-3 text-center">STUDENTS</th>
                    <th className="p-3 text-center">MEAN /100</th>
                    <th className="p-3 text-center">BELOW 40</th>
                    <th className="p-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {internalList.map((item, idx) => (
                    <tr key={item.course} className="hover:bg-surface-alt">
                      <td className="p-3 font-semibold text-ink">{item.course}</td>
                      <td className="p-3 text-muted">{item.dept}</td>
                      <td className="p-3 text-muted">{item.approvedBy}</td>
                      <td className="p-3 text-center">{item.students}</td>
                      <td className="p-3 text-center font-bold text-ink">{item.mean || '–'}</td>
                      <td className="p-3 text-center text-danger">{item.below40}</td>
                      <td className="p-3 text-right">
                        {item.status === 'Accepted into results' ? (
                          <span className="text-teal font-medium">✓ Accepted into results</span>
                        ) : role === 'coe' && item.status.includes('Ready for CoE') ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAcceptCourse(idx)}
                              className="px-2.5 py-1 bg-teal text-white rounded text-[11px] hover:bg-[#0b4b42]"
                            >
                              Accept into results
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted">{item.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-muted font-mono pt-2 border-t border-border">
              Accepted internals are locked; any later change needs the HOD to re-approve and the CoE to accept again.
            </div>
          </div>
        )}

        {/* Monitor Tab */}
        {activeTab === 'monitor' && (
          <div className="bg-surface p-6 rounded-[6px] border border-border space-y-4">
            <h2 className="text-lg font-semibold text-ink">University Lab Operations Monitor</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-center">
              <div className="p-4 bg-surface-alt rounded border border-border">
                <span className="text-muted text-[11px] block uppercase">Scheduled Labs Today</span>
                <span className="text-2xl font-bold text-ink mt-1 block">18</span>
              </div>
              <div className="p-4 bg-surface-alt rounded border border-border">
                <span className="text-muted text-[11px] block uppercase">Average Attendance</span>
                <span className="text-2xl font-bold text-teal mt-1 block">94.8%</span>
              </div>
              <div className="p-4 bg-surface-alt rounded border border-border">
                <span className="text-muted text-[11px] block uppercase">Pending HOD Approvals</span>
                <span className="text-2xl font-bold text-assist mt-1 block">5</span>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="bg-surface p-6 rounded-[6px] border border-border space-y-4">
            <h2 className="text-lg font-semibold text-ink">Accredited Engineering Laboratories</h2>
            <p className="text-xs text-muted">All course files and CO-PO attainment records available for direct inspection.</p>
          </div>
        )}
      </main>

      <FooterBranding />
    </div>
  );
};
