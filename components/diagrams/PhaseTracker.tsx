'use client';

export interface Phase {
  id: string;
  label: string;
  note: string;
}

/** The real pipeline stages, in the order the system runs them. */
export const phases: Phase[] = [
  { id: 'ingest', label: 'Ingest', note: 'Site video lands in object storage and is registered for processing.' },
  { id: 'frames', label: 'Frame select', note: 'Frames extracted from the compressed video at a sampling interval.' },
  { id: 'dedupe', label: 'ORB dedupe', note: 'ORB feature similarity drops near-identical frames before inference runs.' },
  { id: 'detect', label: 'Detect', note: 'Tiled object detection over full-resolution frames; blurred frames are gated out.' },
  { id: 'label', label: 'VLM label', note: 'A vision-language pass turns each detection into a semantic issue description.' },
  { id: 'taxonomy', label: 'Taxonomy map', note: 'Descriptions map deterministically onto CSI codes and the quality-issue taxonomy.' },
  { id: 'rules', label: 'Project rules', note: 'Rules extracted from the project’s own uploaded documents filter and prioritise what surfaces.' },
];

export function PhaseTracker({ activeIndex }: { activeIndex: number }) {
  return (
    <ol className="flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:gap-x-1 sm:gap-y-2">
      {phases.map((phase, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const state = done ? 'done' : active ? 'active' : 'pending';

        return (
          <li key={phase.id} className="flex items-center gap-2">
            <span
              className={`flex items-center gap-2 rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-300 ${
                active
                  ? 'border-vision/70 bg-vision/10 text-vision'
                  : done
                    ? 'border-line bg-surface/60 text-ink-mute'
                    : 'border-line/60 text-ink-faint'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                  active ? 'bg-vision' : done ? 'bg-infer' : 'bg-ink-faint/40'
                }`}
                aria-hidden
              />
              {phase.label}
              <span className="sr-only"> — {state}</span>
            </span>
            {i < phases.length - 1 ? (
              <span
                className={`hidden h-px w-3 transition-colors duration-300 sm:block ${done ? 'bg-infer/50' : 'bg-line'}`}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
