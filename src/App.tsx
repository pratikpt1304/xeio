import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SignInScreen } from './components/SignInScreen';
import { FacultyWorkspace } from './components/FacultyWorkspace/FacultyWorkspace';
import { StudentApp } from './components/StudentApp/StudentApp';
import { HODConsole } from './components/Oversight/HODConsole';
import { OversightConsole } from './components/Oversight/OversightConsole';
import { SuperAdminConsole } from './components/Admin/SuperAdminConsole';

const AppContent: React.FC = () => {
  const { currentUser, switchRole } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  if (!isAuthenticated) {
    return <SignInScreen onSignIn={() => setIsAuthenticated(true)} />;
  }

  const renderCurrentRoleView = () => {
    switch (currentUser.activeRole) {
      case 'faculty':
        return (
          <FacultyWorkspace
            onPreviewAsStudent={() => switchRole('student')}
            onSignOut={() => setIsAuthenticated(false)}
          />
        );
      case 'student':
        return (
          <StudentApp
            onSwitchToFaculty={() => switchRole('faculty')}
            onSignOut={() => setIsAuthenticated(false)}
          />
        );
      case 'hod':
        return <HODConsole onSignOut={() => setIsAuthenticated(false)} />;
      case 'dean':
      case 'coe':
      case 'vc':
        return <OversightConsole role={currentUser.activeRole} onSignOut={() => setIsAuthenticated(false)} />;
      case 'super_admin':
        return <SuperAdminConsole onSignOut={() => setIsAuthenticated(false)} />;
      default:
        return (
          <FacultyWorkspace
            onPreviewAsStudent={() => switchRole('student')}
            onSignOut={() => setIsAuthenticated(false)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Role-Specific Scoped Workspace */}
      <div className="flex-1">
        {renderCurrentRoleView()}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
