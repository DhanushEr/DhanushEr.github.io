import { StickyNav } from '@/components/nav/StickyNav';
import { Hero } from '@/components/hero/Hero';
import { CapabilityMarquee } from '@/components/strip/CapabilityMarquee';
import { WorkSection } from '@/components/work/WorkSection';
import { TitleProgression } from '@/components/experience/TitleProgression';
import { SkillsGrid } from '@/components/skills/SkillsGrid';
import { Contact } from '@/components/contact/Contact';

export default function Page() {
  return (
    <>
      <StickyNav />
      <main>
        <Hero />
        <CapabilityMarquee />
        <WorkSection />
        <TitleProgression />
        <SkillsGrid />
        <Contact />
      </main>
    </>
  );
}
