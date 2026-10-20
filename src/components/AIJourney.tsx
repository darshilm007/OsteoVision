import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Crosshair, Layers, ScanLine } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   AIJourney — scroll-driven cinematic chapter
   "Watch the AI see a knee X-ray"

   Desktop + motion allowed : sticky pinned stage, one X-ray transforms
                              through the real pipeline as you scroll
                              (raw → detection box → heatmap bloom → verdict).
   Mobile / reduced-motion  : static dark chapter with the same 4 beats.
   All copy is content-integrity safe (no performance claims,
   illustrative example clearly labeled).
───────────────────────────────────────────── */

interface Beat {
  icon: React.ReactNode;
  title: string;
  body: string;
}

const BEATS: Beat[] = [
  {
    icon: <Layers size={15} />,
    title: 'Every scan starts as a routine image',
    body: 'A standard knee radiograph — PNG or JPEG — is uploaded directly in the browser. Nothing special yet.',
  },
  {
    icon: <Crosshair size={15} />,
    title: 'First, the pipeline finds the knee',
    body: 'The image is validated and — when the optional knee-detection model is configured — screened to help confirm it is a knee.',
  },
  {
    icon: <ScanLine size={15} />,
    title: 'Then the model shows where it looks',
    body: 'Where supported, a Grad-CAM++ style heatmap highlights the image regions associated with the model’s prediction.',
  },
  {
    icon: <Brain size={15} />,
    title: 'Prediction. Confidence. Explanation.',
    body: 'A 3-class result with a 0–100 score and the visual evidence behind it — for education and research, not diagnosis.',
  },
];

/* Phase boundaries on the master progress (0 → 1) — tuned to match the
   timeline positions below so captions swap just as each visual event starts */
const PHASE_AT = [0.12, 0.30, 0.52];

export const AIJourney: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const heatRef = useRef<HTMLImageElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const boxLabelRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const verdictRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<'cinema' | 'static'>('static');
  const [beat, setBeat] = useState(0);

  /* Cinema only on desktop with motion allowed */
  useEffect(() => {
    const mqDesktop = window.matchMedia('(min-width: 1024px)');
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMode(mqDesktop.matches && !mqReduce.matches ? 'cinema' : 'static');
    sync();
    mqDesktop.addEventListener('change', sync);
    mqReduce.addEventListener('change', sync);
    return () => {
      mqDesktop.removeEventListener('change', sync);
      mqReduce.removeEventListener('change', sync);
    };
  }, []);

  /* The scroll-driven master timeline */
  useEffect(() => {
    if (mode !== 'cinema') return;
    const root = rootRef.current;
    const imgWrap = imgWrapRef.current;
    const heat = heatRef.current;
    const box = boxRef.current;
    const boxLabel = boxLabelRef.current;
    const sweep = sweepRef.current;
    const verdict = verdictRef.current;
    const bar = barRef.current;
    const rail = railRef.current;
    const hint = hintRef.current;
    if (!root || !imgWrap || !heat || !box || !boxLabel || !sweep || !verdict || !bar || !rail || !hint) return;

    /* Hide everything the timeline will reveal */
    gsap.set(imgWrap, { opacity: 0, y: 28, scale: 1.08 });
    gsap.set(heat, { opacity: 0, clipPath: 'circle(0% at 50% 55%)' });
    gsap.set(box, { opacity: 0, scale: 1.14 });
    gsap.set(boxLabel, { opacity: 0, y: 8 });
    gsap.set(sweep, { opacity: 0, yPercent: -110 });
    gsap.set(verdict, { opacity: 0, y: 42, scale: 0.96 });
    gsap.set(bar, { width: '0%' });

    let lastBeat = -1;

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom', /* the stage rides its own CSS sticky — no GSAP pin */
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          /* Beat index — only re-render React when it actually changes */
          const b = p < PHASE_AT[0] ? 0
                  : p < PHASE_AT[1] ? 1
                  : p < PHASE_AT[2] ? 2 : 3;
          if (b !== lastBeat) { lastBeat = b; setBeat(b); }
          rail.style.height = `${(p * 100).toFixed(1)}%`;
        },
      },
    });

    /* ── Beat 0 : the image arrives ── */
    tl.to(imgWrap, { opacity: 1, y: 0, duration: 0.10 }, 0)
      .to(imgWrap, { scale: 1.02, duration: 0.90 }, 0.05)
      .to(hint, { opacity: 0, duration: 0.05 }, 0.03);

    /* ── Beat 1 : scan pass + detection lock-on ── */
    tl.to(sweep, { opacity: 1, duration: 0.02 }, 0.11)
      .to(sweep, { yPercent: 110, duration: 0.12 }, 0.12)
      .to(sweep, { opacity: 0, duration: 0.03 }, 0.24)
      .to(box, { opacity: 1, scale: 1, duration: 0.10, ease: 'power2.out' }, 0.18)
      .to(boxLabel, { opacity: 1, y: 0, duration: 0.05 }, 0.26);

    /* ── Beat 2 : the heatmap blooms ── */
    tl.to(heat, { opacity: 0.95, duration: 0.01 }, 0.36)
      .to(heat, { clipPath: 'circle(88% at 50% 58%)', duration: 0.16 }, 0.36)
      .to(sweep, { opacity: 0.7, duration: 0.02 }, 0.38)
      .to(sweep, { yPercent: 110, duration: 0.12 }, 0.38)
      .to(sweep, { opacity: 0, duration: 0.03 }, 0.50)
      .to(box, { opacity: 0.22, duration: 0.08 }, 0.42)
      .to(boxLabel, { opacity: 0, duration: 0.06 }, 0.42);

    /* ── Beat 3 : the verdict assembles, then holds ── */
    tl.to(verdict, { opacity: 1, y: 0, scale: 1, duration: 0.12 }, 0.58)
      .to(bar, { width: '86.7%', duration: 0.13 }, 0.64)
      .to([imgWrap, heat], { opacity: 0.6, duration: 0.10 }, 0.74);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      setBeat(0);
      lastBeat = -1;
    };
  }, [mode]);

  /* ══════════════ Static (mobile / reduced motion) ══════════════ */
  if (mode === 'static') {
    return (
      <section className="relative bg-[#0B1226] py-10 md:py-14 overflow-hidden">
        {/* ambient glow */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(60% 40% at 50% 0%, rgba(37,99,235,0.18) 0%, transparent 70%)',
        }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 xl:px-10 z-10">
          <span className="text-xs font-bold text-[#22D3EE] uppercase tracking-wider block mb-2">
            See It In Action
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-8">
            Watch the AI read a knee X-ray
          </h2>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-8">
            <img src="/frames/frame_000299.jpg" alt="Knee radiograph with an explanatory heatmap" className="w-full max-h-[340px] object-cover" loading="lazy" />
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/55 border border-white/15 text-[9px] font-mono text-white/70 uppercase tracking-widest">
              Illustrative
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {BEATS.map((b, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 flex gap-4 items-start">
                <span className="mt-0.5 w-7 h-7 shrink-0 rounded-full bg-[#2563EB]/20 text-[#60A5FA] flex items-center justify-center">
                  {b.icon}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{b.title}</h3>
                  <p className="text-[13px] leading-relaxed text-slate-300/80">{b.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ══════════════ Cinema (desktop, motion allowed) ══════════════ */
  return (
    <div ref={rootRef} className="relative bg-[#0B1226]" style={{ height: '360vh' }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Ambient depth */}
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          background:
            'radial-gradient(55% 45% at 72% 42%, rgba(37,99,235,0.20) 0%, transparent 70%),' +
            'radial-gradient(40% 40% at 20% 80%, rgba(34,211,238,0.08) 0%, transparent 70%)',
        }} />

        {/* Chapter eyebrow */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
          <span className="text-[11px] font-bold text-[#22D3EE] uppercase tracking-[0.22em]">
            See It In Action
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Watch the AI read a knee X-ray
          </h2>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-8 xl:px-10 z-10">
          <div className="grid grid-cols-12 items-center gap-8">

            {/* ── Left: the 4 narration beats (crossfade) ── */}
            <div className="col-span-4 relative h-[240px]">
              {BEATS.map((b, i) => (
                <div
                  key={i}
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
                  style={{
                    opacity: beat === i ? 1 : 0,
                    transform: `translateY(calc(-50% + ${beat === i ? 0 : beat > i ? -18 : 18}px))`,
                    pointerEvents: 'none',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full bg-[#2563EB]/25 text-[#60A5FA] border border-[#2563EB]/40 flex items-center justify-center">
                      {b.icon}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 tracking-widest">
                      0{i + 1} / 04
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white tracking-tight leading-snug mb-2">
                    {b.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-300/75 max-w-[360px]">{b.body}</p>
                </div>
              ))}
            </div>

            {/* ── Center-right: the patient — one X-ray, four transformations ── */}
            <div className="col-span-7 relative flex justify-center">
              <div
                ref={imgWrapRef}
                className="relative rounded-2xl overflow-hidden border border-white/12 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)]"
                style={{ width: 'min(640px, 100%)' }}
              >
                <img src="/frames/frame_000100.jpg" alt="Knee radiograph" className="w-full block" />

                {/* Heatmap layer — blooms in via clip-path */}
                <img
                  ref={heatRef}
                  src="/frames/frame_000299.jpg"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Scan sweep beam */}
                <div
                  ref={sweepRef}
                  className="absolute left-0 right-0 h-[3px] pointer-events-none"
                  style={{
                    top: 0,
                    background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.85), transparent)',
                    boxShadow: '0 0 18px rgba(34,211,238,0.55)',
                  }}
                />

                {/* Detection box — "lock-on" panel */}
                <div
                  ref={boxRef}
                  className="absolute pointer-events-none rounded-md"
                  style={{
                    left: '30%', top: '22%', width: '40%', height: '56%',
                    border: '1.5px solid rgba(34,211,238,0.9)',
                    boxShadow: '0 0 18px rgba(34,211,238,0.35), inset 0 0 22px rgba(34,211,238,0.10)',
                    transformOrigin: '50% 50%',
                  }}
                />
                <div
                  ref={boxLabelRef}
                  className="absolute font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-md bg-[#22D3EE]/15 text-[#67E8F9] border border-[#22D3EE]/40"
                  style={{ left: '30%', top: '16.5%' }}
                >
                  Knee · localized
                </div>

                {/* Verdict glass card */}
                <div
                  ref={verdictRef}
                  className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[86%] rounded-2xl p-4 backdrop-blur-2xl border border-white/20"
                  style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.82), rgba(15,23,42,0.66))' }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                      Model Output · Illustrative
                    </span>
                    <span className="font-mono text-[10px] text-[#67E8F9]">ConvNeXt-Tiny</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    {(['Normal', 'Osteopenia', 'Osteoporosis'] as const).map((cls) => (
                      <span
                        key={cls}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                          cls === 'Osteopenia'
                            ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-[0_0_16px_-2px_rgba(37,99,235,0.7)]'
                            : 'text-slate-400 border-white/10'
                        }`}
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div ref={barRef} className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#22D3EE]" style={{ width: '0%' }} />
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-white/90">86.7%</span>
                    <span className="font-mono text-[11px] text-slate-400">· 58 / 100</span>
                  </div>
                  <p className="mt-2.5 text-[10px] leading-relaxed text-slate-400">
                    Illustrative example of the output format — not a real patient result. Not for diagnosis.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Far right: progress rail ── */}
            <div className="col-span-1 flex justify-center">
              <div className="relative w-[3px] h-[220px] rounded-full bg-white/10 overflow-hidden">
                <div ref={railRef} className="absolute top-0 left-0 right-0 rounded-full bg-gradient-to-b from-[#2563EB] to-[#22D3EE]" style={{ height: '0%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint (fades once the story starts) */}
        <div ref={hintRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
          <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-400">
            Scroll — watch the AI look
          </span>
          <div className="w-5 h-8 rounded-[10px] border-[1.5px] border-white/25 flex items-start justify-center pt-[5px]">
            <div className="w-1 h-2 rounded-sm bg-white/60" style={{ animation: 'scrollDot 1.8s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
