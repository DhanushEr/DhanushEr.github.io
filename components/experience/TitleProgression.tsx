'use client';

import { motion } from 'framer-motion';
import { experience } from '@/lib/projects';
import { SectionHeading, Shell } from '@/components/ui/primitives';
import { inView, riseIn, staggerChildren } from '@/lib/motion';

export function TitleProgression() {
  return (
    <section id="experience" className="border-b border-line py-20 sm:py-28">
      <Shell className="flex flex-col gap-12">
        <SectionHeading index="02 / Experience" title="One company, three titles." />

        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="flex flex-col gap-8"
        >
          <motion.div variants={riseIn} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <h3 className="text-display-md font-display font-bold">
              {experience.company}
              <span className="ml-3 font-body text-[15px] font-normal text-ink-faint">{experience.field}</span>
            </h3>
            <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-mute">{experience.period}</span>
          </motion.div>

          <ol className="relative flex flex-col gap-0 border-l border-line pl-6">
            {experience.roles.map((role) => (
              <motion.li key={role.title} variants={riseIn} className="relative py-4">
                <span
                  className={`absolute -left-[1.6rem] top-[1.45rem] h-2 w-2 rounded-full ${
                    role.current ? 'bg-vision' : 'bg-ink-faint'
                  }`}
                  aria-hidden
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <span className={`text-[16px] font-semibold ${role.current ? 'text-vision' : 'text-ink'}`}>
                    {role.title}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">{role.period}</span>
                </div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </Shell>
    </section>
  );
}
