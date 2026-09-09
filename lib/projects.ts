/**
 * Single source of project content for the site.
 *
 * Derived directly from ../project-summaries.md. Content rules enforced here:
 *  - Only directly-authored, git-confirmed work appears in `contribution`.
 *  - No client names, internal tenant/project IDs, or repo codenames.
 *  - No numeric performance claims — every "needs verification" item stays qualitative.
 */

export type Treatment = 'demo' | 'scripted' | 'case-study';
export type Layer = 'vision' | 'infer' | 'data';

export interface Project {
  slug: string;
  /** Public-facing descriptive title (never the internal repo name). */
  title: string;
  /** Short kicker shown in the project rail. */
  kicker: string;
  period: string;
  treatment: Treatment;
  /** Which accent layer this project belongs to — drives its color treatment. */
  layer: Layer;
  /** One-sentence framing of the problem the system solves. */
  premise: string;
  /** What I personally built, from the git-confirmed contribution notes. */
  contribution: string[];
  stack: string[];
  /** Ownership signal, shown as a badge when present. */
  ownership?: string;
}

export const projects: Project[] = [
  {
    slug: 'site-inspection',
    title: 'Automated Site Safety & Quality Inspection',
    kicker: 'Computer vision · VLM · agent pipeline',
    period: 'Feb – Aug 2026',
    treatment: 'demo',
    layer: 'vision',
    ownership: 'Built from scratch',
    premise:
      'Weekly construction-site footage goes in; structured safety hazards and quality defects come out — each tagged against a taxonomy, using detection rules derived from that project’s own safety documentation rather than a fixed generic rule set.',
    contribution: [
      'Delivered detection to production sites with no GPU budget — inference had to run on CPU-only EC2. Iterated the model across three architectures (SAHI-tiled YOLO, RF-DETR, then TorchVision Faster R-CNN) and tuned tiled inference to reach ~86% precision (mAP 0.65–0.70) on 4K drone imagery inside that constraint.',
      'Made CPU inference viable by cutting the work roughly 99%: frame selection, ORB feature-similarity deduplication and a resolution-independent blur gate reduce a one-minute 4K clip from ~1,800 frames to the 6–7 genuinely unique ones worth detecting on.',
      'Consolidated safety and quality detection into a single inference pass, served through both synchronous and batched asynchronous APIs.',
      'Layered vision-language labeling over raw detections, turning boxes into semantic issue descriptions mapped to a deterministic CSI-code and quality taxonomy.',
      'Designed a six-stage LLM agent chain — parse, sentence-split, rule extraction, filtering, mapping, deduplication — that converts a project’s uploaded safety and quality documents into project-specific detection rules, so flags reflect that site’s requirements instead of a fixed generic rule set.',
      'Engineered the production video pipeline: database-driven stage orchestration with per-stage status tracking and video compression; authored the Dockerfiles and AWS Lambda trigger/runner scripts handed to the DevOps team for release.',
    ],
    stack: [
      'Python',
      'PyTorch / TorchVision',
      'RF-DETR',
      'YOLO + SAHI',
      'OpenCV',
      'FastAPI',
      'OpenAI API',
      'PostgreSQL + pgvector',
      'AWS S3, Lambda',
    ],
  },
  {
    slug: 'voice-to-structured-data',
    title: 'Multilingual Voice-to-Structured-Data',
    kicker: 'Two-agent LLM extraction',
    period: 'Apr – Aug 2026',
    treatment: 'scripted',
    layer: 'infer',
    ownership: 'Sole author',
    premise:
      'A site engineer dictates a report in whatever language mix comes naturally; the system returns a submit-ready structured record against the right form, with every name resolved to a real entity ID — cutting form entry from 2–5 minutes of typing to under a minute.',
    contribution: [
      'Designed and built the entire service: a two-agent LLM pipeline where the first agent matches utterance intent against the tenant’s live form types and the second extracts field values against that form’s real schema.',
      'Added an LLM normalization stage that handles code-mixed input — Tamil, Hindi, English and transliterated variants — while preserving construction terminology and form-type abbreviations.',
      'Halved end-to-end response time from 10–12s to 5–6s by running the form-selection LLM call and the database schema prefetch concurrently on a thread pool, so field definitions are ready the moment the first agent returns — on site, every extra second of waiting pushes users back to typing.',
      'Built deterministic post-processing that resolves extracted names — assignees, dropdown options, site locations — to internal entity IDs, discarding unmatched values rather than emitting bad data.',
    ],
    stack: ['Python', 'Flask', 'OpenAI API (sync + async)', 'asyncio', 'ThreadPoolExecutor', 'PostgreSQL'],
  },
  {
    slug: 'site-layout',
    title: 'AI Site Layout Generation & 3D Review',
    kicker: 'LLM placement · geospatial · 3D',
    period: 'Dec 2025 – Jan 2026',
    treatment: 'demo',
    layer: 'infer',
    ownership: 'Proof of concept',
    premise:
      'Draw a plot and the system reads OpenStreetMap data to find its usable construction area, then lays out buildings, amenities and internal roads — giving a layout engineer a fast read on how effectively the land can be used, rendered as a navigable 3D scene. Built to proof-of-concept and handed to pre-sales.',
    contribution: [
      'Improved LLM-driven layout generation by replacing a fixed max-height heuristic with dimension-based 3D model matching — adding a model-dimension lookup and reworked classification prompt so generated footprints resolve to models that physically fit the plot.',
      'Refactored building-height logic, type and floor-count tables, and pipeline logging across the generation pipeline.',
      'Built an automated site flythrough: spline-interpolated camera pathing that follows the generated road network and orbits each building, with geospatial coordinate projection and in-browser video export.',
      'Added walk and orbit navigation modes to the 3D review scene, plus a material and lighting editor with a day/night toggle.',
    ],
    stack: ['Python', 'OpenAI API', 'PostGIS', 'geospatial projection (UTM / WGS84)', '3D scene tooling'],
  },
  {
    slug: 'document-intelligence',
    title: 'Document Intelligence: Drawings & Specifications',
    kicker: 'LLM agents · hybrid retrieval',
    period: 'May – Jul 2026',
    treatment: 'case-study',
    layer: 'infer',
    premise:
      'Every client onboards thousands of drawing and specification PDFs. Cataloguing a drawing set by hand took days; this turns both document types into structured, searchable records in under an hour, feeding the retrieval index clients search against.',
    contribution: [
      'Built a hierarchical LLM-agent system that classifies drawing sheets by discipline and sheet number, and extracts drawing-set and version information with bulk backfill across existing sets.',
      'Built table-of-contents-aware parsing for specification documents, with dynamic sub-section extraction and PDF section splitting.',
      'Authored the shared ingestion layer — relational, graph, and vector database clients — that both parsers write into, feeding one downstream retrieval and search index.',
    ],
    stack: ['Python', 'OpenAI API', 'PDF / vision parsing', 'PostgreSQL', 'Neo4j', 'vector + full-text retrieval'],
  },
  {
    slug: 'analytics-platform',
    title: 'Multi-Tenant Analytics Data Platform',
    kicker: 'Schema design · event pipeline · tenant isolation',
    period: 'Apr – Aug 2026',
    treatment: 'case-study',
    layer: 'data',
    premise:
      'The data layer behind self-service dashboards and the computer-vision pipeline: a multi-tenant analytics schema, an API that enforces isolation between tenants, and event triggers that push media into inference.',
    contribution: [
      'Designed a multi-tenant analytics schema — data views, dashboards, and chart definitions with role-based permissions — plus denormalized reporting views over forms, locations, and users.',
      'Built the backend API serving that schema, including chart CRUD, a safe view/query preview endpoint, and default-dashboard handling.',
      'Hardened it with JWT-verified tenant/project scoping that rejects any request whose tenant or project parameter does not match the token’s claims, and AES-256 encryption of stored queries.',
      'Built an event-driven media pipeline in-database: trigger functions converting site uploads into queued processing records and firing webhooks into the computer-vision service, with retry and timeout tuning for long-running inference.',
    ],
    stack: ['PostgreSQL', 'Hasura GraphQL', 'SQL triggers & functions', 'JWT', 'AES-256'],
  },
];

export const capabilities = [
  'CPU-only inference',
  'SAHI-tiled inference',
  'RF-DETR',
  'Faster R-CNN',
  'ORB deduplication',
  'vision-language labeling',
  'multi-agent LLM pipelines',
  'document-to-rules extraction',
  'taxonomy mapping',
  'pgvector',
  'Neo4j',
  'event-driven ingestion',
  'tenant isolation',
];

export interface Role {
  title: string;
  period: string;
  current?: boolean;
}

export const experience = {
  company: 'Slate Technologies',
  field: 'Construction Technology',
  period: 'Feb 2025 – Present',
  roles: [
    { title: 'Assistant Software Engineer', period: 'Jul 2026 – Present', current: true },
    { title: 'Trainee Engineer', period: 'Jun 2025 – Jun 2026' },
    { title: 'Intern', period: 'Feb 2025 – May 2025' },
  ] as Role[],
};

export const skillGroups: { label: string; layer: Layer; items: string[] }[] = [
  {
    label: 'Vision & ML',
    layer: 'vision',
    items: [
      'PyTorch',
      'TorchVision',
      'RF-DETR',
      'YOLO / SAHI tiled inference',
      'OpenCV',
      'object detection',
      'CPU-only inference optimization',
    ],
  },
  {
    label: 'LLM & Applied AI',
    layer: 'infer',
    items: [
      'OpenAI API',
      'vision-language (VLM) pipelines',
      'multi-agent pipeline design',
      'prompt engineering',
      'structured extraction',
      'taxonomy mapping',
    ],
  },
  {
    label: 'Data',
    layer: 'data',
    items: ['PostgreSQL', 'pgvector', 'Neo4j', 'vector / graph / full-text retrieval', 'Hasura GraphQL', 'PostGIS', 'pandas'],
  },
  {
    label: 'Platform',
    layer: 'data',
    items: ['Python', 'SQL', 'FastAPI', 'Flask', 'AWS S3 & Lambda', 'Docker', 'deployment scripting for DevOps handoff'],
  },
];

export const contact = {
  /** Split to keep the address out of the markup as a single scrapeable string. */
  emailUser: '12534dhanushm',
  emailDomain: 'gmail.com',
  resumeHref: '/Dhanush_M_Resume.pdf',
};

export const sections = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];
