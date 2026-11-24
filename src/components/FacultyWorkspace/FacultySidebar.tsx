import React from 'react';
import { useApp } from '../../context/AppContext';
import { XeIOLogo, ElzeoLogo } from '../Brand';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface FacultySidebarProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  onSignOut: () => void;
}

interface NavStepItem {
  num: number;
  title: string;
  badge?: string;
  isTeal?: boolean;
  isPulse?: boolean;
}

interface StepGroup {
  group: string;
  items: NavStepItem[];
}

export const FacultySidebar: React.FC<FacultySidebarProps> = ({
  currentStep,
  onSelectStep,
  onSignOut,
}) => {
  const { planStatus, course, batches, sessions } = useApp();

  const steps: StepGroup[] = [
    {
      group: 'PLAN',
      items: [
        { num: 1, title: 'Course setup', badge: planStatus === 'approved' ? 'approved' : 'draft', isTeal: planStatus === 'approved' },
        { num: 2, title: 'Batches', badge: batches.length > 0 ? `${batches.length}` : undefined, isTeal: batches.length > 0 },
        { num: 3, title: 'Session plan', badge: sessions.length > 0 ? `${sessions.length} sessions` : undefined, isTeal: sessions.length > 0 },
      ],
    },
    {
      group: 'PREPARE',
      items: [
        { num: 4, title: 'Lab questions' },
        { num: 5, title: 'Pre/post-test banks' },
      ],
    },
    {
      group: 'RUN',
      items: [
        { num: 6, title: 'Sessions', badge: sessions.length > 0 ? 'Live' : undefined, isTeal: true, isPulse: true },
        { num: 7, title: 'Classroom' },
        { num: 8, title: 'Assessments' },
      ],
    },
    {
      group: 'COMPLETE',
      items: [
        { num: 9, title: 'Reports' },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-rail text-white flex flex-col justify-between border-r border-[#262624] select-none h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-[#262624]">
          <XeIOLogo variant="dark" suffix="Assist" size="md" />
          <div className="text-[11px] text-[#A3A299] font-mono mt-0.5">Faculty workspace</div>
        </div>

        {/* Course Card */}
        <div className="p-4 border-b border-[#262624] bg-[#1A1A18]">
          <div className="text-[10px] font-mono text-[#73726B] uppercase tracking-wider mb-1">Course</div>
          <div className="font-semibold text-sm leading-tight text-white">
            {course.code ? `${course.code} ${course.title}` : 'Untitled Course (Setup Step 1)'}
          </div>
          <div className="text-xs text-[#A3A299] mt-0.5">
            {course.semester ? `${course.className} · ${course.semester}` : 'Configure course details'}
          </div>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-teal-tint">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
            <span>Status: {planStatus.toUpperCase()}</span>
          </div>
        </div>

        {/* 9 Steps Navigation */}
        <nav className="p-3 space-y-4">
          {steps.map((grp) => (
            <div key={grp.group}>
              <div className="text-[10px] font-mono text-[#73726B] uppercase px-2 mb-1.5 tracking-wider">
                {grp.group}
              </div>
              <ul className="space-y-0.5">
                {grp.items.map((item) => {
                  const isActive = currentStep === item.num;
                  return (
                    <li key={item.num}>
                      <button
                        onClick={() => onSelectStep(item.num)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-xs transition-colors ${
                          isActive
                            ? 'bg-[#262624] text-white font-medium'
                            : 'text-[#A3A299] hover:text-white hover:bg-[#1A1A18]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-4 font-mono text-[#73726B] text-[11px]">{item.num}</span>
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                              item.isTeal
                                ? 'bg-teal/20 text-teal-tint'
                                : 'bg-[#2A2926] text-[#A3A299]'
                            } ${item.isPulse ? 'animate-pulse' : ''}`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Branding & Actions */}
      <div className="p-4 border-t border-[#262624] space-y-3">
        <button
          onClick={onSignOut}
          className="w-full text-left text-xs text-[#A3A299] hover:text-white hover:underline"
        >
          Sign out
        </button>
        <div className="pt-2 border-t border-[#262624] flex items-center gap-1.5 text-[11px] text-[#73726B]">
          <span>by</span>
          <ElzeoLogo variant="dark" size="sm" showTagline={false} />
        </div>
      </div>
    </aside>
  );
};
