'use client';

import { ArrowDefs, Connector, DiagramFrame, GroupLabel, Node } from './DiagramParts';

const AMBER = '#FFB020';
const CYAN = '#3FD8C8';
const REJECT = '#FF6B4A';

/**
 * Two things this platform does that are worth showing: media uploads reach the
 * vision service without any polling, and every API request is checked against
 * its own token before it can read a tenant's data.
 */
export function EventPipelineDiagram() {
  return (
    <DiagramFrame
      viewBox="0 0 900 430"
      minWidth={760}
      label="A database trigger converts site uploads into queued processing records and fires a webhook into the computer-vision service. Separately, requests whose tenant claim does not match the requested tenant are rejected."
      caption="Architecture — event-driven media pipeline, and request-level tenant isolation."
    >
      <ArrowDefs />

      {/* ---- event pipeline ---- */}
      <GroupLabel x={20} y={26} text="Event-driven media pipeline" />

      <Node x={20} y={54} w={172} h={76} title="Site upload" lines={['row inserted']} accent={AMBER} />
      <Node x={236} y={54} w={186} h={76} title="Trigger function" lines={['in-database', 'no polling']} accent={AMBER} />
      <Node x={466} y={54} w={172} h={76} title="Processing queue" lines={['queued record']} accent={CYAN} />
      <Node
        x={682}
        y={54}
        w={198}
        h={76}
        title="Vision service"
        lines={['retry + timeout tuned', 'for long inference']}
        accent={CYAN}
      />

      <Connector d="M192 92H230" accent={AMBER} delay={0} />
      <Connector d="M422 92H460" accent={AMBER} delay={0.3} />
      <Connector d="M638 92H676" label="webhook" labelX={657} labelY={80} delay={0.6} />

      <path d="M20 176H880" stroke="#28313D" strokeWidth="1" />

      {/* ---- tenant isolation ---- */}
      <GroupLabel x={20} y={210} text="Request-level tenant isolation" />

      <Node
        x={20}
        y={238}
        w={210}
        h={70}
        title="Request A"
        lines={['token tenant = 7', 'asks for tenant 7']}
        accent={CYAN}
      />
      <Node
        x={20}
        y={330}
        w={210}
        h={70}
        title="Request B"
        lines={['token tenant = 7', 'asks for tenant 9']}
        accent={REJECT}
        dashed
      />

      <Node
        x={330}
        y={276}
        w={200}
        h={94}
        title="Scope check"
        lines={['verify JWT', 'claim vs. parameter', 'stored queries encrypted']}
        accent={CYAN}
      />

      <Connector d="M230 273C280 273 290 306 324 306" delay={0.2} />
      <Connector d="M230 365C280 365 290 336 324 336" accent={REJECT} dashed delay={0.5} />

      <Connector d="M530 306C560 306 566 288 596 288" delay={0.8} />

      {/* outcomes */}
      <g>
        <rect x={600} y={258} width={280} height={58} fill="#131924" stroke={CYAN} strokeOpacity="0.65" />
        <rect x={600} y={258} width={3} height={58} fill={CYAN} opacity="0.8" />
        <text x={614} y={283} fill="#E8EDF4" fontSize="12.5" fontFamily="var(--font-body), sans-serif" fontWeight="600">
          Served
        </text>
        <text x={614} y={301} fill="#8D99AB" fontSize="10.5" fontFamily="ui-monospace, monospace">
          scoped to the token’s own tenant
        </text>
      </g>

      <g>
        <rect
          x={600}
          y={334}
          width={280}
          height={58}
          fill="#131924"
          stroke={REJECT}
          strokeOpacity="0.6"
          strokeDasharray="4 4"
        />
        <rect x={600} y={334} width={3} height={58} fill={REJECT} opacity="0.8" />
        <text x={614} y={359} fill="#E8EDF4" fontSize="12.5" fontFamily="var(--font-body), sans-serif" fontWeight="600">
          Rejected
        </text>
        <text x={614} y={377} fill="#8D99AB" fontSize="10.5" fontFamily="ui-monospace, monospace">
          parameter does not match the claim
        </text>
      </g>

      <path d="M530 336C560 336 566 363 596 363" stroke={REJECT} strokeOpacity="0.45" strokeWidth="1.25" fill="none" strokeDasharray="5 5" />
    </DiagramFrame>
  );
}
