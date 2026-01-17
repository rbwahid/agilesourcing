'use client';

import { Compass, Target, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const valueProps = [
  {
    icon: Compass,
    stat: '10,000+',
    label: 'Active designers monthly',
    description: 'Designers search by your exact specialties, certifications, and MOQ ranges. Be visible to those who need what you offer.',
    gradient: 'from-agile-teal/10 to-mint-accent/5',
    iconBg: 'bg-agile-teal/10',
    iconColor: 'text-agile-teal',
  },
  {
    icon: Target,
    stat: '70%',
    label: 'Reduced inquiry time',
    description: 'Pre-qualified designers with clear requirements. No more back-and-forth on basics—focus on real opportunities.',
    gradient: 'from-charcoal/5 to-charcoal/10',
    iconBg: 'bg-charcoal/10',
    iconColor: 'text-charcoal',
  },
  {
    icon: ShieldCheck,
    stat: '3x',
    label: 'More responses when verified',
    description: 'Showcase certifications, past work, and earn verification badges that build trust with potential partners.',
    gradient: 'from-mint-accent/10 to-agile-teal/5',
    iconBg: 'bg-mint-accent/20',
    iconColor: 'text-agile-teal',
  },
];

export function SupplierValueProps() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            Why Partner With Us
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-charcoal leading-tight mb-6">
            Your Expertise Deserves
            <span className="text-agile-teal"> Visibility</span>
          </h2>
          <p className="text-lg text-charcoal-light leading-relaxed">
            Stop waiting for the right opportunities. Let them find you through our platform built specifically for manufacturing excellence.
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <div
                key={prop.label}
                className={cn(
                  'group relative p-8 rounded-2xl transition-all duration-500',
                  'hover:shadow-xl hover:shadow-charcoal/5 hover:-translate-y-1',
                  'border border-gray-100 hover:border-gray-200',
                  `bg-gradient-to-br ${prop.gradient}`
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                  <div
                    className="absolute -top-10 -right-10 w-20 h-20 rotate-45 bg-gradient-to-br from-transparent to-white/50"
                  />
                </div>

                {/* Icon */}
                <div className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center mb-6',
                  'transition-transform duration-300 group-hover:scale-110',
                  prop.iconBg
                )}>
                  <Icon className={cn('w-7 h-7', prop.iconColor)} />
                </div>

                {/* Stat */}
                <div className="mb-4">
                  <span className="text-5xl lg:text-6xl font-serif font-semibold text-charcoal">
                    {prop.stat}
                  </span>
                </div>

                {/* Label */}
                <h3 className="text-lg font-semibold text-charcoal mb-3">
                  {prop.label}
                </h3>

                {/* Description */}
                <p className="text-charcoal-light leading-relaxed">
                  {prop.description}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-agile-teal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
