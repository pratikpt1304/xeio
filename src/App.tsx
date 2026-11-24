import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/Landing/LandingPage';
import { SignInScreen } from './components/SignInScreen';
import { FacultyWorkspace } from './components/FacultyWorkspace/FacultyWorkspace';
import { StudentApp } from './components/StudentApp/StudentApp';
import { HODConsole } from './components/Oversight/HODConsole';
import { OversightConsole } from './components/Oversight/OversightConsole';
import { SuperAdminConsole } from './components/Admin/SuperAdminConsole';
import { supabase } from './lib/supabase';
import { Globe } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, switchRole } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('xeio_authenticated') === 'true';
  });

  // View mode: 'landing' (default on fresh visit) | 'signin' | 'app' (workspace)
  const [viewMode, setViewMode] = useState<'landing' | 'signin' | 'app'>(() => {
    const isAuth = localStorage.getItem('xeio_authenticated') === 'true';
    const activeView = sessionStorage.getItem('xeio_view_mode');

    // If user was actively inside workspace and refreshed (F5), STAY in workspace!
    if (isAuth && activeView === 'app') {
      return 'app';
    }
    if (window.location.hash.includes('app') || window.location.pathname.startsWith('/app')) {
      return isAuth ? 'app' : 'signin';
    }
    if (window.location.hash.includes('login') || window.location.pathname.startsWith('/login')) {
      return 'signin';
    }
    return 'landing';
  });

  const updateViewMode = (mode: 'landing' | 'signin' | 'app') => {
    sessionStorage.setItem('xeio_view_mode', mode);
    setViewMode(mode);
  };

  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    // Restore persistent session from localStorage
    const savedAuth = localStorage.getItem('xeio_authenticated');
    const savedRole = localStorage.getItem('xeio_active_role') as any;

    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      if (savedRole) {
        switchRole(savedRole);
      }
    }

    // Check existing Supabase session on startup
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setIsAuthenticated(true);
          const role = (session.user.user_metadata?.role as any) || savedRole || 'faculty';
          switchRole(role);
          localStorage.setItem('xeio_authenticated', 'true');
          localStorage.setItem('xeio_active_role', role);
        }
        setIsInitializing(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          localStorage.setItem('xeio_authenticated', 'true');
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          updateViewMode('landing');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsInitializing(false);
    }
  }, []);

  const handleSignIn = (role?: any) => {
    localStorage.setItem('xeio_authenticated', 'true');
    if (role) {
      localStorage.setItem('xeio_active_role', role);
      switchRole(role);
    }
    setIsAuthenticated(true);
    updateViewMode('app');
  };

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsAuthenticated(false);
    updateViewMode('landing');
    if (window.location.hash) {
      window.location.hash = '';
    }
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
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

  // 1. Landing Page View (ALWAYS DEFAULT on root /)
  if (viewMode === 'landing') {
    return (
      <LandingPage
        isAuthenticated={isAuthenticated}
        userRole={currentUser.activeRole ? currentUser.activeRole.toUpperCase() : 'Faculty'}
        onSignInClick={() => {
          if (isAuthenticated) {
            updateViewMode('app');
          } else {
            updateViewMode('signin');
          }
        }}
      />
    );
  }

  // 2. Sign In Screen View
  if (!isAuthenticated || viewMode === 'signin') {
    return (
      <SignInScreen
        onSignIn={handleSignIn}
        onBackToLanding={() => updateViewMode('landing')}
      />
    );
  }

  // 3. Authenticated App Workspaces View
  const renderCurrentRoleView = () => {
    switch (currentUser.activeRole) {
      case 'faculty':
        return <FacultyWorkspace onSignOut={handleSignOut} />;
      case 'student':
        return <StudentApp onSignOut={handleSignOut} />;
      case 'hod':
        return <HODConsole onSignOut={handleSignOut} />;
      case 'dean':
      case 'coe':
      case 'vc':
        return <OversightConsole role={currentUser.activeRole} onSignOut={handleSignOut} />;
      case 'super_admin':
        return <SuperAdminConsole onSignOut={handleSignOut} />;
      default:
        return <FacultyWorkspace onSignOut={handleSignOut} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      {/* Floating shortcut to return to landing page */}
      <button
        onClick={() => updateViewMode('landing')}
        title="View XeIO Public Landing Page"
        className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 bg-[#141413] text-white hover:bg-[#262624] text-[11px] font-mono rounded-full border border-[#2E2E2C] shadow-lg transition-transform hover:scale-105"
      >
        <Globe size={13} className="text-teal" />
        <span>Public Landing Page</span>
      </button>

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
