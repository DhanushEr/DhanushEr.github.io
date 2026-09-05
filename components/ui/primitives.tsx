import type { ReactNode } from 'react';
import type { Layer } from '@/lib/projects';

export const layerText: Record<Layer, string> = {
  vision: 'text-vision',
  infer: 'text-infer',
  data: 'text-ink-mute',
};

export const layerBorder: Record<Layer, string> = {
  vision: 'border-vision/40',
  infer: 'border-infer/40',
  data: 'border-line',
};

export const layerDot: Record<Layer, string> = {
  vision: 'bg-vision',
  infer: 'bg-infer',
  data: 'bg-ink-faint',
};

export function Chip({ children, layer = 'data' }: { children: ReactNode; layer?: Layer }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.09em] ${layerBorder[layer]} ${
        layer === 'data' ? 'text-ink-mute' : layerText[layer]
      }`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ children, layer = 'vision' }: { children: ReactNode; layer?: Layer }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute">
      <span className={`h-1.5 w-1.5 rounded-full ${layerDot[layer]}`} aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeading({
  index,
  title,
  lede,
}: {
  index: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-vision">{index}</span>
        <span className="h-px flex-1 bg-line" aria-hidden />
      </div>
      <h2 className="text-display-md font-display font-bold text-balance">{title}</h2>
      {lede ? <p className="max-w-2xl text-[15px] leading-relaxed text-ink-mute">{lede}</p> : null}
    </div>
  );
}

export function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-shell px-5 sm:px-8 ${className}`}>{children}</div>;
}
