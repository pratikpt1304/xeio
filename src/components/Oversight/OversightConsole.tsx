import React, { useState } from 'react';
import { Role } from '../../types';
import { useApp } from '../../context/AppContext';
import { XeIOLogo, FooterBranding } from '../Brand';
import { Download, RefreshCw, Layers } from 'lucide-react';

export const OversightConsole: React.FC<{
  role: Role;
  onSignOut: () => void;
}> = ({ role, onSignOut }) => {
  const { institution, course, planStatus, batches } = useApp();
  const [activeTab, setActiveTab] = useState<'internals' | 'monitor' | 'courses'>('internals');

  const [internalList, setInternalList] = useState<any[]>(
    course.code
      ? [
          {
            course: `${course.code} ${course.title}`,
            dept: course.department || 'Computer Science and Engineering',
            approvedBy: planStatus === 'approved' ? 'HOD Approved' : 'Awaiting HOD',
            students: batches.reduce((acc, b) => acc + (b.students_count || 0), 0),
            mean: 0,
            below40: 0,
            status: planStatus === 'approved' ? 'HOD Approved (Ready for CoE fetch)' : 'In Progress',
          },
        ]
      : []
  );

  const handleFetchApproved = () => {
    if (course.code && planStatus === 'approved') {
      setInternalList([
        {
          course: `${course.code} ${course.title}`,
          dept: course.department || 'Computer Science and Engineering',
          approvedBy: 'HOD Approved',
          students: batches.reduce((acc, b) => acc + (b.students_count || 0), 0),
          mean: 0,
          below40: 0,
          status: 'HOD Approved (Ready for CoE fetch)',
        },
      ]);
    }
  };

  const handleAcceptCourse = (index: number) => {
    setInternalList((prev) =>
      prev.map((c, i) => (i === index ? { ...c, status: 'Accepted into results' } : c))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Header */}
      <header className="h-14 bg-rail text-white px-6 flex items-center justify-between border-b border-[#262624] select-none">
        <div className="flex items-center gap-4">
          <XeIOLogo variant="dark" suffix={role.toUpperCase()} size="md" />
          <span className="text-xs font-mono text-muted">
            {role === 'dean' ? 'School Academic Oversight' : `${institution.name} · Institutional Oversight`}
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
            Courses
          </button>
          <button
            onClick={() => setActiveTab('internals')}
            className={`px-3 py-1.5 rounded ${activeTab === 'internals' ? 'bg-[#262624] text-white font-semibold' : 'text-[#A3A299]'}`}
          >
            {role === 'coe' ? 'Accepted Internals' : 'Department Progress'}
          </button>
          <button onClick={onSignOut} className="text-[#A3A299] hover:text-white hover:underline text-[11px] ml-4 font-mono">
            Sign out
          </button>
        </nav>
      </header>

      {/* Main Container */}
      <main className="p-8 max-w-7xl mx-auto w-full space-y-6 flex-1">
        {/* Internals / CoE Tab */}
        {activeTab === 'internals' && (
          <div className="bg-surface p-6 rounded-[6px] border border-border space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h1 className="text-lg font-semibold text-ink">
                  {role === 'coe' ? 'Internal Marks Acceptance Pipeline' : 'School Laboratory Internals Overview'}
                </h1>
                <p className="text-xs text-muted font-mono mt-0.5">
                  Fetch approved lab internals from HODs, audit mark distributions and lock into final examination records.
                </p>
              </div>

              {role === 'coe' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFetchApproved}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-alt border border-border rounded text-xs font-mono hover:bg-paper"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Fetch HOD-approved internals</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-rail text-white rounded text-xs font-mono hover:bg-[#262624]">
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CoE Report (CSV)</span>
                  </button>
                </div>
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
                  {internalList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs font-mono text-muted">
                        No department courses submitted to oversight yet.
                      </td>
                    </tr>
                  ) : (
                    internalList.map((item, idx) => (
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
                    ))
                  )}
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
                <span className="text-2xl font-bold text-ink mt-1 block">{batches.length}</span>
              </div>
              <div className="p-4 bg-surface-alt rounded border border-border">
                <span className="text-muted text-[11px] block uppercase">Average Attendance</span>
                <span className="text-2xl font-bold text-teal mt-1 block">0%</span>
              </div>
              <div className="p-4 bg-surface-alt rounded border border-border">
                <span className="text-muted text-[11px] block uppercase">Pending HOD Approvals</span>
                <span className="text-2xl font-bold text-assist mt-1 block">{planStatus === 'sent' ? 1 : 0}</span>
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
