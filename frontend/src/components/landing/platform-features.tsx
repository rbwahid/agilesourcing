'use client';

import { Sparkles, Users, Building2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Analysis',
    description: 'Leverage cutting-edge fashion AI to understand your designs.',
    bullets: [
      'Trend detection & forecasting',
      'Style categorization',
      'Market fit scoring',
    ],
    gradient: 'from-agile-teal/10 to-mint-accent/5',
  },
  {
    icon: Users,
    title: 'Real Audience Validation',
    description: 'Get feedback from actual fashion consumers before production.',
    bullets: [
      'Instagram poll integration',
      'Consumer sentiment analysis',
      'Data-driven decisions',
    ],
    gradient: 'from-mint-accent/10 to-agile-teal/5',
  },
  {
    icon: Building2,
    title: 'Verified Supplier Network',
    description: 'Connect with trusted manufacturers worldwide.',
    bullets: [
      '500+ verified manufacturers',
      'Certification filtering',
      'Direct messaging',
    ],
    gradient: 'from-charcoal/5 to-charcoal/10',
  },
];

export function PlatformFeatures() {
  return (
    <section className="py-20 lg:py-28 bg-light-grey">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            Platform Capabilities
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal leading-tight mb-6">
            Everything You Need to
            <span className="text-agile-teal"> Succeed</span>
          </h2>
          <p className="text-lg text-charcoal-light leading-relaxed">
            Powerful tools designed specifically for fashion designers who want to create with confidence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  'group relative p-8 rounded-2xl transition-all duration-500',
                  'hover:shadow-xl hover:shadow-charcoal/5 hover:-translate-y-1',
                  'bg-white border border-gray-100',
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className={cn(
                  'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                  `bg-gradient-to-br ${feature.gradient}`
                )} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center mb-6',
                    'bg-agile-teal/10 group-hover:bg-agile-teal/20',
                    'transition-all duration-300 group-hover:scale-110'
                  )}>
                    <Icon className="w-7 h-7 text-agile-teal" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-charcoal mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-charcoal-light mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bullet points */}
                  <ul className="space-y-3">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-agile-teal/10 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-agile-teal" />
                        </div>
                        <span className="text-sm text-charcoal-light">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
