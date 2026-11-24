import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { XeIOLogo, ElzeoLogo } from './Brand';
import { Role } from '../types';
import { supabase } from '../lib/supabase';
import { Mail, Lock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

export const SignInScreen: React.FC<{ onSignIn: (role?: Role) => void; onBackToLanding?: () => void }> = ({ onSignIn, onBackToLanding }) => {
  const { switchRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle Supabase Auth (Sign In with Email + Password)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (!supabase) {
        onSignIn('faculty');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMsg(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        const userRole = (data.user.user_metadata?.role as Role) || 'faculty';
        switchRole(userRole);
        onSignIn(userRole);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred during authentication.');
      setIsLoading(false);
    }
  };

  // Handle Quick Demo Role Selection
  const handleQuickDemoSignIn = (role: Role) => {
    switchRole(role);
    onSignIn(role);
  };

  return (
    <div className="min-h-screen md:h-screen flex flex-col md:flex-row bg-[#141413] overflow-y-auto md:overflow-hidden">
      {/* Left Brand Panel */}
      <div className="w-full md:w-5/12 bg-[#141413] text-white p-6 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#262624] shrink-0 overflow-y-auto">
        <div>
          <XeIOLogo variant="dark" size="lg" className="mb-6 md:mb-8" />
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-3 leading-tight">
            The AI faculty assistant that plans, runs and reports every lab.
          </h1>
          <p className="text-[#A3A299] text-sm leading-relaxed max-w-md">
            Unified institutional access for faculty, students, HODs, deans, CoE, and the VC. Role-scoped permissions with complete audit trails.
          </p>
        </div>

        <div className="pt-6 mt-8 border-t border-[#262624]">
          <div className="text-[11px] uppercase tracking-wider text-[#73726B] font-mono mb-2">
            Designed and maintained by
          </div>
          <div className="flex items-center gap-3">
            <ElzeoLogo variant="dark" size="md" />
          </div>
          <div className="text-[11px] text-[#73726B] mt-2">
            Elzeo Future Technologies Pvt Ltd · Production Cloud Architecture
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-7/12 bg-paper p-4 md:p-8 flex flex-col justify-start md:justify-center items-center overflow-y-auto h-full">
        <div className="w-full max-w-md bg-surface p-6 md:p-8 rounded-[6px] border border-border shadow-none my-auto">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="mb-4 text-xs font-mono text-muted hover:text-ink flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to XeIO Home</span>
            </button>
          )}

          <div className="mb-5">
            <div className="text-[11px] font-mono text-teal uppercase tracking-wider mb-1 font-semibold">
              Institutional Portal
            </div>
            <h2 className="text-2xl font-semibold text-ink mb-1">
              Sign In
            </h2>
            <p className="text-xs text-muted leading-normal">
              Enter your institutional credentials or select an evaluation role.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-3 p-2.5 bg-danger-tint border border-danger/30 rounded-[6px] text-xs text-danger flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-mono text-muted uppercase mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-2.5 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full pl-9 pr-3 py-2 bg-surface text-ink text-sm rounded-[6px] border border-border focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-muted uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-2.5 text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-surface text-ink text-sm rounded-[6px] border border-border focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-teal text-white text-xs font-medium rounded-[6px] hover:bg-[#0b4b42] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Quick Access Demo Roles */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="text-[10px] font-mono text-muted uppercase mb-2 flex items-center justify-between">
              <span>Quick Evaluation Roles</span>
              <span className="text-[9px] text-teal font-sans">1-Click Access</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoSignIn('faculty')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink text-[11px]">Faculty Workspace</div>
                <div className="text-[9px] text-muted leading-tight">Course, Labs, Live Monitor</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSignIn('student')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink text-[11px]">Student IDE</div>
                <div className="text-[9px] text-muted leading-tight">Coding, Tests, Lab File</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSignIn('hod')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink text-[11px]">HOD Console</div>
                <div className="text-[9px] text-muted leading-tight">Approvals & Compliance</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSignIn('dean')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink text-[11px]">Dean / CoE / VC</div>
                <div className="text-[9px] text-muted leading-tight">Multi-School Oversight</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSignIn('super_admin')}
                className="col-span-2 p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-ink text-[11px]">Super Administrator</div>
                  <div className="text-[9px] text-muted leading-tight">Manage Institutions, Subscriptions & Limits</div>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#E2E0D8] rounded text-ink">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
