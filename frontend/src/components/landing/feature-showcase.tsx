'use client';

import { Sparkles, Instagram, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    title: 'AI Design Analysis',
    subtitle: 'Intelligent Insights',
    description:
      'Upload any sketch and get instant insights on trends, color palettes, and market potential. Our AI analyzes millions of data points to predict what will resonate with your audience.',
    highlights: ['Trend scoring', 'Color analysis', 'Market timing', 'Style recommendations'],
    icon: Sparkles,
    gradient: 'from-agile-teal to-mint-accent',
    bgColor: 'bg-white',
  },
  {
    title: 'Instagram Validation',
    subtitle: 'Real Audience Testing',
    description:
      'Generate professional mockups and test real audience engagement before production. See how your designs perform with actual consumers, not just assumptions.',
    highlights: ['AI mockup generation', 'Engagement tracking', 'Audience insights', 'Performance metrics'],
    icon: Instagram,
    gradient: 'from-pink-500 to-purple-500',
    bgColor: 'bg-light-grey/30',
  },
  {
    title: 'Supplier Discovery',
    subtitle: 'Verified Partners',
    description:
      'Browse 500+ verified suppliers filtered by specialty, MOQ, certifications, and location. Find partners who share your commitment to quality and sustainability.',
    highlights: ['Verified manufacturers', 'Certification filters', 'Direct messaging', 'Quote requests'],
    icon: Building2,
    gradient: 'from-mint-accent to-emerald-500',
    bgColor: 'bg-white',
  },
];

export function FeatureShowcase() {
  return (
    <section className="relative overflow-hidden">
      {/* Section header */}
      <div className="bg-white py-16 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-sm font-medium text-agile-teal tracking-wider uppercase mb-4">
              Platform Features
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight">
              Your Design Workflow,
              <br />
              <span className="text-agile-teal">Supercharged</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Feature sections */}
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const isReversed = index % 2 === 1;

        return (
          <div
            key={feature.title}
            className={cn('py-16 lg:py-24', feature.bgColor)}
          >
            <div className="container mx-auto px-6">
              <div
                className={cn(
                  'flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-6xl mx-auto',
                  isReversed && 'lg:flex-row-reverse'
                )}
              >
                {/* Visual placeholder */}
                <div className="flex-1 w-full">
                  <div
                    className={cn(
                      'relative aspect-[4/3] rounded-2xl overflow-hidden',
                      'bg-gradient-to-br from-gray-100 to-gray-50',
                      'border border-gray-200'
                    )}
                  >
                    {/* Decorative pattern */}
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, var(--charcoal) 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                      }}
                    />

                    {/* Floating UI mockup placeholder */}
                    <div className="absolute inset-8 rounded-xl bg-white shadow-2xl shadow-charcoal/10 border border-gray-100 overflow-hidden">
                      {/* Header bar */}
                      <div className="h-12 bg-light-grey/50 border-b border-gray-100 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400/60" />
                        <div className="w-3 h-3 rounded-full bg-amber-400/60" />
                        <div className="w-3 h-3 rounded-full bg-green-400/60" />
                        <div className="flex-1 mx-4">
                          <div className="h-6 w-48 bg-gray-200 rounded-md" />
                        </div>
                      </div>

                      {/* Content area */}
                      <div className="p-6">
                        <div className="flex gap-4 mb-4">
                          <div
                            className={cn(
                              'w-16 h-16 rounded-xl bg-gradient-to-br',
                              feature.gradient,
                              'flex items-center justify-center'
                            )}
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                            <div className="h-3 w-48 bg-gray-100 rounded" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-3 w-full bg-gray-100 rounded" />
                          <div className="h-3 w-5/6 bg-gray-100 rounded" />
                          <div className="h-3 w-4/6 bg-gray-100 rounded" />
                        </div>
                        <div className="mt-6 flex gap-2">
                          <div className="h-8 w-24 bg-agile-teal/20 rounded-lg" />
                          <div className="h-8 w-20 bg-gray-100 rounded-lg" />
                        </div>
                      </div>
                    </div>

                    {/* Gradient accent */}
                    <div
                      className={cn(
                        'absolute bottom-0 left-0 right-0 h-1/3',
                        'bg-gradient-to-t from-agile-teal/5 to-transparent'
                      )}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 w-full">
                  {/* Subtitle */}
                  <span className="inline-block text-sm font-medium text-agile-teal tracking-wider uppercase mb-3">
                    {feature.subtitle}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal mb-4">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-lg text-charcoal-light leading-relaxed mb-8">
                    {feature.description}
                  </p>

                  {/* Highlights */}
                  <ul className="grid grid-cols-2 gap-3">
                    {feature.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-agile-teal/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-agile-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-charcoal-light">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
