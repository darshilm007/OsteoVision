import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { StudioPage } from './pages/StudioPage';

/* ─────────────────────────────────────────────
   Main App — Client-Side Routing
───────────────────────────────────────────── */
export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const p = window.location.pathname;
    if (p === '/about' || p === '/studio') return p;
    return '/';
  });
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const [navKey, setNavKey]               = useState<number>(0);

  // Sync with browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === '/about' || p === '/studio') {
        setCurrentRoute(p);
      } else {
        setCurrentRoute('/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Client-side navigation handler — automatically scroll to top when changing page
  const handleNavigate = useCallback((route: string, sectionId?: string) => {
    window.history.pushState({}, '', route);
    setTargetSection(sectionId ?? null);
    setNavKey(Date.now());
    setCurrentRoute(route);
    if (!sectionId) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  // Guarantee scroll-to-top whenever route changes without a specific section target
  useEffect(() => {
    if (!targetSection) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [currentRoute, targetSection]);

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0F172A] relative font-sans">

      {/* Global Header — fixed, transparent at top, collapses on scroll */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        scrollProgress={0}
      />

      {/* Page Views */}
      <main className="relative z-10">
        {currentRoute === '/' && (
          <HomePage
            onOpenUpload={() => handleNavigate('/studio')}
            onNavigate={handleNavigate}
            targetSection={targetSection}
            navKey={navKey}
          />
        )}

        {currentRoute === '/about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentRoute === '/studio' && (
          <StudioPage onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}
