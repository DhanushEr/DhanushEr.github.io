'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PhaseTracker, phases } from '@/components/diagrams/PhaseTracker';
import { DetectionCanvas, type Pass } from '@/components/diagrams/DetectionCanvas';

const models = [
  {
    id: 'yolo',
    label: 'SAHI-tiled YOLO',
    note: 'First working detector. Tiling let full-resolution site frames be inspected without downsampling small objects out of existence.',
  },
  {
    id: 'rfdetr',
    label: 'RF-DETR',
    note: 'Swapped in for defect detection, with tiled inference retained and model weights loaded and cached from object storage.',
  },
  {
    id: 'frcnn',
    label: 'Faster R-CNN',
    note: 'TorchVision Faster R-CNN replaced YOLO in the safety path; safety and quality then ran together in a single inference pass.',
  },
] as const;

const STEP_MS = 900;

export function InspectionDemo() {
  const [pass, setPass] = useState<Pass>('safety');
  const [activeIndex, setActiveIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [model, setModel] = useState<(typeof models)[number]['id']>('frcnn');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAutoRun = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const run = useCallback(() => {
    clear();
    setActiveIndex(0);
    setRunning(true);
  }, []);

  // Advance one stage at a time while running.
  useEffect(() => {
    if (!running) return;
    if (activeIndex >= phases.length - 1) {
      setRunning(false);
      return;
    }
    timer.current = setTimeout(() => setActiveIndex((i) => i + 1), STEP_MS);
    return clear;
  }, [running, activeIndex]);

  // Auto-run once when the panel first scrolls into view; skip the stepping
  // entirely for viewers who prefer reduced motion (jump straight to the result).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || hasAutoRun.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hasAutoRun.current = true;
      setActiveIndex(phases.length - 1);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !hasAutoRun.current) {
          hasAutoRun.current = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [run]);

  useEffect(() => clear, []);

  const switchPass = (next: Pass) => {
    setPass(next);
    run();
  };

  const activeModel = models.find((m) => m.id === model) ?? models[2];
  const complete = activeIndex >= phases.length - 1;

  return (
    <div ref={rootRef} className="flex flex-col gap-5">
      {/* controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Detection pass" className="flex gap-1.5">
          {(['safety', 'quality'] as Pass[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => switchPass(p)}
              aria-pressed={pass === p}
              className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.11em] transition-colors ${
                pass === p
                  ? 'border-vision bg-vision/10 text-vision'
                  : 'border-line text-ink-mute hover:border-ink-faint hover:text-ink'
              }`}
            >
              {p} pass
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={run}
          className="rounded-full border border-line px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.11em] text-ink-mute transition-colors hover:border-ink-faint hover:text-ink"
        >
          {running ? 'Running…' : complete ? 'Replay pipeline' : 'Run pipeline'}
        </button>
      </div>

      <PhaseTracker activeIndex={activeIndex} />

      {/* current stage explanation — the live caption for what the tracker is doing */}
      <p aria-live="polite" className="min-h-[2.5em] text-[13.5px] leading-relaxed text-ink-mute">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-vision">
          {phases[activeIndex].label}
        </span>
        <span className="mx-2 text-ink-faint">—</span>
        {phases[activeIndex].note}
      </p>

      <DetectionCanvas pass={pass} activeIndex={activeIndex} />

      {/* model iteration */}
      <div className="flex flex-col gap-3 border-t border-line pt-5">
        <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
          Detector, across three iterations
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {models.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setModel(m.id)}
              aria-pressed={model === m.id}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.04em] transition-colors ${
                model === m.id
                  ? 'border-infer bg-infer/10 text-infer'
                  : 'border-line text-ink-mute hover:border-ink-faint hover:text-ink'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="max-w-2xl text-[13.5px] leading-relaxed text-ink-mute">{activeModel.note}</p>
      </div>
    </div>
  );
}
