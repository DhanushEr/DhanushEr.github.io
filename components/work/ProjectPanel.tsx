'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/lib/projects';
import { layerText, StatusBadge } from '@/components/ui/primitives';
import { riseIn, staggerChildren } from '@/lib/motion';

const treatmentLabel: Record<Project['treatment'], string> = {
  demo: 'Interactive demo',
  scripted: 'Pipeline walkthrough',
  'case-study': 'Case study',
};

/**
 * Shared panel chrome for every project. The visual slot at the top is where
 * Tier A/B demos mount in later build steps; until then it holds the
 * case-study placeholder passed in as `visual`.
 */
export function ProjectPanel({ project, visual }: { project: Project; visual?: React.ReactNode }) {
  return (
    <motion.article
      key={project.slug}
      id={`panel-${project.slug}`}
      role="tabpanel"
      aria-labelledby={`tab-${project.slug}`}
      variants={staggerChildren}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-7"
    >
      <motion.header variants={riseIn} className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <StatusBadge layer={project.layer}>{treatmentLabel[project.treatment]}</StatusBadge>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">{project.period}</span>
          {project.ownership ? (
            <span
              className={`rounded-sm border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
                project.layer === 'vision' ? 'border-vision/40 text-vision' : 'border-infer/40 text-infer'
              }`}
            >
              {project.ownership}
            </span>
          ) : null}
        </div>

        <h3 className="text-display-md font-display font-bold text-balance">{project.title}</h3>
        <p className="max-w-3xl text-[15px] leading-relaxed text-ink-mute">{project.premise}</p>
      </motion.header>

      {visual ? <motion.div variants={riseIn}>{visual}</motion.div> : null}

      <motion.div variants={riseIn} className="flex flex-col gap-3">
        <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">What I built</h4>
        <ul className="flex flex-col gap-2.5">
          {project.contribution.map((item) => (
            <li key={item} className="flex gap-3 text-[14.5px] leading-relaxed text-ink">
              <span className={`mt-[0.6em] h-1 w-1 shrink-0 ${layerText[project.layer]} bg-current`} aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={riseIn} className="flex flex-col gap-3">
        <h4 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">Stack</h4>
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li
              key={s}
              className="rounded-full border border-line bg-surface/50 px-3 py-1 font-mono text-[11px] tracking-[0.04em] text-ink-mute"
            >
              {s}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.article>
  );
}
