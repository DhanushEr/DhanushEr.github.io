'use client';

import { useState } from 'react';
import { contact } from '@/lib/projects';
import { SectionHeading, Shell } from '@/components/ui/primitives';

/**
 * Email is assembled at interaction time from split parts so the full address
 * never sits in the static markup as one scrapeable string.
 */
export function Contact() {
  const [revealed, setRevealed] = useState(false);
  const address = `${contact.emailUser}@${contact.emailDomain}`;

  return (
    <section id="contact" className="py-20 sm:py-28">
      <Shell className="flex flex-col gap-10">
        <SectionHeading index="04 / Contact" title="Open to applied AI and ML engineering roles." />

        <div className="flex flex-wrap items-center gap-3">
          {revealed ? (
            <a
              href={`mailto:${address}`}
              className="rounded-full bg-vision px-6 py-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.1em] text-ground transition-opacity hover:opacity-90"
            >
              {address}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="rounded-full bg-vision px-6 py-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-ground transition-opacity hover:opacity-90"
            >
              Show email
            </button>
          )}

          <a
            href={contact.resumeHref}
            download
            className="rounded-full border border-line px-6 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink-mute"
          >
            Download résumé
          </a>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
          <span>Dhanush M</span>
        </footer>
      </Shell>
    </section>
  );
}
