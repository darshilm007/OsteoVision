import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  Bone,
  Layers,
  Play,
  Image as ImageIcon,
  Quote,
  Youtube,
  Facebook,
  Twitter,
  Instagram,
  ScanLine,
  Target,
} from 'lucide-react';
import { InteractiveFooterWordmark } from '../components/InteractiveFooterWordmark';

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
            <Layers size={12} color="#18304D" />
            <span style={{
              fontSize: '9.5px', fontWeight: 700, letterSpacing: '1.2px',
              color: '#18304D', textTransform: 'uppercase',
            }}>
              Detection
            </span>
          </div>

          {/* Three translucent internal rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {([
              { label: 'Normal',       dot: '#22c55e' },
              { label: 'Osteopenia',   dot: '#f59e0b' },
              { label: 'Osteoporosis', dot: '#25BFD6' },
            ] as const).map(({ label, dot }) => (
              <div
                key={label}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255, 255, 255, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: '9px',
                  height: '31px',
                  padding: '0 10px',
                }}
              >
                <div style={{ width: '5.5px', height: '5.5px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#10233F', letterSpacing: '0.01em' }}>
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
            <ScanLine size={12} color="#18304D" />
            <span style={{
              fontSize: '9.5px', fontWeight: 700, letterSpacing: '1.2px',
              color: '#18304D', textTransform: 'uppercase',
            }}>
              Radiograph
            </span>
          </div>

          {/* Content */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              fontSize: '15px', fontWeight: 700, color: '#10233F',
              marginBottom: '2px', letterSpacing: '-0.01em', lineHeight: 1.25,
            }}>
              Trabecular Pattern
            </div>
            <div style={{ fontSize: '11px', color: '#49627E', fontWeight: 500 }}>
              Analysis layer active
            </div>
          </div>

          {/* Analysis Ready status pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            borderRadius: '8px',
            padding: '4.5px 9px',
          }}>
            <span style={{
              width: '5.5px', height: '5.5px', borderRadius: '50%',
              background: '#25BFD6',
              boxShadow: '0 0 6px rgba(37, 191, 214, 0.70)',
              flexShrink: 0,
              display: 'inline-block',
            }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#10233F', letterSpacing: '0.01em' }}>
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
            <Bone size={12} color="#18304D" />
            <span style={{
              fontSize: '9.5px', fontWeight: 700, letterSpacing: '1.2px',
              color: '#18304D', textTransform: 'uppercase',
            }}>
              Bone Health Score
            </span>
          </div>

          {/* Score value */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '9px' }}>
            <span style={{
              fontSize: '46px', fontWeight: 800, lineHeight: 1,
              color: '#10233F',
              letterSpacing: '-0.04em',
            }}>
              92
            </span>
            <span style={{ fontSize: '18px', fontWeight: 600, color: '#49627E', paddingBottom: '3px' }}>
              /100
            </span>
          </div>

          {/* Sub-label row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#49627E', fontWeight: 500 }}>
              Calibrated assessment
            </span>
            <span style={{
              fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
              color: '#5D7590',
              background: 'rgba(255, 255, 255, 0.20)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '5px', padding: '2px 5px',
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
  onNavigate:   (route: string, sectionId?: string) => void;
  targetSection?: string | null;
  navKey?:        number;
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
    cyan:  'hover:border-cyan-400 group-hover:text-cyan-500',
    blue:  'hover:border-blue-400 group-hover:text-blue-600',
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
      <div className={`relative w-full ${aspectRatio} rounded-2xl md:rounded-3xl overflow-hidden shadow-lg ${className}`}>
        <img
          src={src}
          alt={label}
          className="w-full h-full object-cover"
        />
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

const RevealSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children, className = '', delay = 0,
}) => {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(36px)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

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
        if (entry.isIntersecting) { void v.play().catch(() => {}); }
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
      desc: 'Opportunistic knee X-ray screening detects silent bone loss years before fractures — with zero extra radiation or visits.',
      image: '/card-1.png',
      fallbackImage: '/portraits/card-1.png',
      defaultImage: '/portraits/patient.png',
    },
    {
      id: 'clinician',
      title: 'Orthopedic Clinicians',
      desc: 'Quantitative 0–100 bone scores and 3-class diagnosis for safer knee arthroplasty, implant sizing, and surgical confidence.',
      image: '/card-2.png',
      fallbackImage: '/portraits/card-2.png',
      defaultImage: '/portraits/clinician.png',
    },
    {
      id: 'imaging',
      title: 'Radiology & Imaging',
      desc: 'Automated trabecular analysis integrated into PACS/DICOM pipelines, creating clinical value with zero new hardware.',
      image: '/card-3.png',
      fallbackImage: '/portraits/card-3.png',
      defaultImage: '/portraits/imaging.png',
    },
    {
      id: 'hospital',
      title: 'Hospitals & Networks',
      desc: 'Reduces secondary fragility fracture readmissions, lowers complication costs, and standardizes bone triage at scale.',
      image: '/card-4.png',
      fallbackImage: '/portraits/card-4.png',
      defaultImage: '/portraits/hospital.png',
    },
  ];

  return (
    <div className="animate-pageEnter relative overflow-hidden">

      {/* ══════════════════════════════════════════════════
          1. HERO SECTION — Full-Viewport Video Background
          Layer 1: Video · Layer 2: Cinematic gradient · Layer 3: Content
      ══════════════════════════════════════════════════ */}

      {/* ── Hero Viewport Block — exactly 100vh ── */}
      <div
        className="hero-viewport"
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          minHeight: '600px',
          overflow: 'hidden',
        }}
      >
        {/* ── LAYER 1: Full-bleed Background Video ── */}
        <video
          ref={heroVideoRef}
          src="/videos/watermark-removed (2).mp4"
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
              'linear-gradient(to right, rgba(8,14,36,0.62) 0%, rgba(8,14,36,0.38) 28%, rgba(8,14,36,0.12) 52%, rgba(8,14,36,0.0) 68%)',
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

        {/* ── LAYER 3: Hero Content ── */}
        <div
          className="hero-main-content-wrap"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            paddingTop: '88px',   /* clear the fixed header */
            paddingBottom: '80px',
          }}
        >
          <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 xl:px-10">
            <div className="hero-content-grid">
            {/* ── LEFT CONTENT ZONE (40-45%) ── */}
            <div className="hero-left-content" style={{ maxWidth: '520px' }}>

              {/* Small specialty badge */}
              <div
                className="hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6"
                style={{
                  background: 'rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.22)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: '#22D3EE', boxShadow: '0 0 6px #22D3EE' }}
                />
                <span
                  className="text-[10px] font-bold tracking-[0.12em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.88)' }}
                >
                  Dedicated to Knee Radiographs Only
                </span>
              </div>

              {/* Main headline — stacked lines with color rules */}
              <h1
                className="font-extrabold tracking-tight leading-[1.07] mb-5"
                style={{
                  fontSize: 'clamp(2.4rem, 4vw, 3.5rem)',
                  letterSpacing: '-0.02em',
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
                  Knee X-Ray
                </span>
                {/* Line 2: OsteoVision clinical blue */}
                <span
                  className="block"
                  style={{
                    color: '#60A5FA',
                    textShadow: '0 2px 20px rgba(37,99,235,0.38)',
                  }}
                >
                  Osteoporosis
                </span>
                {/* Line 3: deep navy / near-black */}
                <span
                  className="block"
                  style={{
                    color: '#E8EDF5',
                    textShadow: '0 2px 18px rgba(0,0,0,0.45)',
                  }}
                >
                  Detection Platform
                </span>
              </h1>

              {/* Description */}
              <p
                className="leading-relaxed mb-8 font-normal"
                style={{
                  color: 'rgba(220,228,240,0.80)',
                  fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
                  maxWidth: '440px',
                  textShadow: '0 1px 6px rgba(0,0,0,0.28)',
                }}
              >
                Upload your knee X-ray to receive an objective bone health
                assessment. The system analyzes trabecular density and outputs{' '}
                <strong style={{ color: 'rgba(240,246,255,0.97)', fontWeight: 600 }}>Normal</strong>,{' '}
                <strong style={{ color: 'rgba(240,246,255,0.97)', fontWeight: 600 }}>Osteopenia</strong>, or{' '}
                <strong style={{ color: 'rgba(240,246,255,0.97)', fontWeight: 600 }}>Osteoporosis</strong> with a calibrated{' '}
                <strong style={{ color: 'rgba(240,246,255,0.97)', fontWeight: 600 }}>score out of 100</strong> and clinical action suggestions.
              </p>

              {/* Primary CTA — premium rounded pill */}
              <button
                id="hero-upload-cta"
                onClick={onOpenUpload}
                className="hero-cta-btn inline-flex items-center gap-3 cursor-pointer group"
                style={{
                  padding: '10px 12px 10px 26px',
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
                  Upload Knee X-Ray
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

            </div>{/* end left content zone */}

            {/* ── RIGHT ZONE: reserved for the X-ray video (no content placed here) ── */}
            <div aria-hidden="true" style={{ display: 'block' }} />

          </div>{/* end hero-content-grid */}
          </div>{/* end max-w-7xl */}
        </div>{/* end layer 3 content */}


        {/* ── Floating Diagnostic Glass Cards ── */}
        <DiagnosticFloatingCards />

        {/* ── Scroll indicator at bottom-center ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
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

      {/* ══════════════════════════════════════════════════
          2. DIAGNOSTIC SERVICES & 3-CLASS OUTPUT BREAKDOWN (id="services")
      ══════════════════════════════════════════════════ */}
      <RevealSection>
        <section id="services" className="relative py-20 max-w-7xl mx-auto px-5 sm:px-8 xl:px-10 z-10">
          
          {/* Section Header */}
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-2">
              Diagnostic Output &amp; Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
              3-Class Classification, 100-Point Score &amp; Action Suggestions
            </h2>
            <p className="text-[#475569] text-base leading-relaxed">
              When a knee X-ray is processed by the backend, OsteoVision delivers a structured tri-fold diagnosis: 
              exact classification category, an objective score out of 100, and recommended clinical actions.
            </p>
          </div>

          {/* Dual Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Card 1: Interactive 3-Class Output Simulator (6 cols) */}
            <RevealSection className="lg:col-span-6" delay={0.05}>
              <div className="card-glass-water p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-md h-full border border-slate-200/80">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      The 3 Output Classes
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#2563EB]">
                      Click class to test
                    </span>
                  </div>

                  {/* Class Switcher Tabs */}
                  <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-100/80 border border-slate-200 mb-6">
                    {(['normal', 'osteopenia', 'osteoporosis'] as const).map((cls) => (
                      <button
                        key={cls}
                        onClick={() => setSelectedDemoClass(cls)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                          selectedDemoClass === cls
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
                        <span className="font-mono font-black text-base text-[#0F172A]">{currentDemo.score} / 100</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            selectedDemoClass === 'normal'
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
                      <strong className="text-slate-900 block mb-1">Radiological Findings:</strong>
                      {currentDemo.findings}
                    </div>

                    <div className="text-xs text-blue-900 bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
                      <strong className="text-[#1D4ED8] block mb-1">Suggested Next Actions:</strong>
                      {currentDemo.suggestion}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Ready to test your knee X-ray?</span>
                  <button
                    onClick={onOpenUpload}
                    className="btn-glass-water-dark inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                  >
                    <span>Launch Studio</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </RevealSection>

            {/* Card 2: Knee Radiograph Media & Score Visualization (6 cols) */}
            <RevealSection className="lg:col-span-6" delay={0.15}>
              <div className="card-glass-water p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-md h-full border border-slate-200/80">
                
                {/* Knee Detection Media Slot */}
                <div className="mb-6">
                  <MediaSlot
                    aspectRatio="aspect-[16/9]"
                    label="Knee Detection Region &amp; Bounding ROI Slot"
                    dimensions="1200 × 700 px"
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
                      <p className="text-sm font-bold text-[#0F172A]">3 Classes + Score /100</p>
                    </div>
                  </div>

                  {/* Segmented Risk Gauge */}
                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="font-medium text-[#475569]">Severity Range Breakdown</span>
                      <span className="font-mono text-slate-400 text-[11px]">Normal (0-30) · Osteopenia (31-70) · Osteoporosis (71-100)</span>
                    </div>

                    {/* Multi-tier segmented bar */}
                    <div className="flex items-center gap-1.5 h-3">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-full rounded-full transition-all ${
                            i < 4
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
        <section className="relative py-12 max-w-7xl mx-auto px-5 sm:px-8 xl:px-10 z-10">
          
          {/* Header */}
          <div className="max-w-3xl mb-6">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-2">
              Knee Osteoporosis Diagnostic Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight mb-3">
              Value Across the Entire Knee Care Continuum
            </h2>
            <p className="text-[#475569] text-base leading-relaxed">
              Hover over each card to explore how OsteoVision transforms routine knee radiographs into definitive 3-class osteoporosis detection, 0–100 bone density scores, and proactive care guidance.
            </p>
          </div>

          {/* 4 Interactive Stakeholder Cards (Exact 1:1 Match to Reference Video) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-28 pb-20">
            {stakeholderCards.map((card) => {
              const isHovered = hoveredStakeholder === card.id;

              return (
                <div
                  key={card.id}
                  onMouseEnter={() => setHoveredStakeholder(card.id)}
                  onMouseLeave={() => setHoveredStakeholder(null)}
                  className={`impact-card-wrapper ${isHovered ? 'is-active' : ''}`}
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

                  {/* Front Layer: Frosted Periwinkle Glass Card */}
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
        <section id="about-us" className="relative py-20 max-w-7xl mx-auto px-5 sm:px-8 xl:px-10 z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
            
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
                Engineered specifically for knee radiographs to spot early trabecular bone loss, grade osteoporosis risk, and provide clear clinical guidance.
              </h2>
            </div>

          </div>

          {/* Stats & Proof Grid with Media Slot */}
          <RevealSection delay={0.15}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
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
                    <p className="text-xs text-[#64748B] font-medium">Calibrated Severity Score Range (0 - 100)</p>
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
                  aspectRatio="aspect-[16/11]"
                  label="Knee Bone Architecture &amp; Density Map Slot"
                  dimensions="1200 × 800 px"
                  type="image"
                  accent="blue"
                />
              </div>

            </div>
          </RevealSection>

        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════════
          4. "WHY KNEE X-RAYS?" BENTO GRID
      ══════════════════════════════════════════════════ */}
      <RevealSection>
        <section className="relative py-20 max-w-7xl mx-auto px-5 sm:px-8 xl:px-10 z-10">
          
          {/* Header with Slider Arrows */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
                Knee Specialization
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Why Knee Radiographs for Osteoporosis?
              </h2>
            </div>
          </div>

          {/* 4-Item Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento 1: Anatomical Knee Focus (3 cols) */}
            <RevealSection className="md:col-span-3" delay={0}>
              <div className="card-glass-water p-6 rounded-3xl flex flex-col justify-between h-full border border-slate-200/80">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] mb-1">
                    Anatomical Knee Focus
                  </h3>
                  <p className="text-xs text-[#64748B] mb-3">
                    Subchondral cancellous bone around the knee shows early porous changes.
                  </p>
                  <MediaSlot
                    aspectRatio="aspect-square"
                    label="Knee Joint Trabecular Anatomy Slot"
                    dimensions="500 × 500"
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
                      Zero Ambiguity
                    </span>
                  </div>
                  <h3 className="text-base font-bold leading-snug mb-3">
                    Every uploaded knee scan resolves into Normal, Osteopenia, or Osteoporosis.
                  </h3>
                  <p className="text-xs text-blue-100 leading-relaxed">
                    Accompanied by an objective score out of 100 for reliable tracking and clear suggestions.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/20 text-[11px] font-mono text-blue-100 uppercase">
                  CALIBRATED DIAGNOSTIC METRIC
                </div>
              </div>
            </RevealSection>

            {/* Bento 3: Attention Detection Slot (3 cols) */}
            <RevealSection className="md:col-span-3" delay={0.16}>
              <div className="card-glass-water p-3 rounded-3xl overflow-hidden h-full border border-slate-200/80">
                <MediaSlot
                  aspectRatio="aspect-square"
                  label="Detection Heatmap &amp; ROI Slot"
                  dimensions="800 × 800"
                  type="image"
                  className="h-full"
                />
              </div>
            </RevealSection>

            {/* Bento 4: 0-100 Score Benchmark (3 cols) */}
            <RevealSection className="md:col-span-3" delay={0.24}>
              <div className="card-glass-water p-6 rounded-3xl flex flex-col justify-between h-full border border-slate-200/80">
                <div>
                  <p className="text-3xl font-black text-[#0F172A] font-mono mb-1">
                    0 — 100
                  </p>
                  <p className="text-xs text-[#64748B] font-medium mb-4">
                    Continuous Bone Fragility Index
                  </p>
                </div>

                {/* Mini Class Bars representing the 3 tiers */}
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
            </RevealSection>

          </div>

        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════════════
          5. CLINICAL VALIDATION / TESTIMONIAL (id="testimonial")
      ══════════════════════════════════════════════════ */}
      <RevealSection>
        <section id="testimonial" className="relative py-20 max-w-7xl mx-auto px-5 sm:px-8 xl:px-10 z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Avatar Thumbnail (3 cols) */}
            <RevealSection className="lg:col-span-3" delay={0}>
              <div className="card-glass-water p-5 rounded-3xl flex flex-col items-center text-center border border-slate-200/80">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Clinical Validation
                </span>
                <div className="w-28 h-28 rounded-2xl overflow-hidden mb-3">
                  <MediaSlot
                    aspectRatio="aspect-square"
                    label="Radiologist Slot"
                    dimensions="300 × 300"
                    type="image"
                    className="!p-2 text-[9px]"
                  />
                </div>
                <p className="text-xs font-bold text-[#0F172A]">Orthopedic Research</p>
                <p className="text-[10px] font-mono text-slate-400">DXA Correlation Benchmark</p>
              </div>
            </RevealSection>

            {/* Center: Large Quote Text (6 cols) */}
            <RevealSection className="lg:col-span-6" delay={0.1}>
              <div className="card-glass-water p-8 sm:p-10 rounded-3xl flex flex-col justify-between border border-slate-200/80">
                <div className="mb-6">
                  <Quote size={28} className="text-[#2563EB] mb-3 opacity-60" />
                  <p className="text-lg sm:text-xl font-medium text-[#0F172A] leading-relaxed italic">
                    " Millions of patients get routine knee X-rays every year for joint pain. OsteoVision turns those existing radiographs into an opportunistic early-detection screening tool for osteoporosis before a fragility fracture happens. "
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-[#0F172A]">Dr. Marcus Vance, MD</p>
                    <p className="text-xs text-[#64748B]">Consultant Musculoskeletal Radiologist</p>
                  </div>
                </div>
              </div>
            </RevealSection>

            {/* Right: Large Portrait Slot (3 cols) */}
            <RevealSection className="lg:col-span-3" delay={0.2}>
              <MediaSlot
                aspectRatio="aspect-[4/5]"
                label="Clinical Workstation Media Slot"
                dimensions="800 × 1000"
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
        <section className="relative py-20 max-w-7xl mx-auto px-5 sm:px-8 xl:px-10 z-10">
          
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-2">
              Scientific Insights
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Understanding Knee Radiograph Osteoporosis Screening
            </h2>
          </div>

          {/* 3 Research Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                author: 'Medical Imaging Team',
                time: '6 Min read',
                date: 'Radiology Update',
                title: 'How Knee X-Rays Reveal Early Micro-Trabecular Loss',
                tag: 'Knee Anatomy',
              },
              {
                author: 'OsteoVision Research',
                time: '8 Min read',
                date: 'Diagnostic Guide',
                title: 'Interpreting the 3 Classes: Normal, Osteopenia, & Osteoporosis',
                tag: 'Class Breakdown',
              },
              {
                author: 'Bone Health Institute',
                time: '5 Min read',
                date: 'Care Pathway',
                title: 'Actionable Suggestions: Calcium, Vitamin D, & DXA Follow-up',
                tag: 'Recommendations',
              },
            ].map((blog, idx) => (
              <RevealSection key={idx} delay={idx * 0.1}>
                <div
                  className="card-glass-water p-5 rounded-3xl flex flex-col justify-between group hover:shadow-lg transition-all h-full border border-slate-200/80"
                >
                  <div>
                    {/* Media Slot with Tag Badge */}
                    <div className="relative mb-4 rounded-2xl overflow-hidden">
                      <MediaSlot
                        aspectRatio="aspect-[16/11]"
                        label={`Research Graphic Slot ${idx + 1}`}
                        dimensions="900 × 600"
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
                    <span>Read Full Methodology</span>
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
          7. FOOTER & UPLOAD CALL TO ACTION (id="contact")
      ══════════════════════════════════════════════════ */}
      <footer id="contact" className="relative pt-20 pb-12 bg-white/70 backdrop-blur-2xl border-t border-slate-200/80 z-10 overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-5 sm:px-8 xl:px-10 relative z-10">
          
          {/* Top CTA & Newsletter Row */}
          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-16 border-b border-slate-200/80 items-center">
              
              <div className="lg:col-span-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                  Protect Bone Strength <br />
                  Analyze Your Knee X-Ray Today
                </h2>
              </div>

              <div className="lg:col-span-6">
                <p className="text-xs text-[#64748B] mb-3">
                  Subscribe to receive updates on algorithm enhancements, knee radiograph benchmarking, and bone density research.
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
                <li><button onClick={() => onNavigate('/', 'about-us')} className="hover:text-blue-600 transition-colors cursor-pointer">About OsteoVision</button></li>
                <li><button onClick={() => onNavigate('/studio')} className="hover:text-blue-600 transition-colors cursor-pointer">Upload Studio</button></li>
              </ul>
            </div>

            {/* Nav Column 2: Scope & Output */}
            <div className="md:col-span-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Diagnostic Scope
              </p>
              <ul className="space-y-2.5 text-xs text-[#475569] font-medium">
                <li><span className="text-slate-700 font-semibold">Knee Radiographs Only</span></li>
                <li><span className="text-slate-600">Normal Class (0-30 Score)</span></li>
                <li><span className="text-slate-600">Osteopenia Class (31-70 Score)</span></li>
                <li><span className="text-slate-600">Osteoporosis Class (71-100 Score)</span></li>
              </ul>
            </div>

            {/* Nav Column 3: Legal & Safety */}
            <div className="md:col-span-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Safety &amp; Ethics
              </p>
              <ul className="space-y-2.5 text-xs text-[#475569] font-medium">
                <li><a href="#privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-blue-600 transition-colors">Terms of Use</a></li>
                <li><a href="#disclaimer" className="hover:text-blue-600 transition-colors">Clinical Disclaimer</a></li>
              </ul>
            </div>

            {/* Contact Box (4 cols) */}
            <div className="col-span-2 md:col-span-4 flex flex-col items-start md:items-end text-left md:text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Questions or Dataset Collaboration?
              </p>
              <a
                href="mailto:contact@osteovision.ai"
                className="text-lg sm:text-2xl font-black text-[#0F172A] tracking-tight hover:text-blue-600 transition-colors font-mono mb-4"
              >
                contact@osteovision.ai
              </a>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 mr-1">Follow Us:</span>
                <a href="#fb" className="w-8 h-8 rounded-full badge-glass-water flex items-center justify-center text-slate-600 hover:text-blue-600">
                  <Facebook size={14} />
                </a>
                <a href="#ig" className="w-8 h-8 rounded-full badge-glass-water flex items-center justify-center text-slate-600 hover:text-pink-600">
                  <Instagram size={14} />
                </a>
                <a href="#x" className="w-8 h-8 rounded-full badge-glass-water flex items-center justify-center text-slate-600 hover:text-black">
                  <Twitter size={14} />
                </a>
                <a href="#yt" className="w-8 h-8 rounded-full badge-glass-water flex items-center justify-center text-slate-600 hover:text-red-600">
                  <Youtube size={14} />
                </a>
              </div>
            </div>

          </div>

          {/* Giant Watermark Typography with Subtle Interactive Cursor Effect */}
          <InteractiveFooterWordmark />

          {/* Bottom Disclaimer & Copyright */}
          <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
            <div>
              © 2026 OsteoVision. Strictly dedicated to knee radiograph osteoporosis screening.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[11px] text-slate-400">Not a replacement for clinical DXA scans. Always consult an orthopedic specialist.</span>
            </div>
          </div>

        </div>

      </footer>

    </div>
  );
};
