import {
  LandingNavbar,
  PricingHero,
  DesignerPricingSection,
  FeatureComparisonTable,
  SupplierPricingSection,
  PricingFaq,
  GetStartedCTA,
  LandingFooter,
} from '@/components/landing';

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <PricingHero />
      <DesignerPricingSection />
      <FeatureComparisonTable />
      <SupplierPricingSection />
      <PricingFaq />
      <GetStartedCTA />
      <LandingFooter />
    </main>
  );
}
