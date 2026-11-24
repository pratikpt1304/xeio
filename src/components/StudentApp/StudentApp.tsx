import React, { useState } from 'react';
import { StudentHeader } from './StudentHeader';
import { StudentHome } from './StudentHome';
import { StudentClassroom } from './StudentClassroom';
import { StudentLabIDE } from './StudentLabIDE';
import { StudentLabFile } from './StudentLabFile';
import { StudentEndSem } from './StudentEndSem';
import { FooterBranding } from '../Brand';

interface StudentAppProps {
  onSignOut: () => void;
}

export const StudentApp: React.FC<StudentAppProps> = ({
  onSignOut,
}) => {
  const [currentTab, setCurrentTab] = useState<'home' | 'classroom' | 'lab' | 'labfile' | 'endsem'>('home');

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      {/* Dark Student Header */}
      <StudentHeader
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onSignOut={onSignOut}
      />

      {/* Main Tab View */}
      <main className="flex-1">
        {currentTab === 'home' && <StudentHome onGoToLab={() => setCurrentTab('lab')} />}
        {currentTab === 'classroom' && <StudentClassroom />}
        {currentTab === 'lab' && <StudentLabIDE />}
        {currentTab === 'labfile' && <StudentLabFile />}
        {currentTab === 'endsem' && <StudentEndSem />}
      </main>

      {/* Footer Branding (unless in full-screen IDE) */}
      {currentTab !== 'lab' && <FooterBranding />}
    </div>
  );
};
