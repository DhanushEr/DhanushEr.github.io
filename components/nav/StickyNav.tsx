'use client';

import { useEffect, useState } from 'react';
import { contact, sections } from '@/lib/projects';

export function StickyNav() {
  const [active, setActive] = useState<string>('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-line bg-ground/85 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a href="#top" className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink">
          Dhanush<span className="text-vision">.M</span>
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:text-ink ${
                  active === s.id ? 'text-vision' : 'text-ink-mute'
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <a
            href={contact.resumeHref}
            download
            className="rounded-full border border-line px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-mute transition-colors hover:border-ink-mute hover:text-ink"
          >
            Résumé
          </a>
          <a
            href="#contact"
            className="rounded-full bg-vision px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ground transition-opacity hover:opacity-90"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
