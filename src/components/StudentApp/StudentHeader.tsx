import React from 'react';
import { useApp } from '../../context/AppContext';
import { XeIOLogo, ElzeoLogo } from '../Brand';

interface StudentHeaderProps {
  currentTab: 'home' | 'classroom' | 'lab' | 'labfile' | 'endsem';
  onSelectTab: (tab: 'home' | 'classroom' | 'lab' | 'labfile' | 'endsem') => void;
  onSignOut: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  currentTab,
  onSelectTab,
  onSignOut,
}) => {
  const { currentUser } = useApp();

  const tabs: { key: 'home' | 'classroom' | 'lab' | 'labfile' | 'endsem'; label: string; badge?: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'classroom', label: 'Classroom' },
    { key: 'lab', label: "Today's lab", badge: 'Live' },
    { key: 'labfile', label: 'Lab file' },
    { key: 'endsem', label: 'End-sem practical' },
  ];

  return (
    <header className="h-14 bg-rail text-white px-6 flex items-center justify-between border-b border-[#262624] select-none sticky top-0 z-30">
      {/* Left: XeIO + Elzeo */}
      <div className="flex items-center gap-4">
        <XeIOLogo variant="dark" size="md" />
        <span className="text-[#3A3935]">|</span>
        <ElzeoLogo variant="dark" size="sm" showTagline={false} />
      </div>

      {/* Middle: Navigation Tabs */}
      <nav className="flex items-center gap-1 font-mono text-xs">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`px-3 py-1.5 rounded-[4px] transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#262624] text-white font-medium'
                  : 'text-[#A3A299] hover:text-white hover:bg-[#1A1A18]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right: Student Profile & Switcher */}
      <div className="flex items-center gap-3 text-xs font-mono">
        <span className="text-[#A3A299]">
          {currentUser.name} {currentUser.roll_number ? <>· <strong className="text-white">{currentUser.roll_number}</strong></> : null}
        </span>
        <span className="text-[#3A3935]">|</span>
        <button
          onClick={onSignOut}
          className="text-[#A3A299] hover:text-white hover:underline text-[11px]"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};
