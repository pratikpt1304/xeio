import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { XeIOLogo, ElzeoLogo } from './Brand';
import { Role } from '../types';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User as UserIcon, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

export const SignInScreen: React.FC<{ onSignIn: () => void }> = ({ onSignIn }) => {
  const { switchRole } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('faculty');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Handle Supabase Auth (Sign In with Email + Password)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (!supabase) {
        // Fallback if supabase client not available
        onSignIn();
        return;
      }

      if (mode === 'signin') {
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
          // Check role metadata or default to faculty
          const userRole = (data.user.user_metadata?.role as Role) || 'faculty';
          switchRole(userRole);
          onSignIn();
        }
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
              role: selectedRole,
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
          setIsLoading(false);
          return;
        }

        if (data.session) {
          switchRole(selectedRole);
          onSignIn();
        } else {
          setSuccessMsg('Account created successfully! You can now sign in.');
          setMode('signin');
          setIsLoading(false);
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred during authentication.');
      setIsLoading(false);
    }
  };

  // Handle Google OAuth SSO
  const handleGoogleSSO = async () => {
    setErrorMsg(null);
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) setErrorMsg(error.message);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Google SSO initialization failed.');
    }
  };

  // Handle Quick Demo Role Selection (for testing & evaluation)
  const handleQuickDemoSignIn = (role: Role) => {
    switchRole(role);
    onSignIn();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#141413]">
      {/* Left Brand Panel */}
      <div className="w-full md:w-5/12 bg-[#141413] text-white p-8 md:p-14 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#262624]">
        <div>
          <XeIOLogo variant="dark" size="lg" className="mb-10" />
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4 leading-tight">
            The AI faculty assistant that plans, runs and reports every lab.
          </h1>
          <p className="text-[#A3A299] text-base leading-relaxed max-w-md">
            Unified institutional access for faculty, students, HODs, deans, CoE, and the VC. Role-scoped permissions with complete audit trails.
          </p>
        </div>

        <div className="pt-12 mt-12 border-t border-[#262624]">
          <div className="text-xs uppercase tracking-wider text-[#73726B] font-mono mb-3">
            Designed and maintained by
          </div>
          <div className="flex items-center gap-3">
            <ElzeoLogo variant="dark" size="md" />
          </div>
          <div className="text-xs text-[#73726B] mt-3">
            Elzeo Future Technologies Pvt Ltd · Production Cloud Architecture
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-7/12 bg-paper p-6 md:p-14 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-md bg-surface p-8 rounded-[6px] border border-border shadow-none">
          {/* Tabs: Sign In / Create Account */}
          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => { setMode('signin'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`pb-2.5 text-sm font-medium mr-6 transition-colors border-b-2 ${
                mode === 'signin'
                  ? 'border-teal text-ink font-semibold'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              Institutional Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setErrorMsg(null); setSuccessMsg(null); }}
              className={`pb-2.5 text-sm font-medium transition-colors border-b-2 ${
                mode === 'signup'
                  ? 'border-teal text-ink font-semibold'
                  : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              Create Account
            </button>
          </div>

          <h2 className="text-2xl font-semibold text-ink mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create an institutional account'}
          </h2>
          <p className="text-xs text-muted mb-6 leading-normal">
            {mode === 'signin'
              ? 'Enter your registered credentials or select a role to begin.'
              : 'Register your faculty or student profile connected to Supabase.'}
          </p>

          {errorMsg && (
            <div className="mb-4 p-3 bg-danger-tint border border-danger/30 rounded-[6px] text-xs text-danger flex items-start gap-2">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-teal-tint border border-teal/30 rounded-[6px] text-xs text-teal flex items-start gap-2">
              <CheckCircle size={15} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon size={14} className="absolute left-3 top-3 text-muted" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Ramesh Sharma"
                      className="w-full pl-9 pr-3.5 py-2 bg-surface text-ink text-sm rounded-[6px] border border-border focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Select Your Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                    className="w-full px-3 py-2 bg-surface text-ink text-sm rounded-[6px] border border-border focus:outline-none focus:ring-1 focus:ring-teal"
                  >
                    <option value="faculty">Faculty / Lab In-Charge</option>
                    <option value="student">Student</option>
                    <option value="hod">Head of Department (HOD)</option>
                    <option value="dean">Dean / Academic Director</option>
                    <option value="coe">Controller of Examinations (CoE)</option>
                    <option value="super_admin">Super Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-mono text-muted uppercase mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-3 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="faculty@university.edu"
                  className="w-full pl-9 pr-3.5 py-2 bg-surface text-ink text-sm rounded-[6px] border border-border focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-muted uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-3 text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2 bg-surface text-ink text-sm rounded-[6px] border border-border focus:outline-none focus:ring-1 focus:ring-teal focus:border-teal"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-teal text-white text-sm font-medium rounded-[6px] hover:bg-[#0b4b42] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Connecting to Supabase...</span>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create Account'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Google SSO Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleGoogleSSO}
              className="w-full py-2 px-3 border border-border bg-surface-alt hover:bg-surface text-xs font-medium text-ink rounded-[6px] transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google Workspace</span>
            </button>
          </div>

          {/* Quick Access Demo Roles (No Password Needed for Evaluation) */}
          <div className="mt-6 pt-5 border-t border-border">
            <div className="text-[11px] font-mono text-muted uppercase mb-2.5 flex items-center justify-between">
              <span>Quick Evaluation Roles</span>
              <span className="text-[10px] text-teal font-sans">1-Click Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoSignIn('faculty')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink">Faculty Workspace</div>
                <div className="text-[10px] text-muted">Course, Labs, Live Monitor</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSignIn('student')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink">Student IDE</div>
                <div className="text-[10px] text-muted">Coding, Tests, Lab File</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSignIn('hod')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink">HOD Console</div>
                <div className="text-[10px] text-muted">Approvals & Compliance</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSignIn('dean')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink">Dean / CoE / VC</div>
                <div className="text-[10px] text-muted">Multi-School Oversight</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoSignIn('super_admin')}
                className="col-span-2 p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-ink">Super Administrator</div>
                  <div className="text-[10px] text-muted">Manage Institutions, Subscriptions & Limits</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#E2E0D8] rounded text-ink">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
