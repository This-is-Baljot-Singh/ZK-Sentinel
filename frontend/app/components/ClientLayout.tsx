'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppContext } from '../context/AppContext';
import { LandingPage } from './LandingPage';

import { FloatingNav } from './FloatingNav';
import { Login } from './Login';
import { Signup } from './Signup';
import { Dashboard } from './Dashboard';
import { Documents } from './Documents';
import { VoiceInterview } from './VoiceInterview';
import { Activity } from './Activity';
import { Settings } from './Settings';

type NavItem = 'home' | 'voice' |'documents'| 'activity' | 'settings';

export default function ClientLayout() {
  const { state, setHasLaunched } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();


  const getActiveItem = (path: string): NavItem => {
    switch (path) {
      case '/': return 'home';
      case '/documents': return 'documents';
      case '/voice': return 'voice';
      case '/activity': return 'activity';
      
      case '/settings': return 'settings';
      default: return 'home';
    }
  };

  const handleNavigate = useCallback((item: NavItem) => {
    switch (item) {
      case 'home': router.push('/'); break;
      case 'documents': router.push('/documents'); break;
      case 'voice': router.push('/voice'); break;
      case 'activity': router.push('/activity'); break;
      case 'settings': router.push('/settings'); break;
    }
  }, [router]);

  if (!state.hasLaunched) {
    return <LandingPage onLaunch={() => setHasLaunched(true)} />;
  }

  // Auth Checks
  if (!state.isAuthenticated) {
     if (pathname === '/signup') return <Signup />;
     return <Login />;
  }

  // Authenticated Views
  const renderContent = () => {
    switch (pathname) {
      case '/': return <Dashboard />;
      case '/documents': return <Documents />;
      case '/voice': return <VoiceInterview />;
      case '/activity': return <Activity />;
      case '/settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      {renderContent()}
      <FloatingNav activeItem={getActiveItem(pathname)} onNavigate={handleNavigate} />
    </>
  );
}
