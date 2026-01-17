import {
  LandingNavbar,
  AboutHero,
  MissionSection,
  ValuesSection,
  FounderStory,
  AboutCTA,
  LandingFooter,
} from '@/components/landing';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <AboutHero />
      <MissionSection />
      <ValuesSection />
      <FounderStory />
      <AboutCTA />
      <LandingFooter />
    </main>
  );
}
