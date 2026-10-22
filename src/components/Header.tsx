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

/* Lerp helper */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

/* ─── Main Header Component ─── */
export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate }) => {
  const [scrollY, setScrollY]             = useState(0);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [logoTilt, setLogoTilt]           = useState({ x: 0, y: 0 }); // 3D tilt
  const [hoveredNav, setHoveredNav]       = useState<string | null>(null);
  const [ctaHover, setCtaHover]           = useState(false);
  const [ctaPressed, setCtaPressed]       = useState(false);

  const drawerRef         = useRef<HTMLDivElement>(null);
  const isNavigatingRef   = useRef<boolean>(false);
  const navLockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoRef           = useRef<HTMLButtonElement>(null);
  const itemRefs          = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorPos, setIndicatorPos] = useState<{ left: number; width: number } | null>(null);

  /* Header is always visible — no hide-on-scroll behavior by design. */

  /* ── Route & Scroll State: on subpages (like /studio), always keep consistent solid styling ── */
  const isSubpage    = currentRoute !== '/';
  const SCROLL_START = 20;
  const SCROLL_END   = 120;
  const scrollRatio  = Math.min(1, Math.max(0, (scrollY - SCROLL_START) / (SCROLL_END - SCROLL_START)));
  const rawProgress  = isSubpage ? 1 : scrollRatio;
  const paddingY     = isSubpage ? 10 : lerp(20, 10, scrollRatio);
  const isScrolled   = isSubpage || scrollRatio > 0.5;

  /* ── Capsule material (shared) ──
     Converges to SOLID frosted white as the page scrolls, so page content
     passing behind the fixed header (e.g. the hero badge pill) never bleeds
     through the glass — that see-through artifact looked like a ghost box
     overlapping the logo. Eased (^0.6) so it solidifies early in the scroll. */
  const capP          = Math.pow(rawProgress, 0.6);
  const capsuleFill   = `linear-gradient(180deg, rgba(255,255,255,${lerp(0.20, 0.97, capP).toFixed(3)}) 0%, rgba(241,245,249,${lerp(0.09, 0.92, capP).toFixed(3)}) 100%)`;
  const capsuleBorder = `1px solid rgba(${Math.round(lerp(255, 148, capP))}, ${Math.round(lerp(255, 163, capP))}, ${Math.round(lerp(255, 184, capP))}, ${lerp(0.28, 0.42, capP).toFixed(3)})`;
  const capsuleShadow = `inset 0 1px 0 rgba(255,255,255,${lerp(0.32, 0.95, capP).toFixed(3)}), inset 0 -1px 0 rgba(15,23,42,${lerp(0, 0.04, capP).toFixed(3)}), 0 1px 2px rgba(15,23,42,${lerp(0.12, 0.06, capP).toFixed(3)}), 0 6px 16px -6px rgba(15,23,42,${lerp(0.30, 0.14, capP).toFixed(3)}), 0 16px 32px -14px rgba(15,23,42,0.10)`;

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
    setLogoTilt({ x: dy * -6, y: dx * 7 });
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
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center p-1.5 shadow-sm overflow-hidden">
                  <img src="/favicon.png" alt="OsteoVision" className="w-full h-full object-contain" />
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
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  <span className="text-slate-600 text-[11px] font-medium">Model Available for Demo</span>
                </div>
                <span className="text-[#2563EB] font-mono font-semibold text-[11px]">ConvNeXt-Tiny · Illustrative</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MAIN HEADER â€” Smart Headroom + Floating Capsules
          â€¢ Always visible - no hide-on-scroll by design
          â€¢ Logo has 3D perspective tilt on hover
          â€¢ Subtitle is a static clinical caption
          â€¢ Nav items blur-to-sharp on hover
          â€¢ Hairline glass capsule, muted navy active pill
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <motion.header
        aria-label="Primary Navigation"
        className="print:hidden" 
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
        {/* Balanced 3-column row: logo left · nav perfectly centered · CTA right */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 xl:px-10 grid grid-cols-[auto_1fr_auto] items-center gap-4">

          {/* â”€â”€ LEFT: Logo with subtle 3D tilt + static caption â”€â”€ */}
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
              /* Sculpted glass capsule — solidifies on scroll, no bleed-through */
              background: capsuleFill,
              backdropFilter: 'blur(24px) saturate(150%)',
              WebkitBackdropFilter: 'blur(24px) saturate(150%)',
              border: capsuleBorder,
              boxShadow: capsuleShadow,
              transition: 'box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease',
            }}
          >
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              {/* Static refined icon tile — no looping glow pulse */}
              <div
                style={{
                  width: 36, height: 36,
                  borderRadius: 11,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isScrolled
                    ? 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(241,245,249,0.90) 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.14) 100%)',
                  border: isScrolled
                    ? '1px solid rgba(203, 213, 225, 0.8)'
                    : '1px solid rgba(255, 255, 255, 0.35)',
                  boxShadow: isScrolled
                    ? 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 6px rgba(15,23,42,0.08)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.40), 0 2px 6px rgba(0,0,0,0.18)',
                  padding: 5,
                  overflow: 'hidden',
                  transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <img src="/favicon.png" alt="OsteoVision" className="w-full h-full object-contain" />
              </div>
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

              {/* ── Static clinical caption — restrained, professional (no typewriter) ── */}
              <span
                className="text-[9.5px] font-semibold tracking-[0.14em] mt-1 uppercase leading-none"
                style={{
                  color: isScrolled ? '#64748B' : 'rgba(255,255,255,0.78)',
                  transition: 'color 0.2s ease',
                }}
              >
                Knee Radiograph · Explainable AI
              </span>
            </div>
          </motion.button>

          {/* ── CENTER: Nav Capsule — Ultra-Transparent iOS Glass ── */}
          <div className="relative pointer-events-auto hidden lg:block justify-self-center">
            <nav
              className="hdr-capsule flex items-center rounded-full relative"
              style={{
                padding: '6px',
                /* Realistic material: light from above; solidifies on scroll so
                   content passing behind the glass never bleeds through */
                background: capsuleFill,
                backdropFilter: 'blur(24px) saturate(150%)',
                WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                border: capsuleBorder,
                boxShadow: capsuleShadow,
              }}
              aria-label="Desktop Primary Navigation"
            >
              {/* Sliding Active Pill */}
              {indicatorPos && (
                <motion.div
                  className="absolute top-1.5 bottom-1.5 rounded-full z-0 pointer-events-none"
                  style={{
                    left: 0,
                    /* Raised machined navy slider: lit top face, grounded shadow */
                    background: 'linear-gradient(180deg, #24344E 0%, #0F172A 100%)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.25), 0 2px 5px rgba(15,23,42,0.35), 0 6px 14px -6px rgba(15,23,42,0.30)',
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
                    className="relative z-10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-normal cursor-pointer flex items-center gap-1.5 focus-visible:outline-none"
                    style={{
                      color: active
                        ? '#FFFFFF'
                        : isScrolled
                          ? '#334155'
                          : '#FFFFFF',
                      textShadow: !active && !isScrolled ? '0 1px 2px rgba(0,0,0,0.40)' : 'none',
                      background: hovered && !active
                        ? (isScrolled ? 'rgba(15, 23, 42, 0.05)' : 'rgba(255, 255, 255, 0.12)')
                        : 'transparent',
                      transition: 'color 0.2s ease, background 0.2s ease',
                    }}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ── RIGHT: CTA + Mobile trigger ── */}
          <div className="pointer-events-auto flex items-center gap-2.5 flex-shrink-0 justify-self-end">

            {/* Upload CTA — sculpted physical button: raised at rest, presses in on click */}
            <button
              id="header-upload-cta"
              onClick={handleUploadClick}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => { setCtaHover(false); setCtaPressed(false); }}
              onMouseDown={() => setCtaPressed(true)}
              onMouseUp={() => setCtaPressed(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs text-white cursor-pointer"
              style={{
                background: isScrolled
                  ? `linear-gradient(180deg, ${ctaHover ? '#2154D0' : '#2A5FE0'} 0%, ${ctaHover ? '#1E40AF' : '#1D4ED8'} 100%)`
                  : `linear-gradient(180deg, rgba(255,255,255,${ctaHover ? 0.28 : 0.22}) 0%, rgba(255,255,255,${ctaHover ? 0.16 : 0.11}) 100%)`,
                backdropFilter: 'blur(24px) saturate(150%)',
                WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                border: isScrolled
                  ? '1px solid rgba(255,255,255,0.16)'
                  : `1px solid rgba(255,255,255,${lerp(0.24, 0.36, rawProgress)})`,
                boxShadow: ctaPressed
                  ? 'inset 0 2px 5px rgba(10,20,45,0.45), inset 0 -1px 0 rgba(255,255,255,0.10), 0 1px 1px rgba(15,23,42,0.10)'
                  : isScrolled
                    ? 'inset 0 1px 0 rgba(255,255,255,0.24), 0 1px 2px rgba(15,23,42,0.25), 0 6px 14px -6px rgba(29,78,216,0.50)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.38), 0 2px 5px rgba(15,23,42,0.18), 0 8px 18px -8px rgba(15,23,42,0.32)',
                transform: ctaPressed ? 'translateY(1px)' : 'none',
                transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.15s ease, transform 0.1s ease',
              }}
              aria-label="Upload Knee X-Ray to AI Studio"
            >
              <UploadCloud size={14} />
              <span className="whitespace-nowrap">Upload Knee X-Ray</span>
              <ArrowRight size={13} />
            </button>

            {/* Mobile Trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
              style={{
                background: capsuleFill,
                backdropFilter: 'blur(24px) saturate(150%)',
                WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                border: capsuleBorder,
                boxShadow: capsuleShadow,
                color: isScrolled ? '#0F172A' : '#FFFFFF',
              }}
              aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="inline-flex"
                  >
                    <X size={17} />
                  </motion.span>
                </AnimatePresence>
              ) : (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key="m"
                    initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="inline-flex"
                  >
                    <Menu size={17} />
                  </motion.span>
                </AnimatePresence>
              )}
            </button>
          </div>

        </div>
      </motion.header>
    </>
  );
};

