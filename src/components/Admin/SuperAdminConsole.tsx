import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { XeIOLogo, ElzeoLogo, FooterBranding } from '../Brand';
import { Users, CreditCard, Sparkles, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const SuperAdminConsole: React.FC<{ onSignOut: () => void }> = ({ onSignOut }) => {
  const { institution } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'subscriptions' | 'credits' | 'audit'>('credits');

  const facultyCredits = [
    {
      name: 'Faculty In-Charge',
      email: `faculty@${institution.email_domain || 'university.edu'}`,
      plan: institution.plan,
      validUntil: institution.plan_end,
      used: institution.ai_used_total,
      cap: institution.ai_total_cap,
      todayUsed: institution.ai_used_today,
      todayCap: institution.ai_daily_cap,
      status: 'Active',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Header */}
      <header className="h-14 bg-rail text-white px-6 flex items-center justify-between border-b border-[#262624] select-none">
        <div className="flex items-center gap-4">
          <XeIOLogo variant="dark" suffix="Super admin" size="md" />
          <span className="text-xs font-mono text-muted">All rights · {institution.name}</span>
        </div>

        <nav className="flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded ${activeTab === 'users' ? 'bg-[#262624] text-white font-semibold' : 'text-[#A3A299]'}`}
          >
            Users and roles
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3 py-1.5 rounded ${activeTab === 'subscriptions' ? 'bg-[#262624] text-white font-semibold' : 'text-[#A3A299]'}`}
          >
            Subscriptions
          </button>
          <button
            onClick={() => setActiveTab('credits')}
            className={`px-3 py-1.5 rounded ${activeTab === 'credits' ? 'bg-[#262624] text-white font-semibold' : 'text-[#A3A299]'}`}
          >
            AI credits
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded ${activeTab === 'audit' ? 'bg-[#262624] text-white font-semibold' : 'text-[#A3A299]'}`}
          >
            Audit log
          </button>
        </nav>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#A3A299]">admin@elzeo.in</span>
          <span className="text-[#3A3935]">|</span>
          <button onClick={onSignOut} className="text-[#A3A299] hover:text-white hover:underline text-[11px]">
            Sign out
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto space-y-6">
        {/* AI Credits Management Tab (PRD Page 30) */}
        {activeTab === 'credits' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-ink">AI credits</h2>
                <p className="text-xs text-muted font-mono mt-0.5">
                  Usage per faculty against their subscription caps. An AI run = one Assist generation.
                </p>
              </div>
            </div>

            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-center">
              <div className="bg-surface p-4 rounded-[6px] border border-border">
                <span className="text-[11px] text-muted block uppercase">Faculty with AI plans</span>
                <span className="text-2xl font-bold text-ink mt-1 block">7</span>
              </div>
              <div className="bg-surface p-4 rounded-[6px] border border-border">
                <span className="text-[11px] text-muted block uppercase">Runs used this term</span>
                <span className="text-2xl font-bold text-ink mt-1 block">707</span>
              </div>
              <div className="bg-surface p-4 rounded-[6px] border border-border">
                <span className="text-[11px] text-muted block uppercase">Runs today</span>
                <span className="text-2xl font-bold text-teal mt-1 block">18</span>
              </div>
              <div className="bg-surface p-4 rounded-[6px] border border-border">
                <span className="text-[11px] text-muted block uppercase">At cap today</span>
                <span className="text-2xl font-bold text-assist mt-1 block">3</span>
              </div>
            </div>

            {/* Faculty Credits Table */}
            <div className="bg-surface rounded-[6px] border border-border overflow-hidden">
              <table className="w-full text-xs font-mono text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-alt text-[11px] text-muted">
                    <th className="p-3">FACULTY</th>
                    <th className="p-3">PLAN</th>
                    <th className="p-3">VALID UNTIL</th>
                    <th className="p-3 w-64">USED THIS SUBSCRIPTION</th>
                    <th className="p-3 text-center">TODAY</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {facultyCredits.map((f) => {
                    const percent = (f.used / f.cap) * 100;
                    return (
                      <tr key={f.email} className="hover:bg-surface-alt">
                        <td className="p-3">
                          <div className="font-semibold text-ink">{f.name}</div>
                          <div className="text-[11px] text-muted font-normal">{f.email}</div>
                        </td>
                        <td className="p-3 font-semibold text-ink">{f.plan}</td>
                        <td className="p-3 text-muted">{f.validUntil}</td>
                        <td className="p-3">
                          <div className="flex justify-between text-[11px] mb-1">
                            <span>{f.used} of {f.cap} used</span>
                            <span className="text-muted">{f.cap - f.used} left</span>
                          </div>
                          <div className="w-full bg-border h-2 rounded overflow-hidden">
                            <div
                              className={`h-full ${
                                percent >= 100 ? 'bg-danger' : percent > 80 ? 'bg-assist' : 'bg-teal'
                              }`}
                              style={{ width: `${Math.min(100, percent)}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="p-3 text-center font-bold">
                          {f.todayUsed}/{f.todayCap}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              f.status === 'OK'
                                ? 'bg-teal-tint text-teal'
                                : f.status.includes('Daily cap')
                                ? 'bg-assist-tint text-assist'
                                : 'bg-danger-tint text-danger'
                            }`}
                          >
                            {f.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => alert(`Upgraded ${f.name} plan!`)}
                            className="text-teal hover:underline"
                          >
                            Move to {f.plan === 'Pro' ? 'Elite' : 'Pro'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-ink">Subscription Plans & Quotas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface p-6 rounded-[6px] border border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-ink">Pro Plan</span>
                  <span className="px-2 py-0.5 bg-teal-tint text-teal rounded text-xs font-mono">Current Active</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div>AI runs per subscription: <strong>125 runs</strong></div>
                  <div>Daily AI cap per faculty: <strong>5 runs / day</strong></div>
                  <div>Available Durations: <strong>3, 6, or 12 months</strong></div>
                </div>
              </div>

              <div className="bg-surface p-6 rounded-[6px] border border-border space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-ink">Elite Plan</span>
                  <span className="px-2 py-0.5 bg-surface-alt border border-border rounded text-xs font-mono">Enterprise</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div>AI runs per subscription: <strong>250 runs</strong></div>
                  <div>Daily AI cap per faculty: <strong>7 runs / day</strong></div>
                  <div>Available Durations: <strong>3, 6, or 12 months</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Log Tab */}
        {activeTab === 'audit' && (
          <div className="bg-surface p-6 rounded-[6px] border border-border space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">Immutable Audit Trail</h2>
                <p className="text-xs text-muted font-mono">OWASP ASVS compliant immutable record of logins, approvals, mark changes and AI calls</p>
              </div>
              <button className="px-3 py-1.5 bg-surface-alt border border-border rounded text-xs font-mono hover:bg-paper">
                Export Audit Log (CSV)
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-surface-alt rounded border border-border flex justify-between">
                <div>
                  <span className="font-semibold text-ink">SYSTEM:</span> Production instance provisioned for {institution.name}
                </div>
                <span className="text-muted">Today IST</span>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-surface p-6 rounded-[6px] border border-border space-y-4">
            <h2 className="text-lg font-semibold text-ink">Institutional User Management</h2>
            <p className="text-xs text-muted">All active users strictly mapped to @{institution.email_domain || 'university.edu'} or @elzeo.in</p>
          </div>
        )}
      </main>

      <FooterBranding />
    </div>
  );
};
