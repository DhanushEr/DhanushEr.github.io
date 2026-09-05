'use client';

import { motion } from 'framer-motion';

export type Pass = 'safety' | 'quality';

interface Detection {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  tag: string;
  severity: 'low' | 'med' | 'high';
  /** Set when the project-rules stage deprioritises this detection. */
  filteredByRules?: boolean;
}

const detections: Record<Pass, Detection[]> = {
  safety: [
    { id: 's1', x: 250, y: 246, w: 62, h: 74, label: 'No hard hat', tag: 'PPE', severity: 'high' },
    { id: 's2', x: 452, y: 150, w: 196, h: 34, label: 'Unguarded slab edge', tag: 'FALL', severity: 'high' },
    { id: 's3', x: 372, y: 214, w: 46, h: 118, label: 'Ladder not secured', tag: 'ACCESS', severity: 'med' },
    {
      id: 's4',
      x: 96,
      y: 356,
      w: 172,
      h: 26,
      label: 'Cable run across walkway',
      tag: 'TRIP',
      severity: 'low',
      filteredByRules: true,
    },
  ],
  quality: [
    { id: 'q1', x: 470, y: 196, w: 40, h: 128, label: 'Honeycombing, column face', tag: 'CSI 03 30', severity: 'med' },
    { id: 'q2', x: 556, y: 96, w: 104, h: 40, label: 'Formwork misalignment', tag: 'CSI 03 10', severity: 'high' },
    { id: 'q3', x: 452, y: 330, w: 148, h: 22, label: 'Surface crack, slab soffit', tag: 'CSI 03 30', severity: 'low' },
    {
      id: 'q4',
      x: 640,
      y: 236,
      w: 58,
      h: 60,
      label: 'Incomplete joint seal',
      tag: 'CSI 07 92',
      severity: 'med',
      filteredByRules: true,
    },
  ],
};

const severityColor = {
  low: '#8D99AB',
  med: '#FFB020',
  high: '#FF6B4A',
} as const;

/** Stage indices from PhaseTracker that gate what the overlay shows. */
const DETECT = 3;
const LABEL = 4;
const TAXONOMY = 5;
const RULES = 6;

export function DetectionCanvas({ pass, activeIndex }: { pass: Pass; activeIndex: number }) {
  const items = detections[pass];
  const showBoxes = activeIndex >= DETECT;
  const showLabels = activeIndex >= LABEL;
  const showTags = activeIndex >= TAXONOMY;
  const rulesApplied = activeIndex >= RULES;

  return (
    <figure className="m-0 flex flex-col gap-2">
      <div className="annotation-frame overflow-hidden border border-line bg-[#0B0E13]">
        {/* viewBox crops to the drawn content so the frame has no dead margin. */}
        <svg viewBox="80 44 700 366" className="block h-auto w-full" role="img" aria-labelledby="scene-desc">
          {/* Single interpolated string: multiple text nodes inside an SVG <title>
              do not hydrate reliably and produce a hydration mismatch. */}
          <title id="scene-desc">{`Stylised construction-site scene with ${items.length} annotated ${pass} findings.`}</title>

          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#131924" />
              <stop offset="100%" stopColor="#0B0E13" />
            </linearGradient>
            <pattern id="mesh" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M14 0H0V14" fill="none" stroke="#28313D" strokeWidth="0.6" />
            </pattern>
          </defs>

          {/* ---- scene ---- */}
          <rect width="800" height="460" fill="url(#sky)" />
          <rect y="352" width="800" height="108" fill="#0F141B" />
          <path d="M0 352H800" stroke="#28313D" strokeWidth="1" />

          {/* tower crane */}
          <g stroke="#2F3945" strokeWidth="2" fill="none">
            <path d="M700 60V352" />
            <path d="M560 60H756" />
            <path d="M700 60L660 96M700 60L740 96" />
            <path d="M604 60V104" strokeDasharray="3 5" />
          </g>

          {/* building frame */}
          <g>
            <rect x="440" y="88" width="240" height="264" fill="#111721" stroke="#2F3945" />
            {[136, 184, 232, 280, 328].map((y) => (
              <path key={y} d={`M440 ${y}H680`} stroke="#28313D" strokeWidth="4" />
            ))}
            {[480, 520, 560, 600, 640].map((x) => (
              <path key={x} d={`M${x} 88V352`} stroke="#28313D" strokeWidth="3" />
            ))}
          </g>

          {/* scaffold mesh */}
          <rect x="440" y="184" width="120" height="168" fill="url(#mesh)" opacity="0.75" />

          {/* ladder */}
          <g stroke="#3A4553" strokeWidth="2.5">
            <path d="M378 214V332M410 214V332" />
            {[236, 260, 284, 308].map((y) => (
              <path key={y} d={`M378 ${y}H410`} />
            ))}
          </g>

          {/* material stacks */}
          <g fill="#161D28" stroke="#2F3945">
            <rect x="96" y="300" width="96" height="20" />
            <rect x="96" y="320" width="96" height="20" />
            <rect x="208" y="312" width="64" height="28" />
          </g>

          {/* cable run */}
          <path d="M96 368C160 380 220 356 268 370" stroke="#3A4553" strokeWidth="3" fill="none" />

          {/* workers */}
          <g fill="#3A4553">
            <circle cx="281" cy="262" r="11" />
            <rect x="270" y="276" width="22" height="42" rx="4" />
            <rect x="266" y="318" width="9" height="26" rx="3" />
            <rect x="287" y="318" width="9" height="26" rx="3" />
          </g>
          <g fill="#333E4B">
            <circle cx="352" cy="286" r="9" />
            <rect x="343" y="298" width="18" height="34" rx="4" />
            <rect x="340" y="332" width="8" height="20" rx="3" />
            <rect x="356" y="332" width="8" height="20" rx="3" />
          </g>

          {/* ---- detection overlay ---- */}
          {showBoxes
            ? items.map((d, i) => {
                const dimmed = rulesApplied && d.filteredByRules;
                const stroke = dimmed ? '#4A5462' : severityColor[d.severity];

                return (
                  <motion.g
                    key={`${pass}-${d.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: dimmed ? 0.45 : 1 }}
                    transition={{ duration: 0.35, delay: i * 0.12 }}
                  >
                    <motion.rect
                      x={d.x}
                      y={d.y}
                      width={d.w}
                      height={d.h}
                      fill={dimmed ? 'transparent' : `${stroke}12`}
                      stroke={stroke}
                      strokeWidth="1.5"
                      strokeDasharray={dimmed ? '4 4' : undefined}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.12 }}
                    />

                    {showLabels ? (
                      <g>
                        <rect
                          x={d.x}
                          y={d.y - 19}
                          width={Math.max(d.label.length * 5.6 + (showTags ? d.tag.length * 5.4 + 14 : 0), 60)}
                          height="16"
                          fill="#0B0E13"
                          stroke={stroke}
                          strokeWidth="0.75"
                        />
                        <text
                          x={d.x + 5}
                          y={d.y - 7}
                          fill={dimmed ? '#6B7382' : '#E8EDF4'}
                          fontSize="9.5"
                          fontFamily="ui-monospace, monospace"
                          letterSpacing="0.03em"
                        >
                          {d.label.toUpperCase()}
                          {showTags ? (
                            <tspan fill={stroke} dx="8">
                              {d.tag}
                            </tspan>
                          ) : null}
                        </text>
                      </g>
                    ) : null}

                    {dimmed ? (
                      <text
                        x={d.x + 2}
                        y={d.y + d.h + 12}
                        fill="#6B7382"
                        fontSize="8.5"
                        fontFamily="ui-monospace, monospace"
                      >
                        DEPRIORITISED BY PROJECT RULES
                      </text>
                    ) : null}
                  </motion.g>
                );
              })
            : null}
        </svg>
      </div>

      {/* Small screens: the in-scene labels are too small to read, so the same
          findings are listed as text. Hidden from AT on wider screens to avoid
          duplicating what the SVG title already conveys. */}
      {showLabels ? (
        <ul className="flex flex-col gap-1.5 sm:hidden">
          {items.map((d) => {
            const dimmed = rulesApplied && d.filteredByRules;
            return (
              <li
                key={`list-${d.id}`}
                className={`flex items-start gap-2 text-[12px] leading-snug ${dimmed ? 'text-ink-faint' : 'text-ink-mute'}`}
              >
                <span
                  className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: dimmed ? '#4A5462' : severityColor[d.severity] }}
                  aria-hidden
                />
                <span>
                  {d.label}
                  {showTags ? <span className="ml-1.5 font-mono text-[10px] text-ink-faint">{d.tag}</span> : null}
                  {dimmed ? (
                    <span className="ml-1.5 font-mono text-[10px] uppercase tracking-[0.08em]">
                      · deprioritised by project rules
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}

      <figcaption className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
        Illustrative reconstruction — synthetic scene and sample findings, not live model output.
      </figcaption>
    </figure>
  );
}
