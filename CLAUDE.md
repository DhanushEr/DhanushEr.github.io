# Portfolio Website — Dhanush

## Purpose
Bold, design-forward, graphic-heavy personal portfolio site.

## Content source
../project-summaries.md — already analyzed, reuse directly, don't re-derive.

## Design direction
- Bold, graphic-heavy, design-forward — NOT a minimal/plain dev portfolio.
- Strong visual identity: confident typography, intentional color, generous
  use of motion — not templated "AI-generated" defaults.
- Favor custom SVG/Canvas diagrams over stock icons, especially for
  pipeline/architecture visuals.
- Scroll-triggered animations (Framer Motion) to make CV/pipeline work feel
  alive, not static bullet points.
- Show, don't just tell: architecture diagrams, pipeline flow visuals,
  sanitized before/after-style visuals for CV work.

## Stack
- Next.js + Tailwind CSS
- Framer Motion for animation
- Custom SVG/Canvas components for technical diagrams

## Sections (draft)
1. Hero — name, role, one strong visual/tagline
2. Featured projects — 3-5 projects with custom visuals per project
3. Skills/stack — visual, not just a text list
4. Contact

## Design reference (style only — do not copy content/personal info)
Reference site characteristics to match in quality bar:
- Dark theme, bold oversized headline typography with gradient/color-accent 
  on key phrases (e.g. one line white, next line in accent blue/purple)
- Sticky top nav with pill-style CTA buttons (outline + filled)
- Tag/chip row under hero summarizing core stack
- Dedicated Projects section: left sidebar project list + right detail 
  panel per project, not a flat grid
- Live/interactive product demos where feasible for this candidate's work 
  (e.g. an orbitable 3D view for siteplanning-app's building models, a 
  phase/status tracker UI for the visual_intelligence pipeline stages)
- Small persistent corner widget (chat-style) — stretch goal, not required 
  for v1
- Terminal/monospace styling accents for technical credibility (status 
  badges, phase labels in monospace caps)

Build OUR OWN distinct visual identity at this quality level — same 
ambition and polish, not a clone. Use Dhanush's actual project content 
from ../project-summaries.md and the finished resume, never any content 
from the reference site.
