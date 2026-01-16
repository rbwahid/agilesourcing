import {
  HeroSection,
  ProblemSolution,
  FeaturesGrid,
  HowItWorks,
  SocialProof,
  SupplierCTA,
  FinalCTA,
  LandingFooter,
} from '@/components/landing';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSolution />
      <FeaturesGrid />
      <HowItWorks />
      <SocialProof />
      <SupplierCTA />
      <FinalCTA />
      <LandingFooter />
    </main>
  );
}
