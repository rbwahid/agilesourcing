'use client';

import { Palette, Factory } from 'lucide-react';

export function PricingHero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-16 lg:py-20 bg-light-grey">
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #222222 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-agile-teal" />
            <span className="text-sm font-medium text-charcoal-light">
              No hidden fees
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight mb-6">
            Simple, Transparent
            <span className="text-agile-teal"> Pricing</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-charcoal-light max-w-xl mx-auto leading-relaxed mb-10">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Quick links */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('designer-pricing')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-charcoal font-medium hover:border-agile-teal hover:text-agile-teal transition-colors duration-300 shadow-sm"
            >
              <Palette className="w-5 h-5" />
              For Designers
            </button>
            <button
              onClick={() => scrollToSection('supplier-pricing')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-charcoal font-medium hover:border-agile-teal hover:text-agile-teal transition-colors duration-300 shadow-sm"
            >
              <Factory className="w-5 h-5" />
              For Suppliers
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
