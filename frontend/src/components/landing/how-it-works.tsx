'use client';

import { Upload, Lightbulb, Globe, Handshake } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '01',
    title: 'Share Your Vision',
    description: 'Upload your designs and let us see what you see',
    icon: Upload,
  },
  {
    number: '02',
    title: 'Discover Insights',
    description: 'AI reveals trends, potential, and opportunities you might miss',
    icon: Lightbulb,
  },
  {
    number: '03',
    title: 'Validate with the World',
    description: 'Test market response before investing in production',
    icon: Globe,
  },
  {
    number: '04',
    title: 'Find Your Partner',
    description: 'Connect with suppliers who\'ll bring your vision to life',
    icon: Handshake,
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 lg:py-32 bg-light-grey/30 overflow-hidden">
      {/* Decorative line pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-[0.03]"
          viewBox="0 0 800 800"
        >
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx="400"
              cy="400"
              r={50 + i * 40}
              fill="none"
              stroke="var(--charcoal)"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-24">
          <span className="inline-block text-sm font-medium text-agile-teal tracking-wider uppercase mb-4">
            How It Works
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight mb-6">
            From Spark to{' '}
            <span className="text-agile-teal">Reality</span>
          </h2>
          <p className="text-lg text-charcoal-light max-w-xl mx-auto">
            Four simple steps to transform your creative vision into a market-ready collection.
          </p>
        </div>

        {/* Steps - Desktop horizontal layout */}
        <div className="hidden lg:block max-w-6xl mx-auto">
          {/* Connecting line */}
          <div className="relative">
            <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-agile-teal/20 via-agile-teal/40 to-agile-teal/20" />
          </div>

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative text-center"
                  style={{
                    animationDelay: `${0.2 + index * 0.15}s`,
                  }}
                >
                  {/* Step circle */}
                  <div className="relative inline-flex mb-8">
                    <div className="w-24 h-24 rounded-full bg-white border-2 border-agile-teal/20 flex items-center justify-center shadow-lg shadow-agile-teal/5 transition-all duration-300 hover:border-agile-teal hover:shadow-xl hover:shadow-agile-teal/10 group">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-agile-teal to-mint-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-charcoal text-white text-xs font-semibold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>

                  {/* Step content */}
                  <h3 className="font-serif text-xl font-semibold text-charcoal mb-3">
                    {step.title}
                  </h3>
                  <p className="text-charcoal-light text-sm leading-relaxed max-w-[200px] mx-auto">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps - Mobile/Tablet vertical layout */}
        <div className="lg:hidden max-w-md mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="relative flex gap-6">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-agile-teal/20 flex items-center justify-center shadow-lg shadow-agile-teal/5">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-agile-teal to-mint-accent flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    {/* Number badge */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-charcoal text-white text-xs font-semibold flex items-center justify-center">
                      {step.number}
                    </div>
                  </div>
                  {/* Connecting line */}
                  {!isLast && (
                    <div className="w-0.5 h-full min-h-[80px] bg-gradient-to-b from-agile-teal/40 to-agile-teal/10" />
                  )}
                </div>

                {/* Content */}
                <div className={cn('pt-2 pb-10', isLast && 'pb-0')}>
                  <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
                    {step.title}
                  </h3>
                  <p className="text-charcoal-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
