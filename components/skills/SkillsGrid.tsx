'use client';

import { motion } from 'framer-motion';
import { skillGroups } from '@/lib/projects';
import { layerDot, layerText, SectionHeading, Shell } from '@/components/ui/primitives';
import { inView, riseIn, staggerChildren } from '@/lib/motion';

export function SkillsGrid() {
  return (
    <section id="skills" className="border-b border-line py-20 sm:py-28">
      <Shell className="flex flex-col gap-12">
        <SectionHeading index="03 / Stack" title="What I build with." />

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="grid gap-x-10 gap-y-8 sm:grid-cols-2"
        >
          {skillGroups.map((group) => (
            <motion.div key={group.label} variants={riseIn} className="flex flex-col gap-3.5">
              <h3 className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em]">
                <span className={`h-1.5 w-1.5 rounded-full ${layerDot[group.layer]}`} aria-hidden />
                <span className={group.layer === 'data' ? 'text-ink-mute' : layerText[group.layer]}>{group.label}</span>
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line bg-surface/50 px-3 py-1.5 text-[13px] text-ink-mute"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </Shell>
    </section>
  );
}
