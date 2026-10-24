import React, { useEffect, useRef, useState } from 'react';
import { CountUp } from './CountUp';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────────
   HeroStatsBand — a slim implementation-overview strip that sits right
   below the hero. Numbers count up only when the band scrolls into view.

   CONTENT INTEGRITY: every cell is a descriptive fact about the current
   implementation (architecture / output format), NOT a clinical
   performance or accuracy metric. No fabricated benchmarks.
───────────────────────────────────────────── */
type Cell =
  | {
      kind: 'count';
      target: number;
      decimals?: number;
      prefix?: string;
      suffix?: string;
      label: string;
      sub: string;
    }
  | { kind: 'text'; value: string; label: string; sub: string };

const CELLS: Cell[] = [
  {
    kind: 'count',
    target: 3,
    label: 'Diagnostic Classes',
    sub: 'Normal · Osteopenia · Osteoporosis',
  },
  {
    kind: 'count',
    target: 100,
    suffix: ' pt',
    label: 'Score Readout',
    sub: '0–100 confidence scale per image',
  },
  {
    kind: 'text',
    value: 'Deep Neural AI',
    label: 'Analysis Engine',
    sub: 'Automated radiographic screening',
  },
  {
    kind: 'text',
    value: 'Grad-CAM++',
    label: 'Visual Explanation',
    sub: 'Generated where supported',
  },
];

export const HeroStatsBand: React.FC = () => {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const reduce = prefersReduced();

  useEffect(() => {
    if (reduce) {
      setInView(true);
      setStarted(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      setStarted(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            setStarted(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduce]);

  return (
    <section
      ref={ref}
      aria-label="Implementation overview"
      className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-3.5 sm:px-6 xl:px-10 2xl:px-12 relative z-10 py-8 sm:py-10 md:py-12"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
        {CELLS.map((c, i) => {
          const enter = reduce
            ? ''
            : `${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'} transition-all duration-500`;
          return (
            <div
              key={c.label}
              className={`bg-white px-3.5 sm:px-6 py-4 sm:py-6 flex flex-col justify-center ${enter}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className={`font-extrabold text-[#2563EB] font-mono tracking-tight mb-1 leading-none whitespace-nowrap ${
                  c.kind === 'count'
                    ? 'text-2xl sm:text-3xl lg:text-4xl'
                    : 'text-sm sm:text-base lg:text-xl truncate'
                }`}
              >
                {c.kind === 'count' ? (
                  <CountUp
                    value={started ? c.target : 0}
                    decimals={c.decimals ?? 0}
                    prefix={c.prefix ?? ''}
                    suffix={c.suffix ?? ''}
                  />
                ) : (
                  c.value
                )}
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-0.5 truncate">
                {c.label}
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#64748B] leading-snug line-clamp-2">
                {c.sub}
              </p>
            </div>
          );
        })}
      </div>
      <p className="text-center text-[11px] text-[#94A3B8] mt-3">
        Descriptive facts about the current implementation — not clinical performance or accuracy metrics.
      </p>
    </section>
  );
};
