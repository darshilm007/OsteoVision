import React, { useEffect, useMemo, useRef } from 'react';

/* ─────────────────────────────────────────────
   HeroAmbient — decorative background life layered between the hero
   video/gradients and the hero text (z-index sits below content).
   - Aurora mesh: soft radial glows that slowly drift (no blur filter,
     the radial gradient is already feathered → GPU-cheap).
   - Particle field: tiny cyan/white motes rising slowly.
   - Depth parallax: aurora and particles shift by different amounts on
     mouse move, giving a subtle 3D separation.
   - Fully motion-safe: parallax skipped on reduced-motion; CSS reduced
     block neutralises the drift/rise animations.
───────────────────────────────────────────── */

type Particle = {
  left: number;    // %
  bottom: number;  // % (start position)
  size: number;    // px
  dur: number;     // s
  delay: number;   // s
  tint: 'cyan' | 'white' | 'blue';
};

const PARTICLE_COUNT = 12;

const TINT_SHADOW: Record<Particle['tint'], string> = {
  cyan: '0 0 6px 1px rgba(34,211,238,0.6)',
  white: '0 0 5px 1px rgba(255,255,255,0.55)',
  blue: '0 0 6px 1px rgba(96,165,250,0.55)',
};

export const HeroAmbient: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  const particles = useMemo<Particle[]>(() => {
    const tints: Particle['tint'][] = ['cyan', 'white', 'blue', 'cyan', 'white'];
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      left: Math.random() * 100,
      bottom: Math.random() * 55,
      size: 2 + Math.random() * 3,
      dur: 9 + Math.random() * 9,
      delay: Math.random() * 9,
      tint: tints[Math.floor(Math.random() * tints.length)],
    }));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const px = (e.clientX / window.innerWidth) * 2 - 1;   // -1 → 1
        const py = (e.clientY / window.innerHeight) * 2 - 1;
        root.style.setProperty('--px', px.toFixed(3));
        root.style.setProperty('--py', py.toFixed(3));
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none overflow-hidden"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        ['--px' as string]: '0',
        ['--py' as string]: '0',
      } as React.CSSProperties}
    >
      {/* ── Aurora mesh group (moves with cursor) ── */}
      <div
        className="absolute inset-0"
        style={{
          transform:
            'translate3d(calc(var(--px) * 9px), calc(var(--py) * 6px), 0)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          mixBlendMode: 'screen',
        }}
      >
        <div
          className="animate-aurora absolute rounded-full"
          style={{
            width: '46vw', height: '46vw', left: '34%', top: '6%',
            ['--dur' as string]: '20s', ['--delay' as string]: '0s',
            background:
              'radial-gradient(closest-side, rgba(34,211,238,0.22), rgba(34,211,238,0) 72%)',
          } as React.CSSProperties}
        />
        <div
          className="animate-aurora absolute rounded-full"
          style={{
            width: '52vw', height: '52vw', right: '2%', bottom: '-8%',
            ['--dur' as string]: '26s', ['--delay' as string]: '-6s',
            background:
              'radial-gradient(closest-side, rgba(37,99,235,0.20), rgba(37,99,235,0) 70%)',
          } as React.CSSProperties}
        />
        <div
          className="animate-aurora absolute rounded-full"
          style={{
            width: '38vw', height: '38vw', left: '6%', bottom: '-6%',
            ['--dur' as string]: '23s', ['--delay' as string]: '-12s',
            background:
              'radial-gradient(closest-side, rgba(96,165,250,0.16), rgba(96,165,250,0) 72%)',
          } as React.CSSProperties}
        />
      </div>

      {/* ── Particle field (moves opposite for depth) ── */}
      <div
        className="absolute inset-0"
        style={{
          transform:
            'translate3d(calc(var(--px) * -6px), calc(var(--py) * -4px), 0)',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {particles.map((p, i) => (
          <span
            key={i}
            className="animate-particle absolute rounded-full"
            style={{
              left: `${p.left}%`,
              bottom: `${p.bottom}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background:
                p.tint === 'white'
                  ? 'rgba(255,255,255,0.75)'
                  : p.tint === 'cyan'
                    ? 'rgba(34,211,238,0.72)'
                    : 'rgba(147,197,253,0.72)',
              boxShadow: TINT_SHADOW[p.tint],
              ['--dur' as string]: `${p.dur}s`,
              ['--delay' as string]: `${p.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
};
