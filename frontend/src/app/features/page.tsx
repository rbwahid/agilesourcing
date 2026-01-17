import {
  LandingNavbar,
  FeaturesHero,
  FeatureDeepDive,
  FeaturesCTA,
  LandingFooter,
} from '@/components/landing';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <FeaturesHero />
      <FeatureDeepDive />
      <FeaturesCTA />
      <LandingFooter />
    </main>
  );
}
