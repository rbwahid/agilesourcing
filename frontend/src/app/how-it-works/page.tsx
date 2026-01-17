import {
  LandingNavbar,
  HowItWorksHero,
  DesignerJourney,
  PlatformFeatures,
  SupplierTeaser,
  GetStartedCTA,
  LandingFooter,
} from '@/components/landing';

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <HowItWorksHero />
      <DesignerJourney />
      <PlatformFeatures />
      <SupplierTeaser />
      <GetStartedCTA />
      <LandingFooter />
    </main>
  );
}
