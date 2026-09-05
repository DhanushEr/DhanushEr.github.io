'use client';

import { motion } from 'framer-motion';
import { AnnotationBackdrop } from './AnnotationBackdrop';
import { Shell } from '@/components/ui/primitives';
import { contact } from '@/lib/projects';
import { riseIn, staggerChildren } from '@/lib/motion';

const heroChips = ['Computer vision', 'LLM agent pipelines', 'VLM labeling', 'Production data platforms'];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-line pb-16 pt-28 sm:pb-24 sm:pt-36">
      <div className="rule-grid absolute inset-0 opacity-40" aria-hidden />
      <div className="absolute inset-0" aria-hidden>
        <AnnotationBackdrop />
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ground"
        aria-hidden
      />

      <Shell className="relative">
        <motion.div variants={staggerChildren} initial="hidden" animate="show" className="flex flex-col gap-7">
          <motion.p variants={riseIn} className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-mute">
            Data Scientist · ML Engineer
            <span className="mx-2 text-vision">/</span>
            Slate Technologies
          </motion.p>

          <motion.h1 variants={riseIn} className="max-w-5xl text-display-xl font-display font-extrabold text-balance">
            I build systems that
            <br />
            <span className="text-vision">see the site</span>{' '}
            <span className="text-ink-mute">and</span> <span className="text-infer">read the docs</span>.
          </motion.h1>

          <motion.p variants={riseIn} className="max-w-2xl text-[16px] leading-relaxed text-ink-mute sm:text-[17px]">
            Production LLM and computer-vision systems built from the ground up — an automated
            site safety and quality inspection platform, and a multilingual voice-to-structured-data
            service — owned end to end, from detection model and prompt architecture through API,
            data model, and production hardening.
          </motion.p>

          <motion.ul variants={riseIn} className="flex flex-wrap gap-2">
            {heroChips.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-line bg-surface/60 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.09em] text-ink-mute"
              >
                {chip}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={riseIn} className="mt-2 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="rounded-full bg-vision px-6 py-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-ground transition-opacity hover:opacity-90"
            >
              View work
            </a>
            <a
              href={contact.resumeHref}
              download
              className="rounded-full border border-line px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink-mute"
            >
              Download résumé
            </a>
          </motion.div>
        </motion.div>
      </Shell>
    </section>
  );
}
