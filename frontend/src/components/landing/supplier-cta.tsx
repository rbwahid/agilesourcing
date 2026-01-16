'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Factory, Globe, BadgeCheck, Users, ArrowRight } from 'lucide-react';

const benefits = [
  {
    icon: Globe,
    text: 'Be discovered by designers who share your standards',
  },
  {
    icon: BadgeCheck,
    text: 'Showcase certifications that matter',
  },
  {
    icon: Users,
    text: 'Build relationships, not just transactions',
  },
];

export function SupplierCTA() {
  return (
    <section className="relative py-24 lg:py-32 bg-charcoal overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-agile-teal/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-mint-accent/10 blur-3xl" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Flowing fabric shape */}
        <svg
          className="absolute left-0 top-0 h-full w-1/3 opacity-[0.05]"
          viewBox="0 0 200 400"
          preserveAspectRatio="xMinYMid slice"
        >
          <path
            d="M0 0C50 50 20 100 50 150C80 200 20 250 50 300C80 350 20 400 0 400V0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            {/* Content */}
            <div className="lg:max-w-xl">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-agile-teal/20 mb-8">
                <Factory className="w-8 h-8 text-agile-teal" />
              </div>

              {/* Title */}
              <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-white leading-tight mb-6">
                Craft Meets
                <br />
                <span className="text-agile-teal">Commerce</span>
              </h2>

              {/* Description */}
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                Join a network where quality matters. Connect with designers who value craftsmanship, sustainability, and partnership.
              </p>

              {/* Benefits */}
              <ul className="space-y-4 mb-10">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <li key={benefit.text} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-agile-teal" />
                      </div>
                      <span className="text-white/90">{benefit.text}</span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA */}
              <Button
                asChild
                size="lg"
                className="bg-white text-charcoal hover:bg-agile-teal hover:text-white px-8 py-6 text-lg rounded-full group transition-all duration-300"
              >
                <Link href="/register?role=supplier">
                  Partner With Us
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Stats card */}
            <div className="lg:w-80">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-white/60 text-sm uppercase tracking-wider mb-6">
                  Supplier Network
                </h3>

                <div className="space-y-6">
                  <div>
                    <div className="font-serif text-4xl font-semibold text-white mb-1">
                      500+
                    </div>
                    <div className="text-white/60 text-sm">
                      Verified Suppliers
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div>
                    <div className="font-serif text-4xl font-semibold text-white mb-1">
                      50+
                    </div>
                    <div className="text-white/60 text-sm">
                      Countries
                    </div>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div>
                    <div className="font-serif text-4xl font-semibold text-agile-teal mb-1">
                      92%
                    </div>
                    <div className="text-white/60 text-sm">
                      Response Rate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
