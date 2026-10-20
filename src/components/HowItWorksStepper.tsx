import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Upload, ShieldCheck, Cpu, ScanLine, Flame, FileText, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface HowItWorksStep {
  num: string;
  title: string;
  body: string;
}

/* Icon per pipeline step (index-matched to HOW_IT_WORKS_STEPS) */
const STEP_ICONS = [Upload, ShieldCheck, Cpu, ScanLine, Flame, FileText];

/* Real project assets — the film on the light box is the actual product output */
const FILM_SRC = '/frames/frame_000100.jpg';
const HEATMAP_SRC = '/frames/frame_000299.jpg';

/* Sample class chips (illustrative — matches the 3-class model output) */
const CLASS_CHIPS = [
  { label: 'Normal', tone: '#22c55e' },
  { label: 'Osteopenia', tone: '#f59e0b' },
  { label: 'Osteoporosis', tone: '#ef4444' },
];

/* ─────────────────────────────────────────────
   HowItWorksStepper — Split-Film Manipulation
   Left:  step text + live pipeline status rail
   Right: a knee X-ray film on a dark light box that
   physically reacts to each step —
     01 film drops into the box        02 green ROI brackets snap on
     03 scan beam + pixel shimmer      04 class chips lock the prediction
     05 Grad-CAM heatmap blooms        06 report card slides out
   Scroll-driven state machine; overlays are cumulative like a real read.
   Mobile / reduced-motion: static tactile card grid.
───────────────────────────────────────────── */
export const HowItWorksStepper: React.FC<{ steps: HowItWorksStep[] }> = ({ steps }) => {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<'desktop' | 'stack'>('stack');
  const containerRef = useRef<HTMLDivElement>(null);

  // Choose presentation mode from viewport + reduced-motion preference.
  useEffect(() => {
    const mqDesktop = window.matchMedia('(min-width: 1024px)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMode(mqDesktop.matches && !mqReduce.matches ? 'desktop' : 'stack');
    sync();
    mqDesktop.addEventListener('change', sync);
    mqReduce.addEventListener('change', sync);
    return () => {
      mqDesktop.removeEventListener('change', sync);
      mqReduce.removeEventListener('change', sync);
    };
  }, []);

  // ScrollTrigger maps container scroll progress → active step index.
  useEffect(() => {
    if (mode !== 'desktop') return;
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const i = Math.min(steps.length - 1, Math.max(0, Math.floor(self.progress * steps.length)));
          setActive((prev) => (prev === i ? prev : i));
        },
      });
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [mode, steps.length]);

  /* ── Desktop: split-film stage ── */
  if (mode === 'desktop') {
    const s = steps[active];
    const Icon = STEP_ICONS[active] ?? Cpu;
    return (
      <div ref={containerRef} style={{ height: `${steps.length * 62}vh` }} className="relative">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 xl:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

              {/* ════ LEFT: step text + pipeline status rail ════ */}
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-8 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, #2563EB, #22D3EE)' }} />
                  <span className="text-[11px] font-mono font-bold tracking-[0.24em] uppercase text-[#2563EB]">
                    Pipeline — Step {s.num} / {String(steps.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Active step block — re-enters on each change */}
                <div key={active} className="animate-stepEnter">
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      aria-hidden="true"
                      className="font-black font-mono leading-none"
                      style={{
                        fontSize: '64px',
                        backgroundImage: 'linear-gradient(135deg, #2563EB 0%, #22D3EE 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {s.num}
                    </span>
                    <span
                      style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: 'linear-gradient(180deg, rgba(59,130,246,0.16) 0%, rgba(37,99,235,0.09) 100%)',
                        border: '1px solid rgba(37,99,235,0.22)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85), 0 2px 6px rgba(37,99,235,0.12)',
                      }}
                    >
                      <Icon size={21} color="#2563EB" strokeWidth={2.1} />
                    </span>
                  </div>
                  <h3 className="text-[30px] font-extrabold text-[#0F172A] tracking-tight mb-3" style={{ lineHeight: 1.2 }}>
                    {s.title}
                  </h3>
                  <p className="text-[#475569] text-[16.5px] leading-relaxed max-w-lg" style={{ fontWeight: 450 }}>
                    {s.body}
                  </p>
                </div>

                {/* Status rail — live pipeline monitor */}
                <div className="mt-9 space-y-1.5 max-w-sm">
                  {steps.map((st, i) => {
                    const done = i < active, now = i === active;
                    return (
                      <div
                        key={st.num}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300"
                        style={{
                          background: now ? 'rgba(37,99,235,0.07)' : 'transparent',
                          border: `1px solid ${now ? 'rgba(37,99,235,0.18)' : 'transparent'}`,
                        }}
                      >
                        <span
                          className="flex items-center justify-center rounded-full transition-all duration-300"
                          style={{
                            width: '18px', height: '18px', flexShrink: 0,
                            background: done ? 'rgba(34,197,94,0.14)' : now ? '#2563EB' : 'rgba(148,163,184,0.12)',
                            border: `1.5px solid ${done ? 'rgba(34,197,94,0.5)' : now ? '#2563EB' : 'rgba(148,163,184,0.35)'}`,
                            boxShadow: now ? '0 0 0 3px rgba(37,99,235,0.12)' : 'none',
                          }}
                        >
                          {done && <Check size={11} color="#16a34a" strokeWidth={3} />}
                          {now && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span
                          className="font-mono text-[11.5px] tracking-wide transition-colors duration-300"
                          style={{ color: done ? '#16a34a' : now ? '#10233F' : '#94a3b8', fontWeight: now ? 700 : 500 }}
                        >
                          {st.num} · {st.title}
                        </span>
                        <span className="ml-auto font-mono text-[9.5px] uppercase tracking-widest" style={{ color: done ? '#16a34a' : now ? '#2563EB' : '#cbd5e1' }}>
                          {done ? 'done' : now ? 'running' : 'idle'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ════ RIGHT: X-ray film on the light box ════ */}
              <div className="flex items-center justify-center">
                <div
                  className="relative"
                  style={{
                    padding: '18px',
                    borderRadius: '22px',
                    background: 'linear-gradient(180deg, #1B2A41 0%, #0D1626 100%)',
                    border: '1px solid rgba(148,163,184,0.18)',
                    boxShadow:
                      'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.5), ' +
                      '0 2px 4px rgba(15,23,42,0.25), 0 24px 60px -18px rgba(15,23,42,0.55), 0 40px 90px -30px rgba(37,99,235,0.25)',
                  }}
                >
                  {/* Light-box label strip */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-slate-400">
                      Light Box · PA Knee
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-widest" style={{ color: active >= 3 ? '#22D3EE' : '#64748b' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: active >= 3 ? '#22D3EE' : '#64748b', boxShadow: active >= 3 ? '0 0 6px rgba(34,211,238,0.8)' : 'none' }} />
                      {active >= 4 ? 'Heatmap On' : active >= 3 ? 'Predicted' : 'Viewing'}
                    </span>
                  </div>

                  {/* Film well */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      width: 'min(400px, 38vw)',
                      aspectRatio: '4 / 4.6',
                      borderRadius: '10px',
                      background: 'radial-gradient(ellipse at 50% 42%, #16243a 0%, #0a1220 78%)',
                      boxShadow: 'inset 0 0 0 1px rgba(148,163,184,0.12), inset 0 2px 14px rgba(0,0,0,0.6)',
                    }}
                  >
                    {/* Ambient glow bleeding from the film */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(125,180,255,0.10) 0%, transparent 70%)' }}
                    />

                    {/* The film — drops in at step 01, persists after */}
                    <img
                      key={`film-${active === 0 ? 'drop' : 'set'}`}
                      src={FILM_SRC}
                      alt="Knee radiograph on light box"
                      className="absolute inset-0 w-full h-full object-cover select-none"
                      style={{
                        filter: 'brightness(1.06) contrast(1.04)',
                        animation: active === 0 ? 'filmDrop 0.9s cubic-bezier(0.22, 1, 0.36, 1) both' : 'none',
                      }}
                    />

                    {/* 02+ — green ROI brackets + grid */}
                    {active >= 1 && (
                      <div key="roi" className="absolute inset-0 animate-stepEnter pointer-events-none">
                        <div className="absolute inset-4 rounded-lg" style={{ border: '1px dashed rgba(34,197,94,0.35)' }} />
                        {([['top-2 left-2', 'border-t-2 border-l-2'], ['top-2 right-2', 'border-t-2 border-r-2'], ['bottom-2 left-2', 'border-b-2 border-l-2'], ['bottom-2 right-2', 'border-b-2 border-r-2']] as const).map(([pos, edge], k) => (
                          <span
                            key={k}
                            className={`absolute ${pos} w-7 h-7 rounded-[3px]`}
                            style={{ border: 'none' }}
                          >
                            <span className={`absolute inset-0 ${edge}`} style={{ borderColor: 'rgba(74,222,128,0.95)', borderRadius: '3px', filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.6))' }} />
                          </span>
                        ))}
                        <span className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-md" style={{ color: '#4ade80', background: 'rgba(6,20,12,0.72)', border: '1px solid rgba(74,222,128,0.35)' }}>
                          Knee ROI ✓
                        </span>
                      </div>
                    )}

                    {/* 03 — one-shot scan beam + pixel shimmer */}
                    {active === 2 && (
                      <div key="proc" className="absolute inset-0 pointer-events-none">
                        <div
                          className="absolute left-0 right-0 h-[3px]"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.95), transparent)',
                            boxShadow: '0 0 14px rgba(34,211,238,0.7)',
                            animation: 'heatSweep 1.8s cubic-bezier(0.4, 0, 0.2, 1) both',
                          }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, rgba(34,211,238,0.05) 0 2px, transparent 2px 4px), repeating-linear-gradient(90deg, rgba(34,211,238,0.05) 0 2px, transparent 2px 4px)',
                            animation: 'shimmerFade 1.8s ease both',
                          }}
                        />
                      </div>
                    )}

                    {/* 04+ — Grad-CAM heatmap blooms over the film (illustrative) */}
                    {active >= 4 && (
                      <img
                        key="heat"
                        src={HEATMAP_SRC}
                        alt="Grad-CAM attention overlay"
                        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                        style={{
                          mixBlendMode: 'screen',
                          opacity: 0.92,
                          animation: 'heatReveal 1.1s cubic-bezier(0.16, 1, 0.3, 1) both',
                        }}
                      />
                    )}
                    {active >= 4 && (
                      <span key="hl" className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.18em] px-2 py-1 rounded-md whitespace-nowrap" style={{ color: '#22D3EE', background: 'rgba(4,16,24,0.72)', border: '1px solid rgba(34,211,238,0.35)' }}>
                        Grad-CAM++ · Illustrative
                      </span>
                    )}

                    {/* 03+ — class chips stack; prediction locks at 92 (sample) */}
                    {active >= 3 && (
                      <div key="chips" className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                        {CLASS_CHIPS.map((c, i) => {
                          const locked = i === 2;
                          return (
                            <span
                              key={c.label}
                              className="font-mono text-[9.5px] px-2.5 py-1.5 rounded-md whitespace-nowrap"
                              style={{
                                color: locked ? '#fecaca' : 'rgba(148,163,184,0.75)',
                                background: locked ? 'rgba(60,10,14,0.82)' : 'rgba(8,14,26,0.66)',
                                border: `1px solid ${locked ? 'rgba(239,68,68,0.65)' : 'rgba(148,163,184,0.18)'}`,
                                boxShadow: locked ? '0 0 16px rgba(239,68,68,0.35), inset 0 1px 0 rgba(255,255,255,0.08)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                                transform: locked ? 'scale(1.06)' : 'scale(1)',
                                opacity: locked ? 1 : 0.55,
                                animation: `chipSlide 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.12}s both`,
                                fontWeight: locked ? 700 : 500,
                              }}
                            >
                              {c.label}{locked ? ' · 92' : ''}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* 05 — report card slides out from the bottom of the box */}
                    {active === 5 && (
                      <div
                        key="report"
                        className="absolute left-4 right-4 bottom-0 rounded-xl p-4"
                        style={{
                          background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(241,245,249,0.96) 100%)',
                          border: '1px solid rgba(203,213,225,0.9)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), 0 -8px 24px rgba(4,10,20,0.45), 0 16px 40px -10px rgba(15,23,42,0.5)',
                          animation: 'reportRise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">Sample Report</span>
                          <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded" style={{ color: '#b45309', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
                            Demo
                          </span>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[11px] text-slate-500 font-medium">Prediction</p>
                            <p className="text-[17px] font-extrabold text-[#0F172A] tracking-tight">Osteoporosis</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[11px] text-slate-500 font-medium">Score</p>
                            <p className="text-[17px] font-black font-mono text-[#2563EB]">92<span className="text-[11px] font-semibold text-slate-400">/100</span></p>
                          </div>
                        </div>
                        <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(15,23,42,0.08)' }}>
                          <div className="h-full rounded-full" style={{ width: '92%', background: 'linear-gradient(90deg, #2563EB, #22D3EE)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)' }} />
                        </div>
                        <p className="mt-2 text-[9.5px] text-slate-400 font-medium">
                          Educational demo — not a medical diagnosis.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Box foot — etched caption */}
                  <div className="flex items-center justify-between mt-3 px-1">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
                      OsteoVision Studio · Output Preview
                    </span>
                    <span className="flex gap-1">
                      {steps.map((st, i) => (
                        <span
                          key={st.num}
                          className="rounded-full transition-all duration-300"
                          style={{
                            width: i === active ? '14px' : '5px', height: '5px',
                            background: i < active ? 'rgba(34,197,94,0.6)' : i === active ? '#22D3EE' : 'rgba(148,163,184,0.25)',
                            boxShadow: i === active ? '0 0 8px rgba(34,211,238,0.6)' : 'none',
                          }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Fallback: static card grid (mobile / reduced motion) ── */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {steps.map((s, i) => {
        const Icon = STEP_ICONS[i] ?? Cpu;
        return (
          <div key={s.num} className="card-tactile p-5 sm:p-7 group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black font-mono text-slate-300 group-hover:text-[#2563EB] transition-colors">
                  {s.num}
                </span>
                <Icon size={20} color="#2563EB" className="opacity-60" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2 tracking-tight">{s.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed font-normal">{s.body}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-500">
              STEP {s.num}
            </div>
          </div>
        );
      })}
    </div>
  );
};
