import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SignInScreen } from './components/SignInScreen';
import { FacultyWorkspace } from './components/FacultyWorkspace/FacultyWorkspace';
import { StudentApp } from './components/StudentApp/StudentApp';
import { HODConsole } from './components/Oversight/HODConsole';
import { OversightConsole } from './components/Oversight/OversightConsole';
import { SuperAdminConsole } from './components/Admin/SuperAdminConsole';
import { supabase } from './lib/supabase';

const AppContent: React.FC = () => {
  const { currentUser, switchRole } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}

    // Check existing Supabase session on startup
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          const role = (session.user.user_metadata?.role as any) || 'faculty';
          switchRole(role);
        }
        setIsInitializing(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsInitializing(false);
    }
  }, []);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-muted uppercase tracking-wider">Verifying Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignInScreen onSignIn={() => setIsAuthenticated(true)} />;
  }

  const renderCurrentRoleView = () => {
    switch (currentUser.activeRole) {
      case 'faculty':
        return (
          <FacultyWorkspace
            onPreviewAsStudent={() => switchRole('student')}
            onSignOut={handleSignOut}
          />
        );
      case 'student':
        return (
          <StudentApp
            onSwitchToFaculty={() => switchRole('faculty')}
            onSignOut={handleSignOut}
          />
        );
      case 'hod':
        return <HODConsole onSignOut={handleSignOut} />;
      case 'dean':
      case 'coe':
      case 'vc':
        return <OversightConsole role={currentUser.activeRole} onSignOut={handleSignOut} />;
      case 'super_admin':
        return <SuperAdminConsole onSignOut={handleSignOut} />;
      default:
        return (
          <FacultyWorkspace
            onPreviewAsStudent={() => switchRole('student')}
            onSignOut={handleSignOut}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
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
