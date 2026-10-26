import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Bone,
  Layers,
  Play,
  Image as ImageIcon,
  Quote,
  ScanLine,
  Target,
} from 'lucide-react';
import { InteractiveFooterWordmark } from '../components/InteractiveFooterWordmark';
import { HowItWorksStepper } from '../components/HowItWorksStepper';
import { HeroAmbient } from '../components/HeroAmbient';
import { CountUp } from '../components/CountUp';
import { HeroStatsBand } from '../components/HeroStatsBand';

/* ─────────────────────────────────────────────
   Floating Diagnostic Glass Cards — Hero overlay
   Style: Premium Translucent Glass with Dark Clinical Navy Typography
───────────────────────────────────────────── */
const DiagnosticFloatingCards: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  /* Premium translucent glass — exact specification */
  const glassBase: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.16)',
    backdropFilter: 'blur(20px) saturate(115%)',
    WebkitBackdropFilter: 'blur(20px) saturate(115%)',
    border: '1px solid rgba(255, 255, 255, 0.30)',
    borderRadius: '20px',
    transition: 'transform 220ms ease, background 220ms ease, border-color 220ms ease, box-shadow 220ms ease',
    willChange: 'transform',
    overflow: 'visible',
  };

  const entranceStyle = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(8px)',
    transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
  });

  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget as HTMLDivElement;
      el.style.transform = 'translateY(-2px)';
      el.style.background = 'rgba(255, 255, 255, 0.19)';
      el.style.borderColor = 'rgba(255, 255, 255, 0.38)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget as HTMLDivElement;
      el.style.transform = '';
      el.style.background = 'rgba(255, 255, 255, 0.16)';
      el.style.borderColor = 'rgba(255, 255, 255, 0.30)';
    },
  };

  return (
    <div aria-hidden="true" className="diag-cluster-root">
      {/* ── Triangular Cluster Container (x ≈ 68%, y ≈ 58%) ── */}
      <div className="diag-cluster-container">

        {/* ── CARD 1: Detection (Upper-Left of Cluster — 230px x 175px) ── */}
        <div
          data-diag-card="1"
          className="diag-card-detection"
          style={{
            ...glassBase,
            ...entranceStyle(0),
            padding: '14px 16px',
            boxShadow: '0 12px 32px rgba(12, 30, 55, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
            animation: mounted ? 'diagFloat1 7s ease-in-out infinite' : 'none',
          }}
          {...hoverHandlers}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
            <Layers size={13} color="#18304D" />
            <span style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '1.1px',
              color: '#18304D', textTransform: 'uppercase',
            }}>
              Detection
            </span>
          </div>

          {/* Three translucent internal rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {([
              { label: 'Normal', dot: '#22c55e' },
              { label: 'Osteopenia', dot: '#f59e0b' },
              { label: 'Osteoporosis', dot: '#25BFD6' },
            ] as const).map(({ label, dot }) => (
              <div
                key={label}
                style={{
                  display: 'flex', alignItems: 'center', gap: '9px',
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: '10px',
                  height: '34px',
                  padding: '0 11px',
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#10233F', letterSpacing: '0.01em' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CARD 2: Radiograph (Upper-Right of Cluster — 225px x 170px, 24px gap) ── */}
        <div
          data-diag-card="2"
          className="diag-card-radiograph"
          style={{
            ...glassBase,
            ...entranceStyle(100),
            padding: '15px 16px',
            boxShadow: '0 10px 28px rgba(12, 30, 55, 0.10), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
            animation: mounted ? 'diagFloat2 7.5s ease-in-out infinite' : 'none',
          }}
          {...hoverHandlers}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
            <ScanLine size={13} color="#18304D" />
            <span style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '1.1px',
              color: '#18304D', textTransform: 'uppercase',
            }}>
              Radiograph
            </span>
          </div>

          {/* Content */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              fontSize: '17px', fontWeight: 700, color: '#10233F',
              marginBottom: '3px', letterSpacing: '-0.01em', lineHeight: 1.25,
            }}>
              Trabecular Pattern
            </div>
            <div style={{ fontSize: '12.5px', color: '#49627E', fontWeight: 500 }}>
              Analysis layer active
            </div>
          </div>

          {/* Analysis Ready status pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '9px',
            padding: '5.5px 11px',
          }}>
            <span style={{
              width: '6.5px', height: '6.5px', borderRadius: '50%',
              background: '#25BFD6',
              boxShadow: '0 0 6px rgba(37, 191, 214, 0.70)',
              flexShrink: 0,
              display: 'inline-block',
            }} />
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#10233F', letterSpacing: '0.01em' }}>
              Analysis Ready
            </span>
          </div>
        </div>

        {/* ── CARD 3: Bone Health Score (Centered Below Upper Cards — 255px x 180px, 31px gap) ── */}
        <div
          data-diag-card="3"
          className="diag-card-score"
          style={{
            ...glassBase,
            ...entranceStyle(180),
            padding: '16px 18px',
            boxShadow: '0 16px 36px rgba(12, 30, 55, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.28)',
            animation: mounted ? 'diagFloat3 8s ease-in-out infinite' : 'none',
          }}
          {...hoverHandlers}
        >
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
            <Bone size={13} color="#18304D" />
            <span style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '1.1px',
              color: '#18304D', textTransform: 'uppercase',
            }}>
              Bone Health Score
            </span>
          </div>

          {/* Score value */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '9px' }}>
            <span style={{
              fontSize: '50px', fontWeight: 800, lineHeight: 1,
              color: '#10233F',
              letterSpacing: '-0.04em',
            }}>
              92
            </span>
            <span style={{ fontSize: '20px', fontWeight: 600, color: '#49627E', paddingBottom: '3px' }}>
              /100
            </span>
          </div>

          {/* Sub-label row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12.5px', color: '#49627E', fontWeight: 500 }}>
              Calibrated assessment
            </span>
            <span style={{
              fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.08em',
              color: '#5D7590',
              background: 'rgba(255, 255, 255, 0.20)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '6px', padding: '2.5px 7px',
              textTransform: 'uppercase',
            }}>
              SAMPLE
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};


interface HomePageProps {
  onOpenUpload: () => void;
  onNavigate: (route: string, sectionId?: string) => void;
  targetSection?: string | null;
  navKey?: number;
}

/* ─────────────────────────────────────────────
   Reusable Clean Modern Media Slot (Placeholder for Video / Image)
───────────────────────────────────────────── */
interface MediaSlotProps {
  src?: string;
  poster?: string;
  aspectRatio?: string;
  label?: string;
  dimensions?: string;
  type?: 'image' | 'video';
  className?: string;
  accent?: 'cyan' | 'blue' | 'slate';
}

const MediaSlot: React.FC<MediaSlotProps> = ({
  src,
  poster,
  aspectRatio = 'aspect-[16/10]',
  label = 'Media Slot',
  dimensions = '1920 × 1080',
  type = 'image',
  className = '',
  accent = 'blue',
}) => {
  const accentClasses = {
    cyan: 'hover:border-cyan-400 group-hover:text-cyan-500',
    blue: 'hover:border-blue-400 group-hover:text-blue-600',
    slate: 'hover:border-slate-400 group-hover:text-slate-700',
  }[accent];

  if (src && type === 'video') {
    return (
      <div className={`relative w-full ${aspectRatio} rounded-2xl md:rounded-3xl overflow-hidden shadow-lg bg-slate-900 ${className}`}>
        <video
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (src && type === 'image') {
    return (
      <div className={`relative w-full ${aspectRatio} rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 group bg-slate-950 ${className}`}>
        <img
          src={src}
          alt={label}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {label && (
          <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none flex items-center justify-between text-white">
            <span className="text-xs font-semibold tracking-tight truncate pr-2 text-slate-100">
              {label}
            </span>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-400/30 flex-shrink-0">
              Medical Asset
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectRatio} rounded-2xl md:rounded-3xl border-2 border-dashed border-slate-300/85 bg-slate-50/70 hover:bg-slate-100/70 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center group cursor-pointer overflow-hidden ${accentClasses} ${className}`}
      title="Click or replace this container with your image or video"
    >
      {/* Center Icon Box */}
      <div className="w-12 h-12 rounded-2xl bg-white/95 border border-slate-200/90 shadow-sm flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform duration-300 mb-3">
        {type === 'video' ? (
          <Play size={20} className="ml-0.5 text-blue-600 fill-blue-600/20" />
        ) : (
          <ImageIcon size={20} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
        )}
      </div>

      {/* Label and Helper Dimensions */}
      <span className="text-xs font-bold text-slate-700 tracking-tight group-hover:text-blue-600 transition-colors">
        {label}
      </span>
      <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-wider">
        {type === 'video' ? 'MP4 / WEBM' : 'PNG / JPG / DICOM'} · {dimensions}
      </span>

      {/* Watermark subtle tag */}
      <div className="absolute bottom-2 right-2.5 px-2 py-0.5 rounded-md bg-white/80 border border-slate-200/70 text-[9px] font-mono text-slate-400 uppercase tracking-widest pointer-events-none">
        Empty Box
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Scroll-Reveal Hook
───────────────────────────────────────────── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/* Tracks the OS reduced-motion preference reactively. */
function usePrefersReduced() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(m.matches);
    const onChange = () => setReduced(m.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

type RevealFrom = 'up' | 'left' | 'right' | 'scale';

const RevealSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  from?: RevealFrom;
}> = ({ children, className = '', delay = 0, stagger = 0, from = 'up' }) => {
  const { ref, isVisible } = useScrollReveal(0.1);
  const reduced = usePrefersReduced();

  // Reduced motion: no transform/blur/transition — just show content.
  if (reduced) {
    return <div className={className} ref={ref}>{children}</div>;
  }

  const hiddenTransform: Record<RevealFrom, string> = {
    up: 'translateY(24px) scale(0.995)',
    left: 'translateX(-24px) scale(0.997)',
    right: 'translateX(24px) scale(0.997)',
    scale: 'scale(0.96)',
  };

  const styleFor = (idx: number): React.CSSProperties => {
    const d = delay + (stagger ? idx * stagger : 0);
    if (isVisible) {
      return {
        opacity: 1,
        transform: 'none',
        filter: 'blur(0px)',
        transition:
          `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${d}s, ` +
          `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${d}s, ` +
          `filter 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${d}s`,
      };
    }
    return {
      opacity: 0,
      transform: hiddenTransform[from],
      filter: 'blur(6px)',
      transition: 'none',
    };
  };

  const childArr = React.Children.toArray(children);

  // Single child (the common case): style the wrapper directly — no extra DOM.
  if (childArr.length <= 1) {
    return (
      <div className={className} ref={ref} style={styleFor(0)}>
        {children}
      </div>
    );
  }

  // Multiple children: cascade each with the stagger delay.
  return (
    <div className={className} ref={ref}>
      {childArr.map((child, i) => (
        <div key={i} style={styleFor(i)}>{child}</div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   How It Works step data (shared by the scroll stepper)
───────────────────────────────────────────── */
const HOW_IT_WORKS_STEPS = [
  { num: '01', title: 'Upload a Knee X-ray', body: 'Select a knee radiograph image (PNG or JPEG) directly in your browser.' },
  { num: '02', title: 'Validate the Uploaded Image', body: 'The image type is checked and screened to help confirm it is a valid knee radiograph.' },
  { num: '03', title: 'Process the Image with AI', body: 'The image is preprocessed and analyzed by the deep learning classifier.' },
  { num: '04', title: 'Generate a Classification Prediction', body: 'The model returns a predicted category — Normal, Osteopenia, or Osteoporosis — along with a confidence score.' },
  { num: '05', title: 'Generate a Visual Explanation', body: 'Where supported, a Grad-CAM++ heatmap highlights image regions associated with the model’s prediction.' },
  { num: '06', title: 'Review the Results', body: 'You review the prediction, confidence score, and visual explanation. Results are for education and research, not diagnosis.' },
];

/* ─────────────────────────────────────────────
   Main HomePage Component — Knee X-Ray Osteoporosis Detection
───────────────────────────────────────────── */
export const HomePage: React.FC<HomePageProps> = ({
  onOpenUpload,
  onNavigate,
  targetSection,
  navKey,
}) => {
  // Interactive sample selector for Diagnostic Output demo
  const [selectedDemoClass, setSelectedDemoClass] = useState<'normal' | 'osteopenia' | 'osteoporosis'>('osteopenia');

  // Email state for footer newsletter
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Active hover card in Stakeholder section (matching reference video interaction)
  const [hoveredStakeholder, setHoveredStakeholder] = useState<string | null>(null);

  /* Pause hero video when it scrolls out of view — decoded frames otherwise
     keep consuming CPU/GPU during the entire page scroll (major jank source). */
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = heroVideoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { void v.play().catch(() => { }); }
        else { v.pause(); }
      },
      { threshold: 0 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // Handle section scrolling
  React.useLayoutEffect(() => {
    if (targetSection) {
      const scrollToTarget = () => {
        const el = document.getElementById(targetSection);
        if (el) {
          const headerOffset = 80;
          const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
        }
      };
      scrollToTarget();
      const raf = requestAnimationFrame(scrollToTarget);
      return () => cancelAnimationFrame(raf);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [targetSection, navKey]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3500);
      setEmailInput('');
    }
  };

  // Scroll to an on-page section by id (used by footer nav links)
  const goToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  };

  const heroPills = [
    'Knee X-Ray Only',
    '3-Class Output',
    'Score Out of 100',
    'Action Suggestions',
    'Trabecular Detection',
  ];

  // Data for the 3 classes
  const demoData = {
    normal: {
      title: 'Normal Bone Density',
      badge: 'Healthy Bone Status',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      score: 14,
      findings: 'Uniform cancellous bone matrix preserved throughout the distal femur and proximal tibia. Cortical thickness physiological without porous thinning.',
      suggestion: 'Maintain standard physical activity and balanced dietary calcium & Vitamin D intake. Repeat screening on routine schedule.',
      urgency: 'Low Risk — Preventative Health',
    },
    osteopenia: {
      title: 'Osteopenia Detected',
      badge: 'Moderate Risk / Early Loss',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      score: 58,
      findings: 'Early trabecular thinning observed at the subchondral tibial plateau and lateral femoral condyle. Cortical borders show mild localized attenuation.',
      suggestion: 'Early intervention: 1200mg daily Calcium, 2000 IU Vitamin D3, weight-bearing resistance exercises, and follow-up radiological assessment in 12 months.',
      urgency: 'Moderate Risk — Active Intervention Window',
    },
    osteoporosis: {
      title: 'Osteoporosis Indication',
      badge: 'High Risk / Severe Fragility',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      score: 92,
      findings: 'Marked trabecular loss and porous degradation in lateral condyle and tibial plateau. Elevated structural micro-fracture probability.',
      suggestion: 'Immediate DEXA scan correlation for spine & hip confirmation. Consult orthopedic specialist for pharmacological treatment and strict fall-prevention measures.',
      urgency: 'High Risk — Clinical Review Required',
    },
  };

  const currentDemo = demoData[selectedDemoClass];

  const stakeholderCards = [
    {
      id: 'patient',
      title: 'Patients',
      desc: 'Uses routine knee X-rays already captured for joint care, with no additional radiation or visits, to surface an AI-based bone-density indication for opportunistic screening.',
      image: '/portraits/card-1.png',
      fallbackImage: '/portraits/card-1.png',
      defaultImage: '/portraits/patient.png',
    },
    {
      id: 'clinician',
      title: 'Orthopedic Clinicians',
      desc: 'Presents a 3-class AI prediction and a 0–100 score to support review, alongside a visual explanation of the regions behind the model’s decision.',
      image: '/portraits/card-2.png',
      fallbackImage: '/portraits/card-2.png',
      defaultImage: '/portraits/clinician.png',
    },
    {
      id: 'imaging',
      title: 'Radiology & Imaging',
      desc: 'A browser-based workflow for reviewing knee radiographs with automated trabecular analysis and an explainable output.',
      image: '/portraits/card-3.png',
      fallbackImage: '/portraits/card-3.png',
      defaultImage: '/portraits/imaging.png',
    },
    {
      id: 'hospital',
      title: 'Hospitals & Networks',
      desc: 'Explores how existing imaging workflows could support earlier bone-health awareness at scale, as a research and educational concept.',
      image: '/portraits/card-4.png',
      fallbackImage: '/portraits/card-4.png',
      defaultImage: '/portraits/hospital.png',
    },
  ];

  return (
    <div className="relative overflow-x-clip">

      {/* ══════════════════════════════════════════════════
          1. HERO SECTION — Full-Viewport Video Background
          Layer 1: Video · Layer 2: Cinematic gradient · Layer 3: Content
      ══════════════════════════════════════════════════ */}

      {/* ── Hero Viewport Block — adaptive viewport & scalable layout ── */}
      <div
        className="hero-viewport relative w-full min-h-[100svh] md:h-screen md:min-h-[660px] md:max-h-[1120px] overflow-hidden flex flex-col justify-center"
      >
        {/* ── LAYER 1: Full-bleed Background Video ── */}
        <video
          ref={heroVideoRef}
          src="/videos/watermark-removed (2).mp4"
          poster="/images/hero_video_poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            zIndex: 0,
          }}
        />

        {/* ── LAYER 2A: Cinematic left-to-right gradient (readability on bright left side) ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background:
              'linear-gradient(to right, rgba(8,14,36,0.78) 0%, rgba(8,14,36,0.58) 35%, rgba(8,14,36,0.28) 60%, rgba(8,14,36,0.12) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── LAYER 2B: Subtle vertical gradient — header area & very bottom ── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background:
              'linear-gradient(180deg, rgba(8,14,36,0.38) 0%, rgba(8,14,36,0.0) 22%, rgba(8,14,36,0.0) 78%, rgba(8,14,36,0.22) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── LAYER 2C: Ambient aurora mesh + particles + depth parallax ── */}
        <HeroAmbient />

        {/* ── LAYER 3: Hero Content ── */}
        <div
          className="hero-main-content-wrap relative md:absolute md:inset-0 z-10 flex items-center pt-24 sm:pt-28 md:pt-32 lg:pt-36 2xl:pt-40 pb-12 sm:pb-16"
        >
          <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto w-full px-5 sm:px-8 xl:px-10 2xl:px-12">
            <div className="hero-content-grid">
              {/* ── LEFT CONTENT ZONE (40-45%) ── */}
              <div className="hero-left-content max-w-[520px] 2xl:max-w-[620px]">

                {/* Main headline — stacked lines with fluid mathematical scaling */}
                <h1
                  className="font-extrabold tracking-tight leading-[1.08] mb-4 sm:mb-5 text-fluid-h1"
                  style={{
                    letterSpacing: '-0.025em',
                  }}
                >
                  {/* Line 1: deep navy / near-black */}
                  <span
                    className="block"
                    style={{
                      color: '#E8EDF5',
                      textShadow: '0 2px 18px rgba(0,0,0,0.45)',
                    }}
                  >
                    Understand Bone Health
                  </span>
                  {/* Line 2: OsteoVision clinical blue */}
                  <span
                    className="block"
                    style={{
                      color: '#60A5FA',
                      textShadow: '0 2px 20px rgba(37,99,235,0.38)',
                    }}
                  >
                    Through AI-Powered
                  </span>
                  {/* Line 3: deep navy / near-black */}
                  <span
                    className="block"
                    style={{
                      color: '#E8EDF5',
                      textShadow: '0 2px 18px rgba(0,0,0,0.45)',
                    }}
                  >
                    Knee X-Ray Analysis
                  </span>
                </h1>

                {/* Description */}
                <p
                  className="leading-relaxed mb-6 sm:mb-8 font-normal text-fluid-lead"
                  style={{
                    color: 'rgba(220,228,240,0.85)',
                    maxWidth: '460px',
                    textShadow: '0 1px 6px rgba(0,0,0,0.28)',
                  }}
                >
                  OsteoVision is an explainable AI-based web platform designed to
                  classify knee X-ray images into{' '}
                  <strong style={{ color: 'rgba(240,246,255,0.97)', fontWeight: 600 }}>Normal</strong>,{' '}
                  <strong style={{ color: 'rgba(240,246,255,0.97)', fontWeight: 600 }}>Osteopenia</strong>, and{' '}
                  <strong style={{ color: 'rgba(240,246,255,0.97)', fontWeight: 600 }}>Osteoporosis</strong>{' '}
                  categories. It presents the AI prediction and, where available, a
                  confidence score and visual explanation.
                </p>

                {/* Educational / research note */}
                <p
                  className="leading-relaxed mb-6 sm:mb-8 font-normal text-xs sm:text-[13px]"
                  style={{
                    color: 'rgba(200,212,230,0.72)',
                    maxWidth: '460px',
                    marginTop: '-1rem',
                    textShadow: '0 1px 6px rgba(0,0,0,0.28)',
                  }}
                >
                  For educational and research purposes. Not a substitute for professional
                  medical diagnosis.
                </p>

                {/* Primary CTA — premium rounded pill */}
                <button
                  id="hero-upload-cta"
                  onClick={onOpenUpload}
                  className="hero-cta-btn inline-flex items-center gap-3 cursor-pointer group"
                  style={{
                    padding: '10px 14px 10px 24px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    boxShadow: '0 12px 30px -4px rgba(8,14,36,0.55), 0 4px 12px rgba(8,14,36,0.3), inset 0 1.5px 1.5px rgba(255,255,255,0.35)',
                    transition: 'transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s cubic-bezier(0.16,1,0.3,1)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px) scale(1.015)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 18px 40px -4px rgba(8,14,36,0.65), 0 6px 16px rgba(37,99,235,0.22), inset 0 2px 2px rgba(255,255,255,0.5)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = '';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 30px -4px rgba(8,14,36,0.55), 0 4px 12px rgba(8,14,36,0.3), inset 0 1.5px 1.5px rgba(255,255,255,0.35)';
                  }}
                >
                  <span
                    style={{
                      color: '#FFFFFF',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      letterSpacing: '0.01em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Analyze an X-ray
                  </span>
                  {/* Arrow circle */}
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(37,99,235,0.45)',
                      transition: 'transform 0.2s ease',
                    }}
                    className="group-hover:scale-110"
                  >
                    <ArrowRight size={15} color="#FFFFFF" />
                  </div>
                </button>

                {/* ── MOBILE DIAGNOSTIC DOCK (Adaptive Representation for ≤ 768px screens) ── */}
                <div className="mt-7 md:hidden">
                  <div
                    className="p-3.5 rounded-2xl border"
                    style={{
                      background: 'rgba(15, 23, 42, 0.45)',
                      backdropFilter: 'blur(20px) saturate(120%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                      borderColor: 'rgba(255, 255, 255, 0.22)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <Layers size={12} className="text-cyan-400" />
                        3-Class Telemetry
                      </span>
                      <span className="text-[10px] font-mono font-bold text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30">
                        Score: 92/100
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { name: 'Normal', dot: '#22c55e', score: '14' },
                        { name: 'Osteopenia', dot: '#f59e0b', score: '58' },
                        { name: 'Osteoporosis', dot: '#38BDF8', score: '92' },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className="py-1.5 px-2 rounded-xl border flex flex-col items-center justify-center text-center"
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            borderColor: 'rgba(255, 255, 255, 0.15)',
                          }}
                        >
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.dot }} />
                            <span className="text-[11px] font-bold text-white tracking-tight">{item.name}</span>
                          </div>
                          <span className="text-[9.5px] font-mono text-slate-300">{item.score} pt</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        Trabecular Layer Active
                      </span>
                      <span className="font-mono text-slate-400">Deep Learning Active</span>
                    </div>
                  </div>
                </div>

              </div>{/* end left content zone */}

              {/* ── RIGHT ZONE: reserved for the X-ray video ── */}
              <div aria-hidden="true" style={{ display: 'block' }} />

            </div>{/* end hero-content-grid */}
          </div>{/* end max-w-7xl */}
        </div>{/* end layer 3 content */}


        {/* ── Floating Diagnostic Glass Cards ── */}
        <DiagnosticFloatingCards />

        {/* ── Scroll indicator at bottom-center (desktop only to prevent mobile overlap) ── */}
        <div
          className="hidden md:flex flex-col items-center gap-1.5"
          style={{
            position: 'absolute',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <span
            className="text-[10px] font-semibold tracking-[0.16em] uppercase"
            style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.16em' }}
          >
            Scroll to Explore
          </span>
          <div
            style={{
              width: '20px',
              height: '32px',
              borderRadius: '10px',
              border: '1.5px solid rgba(255,255,255,0.28)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '5px',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '8px',
                borderRadius: '2px',
                background: 'rgba(255,255,255,0.6)',
                animation: 'scrollDot 1.8s ease-in-out infinite',
              }}
            />
          </div>
        </div>

      </div>{/* end hero viewport block */}

      {/* ── Animated implementation-overview stats band ── */}
      <HeroStatsBand />

      {/* ══════════════════════════════════════════════════
          2. DIAGNOSTIC SERVICES & 3-CLASS OUTPUT BREAKDOWN (id="services")
      ══════════════════════════════════════════════════ */}
      <RevealSection>
        <section id="services" className="relative py-8 sm:py-10 md:py-14 max-w-7xl 2xl:max-w-[1440px] mx-auto px-3.5 sm:px-6 xl:px-10 2xl:px-12 z-10">

          {/* Section Header */}
          <div className="max-w-3xl mb-6 sm:mb-8">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-2">
              Diagnostic Output &amp; Scoring
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
              3-Class Classification, 100-Point Score &amp; Action Suggestions
            </h2>
            <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
              For each processed knee X-ray, OsteoVision presents a structured output:
              the predicted classification, a confidence score, and — where supported — a
              visual explanation. The preview below is an illustrative example of the output
              format, not a real patient result.
            </p>
          </div>

          {/* Dual Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">

            {/* Card 1: Interactive 3-Class Output Simulator (6 cols) */}
            <RevealSection className="lg:col-span-6" delay={0.05} from="left">
              <div className="card-glass-water p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      The 3 Output Classes
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#2563EB]">
                      Illustrative example
                    </span>
                  </div>

                  {/* Class Switcher Tabs */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200 mb-4 sm:mb-6">
                    {(['normal', 'osteopenia', 'osteoporosis'] as const).map((cls) => (
                      <button
                        key={cls}
                        onClick={() => setSelectedDemoClass(cls)}
                        className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold capitalize transition-all cursor-pointer truncate ${selectedDemoClass === cls
                          ? 'bg-white text-[#0F172A] shadow-sm border border-slate-200/80'
                          : 'text-slate-500 hover:text-slate-800'
                          }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Diagnostic Output Card */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Classification Output</span>
                        <h3 className="text-lg font-bold text-[#0F172A]">{currentDemo.title}</h3>
                      </div>
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${currentDemo.badgeColor}`}>
                        {currentDemo.badge}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-500 font-medium">OsteoVision Score (out of 100):</span>
                        <span className="font-mono font-black text-base text-[#0F172A]"><CountUp value={currentDemo.score} duration={600} /> / 100</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${selectedDemoClass === 'normal'
                            ? 'bg-emerald-500'
                            : selectedDemoClass === 'osteopenia'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                            }`}
                          style={{ width: `${currentDemo.score}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-3">
                      <strong className="text-slate-900 block mb-1">Illustrative Findings Example:</strong>
                      {currentDemo.findings}
                    </div>

                    <div className="text-xs text-blue-900 bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
                      <strong className="text-[#1D4ED8] block mb-1">Illustrative Action Suggestion:</strong>
                      {currentDemo.suggestion}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Ready to analyze your knee X-ray?</span>
                  <button
                    onClick={onOpenUpload}
                    className="btn-glass-water-dark inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                  >
                    <span>Analyze an X-ray</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </RevealSection>

            {/* Card 2: Knee Radiograph Media & Score Visualization (6 cols) */}
            <RevealSection className="lg:col-span-6" delay={0.15} from="right">
              <div className="card-glass-water p-6 sm:p-8 flex flex-col justify-between h-full">

                {/* Knee Detection Media Slot */}
                <div className="mb-6">
                  <MediaSlot
                    src="/images/knee_detection_roi.jpg"
                    aspectRatio="aspect-[16/9]"
                    label="Knee Detection ROI — Distal Femur & Proximal Tibia Isolation"
                    type="image"
                    accent="cyan"
                  />
                </div>

                {/* Quantitative Metric Badges */}
                <div>
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 mb-4">
                    <div>
                      <p className="text-[11px] text-[#64748B]">Analyzed Knee Regions</p>
                      <p className="text-sm font-bold text-[#0F172A]">Distal Femur &amp; Tibia</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#64748B]">Output Format</p>
                      <p className="text-sm font-bold text-[#0F172A]">3 Classes + Confidence Score</p>
                    </div>
                  </div>

                  {/* Segmented Risk Gauge */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 text-xs mb-2">
                      <span className="font-medium text-[#475569]">Illustrative Score Bands</span>
                      <span className="font-mono text-slate-400 text-[11px]">Example only · Normal · Osteopenia · Osteoporosis</span>
                    </div>

                    {/* Multi-tier segmented bar */}
                    <div className="flex items-center gap-1.5 h-3">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-full rounded-full transition-all ${i < 4
                            ? 'bg-emerald-400'
                            : i < 9
                              ? 'bg-amber-400'
                              : 'bg-red-400'
                            }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                      <span>0 (Normal)</span>
                      <span>50 (Osteopenia)</span>
                      <span>100 (Osteoporosis)</span>
                    </div>
                  </div>
                </div>

              </div>
            </RevealSection>

          </div>

        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════════
          2.5 STAKEHOLDER VALUE CARDS (Matching Reference Video Hover Interaction)
      ══════════════════════════════════════════════════ */}
      <RevealSection>
        <section className="relative py-8 sm:py-10 md:py-14 max-w-7xl mx-auto px-3.5 sm:px-6 xl:px-10 z-10">

          {/* Header */}
          <div className="max-w-3xl mb-6">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-2">
              Knee Osteoporosis Screening Potential
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
              Value Across the Entire Knee Care Continuum
            </h2>
            <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
              Hover over (or tap on mobile) each card to explore how OsteoVision aims to use routine knee radiographs to present a 3-class AI prediction, a 0–100 confidence-based score, and a visual explanation.
            </p>
          </div>

          {/* 4 Interactive Stakeholder Cards (Adaptive for Desktop, Tablet & Mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {stakeholderCards.map((card) => {
              const isHovered = hoveredStakeholder === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => setHoveredStakeholder(hoveredStakeholder === card.id ? null : card.id)}
                  onMouseEnter={() => setHoveredStakeholder(card.id)}
                  onMouseLeave={() => setHoveredStakeholder(null)}
                  className={`impact-card-wrapper ${isHovered ? 'is-active' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${card.title} stakeholder perspective`}
                >
                  {/* Back Layer: Photo Card on Light Grey Background */}
                  <div className="impact-card-photo">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover object-center pointer-events-none select-none"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.triedFallback) {
                          target.dataset.triedFallback = '1';
                          target.src = card.fallbackImage;
                        } else if (target.dataset.triedFallback === '1') {
                          target.dataset.triedFallback = '2';
                          target.src = card.defaultImage;
                        }
                      }}
                    />
                  </div>

                  {/* Front Layer: Brand-Blue Glass Card */}
                  <div className="impact-card-glass">
                    <h3 className="impact-card-title-text">
                      {card.title}
                    </h3>
                    <p className="impact-card-body-text">
                      {card.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════════
          3. ABOUT OSTEOVISION & KNEE ANALYSIS (id="about-us")
      ══════════════════════════════════════════════════ */}
      <RevealSection>
        <section id="about-us" className="relative py-10 md:py-14 max-w-7xl mx-auto px-5 sm:px-8 xl:px-10 z-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-8">

            {/* Left: Eyebrow + Domain tags */}
            <div className="lg:col-span-4 flex items-center gap-4">
              <div className="flex -space-x-3 overflow-hidden">
                <div className="w-12 h-12 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-mono text-blue-700 font-bold shadow-sm">
                  Femur
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-white bg-cyan-100 flex items-center justify-center text-[10px] font-mono text-cyan-800 font-bold shadow-sm">
                  Tibia
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">
                  About OsteoVision
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Knee Trabecular Analysis Platform
                </span>
              </div>
            </div>

            {/* Right: Impact Statement */}
            <div className="lg:col-span-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] leading-snug tracking-tight">
                Engineered specifically for knee radiographs to assess early trabecular bone patterns, indicate osteoporosis risk, and present clear, interpretable output.
              </h2>
            </div>

          </div>

          {/* Stats & Proof Grid with Media Slot */}
          <RevealSection delay={0.15}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

              {/* Stats Column (7 cols) */}
              <div className="lg:col-span-7">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                  Quantitative Knee Radiograph Intelligence
                </p>

                <div className="grid grid-cols-3 gap-6 divide-x divide-slate-200">
                  <div className="pr-4">
                    <p className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight font-mono mb-1">
                      3
                    </p>
                    <p className="text-xs text-[#64748B] font-medium">Output Classes (Normal, Osteopenia, Osteoporosis)</p>
                  </div>

                  <div className="px-4">
                    <p className="text-4xl sm:text-5xl font-black text-[#2563EB] tracking-tight font-mono mb-1">
                      100
                    </p>
                    <p className="text-xs text-[#64748B] font-medium">Confidence Score Range (0 - 100)</p>
                  </div>

                  <div className="pl-4">
                    <p className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight font-mono mb-1">
                      100%
                    </p>
                    <p className="text-xs text-[#64748B] font-medium">Exclusively Focused on Knee Joint Views</p>
                  </div>
                </div>
              </div>

              {/* Right Media Slot Card (5 cols) */}
              <div className="lg:col-span-5">
                <MediaSlot
                  src="/images/bone_trabecular.jpg"
                  aspectRatio="aspect-[16/11]"
                  label="Trabecular Bone Architecture — Normal Dense vs Porotic Matrix"
                  type="image"
                  accent="blue"
                />
              </div>

            </div>
          </RevealSection>

        </section>
      </RevealSection>


      {/* ══════════════════════════════════════════════════
          HOW IT WORKS (id="how-it-works")
      ══════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative py-8 sm:py-10 md:py-14 max-w-7xl 2xl:max-w-[1440px] mx-auto px-3.5 sm:px-6 xl:px-10 2xl:px-12 z-10">
        <RevealSection>
          {/* Header */}
          <div className="max-w-3xl mb-6 sm:mb-8">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-2">
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
              From Knee X-Ray to AI-Assisted Result
            </h2>
            <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
              OsteoVision follows a step-by-step workflow. Some steps depend on the current
              implementation of the model backend and are shown only when available.
            </p>
          </div>
        </RevealSection>

        <HowItWorksStepper steps={HOW_IT_WORKS_STEPS} />
      </section>

      {/* ══════════════════════════════════════════════════
          4. "WHY KNEE X-RAYS?" BENTO GRID
      ══════════════════════════════════════════════════ */}
      <RevealSection>
        <section className="relative py-8 sm:py-10 md:py-14 max-w-7xl 2xl:max-w-[1440px] mx-auto px-3.5 sm:px-6 xl:px-10 2xl:px-12 z-10">

          {/* Header with Slider Arrows */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                Knee Specialization
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Why Knee Radiographs for Osteoporosis?
              </h2>
            </div>
          </div>

          {/* 4-Item Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Bento 1: Anatomical Knee Focus (3 cols) */}
            <RevealSection className="md:col-span-3" delay={0}>
              <div className="card-glass-water p-6 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] mb-1">
                    Anatomical Knee Focus
                  </h3>
                  <p className="text-xs text-[#64748B] mb-3">
                    Subchondral cancellous bone around the knee shows early porous changes.
                  </p>
                  <MediaSlot
                    src="/frames/frame_000100.jpg"
                    aspectRatio="aspect-square"
                    label="Anatomical Knee Radiograph (AP View)"
                    type="image"
                  />
                </div>
              </div>
            </RevealSection>

            {/* Bento 2: 3-Class Triage Card (3 cols) */}
            <RevealSection className="md:col-span-3" delay={0.08}>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-3xl text-white flex flex-col justify-between shadow-lg h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md">
                      <Target size={13} />
                      3 Classes
                    </span>
                    <span className="text-[10px] font-mono text-blue-100">
                      Fixed Output
                    </span>
                  </div>
                  <h3 className="text-base font-bold leading-snug mb-3">
                    Each analyzed knee X-ray is reported as Normal, Osteopenia, or Osteoporosis.
                  </h3>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    The prediction is accompanied by a confidence score and, where supported, a visual explanation.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/20 text-[11px] font-mono text-blue-100 uppercase">
                  AI PREDICTION OUTPUT
                </div>
              </div>
            </RevealSection>

            {/* Bento 3: Attention Detection Slot (3 cols) */}
            <RevealSection className="md:col-span-3" delay={0.16}>
              <div className="card-glass-water p-3 overflow-hidden h-full">
                <MediaSlot
                  src="/frames/frame_000299.jpg"
                  aspectRatio="aspect-square"
                  label="Grad-CAM++ Attention Heatmap"
                  type="image"
                  className="h-full"
                />
              </div>
            </RevealSection>

            {/* Bento 4: 0-100 Score Benchmark (3 cols) */}
            <RevealSection className="md:col-span-3" delay={0.24}>
              <div className="card-glass-water p-6 flex flex-col h-full">
                <div>
                  <p className="text-3xl font-black text-[#0F172A] font-mono mb-1">
                    0 — 100
                  </p>
                  <p className="text-xs text-[#64748B] font-medium mb-4">
                    Confidence Score (0–100)
                  </p>
                </div>

                {/* Mini Class Bars representing the 3 tiers — vertically
                    centered in the leftover space so the card never shows
                    a dead gap pinned between header and chart */}
                <div className="flex-1 flex flex-col justify-center min-h-0">
                  <div className="flex items-end justify-between gap-3 h-24 pt-4 border-t border-slate-100">
                    {[
                      { label: 'Normal', score: '24', h: '24%', color: 'bg-emerald-500' },
                      { label: 'Osteopenia', score: '58', h: '58%', color: 'bg-amber-500' },
                      { label: 'Osteo', score: '92', h: '92%', color: 'bg-red-500' },
                    ].map((b) => (
                      <div key={b.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[10px] font-mono font-bold text-slate-700">{b.score}</span>
                        <div
                          className={`w-full rounded-t-lg ${b.color} transition-all duration-500`}
                          style={{ height: b.h }}
                        />
                        <span className="text-[10px] font-mono text-slate-500 truncate w-full text-center">{b.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RevealSection>

          </div>

        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════════
          5. CLINICAL VALIDATION / TESTIMONIAL (id="testimonial")
      ══════════════════════════════════════════════════ */}
      <RevealSection>
        <section id="testimonial" className="relative py-10 md:py-14 max-w-7xl 2xl:max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-10 2xl:px-12 z-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* Left: Avatar Thumbnail (3 cols) */}
            <RevealSection className="lg:col-span-3" delay={0}>
              <div className="card-glass-water p-5 flex flex-col items-center text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Project Rationale
                </span>
                <div className="w-28 h-28 rounded-2xl overflow-hidden mb-3 shadow-md border border-slate-200">
                  <img
                    src="/portraits/clinician.png"
                    alt="Radiology & Clinical Research"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-bold text-[#0F172A]">Clinical Research Lead</p>
                <p className="text-[10px] font-mono text-slate-400">Radiology &amp; Orthopedics</p>
              </div>
            </RevealSection>

            {/* Center: Large Quote Text (6 cols) */}
            <RevealSection className="lg:col-span-6" delay={0.1}>
              <div className="card-glass-water p-8 sm:p-10 flex flex-col justify-between">
                <div className="mb-6">
                  <Quote size={28} className="text-[#2563EB] mb-3 opacity-60" />
                  <p className="text-lg sm:text-xl font-medium text-[#0F172A] leading-relaxed italic">
                    " Millions of patients get routine knee X-rays every year for joint pain. OsteoVision explores whether those existing radiographs can support opportunistic early screening for osteoporosis — as an educational and research concept, not a diagnostic tool. "
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">OsteoVision — Academic Project</p>
                    <p className="text-xs text-[#64748B]">Explainable AI for Knee X-Ray Classification</p>
                  </div>
                </div>
              </div>
            </RevealSection>

            {/* Right: Large Portrait Slot (3 cols) */}
            <RevealSection className="lg:col-span-3" delay={0.2}>
              <MediaSlot
                src="/images/radiology_workstation.jpg"
                aspectRatio="aspect-[4/5]"
                label="Clinical DICOM Diagnostic Suite"
                type="image"
                accent="blue"
              />
            </RevealSection>

          </div>

        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════════
          6. RESEARCH INSIGHTS & PROTOCOLS
      ══════════════════════════════════════════════════ */}
      <RevealSection>
        <section className="relative py-10 md:py-14 max-w-7xl 2xl:max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-10 2xl:px-12 z-10">

          {/* Header */}
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-2">
              Scientific Insights
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Understanding Knee Radiograph Osteoporosis Screening
            </h2>
          </div>

          {/* 3 Research Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-8">
            {[
              {
                author: 'Project Notes',
                time: '6 Min read',
                date: 'Knee Anatomy',
                title: 'How Knee X-Rays Can Reveal Early Micro-Trabecular Loss',
                tag: 'Knee Anatomy',
                image: '/images/research_trabecular.jpg',
              },
              {
                author: 'OsteoVision Project',
                time: '8 Min read',
                date: 'Reference Guide',
                title: 'Understanding the 3 Classes: Normal, Osteopenia, & Osteoporosis',
                tag: 'Class Breakdown',
                image: '/images/research_ai_model.jpg',
              },
              {
                author: 'Study Notes',
                time: '5 Min read',
                date: 'Background',
                title: 'General Context: Calcium, Vitamin D, & DXA Follow-up',
                tag: 'General Information',
                image: '/images/research_bone_health.jpg',
              },
            ].map((blog, idx) => (
              <RevealSection key={idx} delay={idx * 0.1}>
                <div
                  className="card-glass-water p-5 flex flex-col justify-between group h-full"
                >
                  <div>
                    {/* Media Slot with Tag Badge */}
                    <div className="relative mb-4 rounded-2xl overflow-hidden">
                      <MediaSlot
                        src={blog.image}
                        aspectRatio="aspect-[16/11]"
                        label={blog.title}
                        type="image"
                        className="!min-h-[170px]"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#0F172A] shadow-xs">
                        {blog.tag}
                      </div>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2 font-medium">
                      <span className="font-bold text-[#0F172A]">{blog.author}</span>
                      <span>·</span>
                      <span>{blog.time}</span>
                      <span>·</span>
                      <span>{blog.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#0F172A] leading-snug tracking-tight mb-4 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                  </div>

                  {/* Action Link */}
                  <div
                    onClick={() => onNavigate('/about')}
                    className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span>Read More</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>

          {/* Read More Blog Pill */}
          <div className="text-center">
            <button
              onClick={() => onNavigate('/about')}
              className="btn-glass-water-dark inline-flex items-center gap-2.5 px-7 py-3 rounded-full text-xs font-bold cursor-pointer"
            >
              <span>Explore Research &amp; Methodology</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════════
          6.5 FAQ (id="faq")
      ══════════════════════════════════════════════════ */}
      <RevealSection>
        <section id="faq" className="relative py-10 md:py-14 max-w-7xl 2xl:max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-10 2xl:px-12 z-10">

          {/* Header */}
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Understanding OsteoVision
            </h2>
          </div>

          {/* Q&A Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'What is OsteoVision?',
                a: 'OsteoVision is an academic, explainable AI-based web project that classifies knee X-ray images into Normal, Osteopenia, or Osteoporosis. It is intended for educational and preliminary research use, not for medical diagnosis.',
              },
              {
                q: 'How does image analysis work?',
                a: 'After upload and image-type validation, the image is preprocessed and passed to an advanced deep learning classifier, which returns a predicted class and a confidence score. Where supported, a Grad-CAM++ heatmap is generated as a visual explanation.',
              },
              {
                q: 'Which image formats are supported?',
                a: 'PNG and JPEG images are supported. Files that cannot be decoded as a valid image are rejected.',
              },
              {
                q: 'What does the classification mean?',
                a: 'It is the model\u2019s predicted category among the three classes. It is an AI prediction, not a confirmed medical diagnosis.',
              },
              {
                q: 'What does the confidence score mean?',
                a: 'It reflects the model\u2019s relative certainty for its top predicted class. It is not a guarantee of correctness and is not a confirmed probability of disease.',
              },
              {
                q: 'What is Grad-CAM?',
                a: 'Grad-CAM is an explainability method that produces a heatmap highlighting image regions associated with the model\u2019s prediction. A heatmap does not independently establish osteoporosis or prove the model is focusing on clinically meaningful features.',
              },
              {
                q: 'Why might an image fail to process?',
                a: 'A file may not be a valid image, may not be decodable as a radiograph, may not appear to be a knee X-ray, or the analysis backend may be unavailable.',
              },
              {
                q: 'How are uploaded images handled?',
                a: 'Uploaded images are sent to the analysis backend for processing. The current backend processes images in memory and does not implement persistent image storage. No data-retention or deletion guarantee beyond this should be assumed.',
              },
            ].map((item) => (
              <div key={item.q} className="card-tactile p-6 flex flex-col justify-start">
                <h3 className="text-sm font-bold text-[#0F172A] tracking-tight mb-2">{item.q}</h3>
                <p className="text-xs text-[#475569] leading-relaxed font-normal">{item.a}</p>
              </div>
            ))}
          </div>

        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════════
          7. FOOTER & UPLOAD CALL TO ACTION (id="contact")
      ══════════════════════════════════════════════════ */}
      <footer id="contact" className="relative pt-12 pb-8 bg-white/70 backdrop-blur-2xl border-t border-slate-200/80 z-10 overflow-hidden">

        {/* Ambient aurora depth — soft brand glows drifting behind the finale */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          <div
            className="animate-aurora absolute rounded-full"
            style={{
              width: '42vw', height: '42vw', right: '-6%', top: '-12%',
              ['--dur' as string]: '24s', ['--delay' as string]: '0s',
              background: 'radial-gradient(closest-side, rgba(37,99,235,0.07), rgba(37,99,235,0) 70%)',
            } as React.CSSProperties}
          />
          <div
            className="animate-aurora absolute rounded-full"
            style={{
              width: '38vw', height: '38vw', left: '-8%', bottom: '-16%',
              ['--dur' as string]: '28s', ['--delay' as string]: '-8s',
              background: 'radial-gradient(closest-side, rgba(34,211,238,0.07), rgba(34,211,238,0) 70%)',
            } as React.CSSProperties}
          />
        </div>

        <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto px-5 sm:px-8 xl:px-10 2xl:px-12 relative z-10">

          {/* Top CTA & Newsletter Row */}
          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-slate-200/80 items-center">

              <div className="lg:col-span-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-5">
                  Protect Bone Strength <br />
                  Analyze Your Knee X-Ray Today
                </h2>
                <div className="relative inline-flex">
                  <span
                    aria-hidden="true"
                    className="cta-beacon pointer-events-none absolute inset-0 rounded-full"
                    style={{ border: '2px solid rgba(37,99,235,0.5)' }}
                  />
                  <button
                    onClick={() => onNavigate('/studio')}
                    className="btn-tactile-dark relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-bold cursor-pointer"
                  >
                    <ScanLine size={16} />
                    <span>Analyze a Knee X-ray</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <p className="text-xs text-[#64748B] mb-3">
                  Subscribe to receive updates on enhancements, knee radiograph benchmarking, and bone density research.
                </p>

                {/* Newsletter Input Form */}
                <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    placeholder="Your Email Address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-full bg-slate-50 border border-slate-200 text-xs text-[#0F172A] focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="btn-glass-water-dark px-6 py-3 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer"
                  >
                    {subscribed ? 'Subscribed ✓' : 'Subscribe'}
                  </button>
                </form>
              </div>

            </div>
          </RevealSection>

          {/* Middle Nav Links & Contact Row */}
          <div className="py-14 grid grid-cols-2 md:grid-cols-12 gap-8 items-start">

            {/* Nav Column 1: Platform */}
            <div className="md:col-span-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Platform
              </p>
              <ul className="space-y-2.5 text-xs text-[#475569] font-medium">
                <li><button onClick={() => onNavigate('/')} className="hover:text-blue-600 transition-colors cursor-pointer">Home</button></li>
                <li><button onClick={() => onNavigate('/', 'services')} className="hover:text-blue-600 transition-colors cursor-pointer">Diagnostic Output</button></li>
                <li><button onClick={() => goToSection('how-it-works')} className="hover:text-blue-600 transition-colors cursor-pointer">How It Works</button></li>
                <li><button onClick={() => onNavigate('/', 'about-us')} className="hover:text-blue-600 transition-colors cursor-pointer">About OsteoVision</button></li>
                <li><button onClick={() => onNavigate('/studio')} className="hover:text-blue-600 transition-colors cursor-pointer">Analyze a Knee X-ray</button></li>
                <li><button onClick={() => goToSection('faq')} className="hover:text-blue-600 transition-colors cursor-pointer">FAQ</button></li>
              </ul>
            </div>

            {/* Nav Column 2: Scope & Output */}
            <div className="md:col-span-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Output Classes
              </p>
              <ul className="space-y-2.5 text-xs text-[#475569] font-medium">
                <li><span className="text-slate-700 font-semibold">Knee Radiographs Only</span></li>
                <li><span className="text-slate-600">Normal</span></li>
                <li><span className="text-slate-600">Osteopenia</span></li>
                <li><span className="text-slate-600">Osteoporosis</span></li>
              </ul>
            </div>

            {/* Nav Column 3: Legal & Safety */}
            <div className="md:col-span-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Safety &amp; Ethics
              </p>
              <ul className="space-y-2.5 text-xs text-[#475569] font-medium">
                <li><button onClick={() => onNavigate('/privacy')} className="hover:text-blue-600 transition-colors cursor-pointer">Privacy Policy</button></li>
                <li><button onClick={() => goToSection('medical-disclaimer')} className="hover:text-blue-600 transition-colors cursor-pointer">Medical Disclaimer</button></li>
              </ul>
            </div>

            {/* Academic Project Note (4 cols) */}
            <div className="col-span-2 md:col-span-4 flex flex-col items-start md:items-end text-left md:text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                About This Project
              </p>
              <p className="text-sm text-[#475569] leading-relaxed max-w-sm font-medium">
                OsteoVision is an academic, educational and research-oriented AI project.
                It is not a medical device and does not provide clinical diagnosis.
              </p>
            </div>

          </div>

          {/* Giant Watermark Typography with Subtle Interactive Cursor Effect */}
          <InteractiveFooterWordmark />

          {/* Bottom Disclaimer & Copyright */}
          <div id="medical-disclaimer" className="pt-6 border-t border-slate-200/80 flex flex-col gap-3 text-xs text-slate-500 font-medium">
            <span className="text-[11px] text-slate-500 leading-relaxed">
              OsteoVision is an educational and research-oriented AI project. Its outputs are
              generated by a Deep-learning model and may contain errors. Results must not be
              used as a substitute for professional medical evaluation, diagnosis, or treatment
              decisions. Consult a qualified healthcare professional for clinical assessment.
            </span>
            <div>
              © 2026 OsteoVision. Academic project for knee radiograph osteoporosis classification.
            </div>
          </div>

        </div>

      </footer>

    </div>
  );
};
