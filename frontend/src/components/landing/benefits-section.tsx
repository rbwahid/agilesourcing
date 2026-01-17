'use client';

import { TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const benefits = [
  {
    title: 'Validate Before You Invest',
    description: 'Know which designs will resonate before spending on production',
    stat: '87%',
    statLabel: 'of validated designs meet sales targets',
    icon: TrendingUp,
    gradient: 'from-agile-teal to-mint-accent',
  },
  {
    title: 'Find Partners You Can Trust',
    description: 'Connect with verified manufacturers who share your values',
    stat: '500+',
    statLabel: 'certified sustainable suppliers',
    icon: ShieldCheck,
    gradient: 'from-mint-accent to-emerald-400',
  },
  {
    title: 'Launch Faster, Stress Less',
    description: 'Streamline your workflow from sketch to production',
    stat: '60%',
    statLabel: 'reduction in sourcing time',
    icon: Zap,
    gradient: 'from-amber-400 to-orange-400',
  },
];

export function BenefitsSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-light-grey/50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {[...Array(8)].map((_, i) => (
            <circle
              key={i}
              cx="200"
              cy="200"
              r={40 + i * 25}
              fill="none"
              stroke="var(--agile-teal)"
              strokeWidth="0.5"
              opacity={0.1 - i * 0.01}
            />
          ))}
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <span className="inline-block text-sm font-medium text-agile-teal tracking-wider uppercase mb-4">
            Designer Benefits
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight">
            What You'll{' '}
            <span className="text-agile-teal">Achieve</span>
          </h2>
        </div>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className={cn(
                  'group relative bg-white rounded-2xl p-8 lg:p-10 transition-all duration-500',
                  'hover:shadow-2xl hover:shadow-charcoal/10 hover:-translate-y-2',
                  'border border-gray-100 hover:border-transparent'
                )}
                style={{
                  animationDelay: `${0.2 + index * 0.15}s`,
                }}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                    'bg-gradient-to-br from-white via-white to-agile-teal/5'
                  )}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={cn(
                      'inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6',
                      'bg-gradient-to-br',
                      benefit.gradient,
                      'transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3'
                    )}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Stat - Large and prominent */}
                  <div className="mb-4">
                    <span className="font-serif text-5xl lg:text-6xl font-semibold text-charcoal">
                      {benefit.stat}
                    </span>
                  </div>

                  {/* Stat label */}
                  <p className="text-sm text-agile-teal font-medium mb-4">
                    {benefit.statLabel}
                  </p>

                  {/* Divider */}
                  <div className="w-12 h-0.5 bg-gray-200 mb-4 transition-all duration-300 group-hover:w-20 group-hover:bg-agile-teal" />

                  {/* Title */}
                  <h3 className="font-serif text-xl lg:text-2xl font-semibold text-charcoal mb-3">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-charcoal-light leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-agile-teal/10 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
