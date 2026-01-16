'use client';

import {
  Sparkles,
  Instagram,
  Building2,
  Wand2,
  MessageSquare,
  Route,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'AI Design Analysis',
    description: 'Uncover hidden potential in every sketch with intelligent trend insights',
    icon: Sparkles,
    gradient: 'from-agile-teal to-mint-accent',
  },
  {
    title: 'Instagram Validation',
    description: 'Let your audience vote before a single stitch is sewn',
    icon: Instagram,
    gradient: 'from-pink-500 to-purple-500',
  },
  {
    title: 'Verified Supplier Network',
    description: '500+ ethical manufacturers, vetted and ready to partner',
    icon: Building2,
    gradient: 'from-mint-accent to-agile-teal',
  },
  {
    title: 'Intelligent Matching',
    description: 'Find suppliers who understand your vision and values',
    icon: Wand2,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Seamless Communication',
    description: 'From first hello to final handshake, all in one place',
    icon: MessageSquare,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Journey Tracking',
    description: 'Watch your collection come to life, step by step',
    icon: Route,
    gradient: 'from-agile-teal to-emerald-500',
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--charcoal) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating accent */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-agile-teal/5 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-mint-accent/5 blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <span className="inline-block text-sm font-medium text-agile-teal tracking-wider uppercase mb-4">
            Platform Features
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight mb-6">
            Your Creative Toolkit,
            <br />
            <span className="relative inline-block">
              Reimagined
              <svg
                className="absolute -bottom-1 left-0 w-full h-2"
                viewBox="0 0 200 8"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 4C40 2 80 6 120 4C160 2 200 6 200 4"
                  stroke="var(--mint-accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.4"
                />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-charcoal-light max-w-xl mx-auto">
            Everything you need to validate, source, and create—unified in one intelligent platform.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  'group relative bg-white border border-gray-100 rounded-2xl p-8 transition-all duration-500',
                  'hover:border-transparent hover:shadow-2xl hover:shadow-charcoal/10 hover:-translate-y-2'
                )}
                style={{
                  animationDelay: `${0.1 + index * 0.1}s`,
                }}
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-white to-agile-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon with gradient background */}
                  <div className="relative mb-6">
                    <div
                      className={cn(
                        'inline-flex items-center justify-center w-14 h-14 rounded-xl',
                        'bg-gradient-to-br',
                        feature.gradient,
                        'transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3'
                      )}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    {/* Glow effect */}
                    <div
                      className={cn(
                        'absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500',
                        'bg-gradient-to-br',
                        feature.gradient
                      )}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl lg:text-2xl font-semibold text-charcoal mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-charcoal-light leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Learn more link */}
                  <div className="mt-6 flex items-center text-agile-teal font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm">Learn more</span>
                    <svg
                      className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
