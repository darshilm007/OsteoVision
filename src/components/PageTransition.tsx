import React, { useEffect, useRef, useState } from 'react';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Order is used only to infer navigation direction (forward vs back) so the
   slide reads as a spatial journey rather than a random flicker. */
const ROUTE_ORDER: Record<string, number> = {
  '/': 0,
  '/about': 1,
  '/studio': 2,
  '/privacy': 3,
};

const EXIT_MS = 200;
const ENTER_MS = 440;

/* ─────────────────────────────────────────────
   PageTransition — cinematic direction-aware swap between routes.
   Owns a single source of truth for what page is visible (displayKey),
   so the OLD page can animate out before the NEW page animates in.
   App passes a pure renderPage(key) so we can render by displayKey, not
   by the just-changed currentRoute.
───────────────────────────────────────────── */
export const PageTransition: React.FC<{
  routeKey: string;
  renderPage: (key: string) => React.ReactNode;
}> = ({ routeKey, renderPage }) => {
  const reduced = useRef(prefersReduced());
  const [displayKey, setDisplayKey] = useState(routeKey);
  const [phase, setPhase] = useState<'idle' | 'exit'>('idle');
  const [dir, setDir] = useState<1 | -1>(1);
  // Once the enter animation has played for the current page, we drop the
  // animation style entirely — a lingering fill:"both" would keep a transform
  // + filter on the page ancestor and silently break sticky/GSAP pinning below it.
  const [enteredKey, setEnteredKey] = useState<string | null>(null);
  const prevRef = useRef(routeKey);
  const timer = useRef<number>(0);

  useEffect(() => {
    if (routeKey === prevRef.current) return;

    const from = ROUTE_ORDER[prevRef.current] ?? 0;
    const to = ROUTE_ORDER[routeKey] ?? 0;
    const nextDir: 1 | -1 = to >= from ? 1 : -1;
    setDir(nextDir);
    prevRef.current = routeKey;

    // Reduced-motion (or unknown support): swap instantly, no animation.
    if (reduced.current) {
      setDisplayKey(routeKey);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      return;
    }

    // Animate old page out, then mount the new one and scroll to top.
    setPhase('exit');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setDisplayKey(routeKey);
      setPhase('idle');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, EXIT_MS);

    return () => window.clearTimeout(timer.current);
  }, [routeKey]);

  let style: React.CSSProperties;
  if (reduced.current) {
    style = {};
  } else if (phase === 'exit') {
    style = {
      animation: `ovPageExit ${EXIT_MS}ms cubic-bezier(0.4, 0, 0.2, 1) both`,
      ['--ov-exit-y' as string]: `${dir === 1 ? -10 : 10}px`,
    } as React.CSSProperties;
  } else if (enteredKey === displayKey) {
    // Enter animation already played for this page — clean ancestor.
    style = {};
  } else {
    style = {
      animation: `ovPageEnter ${ENTER_MS}ms cubic-bezier(0.16, 1, 0.3, 1) both`,
      ['--ov-enter-y' as string]: `${dir === 1 ? 18 : -18}px`,
    } as React.CSSProperties;
  }

  // Keyed by displayKey so each swap remounts and replays the enter animation.
  return (
    <div
      key={displayKey}
      style={style}
      onAnimationEnd={(e) => {
        // Only react to this wrapper's own animation, not bubbled child ones.
        if (e.target === e.currentTarget && phase === 'idle') {
          setEnteredKey(displayKey);
        }
      }}
    >
      {renderPage(displayKey)}
    </div>
  );
};
