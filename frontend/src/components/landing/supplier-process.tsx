'use client';

import { UserPlus, Upload, Search, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '01',
    title: 'Create Profile',
    description: 'Set up your company info, specialties, and certifications in minutes.',
    icon: UserPlus,
  },
  {
    number: '02',
    title: 'Upload Catalog',
    description: 'Showcase your capabilities, samples, and past work to attract designers.',
    icon: Upload,
  },
  {
    number: '03',
    title: 'Get Discovered',
    description: 'Designers find you through our smart matching and search filters.',
    icon: Search,
  },
  {
    number: '04',
    title: 'Connect & Grow',
    description: 'Build lasting relationships and grow your client base organically.',
    icon: TrendingUp,
  },
];

export function SupplierProcess() {
  return (
    <section id="supplier-process" className="py-24 lg:py-32 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            How It Works
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-charcoal leading-tight mb-6">
            Four Steps to
            <span className="text-agile-teal"> New Opportunities</span>
          </h2>
          <p className="text-lg text-charcoal-light leading-relaxed">
            Join our network and start connecting with fashion designers in just a few minutes.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block relative">
          {/* Connecting line */}
          <div className="absolute top-24 left-[12.5%] right-[12.5%] h-0.5">
            <div className="w-full h-full bg-gradient-to-r from-agile-teal/20 via-agile-teal to-agile-teal/20" />
            {/* Animated dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-agile-teal animate-pulse shadow-lg shadow-agile-teal/50"
              style={{
                animation: 'moveRight 8s ease-in-out infinite',
              }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative text-center group"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Circle with icon */}
                  <div className="relative inline-flex mb-8">
                    {/* Background pulse */}
                    <div className="absolute inset-0 rounded-full bg-agile-teal/20 animate-ping opacity-0 group-hover:opacity-75" style={{ animationDuration: '2s' }} />

                    {/* Main circle */}
                    <div className={cn(
                      'relative w-20 h-20 rounded-full flex items-center justify-center',
                      'bg-gradient-to-br from-agile-teal to-mint-accent',
                      'shadow-lg shadow-agile-teal/20',
                      'transition-transform duration-500 group-hover:scale-110'
                    )}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Step number badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-charcoal text-white text-xs font-bold flex items-center justify-center shadow-md">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-charcoal mb-3">
                    {step.title}
                  </h3>
                  <p className="text-charcoal-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Layout - Vertical Timeline */}
        <div className="lg:hidden relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-agile-teal via-agile-teal to-agile-teal/20" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative pl-16"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Circle with icon */}
                  <div className="absolute left-0 top-0">
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center',
                      'bg-gradient-to-br from-agile-teal to-mint-accent',
                      'shadow-md shadow-agile-teal/20'
                    )}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <span className="inline-block text-xs font-bold text-agile-teal tracking-wider mb-1">
                      STEP {step.number}
                    </span>
                    <h3 className="text-lg font-semibold text-charcoal mb-2">
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
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes moveRight {
          0%, 100% { left: 0; }
          50% { left: calc(100% - 12px); }
        }
      `}</style>
    </section>
  );
}
