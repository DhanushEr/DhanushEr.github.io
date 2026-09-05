'use client';

import { useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Shared building blocks for the architecture diagrams.
 *
 * Everything is drawn visible at rest — the only animation is a decorative pulse
 * travelling along each connector, which is safe to never run.
 */

export function DiagramFrame({
  children,
  caption,
  minWidth = 700,
  viewBox,
  label,
}: {
  children: ReactNode;
  caption: string;
  minWidth?: number;
  viewBox: string;
  label: string;
}) {
  return (
    <figure className="m-0 flex flex-col gap-2">
      {/* Wide diagram scrolls horizontally in its own container rather than squashing;
          overflow-y is pinned so the browser doesn't add a second scrollbar. */}
      <div className="annotation-frame overflow-x-auto overflow-y-hidden border border-line bg-[#0B0E13]">
        {/* No fixed height: the SVG scales on its own aspect ratio. */}
        <svg viewBox={viewBox} role="img" aria-label={label} style={{ minWidth }} className="block h-auto w-full">
          {children}
        </svg>
      </div>
      <figcaption className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">{caption}</figcaption>
    </figure>
  );
}

export function Node({
  x,
  y,
  w,
  h,
  title,
  lines = [],
  accent = '#3FD8C8',
  dashed = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines?: string[];
  accent?: string;
  dashed?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="#131924"
        stroke={accent}
        strokeOpacity={dashed ? 0.5 : 0.65}
        strokeWidth="1"
        strokeDasharray={dashed ? '4 4' : undefined}
      />
      <rect x={x} y={y} width={3} height={h} fill={accent} opacity="0.8" />
      <text
        x={x + 14}
        y={y + 21}
        fill="#E8EDF4"
        fontSize="12.5"
        fontFamily="var(--font-body), system-ui, sans-serif"
        fontWeight="600"
      >
        {title}
      </text>
      {lines.map((line, i) => (
        <text
          key={line}
          x={x + 14}
          y={y + 40 + i * 15}
          fill="#8D99AB"
          fontSize="10.5"
          fontFamily="ui-monospace, monospace"
          letterSpacing="0.02em"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

export function Connector({
  d,
  accent = '#3FD8C8',
  label,
  labelX,
  labelY,
  delay = 0,
  dashed = false,
}: {
  d: string;
  accent?: string;
  label?: string;
  labelX?: number;
  labelY?: number;
  delay?: number;
  dashed?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={accent}
        strokeOpacity="0.45"
        strokeWidth="1.25"
        strokeDasharray={dashed ? '5 5' : undefined}
        markerEnd="url(#arrow)"
      />
      {/* Decorative pulse. Native SVG motion rather than a framer-motion value:
          offset-path is a CSS property and gets forwarded to the DOM as an
          unknown attribute when passed through motion props. */}
      {!reduced ? (
        <circle r="2.75" fill={accent} opacity="0.9">
          <animateMotion dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" path={d} />
          <animate
            attributeName="opacity"
            values="0;0.9;0.9;0"
            dur="2.4s"
            begin={`${delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ) : null}
      {label ? (
        <text
          x={labelX}
          y={labelY}
          fill="#6B7382"
          fontSize="9.5"
          fontFamily="ui-monospace, monospace"
          letterSpacing="0.06em"
          textAnchor="middle"
        >
          {label.toUpperCase()}
        </text>
      ) : null}
    </g>
  );
}

export function ArrowDefs() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0 0L10 5L0 10Z" fill="#3FD8C8" fillOpacity="0.55" />
      </marker>
    </defs>
  );
}

export function GroupLabel({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <text
      x={x}
      y={y}
      fill="#5C6675"
      fontSize="9.5"
      fontFamily="ui-monospace, monospace"
      letterSpacing="0.16em"
    >
      {text.toUpperCase()}
    </text>
  );
}
