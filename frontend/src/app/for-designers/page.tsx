import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {
  LandingNavbar,
  DesignerHero,
  BenefitsSection,
  FeatureShowcase,
  DesignerTestimonials,
  PricingTable,
  FaqSection,
  LandingFooter,
} from '@/components/landing';

// Custom Final CTA for designers page
function DesignerFinalCTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-agile-teal via-agile-teal to-mint-accent" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-pulse"
          style={{ animationDuration: '8s', animationDelay: '2s' }}
        />

        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6">
            Ready to Design
            <br />
            with Confidence?
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-white/80 max-w-xl mx-auto leading-relaxed mb-10">
            Join thousands of designers who validate before they create. Because great fashion deserves certainty.
          </p>

          {/* CTA */}
          <Button
            asChild
            size="lg"
            className="bg-white text-agile-teal hover:bg-charcoal hover:text-white px-10 py-7 text-lg font-semibold rounded-full group transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-2xl"
          >
            <Link href="/register?role=designer">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/60">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Setup in 2 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ForDesignersPage() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <DesignerHero />
      <BenefitsSection />
      <FeatureShowcase />
      <DesignerTestimonials />
      <PricingTable />
      <FaqSection />
      <DesignerFinalCTA />
      <LandingFooter />
    </main>
  );
}
