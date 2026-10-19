import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Bone,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Activity,
  Layers,
  Cpu,
  Eye,
  ChevronRight,
  UploadCloud,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Types
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string, sectionId?: string) => void;
}

type NavItemType = {
  id: string;
  label: string;
  type: 'section' | 'route';
  target: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
};

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Navigation Config
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const NAV_ITEMS: NavItemType[] = [
  { id: 'home',        label: 'Home',              type: 'section', target: '',            icon: Activity },
  { id: 'services',    label: 'Diagnostic Output', type: 'section', target: 'services',    icon: Layers   },
  { id: 'about-us',    label: 'About OsteoVision', type: 'section', target: 'about-us',    icon: Eye      },
  { id: 'testimonial', label: 'Validation',        type: 'section', target: 'testimonial', icon: Sparkles },
  { id: 'contact',     label: 'Contact',           type: 'section', target: 'contact',     icon: Cpu      },
];

/* Clinical terminal ticker strings */
const TICKER_STRINGS = [
  'KNEE RADIOGRAPH ANALYSIS',
  'MODEL STATUS: ACTIVE â– ',
  'ROC-AUC: 94.2%',
  'TRABECULAR SCAN READY',
  '3-CLASS OUTPUT ENGINE',
  'OSTEOPOROSIS DETECTION',
];

/* Lerp helper */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   Clinical Terminal Ticker Hook
   Cycles through strings with typewriter effect
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function useTicker(strings: string[], speed = 45, pauseMs = 1800) {
  const [display, setDisplay] = useState('');
  const [cursor, setCursor]   = useState(true);
  const idxRef    = useRef(0);
  const charRef   = useRef(0);
  const phaseRef  = useRef<'typing' | 'pausing' | 'erasing'>('typing');
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const tick = () => {
      const str = strings[idxRef.current];

      if (phaseRef.current === 'typing') {
        charRef.current++;
        setDisplay(str.slice(0, charRef.current));
        if (charRef.current >= str.length) {
          phaseRef.current = 'pausing';
          timerRef.current = setTimeout(tick, pauseMs);
          return;
        }
      } else if (phaseRef.current === 'pausing') {
        phaseRef.current = 'erasing';
      } else {
        charRef.current--;
        setDisplay(str.slice(0, charRef.current));
        if (charRef.current <= 0) {
          idxRef.current = (idxRef.current + 1) % strings.length;
          phaseRef.current = 'typing';
          timerRef.current = setTimeout(tick, speed * 2);
          return;
        }
      }
      timerRef.current = setTimeout(tick, phaseRef.current === 'erasing' ? speed * 0.6 : speed);
    };

    timerRef.current = setTimeout(tick, speed);

    // Cursor blink
    const blinkInterval = setInterval(() => setCursor(c => !c), 530);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearInterval(blinkInterval);
    };
  }, [strings, speed, pauseMs]);

  return { display, cursor };
}

/* Isolated ticker — its ~24 state updates/sec re-render only this tiny span,
   never the whole 600-line header tree (major continuous CPU win). */
const TerminalTicker: React.FC<{ scrolled: boolean }> = ({ scrolled }) => {
  const { display, cursor } = useTicker(TICKER_STRINGS, 42, 1600);
  return (
    <span
      className="text-[9.5px] font-bold tracking-wider mt-1 uppercase leading-none font-mono"
      style={{
        color: scrolled ? '#334155' : 'rgba(255,255,255,0.85)',
        textShadow: !scrolled ? '0 1px 2px rgba(0,0,0,0.45)' : 'none',
        minWidth: '164px',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        transition: 'color 0.2s ease',
      }}
    >
      {display}
      <span
        style={{
          opacity: cursor ? 1 : 0,
          transition: 'opacity 0.1s',
          color: scrolled ? '#2563EB' : '#38BDF8',
          marginLeft: '1px',
        }}
      >
        |
      </span>
    </span>
  );
};

/* ─── Main Header Component ─── */
export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate }) => {
  const [scrollY, setScrollY]             = useState(0);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [logoTilt, setLogoTilt]           = useState({ x: 0, y: 0 }); // 3D tilt
  const [hoveredNav, setHoveredNav]       = useState<string | null>(null);

  const drawerRef         = useRef<HTMLDivElement>(null);
  const isNavigatingRef   = useRef<boolean>(false);
  const navLockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoRef           = useRef<HTMLButtonElement>(null);
  const itemRefs          = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorPos, setIndicatorPos] = useState<{ left: number; width: number } | null>(null);

  /* Terminal ticker state is isolated inside <TerminalTicker /> */

  /* ── Route & Scroll State: on subpages (like /studio), always keep consistent solid styling ── */
  const isSubpage    = currentRoute !== '/';
  const SCROLL_START = 20;
  const SCROLL_END   = 120;
  const scrollRatio  = Math.min(1, Math.max(0, (scrollY - SCROLL_START) / (SCROLL_END - SCROLL_START)));
  const rawProgress  = isSubpage ? 1 : scrollRatio;
  const paddingY     = isSubpage ? 10 : lerp(20, 10, scrollRatio);
  const isScrolled   = isSubpage || scrollRatio > 0.5;

  /* ── Scroll listener: rAF-throttled + clamped ──
     Header styling only varies within the first 120px, so scrollY state is
     clamped past that band — zero React re-renders fire during deep-page scroll. */
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const sy = window.scrollY ?? document.documentElement.scrollTop;
      setScrollY(Math.min(sy, SCROLL_END + 1));

      if (isNavigatingRef.current) return;

      if (currentRoute === '/') {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        if (sy + clientHeight >= scrollHeight - 120) { setActiveSection('contact'); return; }
        const sectionIds = ['contact', 'testimonial', 'about-us', 'services'];
        let matched = false;
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 260 && rect.bottom > 100) { setActiveSection(id); matched = true; break; }
          }
        }
        if (!matched && sy < 300) setActiveSection('home');
      }
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentRoute]);

  /* â”€â”€ Body scroll lock â”€â”€ */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
      window.addEventListener('keydown', onKey);
      return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen]);

  /* â”€â”€ Navigation dispatcher â”€â”€ */
  const handleItemClick = useCallback((item: NavItemType) => {
    setMobileOpen(false);
    isNavigatingRef.current = true;
    if (navLockTimeoutRef.current) clearTimeout(navLockTimeoutRef.current);
    navLockTimeoutRef.current = setTimeout(() => { isNavigatingRef.current = false; }, 700);

    if (item.type === 'section') {
      setActiveSection(item.id);
      if (item.id === 'home') {
        if (currentRoute === '/') window.scrollTo({ top: 0, behavior: 'instant' });
        else onNavigate('/');
      } else {
        if (currentRoute === '/') {
          const el = document.getElementById(item.target);
          if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'instant' });
        } else onNavigate('/', item.target);
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      onNavigate(item.target);
    }
  }, [currentRoute, onNavigate]);

  const handleUploadClick = useCallback(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    onNavigate('/studio');
  }, [onNavigate]);

  const isActive = (item: NavItemType): boolean => {
    if (currentRoute !== '/') return false;
    if (item.type === 'section') {
      if (item.id === 'home') return activeSection === 'home';
      return activeSection === item.id;
    }
    return false;
  };

  const activeItemId = currentRoute === '/' ? (NAV_ITEMS.find((item) => isActive(item))?.id || 'home') : null;

  /* ── Sliding indicator position ── */
  useEffect(() => {
    if (!activeItemId) {
      setIndicatorPos(null);
      return;
    }
    const updatePosition = () => {
      const activeEl = itemRefs.current[activeItemId];
      if (activeEl) setIndicatorPos({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
    };
    updatePosition();
    const raf = requestAnimationFrame(updatePosition);
    window.addEventListener('resize', updatePosition);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', updatePosition); };
  }, [activeItemId, currentRoute, activeSection]);

  /* â”€â”€ Logo 3D tilt on mouse move â”€â”€ */
  const handleLogoMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const el = logoRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setLogoTilt({ x: dy * -12, y: dx * 14 });
  }, []);

  const handleLogoMouseLeave = useCallback(() => {
    setLogoTilt({ x: 0, y: 0 });
  }, []);

  return (
    <>
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MOBILE BACKDROP
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MOBILE DRAWER
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-drawer"
            ref={drawerRef}
            id="mobile-navigation-drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30, mass: 0.8 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[min(340px,88vw)] bg-white/98 backdrop-blur-2xl border-l border-slate-200 flex flex-col shadow-[-16px_0_40px_rgba(15,23,42,0.12)] lg:hidden overflow-hidden"
            role="dialog" aria-modal="true" aria-label="Diagnostic Navigation"
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-slate-200 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#2563EB] shadow-sm">
                  <Bone size={17} className="-rotate-12" />
                </div>
                <div>
                  <span className="text-sm font-bold text-[#0F172A] tracking-tight leading-none">
                    Osteo<span className="text-[#2563EB]">Vision</span>
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">KNEE RADIOGRAPH ANALYSIS</p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
                aria-label="Close navigation drawer"
              >
                <X size={17} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6 space-y-2.5 relative z-10" aria-label="Mobile Navigation Menu">
              {NAV_ITEMS.map((item, i) => {
                const active = isActive(item);
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left cursor-pointer transition-all duration-200 border ${
                      active
                        ? 'bg-blue-50/80 border-blue-200 shadow-sm text-[#2563EB] font-semibold'
                        : 'bg-white border-slate-200/80 text-slate-600 hover:text-[#2563EB] hover:bg-slate-50 hover:border-slate-300'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-[#2563EB] text-white shadow-sm' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-sm font-semibold tracking-tight">{item.label}</span>
                    </div>
                    <ChevronRight size={15} className={active ? 'text-[#2563EB]' : 'text-slate-400'} />
                  </motion.button>
                );
              })}
              <div className="pt-4">
                <button
                  onClick={handleUploadClick}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl font-semibold text-sm text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] shadow-[0_8px_24px_rgba(37,99,235,0.18)] transition-all cursor-pointer"
                >
                  <UploadCloud size={17} />
                  <span>Launch Diagnostic Studio</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </nav>

            <div className="p-4 border-t border-slate-200 bg-slate-50 relative z-10">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 text-[11px] font-medium">Model Pipeline Active</span>
                </div>
                <span className="text-[#2563EB] font-mono font-semibold text-[11px]">94.2% ROC-AUC</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MAIN HEADER â€” Smart Headroom + Floating Capsules
          â€¢ Hides on scroll-down, springs back on scroll-up
          â€¢ Logo has 3D perspective tilt on hover
          â€¢ Subtitle is a typewriter clinical terminal ticker
          â€¢ Nav items blur-to-sharp on hover
          â€¢ Animated gradient border on nav capsule (scrolled)
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <motion.header
        aria-label="Primary Navigation"
        animate={{
          y: '0%',
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 36,
          mass: 0.7,
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          paddingTop:    `${paddingY}px`,
          paddingBottom: `${paddingY}px`,
          backgroundColor: 'transparent',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          boxShadow: 'none',
          willChange: 'transform, padding',
          pointerEvents: 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 xl:px-10 flex items-center justify-between gap-4">

          {/* â”€â”€ LEFT: Logo with 3D Tilt + Terminal Ticker â”€â”€ */}
          <motion.button
            ref={logoRef}
            onClick={() => handleItemClick(NAV_ITEMS[0])}
            onMouseMove={handleLogoMouseMove}
            onMouseLeave={handleLogoMouseLeave}
            className="pointer-events-auto flex items-center gap-3 group cursor-pointer focus-visible:outline-none flex-shrink-0"
            aria-label="OsteoVision Homepage"
            animate={{
              rotateX: logoTilt.x,
              rotateY: logoTilt.y,
            }}
            transition={{ type: 'spring', stiffness: 280, damping: 18, mass: 0.5 }}
            style={{
              padding: '7px 18px 7px 10px',
              borderRadius: '9999px',
              transformStyle: 'preserve-3d',
              perspective: '600px',
              /* Ultra-transparent iOS liquid glass */
              background: isSubpage
                ? 'rgba(255, 255, 255, 0.65)'
                : `rgba(255,255,255,${lerp(0.12, 0.22, rawProgress)})`,
              backdropFilter: 'blur(30px) saturate(190%)',
              WebkitBackdropFilter: 'blur(30px) saturate(190%)',
              border: isSubpage
                ? '1px solid rgba(226, 232, 240, 0.90)'
                : `1px solid rgba(255,255,255,${lerp(0.28, 0.40, rawProgress)})`,
              boxShadow: isSubpage
                ? '0 8px 30px rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                : `0 8px 32px rgba(15,23,42,${lerp(0.03, 0.06, rawProgress)}), inset 0 1px 0 rgba(255,255,255,0.45)`,
              transition: 'box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              {/* Icon container with X-ray glow */}
              <motion.div
                animate={{
                  boxShadow: isScrolled
                    ? [
                        '0 0 0px 0px rgba(37,99,235,0)',
                        '0 0 14px 3px rgba(37,99,235,0.35)',
                        '0 0 0px 0px rgba(37,99,235,0)',
                      ]
                    : [
                        '0 0 0px 0px rgba(147,197,253,0)',
                        '0 0 18px 4px rgba(147,197,253,0.4)',
                        '0 0 0px 0px rgba(147,197,253,0)',
                      ],
                }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                style={{
                  width: 34, height: 34,
                  borderRadius: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isScrolled
                    ? 'rgba(37, 99, 235, 0.12)'
                    : 'rgba(255, 255, 255, 0.18)',
                  border: isScrolled
                    ? '1px solid rgba(37, 99, 235, 0.28)'
                    : '1px solid rgba(255, 255, 255, 0.38)',
                  color: isScrolled ? '#2563EB' : '#FFFFFF',
                  transition: 'color 0.2s ease, background 0.2s ease, border-color 0.2s ease',
                }}
              >
                <Bone size={17} className="-rotate-12" />
              </motion.div>
              {/* Live pulse dot */}
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"
                style={{ boxShadow: '0 0 8px #2563eb' }}
              />
            </div>

            <div className="flex flex-col text-left">
              {/* Brand name — high contrast bold */}
              <span
                className="font-extrabold text-base tracking-tight leading-none"
                style={{
                  color: isScrolled ? '#0F172A' : '#FFFFFF',
                  transition: 'color 0.2s ease',
                  textShadow: !isScrolled ? '0 1px 3px rgba(0,0,0,0.55)' : 'none',
                }}
              >
                Osteo<span style={{ color: isScrolled ? '#2563EB' : '#38BDF8' }}>Vision</span>
              </span>

              {/* ── CLINICAL TERMINAL TICKER — isolated component, see TerminalTicker ── */}
              <TerminalTicker scrolled={isScrolled} />
            </div>
          </motion.button>

          {/* ── CENTER: Nav Capsule — Ultra-Transparent iOS Glass ── */}
          <div className="relative pointer-events-auto hidden lg:block">
            <nav
              className="flex items-center rounded-full relative overflow-hidden"
              style={{
                padding: '6px',
                background: isSubpage
                  ? 'rgba(255, 255, 255, 0.65)'
                  : `rgba(255,255,255,${lerp(0.12, 0.22, rawProgress)})`,
                backdropFilter: 'blur(30px) saturate(190%)',
                WebkitBackdropFilter: 'blur(30px) saturate(190%)',
                border: isSubpage
                  ? '1px solid rgba(226, 232, 240, 0.90)'
                  : `1px solid rgba(255,255,255,${lerp(0.28, 0.40, rawProgress)})`,
                boxShadow: isSubpage
                  ? '0 8px 30px rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  : `0 8px 32px rgba(15,23,42,${lerp(0.03, 0.06, rawProgress)}), inset 0 1px 0 rgba(255,255,255,0.45)`,
              }}
              aria-label="Desktop Primary Navigation"
            >
              {/* Sliding Active Pill */}
              {indicatorPos && (
                <motion.div
                  className="absolute top-1.5 bottom-1.5 rounded-full bg-[#2563EB] z-0 pointer-events-none"
                  style={{
                    left: 0,
                    boxShadow: '0 4px 14px rgba(37,99,235,0.38), inset 0 1px 0 rgba(255,255,255,0.35)',
                  }}
                  initial={false}
                  animate={{ x: indicatorPos.left, width: indicatorPos.width }}
                  transition={{ type: 'spring', stiffness: 480, damping: 36, mass: 0.7 }}
                />
              )}

              {NAV_ITEMS.map((item) => {
                const active  = isActive(item);
                const hovered = hoveredNav === item.id;

                return (
                  <button
                    key={item.id}
                    ref={(el) => { itemRefs.current[item.id] = el; }}
                    onClick={() => handleItemClick(item)}
                    onMouseEnter={() => setHoveredNav(item.id)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className="relative z-10 px-4 py-1.5 rounded-full text-xs font-bold tracking-normal cursor-pointer flex items-center gap-1.5 focus-visible:outline-none"
                    style={{
                      color: active
                        ? '#FFFFFF'
                        : isScrolled
                          ? '#0F172A'
                          : '#FFFFFF',
                      textShadow: !active && !isScrolled ? '0 1px 3px rgba(0,0,0,0.55)' : 'none',
                      transform: hovered && !active ? 'scale(1.05)' : 'scale(1)',
                      transition: 'color 0.2s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ── RIGHT: Status + CTA + Mobile trigger ── */}
          <div className="pointer-events-auto flex items-center gap-2.5 flex-shrink-0">

            {/* Status capsule — Ultra-Transparent iOS glass */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold"
              style={{
                background: isSubpage
                  ? 'rgba(255, 255, 255, 0.65)'
                  : `rgba(255,255,255,${lerp(0.12, 0.22, rawProgress)})`,
                backdropFilter: 'blur(30px) saturate(190%)',
                WebkitBackdropFilter: 'blur(30px) saturate(190%)',
                border: isSubpage
                  ? '1px solid rgba(226, 232, 240, 0.90)'
                  : `1px solid rgba(255,255,255,${lerp(0.28, 0.40, rawProgress)})`,
                boxShadow: isSubpage
                  ? '0 8px 30px rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  : `0 8px 32px rgba(15,23,42,${lerp(0.03, 0.06, rawProgress)}), inset 0 1px 0 rgba(255,255,255,0.45)`,
                color: isScrolled ? '#0F172A' : '#FFFFFF',
                textShadow: !isScrolled ? '0 1px 3px rgba(0,0,0,0.45)' : 'none',
              }}
            >
              {/* Pulsing green dot */}
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" style={{ boxShadow: '0 0 6px #10b981' }} />
              </span>
              <span className="font-mono tracking-wide">Knee System Active</span>
            </div>

            {/* Upload CTA */}
            <motion.button
              id="header-upload-cta"
              onClick={handleUploadClick}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs text-white cursor-pointer overflow-hidden"
              style={{
                background: isScrolled
                  ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                  : 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(30px) saturate(190%)',
                WebkitBackdropFilter: 'blur(30px) saturate(190%)',
                border: isScrolled
                  ? '1px solid rgba(255,255,255,0.35)'
                  : '1px solid rgba(255,255,255,0.40)',
                boxShadow: isScrolled
                  ? '0 8px 24px rgba(37,99,235,0.32), inset 0 1px 0 rgba(255,255,255,0.35)'
                  : '0 8px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.45)',
              }}
              aria-label="Upload Knee X-Ray to AI Studio"
            >
              {/* Shimmer sweep */}
              <span
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
                  transform: 'skewX(-20deg) translateX(-120%)',
                  animation: 'ctaShimmer 2.8s ease-in-out infinite',
                }}
              />
              <UploadCloud size={14} />
              <span className="whitespace-nowrap font-semibold">Upload Knee X-Ray</span>
              <ArrowRight size={13} />
            </motion.button>

            {/* Mobile Trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
              style={{
                background: isSubpage
                  ? 'rgba(255, 255, 255, 0.65)'
                  : `rgba(255,255,255,${lerp(0.12, 0.22, rawProgress)})`,
                backdropFilter: 'blur(30px) saturate(190%)',
                WebkitBackdropFilter: 'blur(30px) saturate(190%)',
                border: isSubpage
                  ? '1px solid rgba(226, 232, 240, 0.90)'
                  : `1px solid rgba(255,255,255,${lerp(0.28, 0.40, rawProgress)})`,
                boxShadow: isSubpage
                  ? '0 8px 30px rgba(15, 23, 42, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                  : `0 8px 32px rgba(15,23,42,${lerp(0.03, 0.06, rawProgress)}), inset 0 1px 0 rgba(255,255,255,0.45)`,
                color: isScrolled ? '#0F172A' : '#FFFFFF',
              }}
              aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>

        </div>
      </motion.header>
    </>
  );
};

