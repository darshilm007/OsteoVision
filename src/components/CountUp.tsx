import React, { useEffect, useRef, useState } from 'react';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────────────────────────────────────────
   CountUp — animates a number toward `value` whenever it changes.
   - easeOutCubic, ~900ms
   - Jumps straight to the value when reduced-motion is on (no flashing).
───────────────────────────────────────────── */
export const CountUp: React.FC<{
  value?: number;
  end?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}> = ({ value, end, decimals = 0, suffix = '', prefix = '', duration = 900, className }) => {
  const targetVal = typeof value === 'number' && !isNaN(value)
    ? value
    : typeof end === 'number' && !isNaN(end)
    ? end
    : 0;

  const [display, setDisplay] = useState(() => (prefersReduced() ? targetVal : 0));
  const fromRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (prefersReduced()) {
      fromRef.current = targetVal;
      setDisplay(targetVal);
      return;
    }
    const from = fromRef.current;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (targetVal - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = targetVal;
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [targetVal, duration]);

  return (
    <span className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
};
