import { useEffect } from 'react';

/* ─────────────────────────────────────────────
   InteractiveEffects — global 3D tilt + magnetic micro-interactions
   - Attaches ONE delegated pointermove listener (no per-card listeners).
   - Robust to route changes / dynamically mounted cards.
   - Fully disabled when the user prefers reduced motion.
   - Adds NO new dependencies and changes NO layout (transform-only).
───────────────────────────────────────────── */

const CARD_SELECTOR = '.card-tactile, .card-glass-water';
const BTN_SELECTOR =
  '.btn-tactile-dark, .btn-tactile-light, .btn-glass-water-dark, .btn-glass-water-light';

const MAX_TILT = 3.2;   // degrees — restrained, premium (not a toy tilt)
const BTN_PULL = 4;     // px — gentle magnetic pull radius
const SETTLE = 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease';
const TRACK_CARD = 'transform 120ms ease-out, box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease';
const TRACK_BTN = 'transform 90ms ease-out, box-shadow 0.22s ease, background 0.22s ease';

export function useInteractiveEffects() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;

    let currentCard: HTMLElement | null = null;
    let currentBtn: HTMLElement | null = null;
    let raf = 0;

    const resetCard = (el: HTMLElement) => {
      el.style.transition = SETTLE;
      el.style.transform = '';
      el.style.willChange = '';
      el.style.removeProperty('--glow-opacity');
    };

    const resetBtn = (el: HTMLElement) => {
      el.style.transition = SETTLE;
      el.style.transform = '';
      el.style.willChange = '';
    };

    const onMove = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;

      // ── Cards: 3D tilt + cursor sheen ──
      const card = target.closest<HTMLElement>(CARD_SELECTOR);
      if (card !== currentCard) {
        if (currentCard) resetCard(currentCard);
        currentCard = card;
        if (card) {
          card.style.transition = TRACK_CARD;
          card.style.willChange = 'transform';
        }
      }
      if (card) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;   // 0 → 1
          const py = (e.clientY - r.top) / r.height;   // 0 → 1
          const rx = (0.5 - py) * MAX_TILT * 2;
          const ry = (px - 0.5) * MAX_TILT * 2;
          card.style.transform =
            `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-1.5px) scale(1.002)`;
          card.style.setProperty('--glow-x', `${(px * 100).toFixed(1)}%`);
          card.style.setProperty('--glow-y', `${(py * 100).toFixed(1)}%`);
          card.style.setProperty('--glow-opacity', '0.8');
        });
      }

      // ── Buttons: magnetic pull toward cursor ──
      const btnEl = target.closest<HTMLElement>(BTN_SELECTOR);
      const nextBtn =
        btnEl && !btnEl.hasAttribute('data-no-magnetic') && !(btnEl as HTMLButtonElement).disabled
          ? btnEl
          : null;
      if (nextBtn !== currentBtn) {
        if (currentBtn) resetBtn(currentBtn);
        currentBtn = nextBtn;
        if (currentBtn) {
          currentBtn.style.transition = TRACK_BTN;
          currentBtn.style.willChange = 'transform';
        }
      }
      if (currentBtn) {
        const r = currentBtn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width / 2)));
        const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 2)));
        currentBtn.style.transform =
          `translate(${(dx * BTN_PULL).toFixed(1)}px, ${(dy * BTN_PULL - 0.5).toFixed(1)}px) scale(1.02)`;
      }
    };

    const onLeaveWindow = () => {
      if (currentCard) { resetCard(currentCard); currentCard = null; }
      if (currentBtn) { resetBtn(currentBtn); currentBtn = null; }
    };

    // ── Buttons: click ripple spawned at the pointer point ──
    const onDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const btn = target.closest<HTMLElement>(BTN_SELECTOR);
      if (!btn || (btn as HTMLButtonElement).disabled) return;
      if (btn.hasAttribute('data-no-ripple')) return;

      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 1.15;
      const span = document.createElement('span');
      const isLight =
        btn.classList.contains('btn-tactile-light') ||
        btn.classList.contains('btn-glass-water-light');
      span.className = isLight ? 'ov-ripple ov-ripple--tint' : 'ov-ripple';
      span.style.width = `${size}px`;
      span.style.height = `${size}px`;
      span.style.left = `${e.clientX - r.left - size / 2}px`;
      span.style.top = `${e.clientY - r.top - size / 2}px`;
      btn.appendChild(span);
      window.setTimeout(() => span.remove(), 600);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeaveWindow);
    window.addEventListener('blur', onLeaveWindow);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeaveWindow);
      window.removeEventListener('blur', onLeaveWindow);
    };
  }, []);
}
