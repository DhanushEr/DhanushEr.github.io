'use client';

import { useEffect, useRef } from 'react';

/**
 * Ambient backdrop: detection-style annotation frames that drift, then "lock on"
 * to a target — the visual language of the inspection work, drawn procedurally.
 *
 * Renders a single static composed frame when the viewer prefers reduced motion.
 */

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  tx: number;
  ty: number;
  locked: number; // 0..1 lock-on progress
  hold: number;
  layer: 0 | 1; // 0 = vision (amber), 1 = infer (cyan)
}

const VISION = 'rgba(255, 176, 32,';
const INFER = 'rgba(63, 216, 200,';

export function AnnotationBackdrop() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let boxes: Box[] = [];
    let w = 0;
    let h = 0;

    const seed = (count: number) => {
      boxes = Array.from({ length: count }, (_, i) => {
        const bw = 90 + Math.random() * 190;
        const bh = 60 + Math.random() * 130;
        return {
          x: Math.random() * Math.max(w - bw, 1),
          y: Math.random() * Math.max(h - bh, 1),
          w: bw,
          h: bh,
          tx: Math.random() * Math.max(w - bw, 1),
          ty: Math.random() * Math.max(h - bh, 1),
          locked: Math.random(),
          hold: Math.random() * 200,
          layer: i % 3 === 0 ? 1 : 0,
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(w < 640 ? 5 : 9);
    };

    const corner = (b: Box, alpha: number, color: string) => {
      const len = Math.min(18, b.w * 0.22, b.h * 0.28);
      ctx.strokeStyle = `${color} ${alpha})`;
      ctx.lineWidth = 1.25;
      const pts: [number, number, number, number][] = [
        [b.x, b.y + len, b.x, b.y],
        [b.x, b.y, b.x + len, b.y],
        [b.x + b.w - len, b.y, b.x + b.w, b.y],
        [b.x + b.w, b.y, b.x + b.w, b.y + len],
        [b.x + b.w, b.y + b.h - len, b.x + b.w, b.y + b.h],
        [b.x + b.w, b.y + b.h, b.x + b.w - len, b.y + b.h],
        [b.x + len, b.y + b.h, b.x, b.y + b.h],
        [b.x, b.y + b.h, b.x, b.y + b.h - len],
      ];
      ctx.beginPath();
      for (const [x1, y1, x2, y2] of pts) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const b of boxes) {
        const color = b.layer === 1 ? INFER : VISION;
        const alpha = 0.1 + b.locked * 0.3;
        corner(b, alpha, color);

        if (b.locked > 0.72) {
          ctx.fillStyle = `${color} ${(b.locked - 0.72) * 1.6})`;
          ctx.font = '10px ui-monospace, monospace';
          ctx.fillText(b.layer === 1 ? 'INFER' : 'DETECT', b.x + 2, b.y - 6);
        }
      }
    };

    const step = () => {
      for (const b of boxes) {
        if (b.hold > 0) {
          b.hold -= 1;
          b.locked = Math.min(1, b.locked + 0.02);
        } else {
          b.locked = Math.max(0, b.locked - 0.012);
          b.x += (b.tx - b.x) * 0.012;
          b.y += (b.ty - b.y) * 0.012;
          if (Math.abs(b.tx - b.x) < 2 && Math.abs(b.ty - b.y) < 2) {
            b.tx = Math.random() * Math.max(w - b.w, 1);
            b.ty = Math.random() * Math.max(h - b.h, 1);
            b.hold = 120 + Math.random() * 220;
          }
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    resize();
    if (reduced) {
      boxes.forEach((b) => (b.locked = 0.85));
      draw();
    } else {
      raf = requestAnimationFrame(step);
    }

    const onResize = () => {
      resize();
      if (reduced) {
        boxes.forEach((b) => (b.locked = 0.85));
        draw();
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90"
    />
  );
}
