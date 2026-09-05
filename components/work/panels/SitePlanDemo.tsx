'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Layout } from './SiteScene';

/**
 * The Three.js bundle is the heaviest thing on the site, so it is code-split and
 * only requested once this panel is actually selected.
 */
const SiteScene = dynamic(() => import('./SiteScene').then((m) => m.SiteScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">Loading scene…</span>
    </div>
  ),
});

const layoutCopy: Record<Layout, string> = {
  heuristic:
    'Before: one generic model at a capped height, dropped onto every plot. Buildings that overrun their footprint are outlined in red — the plot boundary can no longer be respected.',
  matched:
    'After: a model-dimension lookup and a reworked classification prompt pick a model whose length, width and storey height actually fit the plot, so massing follows the site rather than a fixed cap.',
};

export function SitePlanDemo() {
  const [layout, setLayout] = useState<Layout>('matched');
  const [night, setNight] = useState(false);
  const [flying, setFlying] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Model placement strategy" className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setLayout('heuristic')}
            aria-pressed={layout === 'heuristic'}
            className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
              layout === 'heuristic'
                ? 'border-vision bg-vision/10 text-vision'
                : 'border-line text-ink-mute hover:border-ink-faint hover:text-ink'
            }`}
          >
            Fixed height cap
          </button>
          <button
            type="button"
            onClick={() => setLayout('matched')}
            aria-pressed={layout === 'matched'}
            className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
              layout === 'matched'
                ? 'border-infer bg-infer/10 text-infer'
                : 'border-line text-ink-mute hover:border-ink-faint hover:text-ink'
            }`}
          >
            Fit by dimension
          </button>
        </div>

        <div className="ml-auto flex gap-1.5">
          <button
            type="button"
            onClick={() => setNight((n) => !n)}
            aria-pressed={night}
            className="rounded-full border border-line px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute transition-colors hover:border-ink-faint hover:text-ink"
          >
            {night ? 'Night' : 'Day'}
          </button>
          <button
            type="button"
            onClick={() => setFlying(true)}
            disabled={flying}
            className="rounded-full border border-line px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-mute transition-colors hover:border-ink-faint hover:text-ink disabled:opacity-50"
          >
            {flying ? 'Flying…' : 'Flythrough'}
          </button>
        </div>
      </div>

      <figure className="m-0 flex flex-col gap-2">
        <div className="annotation-frame h-[300px] overflow-hidden border border-line bg-[#0B0E13] sm:h-[420px]">
          <SiteScene layout={layout} night={night} flying={flying} onFlightDone={() => setFlying(false)} />
        </div>
        <figcaption className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          Procedural stand-in site — geometry generated in code, drag to orbit. Not project data.
        </figcaption>
      </figure>

      <p aria-live="polite" className="max-w-2xl text-[13.5px] leading-relaxed text-ink-mute">
        {layoutCopy[layout]}
      </p>
    </div>
  );
}
