import { capabilities } from '@/lib/projects';

export function CapabilityMarquee() {
  const doubled = [...capabilities, ...capabilities];

  return (
    <div className="overflow-hidden border-b border-line bg-surface/40 py-3">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap" aria-hidden>
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint"
          >
            {item}
            <span className="text-vision/50">/</span>
          </span>
        ))}
      </div>
      {/* Accessible, non-animated equivalent for assistive tech. */}
      <p className="sr-only">Core capabilities: {capabilities.join(', ')}.</p>
    </div>
  );
}
