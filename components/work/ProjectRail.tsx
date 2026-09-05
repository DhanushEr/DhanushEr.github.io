'use client';

import type { Project } from '@/lib/projects';
import { layerDot } from '@/components/ui/primitives';

export function ProjectRail({
  projects,
  activeSlug,
  onSelect,
}: {
  projects: Project[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="lg:sticky lg:top-24">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
        {projects.length} selected projects
      </p>
      <ul role="tablist" aria-label="Projects" className="flex flex-col gap-1">
        {projects.map((p, i) => {
          const active = p.slug === activeSlug;
          return (
            <li key={p.slug}>
              <button
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls={`panel-${p.slug}`}
                id={`tab-${p.slug}`}
                onClick={() => onSelect(p.slug)}
                className={`group w-full border-l-2 py-3 pl-4 pr-2 text-left transition-colors ${
                  active ? 'border-vision bg-surface/50' : 'border-line hover:border-ink-faint hover:bg-surface/30'
                }`}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-ink-faint">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1">
                    <span
                      className={`block text-[15px] font-semibold leading-snug transition-colors ${
                        active ? 'text-ink' : 'text-ink-mute group-hover:text-ink'
                      }`}
                    >
                      {p.title}
                    </span>
                    <span className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
                      <span className={`h-1.5 w-1.5 rounded-full ${layerDot[p.layer]}`} aria-hidden />
                      {p.kicker}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
