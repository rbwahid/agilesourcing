'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Factory, Users, Globe } from 'lucide-react';

const stats = [
  { value: '500+', label: 'Verified Suppliers', icon: Factory },
  { value: '10k+', label: 'Active Designers', icon: Users },
  { value: '50+', label: 'Countries', icon: Globe },
];

export function SupplierTeaser() {
  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-charcoal" />

      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Accent gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-agile-teal/10 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Content */}
          <div className="max-w-xl">
            <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
              For Manufacturers
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white leading-tight mb-4">
              Are You a Manufacturer?
            </h2>

            <p className="text-lg text-white/70 leading-relaxed mb-6">
              Join our network and connect with designers actively seeking production partners. Get discovered by brands that value quality.
            </p>

            <Button
              asChild
              className="bg-agile-teal hover:bg-agile-teal/90 text-white px-6 py-6 text-base font-semibold rounded-xl group transition-all duration-300"
            >
              <Link href="/for-suppliers">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 lg:gap-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-agile-teal" />
                  </div>
                  <div className="text-2xl font-serif font-semibold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/50">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
