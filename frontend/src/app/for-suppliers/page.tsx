import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import {
  LandingNavbar,
  SupplierHero,
  SupplierValueProps,
  SupplierFeatures,
  SupplierProcess,
  SupplierTestimonials,
  SupplierPricing,
  SupplierFaq,
  LandingFooter,
} from '@/components/landing';

// Custom Final CTA for suppliers page
function SupplierFinalCTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-agile-teal via-agile-teal to-mint-accent" />

      {/* Industrial pattern overlay */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Animated orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/10 blur-3xl animate-pulse"
          style={{ animationDuration: '6s' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-pulse"
          style={{ animationDuration: '8s', animationDelay: '2s' }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6">
            Ready to Grow Your
            <br />
            Designer Network?
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-white/80 max-w-xl mx-auto leading-relaxed mb-10">
            Join hundreds of manufacturers connecting with fashion designers who value quality and reliability.
          </p>

          {/* CTA */}
          <Button
            asChild
            size="lg"
            className="bg-white text-agile-teal hover:bg-charcoal hover:text-white px-10 py-7 text-lg font-semibold rounded-full group transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-2xl"
          >
            <Link href="/register?role=supplier">
              Join Our Network
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/60">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">No commission fees</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Setup in 15 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ForSuppliersPage() {
  return (
    <main className="min-h-screen">
      <LandingNavbar />
      <SupplierHero />
      <SupplierValueProps />
      <SupplierFeatures />
      <SupplierProcess />
      <SupplierTestimonials />
      <SupplierPricing />
      <SupplierFaq />
      <SupplierFinalCTA />
      <LandingFooter />
    </main>
  );
}
