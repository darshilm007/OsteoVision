import React, { useEffect, useRef, useCallback } from 'react';

/**
 * InteractiveFooterWordmark
 * 
 * An exact reproduction of the reference dot-matrix text interaction:
 * 1. The wordmark "OsteoVision" is ALWAYS composed of a uniform dot matrix grid.
 * 2. All dots are the EXACT SAME clinical slate color (#94A3B8 / rgba(148, 163, 184, 0.85)),
 *    matching the reference image & video.
 * 3. When the normal mouse cursor moves over the wordmark, dots within the cursor radius (85px)
 *    are dynamically pushed outward (magnetic dispersion), creating a clean circular clearing
 *    with scattered particles around the rim.
 * 4. As the cursor moves away, the dots smoothly spring back into their exact matrix grid
 *    with calibrated spring & damping physics.
 * 5. When resting, the canvas renders the static dot grid with zero CPU/GPU overhead.
 * 6. Uses the browser's normal default mouse cursor.
 */

interface DotParticle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const InteractiveFooterWordmark: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const particlesRef = useRef<DotParticle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);
  // When the OS asks for reduced motion, the dispersion loop never starts
  // (the static dot matrix still renders normally).
  const reducedMotionRef = useRef<boolean>(false);

  // Mouse tracking with lerping
  const mouseRef = useRef({
    targetX: -1000,
    targetY: -1000,
    currX: -1000,
    currY: -1000,
    isHovering: false,
    hasMoved: false,
    isTouch: false,
  });

  // Check touch devices + reduced-motion preference
  useEffect(() => {
    mouseRef.current.isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReduce = () => { reducedMotionRef.current = mqReduce.matches; };
    syncReduce();
    mqReduce.addEventListener('change', syncReduce);
    return () => mqReduce.removeEventListener('change', syncReduce);
  }, []);

  // Dot color matching the reference image and video exactly (uniform clean slate)
  const DOT_COLOR = 'rgba(148, 163, 184, 0.85)';
  const MOUSE_RADIUS = 90; // Dispersion radius (pixels)
  const SPRING = 0.085;    // Spring return stiffness
  const FRICTION = 0.82;   // Damping / friction

  // Draw static state onto canvas
  const drawDots = useCallback((ctx: CanvasRenderingContext2D, dpr: number) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    ctx.fillStyle = DOT_COLOR;
    const particles = particlesRef.current;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }, [DOT_COLOR]);

  // Build the dot matrix from rasterized typography
  const buildMatrix = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;

    // Font size is resolved FIRST — the band height then hugs the actual
    // lettering, so the top/bottom whitespace stays medium (not a fixed
    // 290px box with dead air around ~195px of text).
    const off = document.createElement('canvas');
    const offCtx = off.getContext('2d');
    if (!offCtx) return;

    let fontSize = Math.max(64, Math.min(width * 0.165, 210));
    const fontFor = (size: number) =>
      `900 ${size}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
    offCtx.font = fontFor(fontSize);
    // Fit-to-width: shrink until the wordmark fits inside the canvas with margin,
    // so no edge letters get clipped at any viewport size.
    const maxTextWidth = width * 0.94;
    const measured = offCtx.measureText('OsteoVision').width;
    if (measured > maxTextWidth) {
      fontSize = Math.max(40, fontSize * (maxTextWidth / measured));
    }

    // Ascender→descender ≈ 0.95em; ×1.22 leaves a medium ~13% margin top & bottom
    const height = Math.round(Math.max(90, fontSize * 1.22));
    container.style.height = `${height}px`;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Resizing a canvas resets its 2D context state — re-apply everything
    off.width = width;
    off.height = height;
    offCtx.font = fontFor(fontSize);
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillStyle = '#000000';

    const centerX = width / 2;
    // 'OsteoVision' has no descenders — nudge down so the VISUAL ink block
    // is centered in the band (plain 'middle' centers the em box, leaving
    // the wordmark looking top-heavy with extra space below)
    const centerY = height / 2 + fontSize * 0.09;
    offCtx.fillText('OsteoVision', centerX, centerY);

    const imgData = offCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Grid spacing scales with the rendered font size so letterforms stay
    // readable at every viewport: ~5.5px grid at the largest wordmark
    // (matches the reference density), down to ~2.8px when the font shrinks
    // on narrow screens. Dot radius keeps a constant ratio to the grid.
    const gridStep = Math.max(2.8, Math.min(5.5, fontSize * 0.031));
    const dotRadius = gridStep * 0.30;

    const newParticles: DotParticle[] = [];

    // Sample dots strictly on regular grid columns and rows.
    // Instead of reading ONE pixel per grid point (which drops dots along
    // letter edges when the sample lands in an anti-aliased gap), take the
    // MAXIMUM alpha inside each grid cell — every cell the glyph touches
    // produces a dot, so the wordmark reads clearly.
    const half = Math.floor(gridStep / 2);
    for (let gy = Math.floor(gridStep / 2); gy < height; gy += gridStep) {
      for (let gx = Math.floor(gridStep / 2); gx < width; gx += gridStep) {
        // Grid coords drift fractional via `+=` — round to integer pixels
        // before indexing ImageData (raw float indices read `undefined`,
        // which silently dropped most cells)
        const cx = Math.round(gx);
        const cy = Math.round(gy);
        let alpha = 0;
        for (let sy = cy - half; sy <= cy + half && alpha <= 140; sy++) {
          if (sy < 0 || sy >= height) continue;
          for (let sx = cx - half; sx <= cx + half; sx++) {
            if (sx < 0 || sx >= width) continue;
            const a = data[(sy * width + sx) * 4 + 3];
            if (a > alpha) alpha = a;
          }
        }

        // Solid glyph coverage only — threshold 140 keeps edges crisp
        // instead of fattening strokes with every AA edge cell
        if (alpha > 140) {
          newParticles.push({
            originX: gx,
            originY: gy,
            x: gx,
            y: gy,
            vx: 0,
            vy: 0,
            radius: dotRadius,
          });
        }
      }
    }

    particlesRef.current = newParticles;

    // Immediately render pristine static state
    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawDots(ctx, dpr);
    }
  }, [drawDots]);

  // Resize listener
  useEffect(() => {
    buildMatrix();

    const handleResize = () => {
      buildMatrix();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [buildMatrix]);

  // Main animation / physics loop
  const startLoop = useCallback(() => {
    if (isRunningRef.current || mouseRef.current.isTouch || reducedMotionRef.current) return;
    isRunningRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const tick = () => {
      const mouse = mouseRef.current;
      const particles = particlesRef.current;

      // Smooth cursor position interpolation
      if (mouse.isHovering) {
        mouse.currX += (mouse.targetX - mouse.currX) * 0.18;
        mouse.currY += (mouse.targetY - mouse.currY) * 0.18;
      }

      let moving = false;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Mouse Repulsion / Dispersion (also captures "glow" for the brand ignite)
        let glow = 0;
        if (mouse.isHovering) {
          const dx = p.x - mouse.currX;
          const dy = p.y - mouse.currY;
          const dist = Math.hypot(dx, dy);

          if (dist < MOUSE_RADIUS && dist > 0.01) {
            const angle = Math.atan2(dy, dx);
            // Repulsion force pushes dots outward away from the cursor
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            const push = force * force * 11;

            p.vx += Math.cos(angle) * push * 0.45;
            p.vy += Math.sin(angle) * push * 0.45;
            glow = force;
          }
        }

        // 2. Spring return physics back to exact origin
        const hdx = p.originX - p.x;
        const hdy = p.originY - p.y;
        p.vx += hdx * SPRING;
        p.vy += hdy * SPRING;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        // Check if particle is still in motion
        if (Math.abs(p.vx) > 0.01 || Math.abs(p.vy) > 0.01 || Math.abs(hdx) > 0.05 || Math.abs(hdy) > 0.05) {
          moving = true;
        }

        // Draw: clinical slate at rest, igniting toward brand cyan under the cursor
        ctx.beginPath();
        if (glow > 0.02) {
          const t = Math.min(1, glow * 1.25);
          ctx.fillStyle = `rgba(${(148 + (34 - 148) * t) | 0}, ${163 + (211 - 163) * t | 0}, ${184 + (238 - 184) * t | 0}, 0.9)`;
          ctx.arc(p.x, p.y, p.radius + t * 0.9, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = DOT_COLOR;
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      ctx.restore();

      // Keep running while hovering or while dots are still settling
      if (mouse.isHovering || moving) {
        animFrameIdRef.current = requestAnimationFrame(tick);
      } else {
        // Snap perfectly back to origins and pause loop
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x = p.originX;
          p.y = p.originY;
          p.vx = 0;
          p.vy = 0;
        }
        drawDots(ctx, dpr);
        isRunningRef.current = false;
        animFrameIdRef.current = null;
      }
    };

    animFrameIdRef.current = requestAnimationFrame(tick);
  }, [drawDots, DOT_COLOR, FRICTION, MOUSE_RADIUS, SPRING]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseRef.current.isTouch) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mouse = mouseRef.current;
    if (!mouse.isHovering) {
      mouse.currX = x;
      mouse.currY = y;
    }
    mouse.targetX = x;
    mouse.targetY = y;
    mouse.isHovering = true;

    startLoop();
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseRef.current.isTouch) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const mouse = mouseRef.current;
    mouse.targetX = x;
    mouse.targetY = y;
    mouse.currX = x;
    mouse.currY = y;
    mouse.isHovering = true;

    startLoop();
  };

  const handleMouseLeave = () => {
    if (mouseRef.current.isTouch) return;
    mouseRef.current.isHovering = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full my-4 select-none overflow-hidden flex items-center justify-center"
      style={{ cursor: 'default' }}
      aria-label="OsteoVision"
    >
      <span className="sr-only">OsteoVision</span>
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-none"
      />
    </div>
  );
};

export default InteractiveFooterWordmark;
