import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { XeIOLogo, ElzeoLogo } from './Brand';
import { Role } from '../types';

export const SignInScreen: React.FC<{ onSignIn: () => void }> = ({ onSignIn }) => {
  const { switchRole, currentUser } = useApp();
  const [email, setEmail] = useState('faculty.demo@sanjivani.edu.in');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = (selectedEmail?: string, role?: Role) => {
    const targetEmail = selectedEmail || email;
    if (!targetEmail.endsWith('@sanjivani.edu.in') && !targetEmail.endsWith('@elzeo.in')) {
      setErrorMsg("This email isn't onboarded yet. Ask your faculty for an invite or your admin for an account.");
      return;
    }
    setErrorMsg(null);
    if (role) {
      switchRole(role);
    }
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
            One sign-in for faculty, students, HODs, deans, the CoE and the VC. Each role sees only its own scope.
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
            Elzeo Future Technologies Pvt Ltd, India · Sanjivani University deployment
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full md:w-7/12 bg-paper p-8 md:p-14 flex items-center justify-center">
        <div className="w-full max-w-md bg-surface p-8 rounded-[6px] border border-border shadow-none">
          <h2 className="text-2xl font-semibold text-ink mb-1.5">Sign in</h2>
          <p className="text-sm text-muted mb-6 leading-normal">
            Use your institutional account. Only emails created by the super admin, or invited by your faculty with a class code, can sign in.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-mono text-muted uppercase mb-1.5">
                Institutional email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty.demo@sanjivani.edu.in"
                className="w-full px-3.5 py-2.5 bg-surface text-ink text-sm rounded-[6px] border border-border focus:outline-none focus:ring-1 focus:ring-brand-blueLight focus:border-brand-blueLight"
                required
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-danger-tint border border-danger/30 rounded-[6px] text-xs text-danger leading-relaxed">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-rail text-white text-sm font-medium rounded-[6px] hover:bg-[#262624] transition-colors"
            >
              Continue with Sanjivani SSO
            </button>
          </form>

          {/* Institutional SSO Demo Shortcuts */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="text-xs font-mono text-muted uppercase mb-3 flex items-center justify-between">
              <span>Demo accounts (Quick sign in)</span>
              <span className="text-[10px] text-teal font-normal font-sans">SSO Active</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleSignIn('faculty.demo@sanjivani.edu.in', 'faculty')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink">Faculty</div>
                <div className="text-[11px] text-muted">Dr. Ramesh (CSE)</div>
              </button>

              <button
                onClick={() => handleSignIn('2301044@sanjivani.edu.in', 'student')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink">Student</div>
                <div className="text-[11px] text-muted">Aarav (Roll 2301044)</div>
              </button>

              <button
                onClick={() => handleSignIn('hod.cse@sanjivani.edu.in', 'hod')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink">HOD</div>
                <div className="text-[11px] text-muted">Prof. Sunita (CSE)</div>
              </button>

              <button
                onClick={() => handleSignIn('dean.set@sanjivani.edu.in', 'dean')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink">Dean</div>
                <div className="text-[11px] text-muted">Dr. Anand (SET)</div>
              </button>

              <button
                onClick={() => handleSignIn('coe@sanjivani.edu.in', 'coe')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink">CoE</div>
                <div className="text-[11px] text-muted">Dr. Vikram Joshi</div>
              </button>

              <button
                onClick={() => handleSignIn('vc@sanjivani.edu.in', 'vc')}
                className="p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all"
              >
                <div className="font-semibold text-ink">VC</div>
                <div className="text-[11px] text-muted">Dr. Sharad Shinde</div>
              </button>

              <button
                onClick={() => handleSignIn('admin@elzeo.in', 'super_admin')}
                className="col-span-2 p-2 text-left rounded-[6px] border border-border bg-surface-alt hover:border-teal hover:bg-teal-tint transition-all flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-ink">Super Admin (Elzeo)</div>
                  <div className="text-[11px] text-muted">Manage institutions, subscriptions & credit caps</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#E2E0D8] rounded text-ink">System</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
