'use client';

import { ArrowDefs, Connector, DiagramFrame, GroupLabel, Node } from './DiagramParts';

const AMBER = '#FFB020';
const CYAN = '#3FD8C8';

/**
 * Drawings and specifications enter through separate agent chains, then converge
 * on one shared ingestion layer that fans out to three stores.
 */
export function IngestionDiagram() {
  return (
    <DiagramFrame
      viewBox="0 0 900 400"
      minWidth={760}
      label="Two document types pass through separate LLM agent chains into a shared ingestion layer, which writes to relational, graph, and vector stores feeding one retrieval index."
      caption="Architecture — drawing and specification extraction into a shared retrieval index."
    >
      <ArrowDefs />

      <GroupLabel x={20} y={26} text="Source documents" />
      <GroupLabel x={230} y={26} text="LLM agent chains" />
      <GroupLabel x={505} y={26} text="Shared ingestion" />
      <GroupLabel x={700} y={26} text="Stores" />

      {/* sources */}
      <Node x={20} y={62} w={168} h={78} title="Drawing set" lines={['CAD-exported PDF', 'multi-sheet']} accent={AMBER} />
      <Node x={20} y={228} w={168} h={78} title="Specification" lines={['CSI-format sections', 'submittals']} accent={AMBER} />

      {/* agent chains */}
      <Node
        x={230}
        y={44}
        w={230}
        h={114}
        title="Sheet classification"
        lines={['discipline + sheet number', 'drawing-set / version', 'bulk backfill']}
        accent={CYAN}
      />
      <Node
        x={230}
        y={210}
        w={230}
        h={114}
        title="Section parsing"
        lines={['table-of-contents aware', 'dynamic sub-sections', 'PDF section splitting']}
        accent={CYAN}
      />

      {/* shared ingestion */}
      <Node
        x={505}
        y={128}
        w={150}
        h={112}
        title="Ingestion layer"
        lines={['one client set,', 'shared by both', 'parsers']}
        accent={CYAN}
      />

      {/* stores */}
      <Node x={700} y={62} w={180} h={56} title="Relational" lines={['structured records']} accent={CYAN} />
      <Node x={700} y={156} w={180} h={56} title="Graph" lines={['entity relationships']} accent={CYAN} />
      <Node x={700} y={250} w={180} h={56} title="Vector" lines={['semantic retrieval']} accent={CYAN} />

      {/* flows */}
      <Connector d="M188 101H224" accent={AMBER} delay={0} />
      <Connector d="M188 267H224" accent={AMBER} delay={0.35} />
      <Connector d="M460 101C486 101 486 172 499 172" delay={0.6} />
      <Connector d="M460 267C486 267 486 198 499 198" delay={0.9} />
      <Connector d="M655 172C676 172 676 90 694 90" delay={1.2} />
      <Connector d="M655 184H694" delay={1.35} />
      <Connector d="M655 196C676 196 676 278 694 278" delay={1.5} />

      {/* retrieval outcome */}
      <g>
        <path d="M20 352H880" stroke="#28313D" strokeWidth="1" />
        <text
          x={20}
          y={378}
          fill="#8D99AB"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          letterSpacing="0.04em"
        >
          ONE RETRIEVAL INDEX — DRAWINGS AND SPECS QUERYABLE THROUGH THE SAME PATH
        </text>
      </g>
    </DiagramFrame>
  );
}
