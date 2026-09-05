'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Scripted walkthrough of the voice-to-form-fill pipeline. Every value here is a
 * fixed sample — no model is called. The point is the shape of the pipeline:
 * normalise, pick the form, extract against that form's real schema, then resolve
 * names to entity IDs and drop anything that doesn't match.
 */

interface Field {
  caption: string;
  value: string;
  /** What the value resolves to once matched against the form's options. */
  resolved?: string;
  /** Extracted but with no match in the form's option list — dropped rather than guessed. */
  dropped?: boolean;
  elementId: string;
}

interface Sample {
  id: string;
  language: string;
  raw: string;
  normalized: string;
  form: string;
  fields: Field[];
}

const formTypes = ['Quality NCR', 'Design RFI', 'Technical Query', 'Daily Site Diary', 'Safety Observation'];

const samples: Sample[] = [
  {
    id: 'ta',
    language: 'Tamil + English',
    raw: 'Second floor la oru crack irukku, quality NCR raise pannunga, Priya ku assign pannunga, urgent',
    normalized:
      'There is a crack on the second floor. Raise a Quality NCR and assign it to Priya. Marked urgent.',
    form: 'Quality NCR',
    fields: [
      { caption: 'Description', value: 'Crack observed on second floor', elementId: 'e_4821' },
      { caption: 'Location', value: 'Second floor', resolved: 'location #318', elementId: 'e_4822' },
      { caption: 'Assignee', value: 'Priya', resolved: 'user #1042', elementId: 'e_4823' },
      { caption: 'Priority', value: 'urgent', dropped: true, elementId: 'e_4824' },
    ],
  },
  {
    id: 'hi',
    language: 'Hindi + English',
    raw: 'Column ka formwork misaligned hai, RFI banao aur Rahul ko assign karo, tower B ground floor',
    normalized:
      'The column formwork is misaligned. Create a Design RFI and assign it to Rahul. Location: Tower B, ground floor.',
    form: 'Design RFI',
    fields: [
      { caption: 'Description', value: 'Column formwork misaligned', elementId: 'e_5110' },
      { caption: 'Location', value: 'Tower B — Ground floor', resolved: 'location #204', elementId: 'e_5111' },
      { caption: 'Assignee', value: 'Rahul', resolved: 'user #877', elementId: 'e_5112' },
    ],
  },
  {
    id: 'en',
    language: 'English',
    raw: 'Log a technical query about rebar spacing on level 3, assign to Anita, priority high',
    normalized:
      'Log a Technical Query regarding rebar spacing on level 3. Assign to Anita. Priority: high.',
    form: 'Technical Query',
    fields: [
      { caption: 'Description', value: 'Rebar spacing query, level 3', elementId: 'e_6015' },
      { caption: 'Location', value: 'Level 3', resolved: 'location #91', elementId: 'e_6016' },
      { caption: 'Assignee', value: 'Anita', resolved: 'user #530', elementId: 'e_6017' },
      { caption: 'Priority', value: 'High', resolved: 'option #3', elementId: 'e_6018' },
    ],
  },
];

const stages = [
  { id: 'raw', label: 'Utterance' },
  { id: 'normalize', label: 'Normalise' },
  { id: 'select', label: 'Agent 1 · form' },
  { id: 'extract', label: 'Agent 2 · fields' },
  { id: 'resolve', label: 'Resolve IDs' },
  { id: 'payload', label: 'Payload' },
] as const;

const STEP_MS = 1150;

export function VoicePipelineDemo() {
  const [sample, setSample] = useState(samples[0]);
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasAutoRun = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const run = useCallback(() => {
    clear();
    setStage(0);
    setRunning(true);
  }, []);

  useEffect(() => {
    if (!running) return;
    if (stage >= stages.length - 1) {
      setRunning(false);
      return;
    }
    timer.current = setTimeout(() => setStage((s) => s + 1), STEP_MS);
    return clear;
  }, [running, stage]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || hasAutoRun.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hasAutoRun.current = true;
      setStage(stages.length - 1);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !hasAutoRun.current) {
          hasAutoRun.current = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [run]);

  useEffect(() => clear, []);

  const pick = (s: Sample) => {
    setSample(s);
    run();
  };

  const kept = sample.fields.filter((f) => !f.dropped);
  const done = stage >= stages.length - 1;

  return (
    <div ref={rootRef} className="flex flex-col gap-5">
      {/* sample picker */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Sample utterance" className="flex flex-wrap gap-1.5">
          {samples.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => pick(s)}
              aria-pressed={sample.id === s.id}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.04em] transition-colors ${
                sample.id === s.id
                  ? 'border-infer bg-infer/10 text-infer'
                  : 'border-line text-ink-mute hover:border-ink-faint hover:text-ink'
              }`}
            >
              {s.language}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={run}
          className="rounded-full border border-line px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.11em] text-ink-mute transition-colors hover:border-ink-faint hover:text-ink"
        >
          {running ? 'Running…' : done ? 'Replay' : 'Run'}
        </button>
      </div>

      {/* stage rail */}
      <ol className="flex flex-wrap gap-1.5">
        {stages.map((s, i) => (
          <li
            key={s.id}
            className={`rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors ${
              i === stage
                ? 'border-infer/70 bg-infer/10 text-infer'
                : i < stage
                  ? 'border-line bg-surface/60 text-ink-mute'
                  : 'border-line/60 text-ink-faint'
            }`}
          >
            {s.label}
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-3">
        {/* 1 — raw utterance */}
        <div className="border border-line bg-surface/40 p-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            Dictated · {sample.language}
          </p>
          <p className="text-[14.5px] leading-relaxed text-ink">“{sample.raw}”</p>
        </div>

        {/* 2 — normalised */}
        {stage >= 1 ? (
          <div className="border border-line bg-surface/40 p-4">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-infer">
              Normalised → English
            </p>
            <p className="text-[14.5px] leading-relaxed text-ink">{sample.normalized}</p>
            <p className="mt-2 text-[12.5px] text-ink-faint">
              Construction terms and form-type abbreviations are preserved verbatim.
            </p>
          </div>
        ) : null}

        {/* 3 — agent 1 and the concurrent prefetch */}
        {stage >= 2 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border border-line bg-surface/40 p-4">
              <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-infer">
                Agent 1 · form type
              </p>
              <ul className="flex flex-col gap-1">
                {formTypes.map((f) => {
                  const chosen = f === sample.form;
                  return (
                    <li
                      key={f}
                      className={`flex items-center gap-2 text-[13px] ${chosen ? 'text-ink' : 'text-ink-faint'}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${chosen ? 'bg-infer' : 'bg-ink-faint/30'}`}
                        aria-hidden
                      />
                      {f}
                      {chosen ? (
                        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-infer">
                          selected
                        </span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border border-line bg-surface/40 p-4">
              <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-vision">
                Concurrently · schema prefetch
              </p>
              <p className="text-[13px] leading-relaxed text-ink-mute">
                Field definitions for every candidate form are fetched from Postgres on a thread pool
                while agent 1 is still deciding — so the schema is already in hand the moment a form
                is chosen, instead of adding a second round trip.
              </p>
            </div>
          </div>
        ) : null}

        {/* 4 & 5 — extraction and resolution */}
        {stage >= 3 ? (
          <div className="border border-line bg-surface/40 p-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-infer">
              Agent 2 · fields extracted against the {sample.form} schema
            </p>
            <ul className="flex flex-col divide-y divide-line/70">
              {sample.fields.map((f) => (
                <li key={f.caption} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2">
                  <span className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">
                    {f.caption}
                  </span>
                  <span className={`text-[13.5px] ${f.dropped && stage >= 4 ? 'text-ink-faint line-through' : 'text-ink'}`}>
                    {f.value}
                  </span>
                  {stage >= 4 ? (
                    <span className="ml-auto font-mono text-[11px]">
                      {f.dropped ? (
                        <span className="text-[#FF6B4A]">no match in options · dropped</span>
                      ) : f.resolved ? (
                        <span className="text-infer">→ {f.resolved}</span>
                      ) : (
                        <span className="text-ink-faint">free text</span>
                      )}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* 6 — payload */}
        {stage >= 5 ? (
          <div className="border border-line bg-[#0B0E13] p-4">
            <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
              Submit-ready payload · keyed by form element ID
            </p>
            <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-ink-mute">
              <code>{`{
  "featureId": "${sample.form.toLowerCase().replace(/\s+/g, '_')}",
  "fields": {
${kept
  .map((f) => `    "${f.elementId}": ${f.resolved ? `[${f.resolved.replace(/\D/g, '')}]` : `"${f.value}"`}`)
  .join(',\n')}
  }
}`}</code>
            </pre>
          </div>
        ) : null}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
        Scripted walkthrough — fixed sample values, no live model call.
      </p>
    </div>
  );
}
