import { useEffect } from 'react';

/* ─────────────────────────────────────────────
   ScrollProgressBar — thin top page-scroll indicator
   Purely visual, pointer-events none, rAF-throttled.
───────────────────────────────────────────── */
export const ScrollProgressBar = () => {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      const bar = document.getElementById('ov-scroll-progress');
      if (bar) bar.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[70] pointer-events-none">
      <div
        id="ov-scroll-progress"
        className="h-full w-full origin-left bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#22D3EE]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
};
