'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { projects } from '@/lib/projects';
import { SectionHeading, Shell } from '@/components/ui/primitives';
import { ProjectRail } from './ProjectRail';
import { ProjectPanel } from './ProjectPanel';
import { InspectionDemo } from './panels/InspectionDemo';
import { SitePlanDemo } from './panels/SitePlanDemo';
import { VoicePipelineDemo } from './panels/VoicePipelineDemo';
import { IngestionDiagram } from '@/components/diagrams/IngestionDiagram';
import { EventPipelineDiagram } from '@/components/diagrams/EventPipelineDiagram';

/** Every project has a bespoke visual; a project without one simply renders no figure. */
const panelVisuals: Record<string, () => JSX.Element> = {
  'site-inspection': () => <InspectionDemo />,
  'voice-to-structured-data': () => <VoicePipelineDemo />,
  'site-layout': () => <SitePlanDemo />,
  'document-intelligence': () => <IngestionDiagram />,
  'analytics-platform': () => <EventPipelineDiagram />,
};

export function WorkSection() {
  const [activeSlug, setActiveSlug] = useState(projects[0].slug);
  const active = projects.find((p) => p.slug === activeSlug) ?? projects[0];
  const Visual = panelVisuals[active.slug];

  return (
    <section id="work" className="border-b border-line py-20 sm:py-28">
      <Shell className="flex flex-col gap-12">
        <SectionHeading
          index="01 / Work"
          title="Five systems, built end to end."
          lede="Detection models, agent pipelines, and the data platforms underneath them — each entry describes only what I personally designed and wrote."
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(240px,300px)_1fr] lg:gap-14">
          <ProjectRail projects={projects} activeSlug={activeSlug} onSelect={setActiveSlug} />

          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <ProjectPanel key={active.slug} project={active} visual={Visual ? <Visual /> : null} />
            </AnimatePresence>
          </div>
        </div>
      </Shell>
    </section>
  );
}
