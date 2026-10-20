import React, { useCallback, useRef, useState } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

/* ─────────────────────────────────────────────
   BeforeAfterCompare — draggable Original ↔ Visual Explanation slider.
   Uses clip-path so both images stay full-size (no squish).
   Works with mouse + touch. Not a "motion" effect, so it stays
   available even with reduced-motion (it is user-driven).
───────────────────────────────────────────── */
export const BeforeAfterCompare: React.FC<{
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}> = ({ before, after, beforeLabel = 'Original X-ray', afterLabel = 'Visual Explanation' }) => {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    update(e.clientX);
  };
  const onMove = (e: React.PointerEvent) => {
    if (dragging.current) update(e.clientX);
  };
  const onUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={ref}
      className="absolute inset-0 select-none touch-none cursor-ew-resize"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {/* Right / underlying layer: visual explanation */}
      <img
        src={after}
        alt={afterLabel}
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain filter contrast-[1.05]"
      />
      {/* Left layer: original, clipped to the handle position */}
      <img
        src={before}
        alt={beforeLabel}
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain filter contrast-[1.05]"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* Labels */}
      <span className="absolute top-3 left-3 z-20 text-[10px] font-mono text-[#0F172A] bg-white/95 border border-slate-200 px-2.5 py-1 rounded-full shadow-xs pointer-events-none">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 z-20 text-[10px] font-mono text-white bg-[#2563EB]/90 border border-[#2563EB] px-2.5 py-1 rounded-full shadow-xs pointer-events-none">
        {afterLabel}
      </span>

      {/* Divider + grip */}
      <div
        className="absolute top-0 bottom-0 z-20 w-[2px] bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.35)] pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-[#2563EB]">
          <ChevronsLeftRight size={16} />
        </div>
      </div>
    </div>
  );
};
