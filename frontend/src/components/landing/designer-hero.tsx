'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';

export function DesignerHero() {
  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary gradient orb */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, var(--mint-accent) 0%, transparent 70%)',
            animationDuration: '8s',
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, var(--agile-teal) 0%, transparent 70%)',
            animationDuration: '10s',
            animationDelay: '2s',
          }}
        />

        {/* Flowing fabric SVG */}
        <svg
          className="absolute top-0 left-0 w-1/3 h-full opacity-[0.04]"
          viewBox="0 0 200 600"
          fill="none"
          preserveAspectRatio="xMinYMid slice"
        >
          <path
            d="M0 0C50 80 30 160 60 240C90 320 30 400 60 480C90 560 30 600 0 600V0Z"
            fill="var(--agile-teal)"
          />
        </svg>

        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--charcoal) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-agile-teal/10 border border-agile-teal/20 mb-8 animate-fade-in"
            style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
          >
            <span className="text-sm font-medium text-agile-teal tracking-wide">
              For Fashion Designers
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-charcoal leading-[1.1] tracking-tight mb-6 animate-slide-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
          >
            Turn Creative Uncertainty
            <br />
            <span className="text-agile-teal">Into Confident Collections</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg sm:text-xl text-charcoal-light max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}
          >
            Stop second-guessing your designs. AI-powered validation and verified supplier connections help you create with certainty.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}
          >
            <Button
              asChild
              size="lg"
              className="bg-agile-teal hover:bg-agile-teal/90 text-white px-8 py-6 text-lg rounded-full group transition-all duration-300 hover:shadow-xl hover:shadow-agile-teal/20"
            >
              <Link href="/register?role=designer">
                Start Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToPricing}
              className="border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-white px-8 py-6 text-lg rounded-full transition-all duration-300"
            >
              See Pricing
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Quick stats */}
          <div
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in"
            style={{ animationDelay: '0.8s', animationFillMode: 'backwards' }}
          >
            <div className="text-center">
              <div className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">10K+</div>
              <div className="text-xs sm:text-sm text-charcoal-light/70">Designs Validated</div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">87%</div>
              <div className="text-xs sm:text-sm text-charcoal-light/70">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">500+</div>
              <div className="text-xs sm:text-sm text-charcoal-light/70">Suppliers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
