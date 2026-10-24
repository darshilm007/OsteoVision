import React, { useEffect, useState, useCallback } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { StudioPage } from './pages/StudioPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { useInteractiveEffects } from './components/InteractiveEffects';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { PageTransition } from './components/PageTransition';

/* ─────────────────────────────────────────────
   Main App — Client-Side Routing
───────────────────────────────────────────── */
export default function App() {
  useInteractiveEffects();

  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const p = window.location.pathname;
    if (p === '/about' || p === '/studio' || p === '/privacy') return p;
    return '/';
  });
  const [targetSection, setTargetSection] = useState<string | null>(null);
  const [navKey, setNavKey]               = useState<number>(0);

  // Sync with browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === '/about' || p === '/studio' || p === '/privacy') {
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

  // Render the page for a given route key. PageTransition calls this with the
  // key it currently has mounted (displayKey), so the outgoing page keeps
  // rendering while it animates out.
  const renderPage = useCallback(
    (key: string) => {
      if (key === '/about') return <AboutPage onNavigate={handleNavigate} />;
      if (key === '/studio') return <StudioPage onNavigate={handleNavigate} />;
      if (key === '/privacy') return <PrivacyPage onNavigate={handleNavigate} />;
      return (
        <HomePage
          onOpenUpload={() => handleNavigate('/studio')}
          onNavigate={handleNavigate}
          targetSection={targetSection}
          navKey={navKey}
        />
      );
    },
    [handleNavigate, targetSection, navKey],
  );

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#0F172A] relative font-sans">

      {/* Global page-scroll progress indicator */}
      <ScrollProgressBar />

      {/* Global Header — fixed, transparent at top, collapses on scroll */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />

      {/* Page Views — cinematic direction-aware transitions */}
      <main className="relative">
        <PageTransition routeKey={currentRoute} renderPage={renderPage} />
      </main>
    </div>
  );
}
