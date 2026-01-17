'use client';

import { Upload, Sparkles, Users, Handshake, Clock, ImagePlus, TrendingUp, BarChart3, Heart, MessageSquare, BadgeCheck, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '01',
    title: 'Upload Your Design',
    description: 'Upload your design sketch or concept. Our AI analyzes it instantly for trends and market potential.',
    icon: Upload,
    time: '30 seconds',
    mockup: 'upload',
  },
  {
    number: '02',
    title: 'Get AI Insights',
    description: 'Receive instant trend analysis, market fit scores, and style recommendations powered by fashion AI.',
    icon: Sparkles,
    time: 'Instant',
    mockup: 'analysis',
  },
  {
    number: '03',
    title: 'Validate with Audiences',
    description: 'Test your designs with real fashion consumers through Instagram polls and targeted surveys.',
    icon: Users,
    time: '24-48 hours',
    mockup: 'validation',
  },
  {
    number: '04',
    title: 'Connect with Suppliers',
    description: 'Match with verified manufacturers who specialize in your design\'s specific requirements.',
    icon: Handshake,
    time: 'Browse anytime',
    mockup: 'suppliers',
  },
];

function UploadMockup() {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 w-full max-w-[200px]">
      <div className="border-2 border-dashed border-agile-teal/30 rounded-lg p-4 text-center">
        <ImagePlus className="w-8 h-8 text-agile-teal/50 mx-auto mb-2" />
        <div className="text-xs text-charcoal-light">Drop design here</div>
      </div>
      <div className="mt-3 flex gap-2">
        <div className="flex-1 h-2 bg-agile-teal rounded-full" />
        <div className="text-xs text-agile-teal font-medium">100%</div>
      </div>
    </div>
  );
}

function AnalysisMockup() {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 w-full max-w-[200px]">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-agile-teal" />
        <span className="text-xs font-medium text-charcoal">Trend Score</span>
      </div>
      <div className="text-2xl font-serif font-semibold text-charcoal mb-2">87%</div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-charcoal-light">Style Match</span>
          <span className="text-agile-teal">High</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-charcoal-light">Market Fit</span>
          <span className="text-agile-teal">Strong</span>
        </div>
      </div>
    </div>
  );
}

function ValidationMockup() {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 w-full max-w-[200px]">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-agile-teal" />
        <span className="text-xs font-medium text-charcoal">Poll Results</span>
      </div>
      <div className="space-y-2">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-charcoal-light flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-400" /> Love it
            </span>
            <span className="text-charcoal font-medium">68%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-agile-teal rounded-full" style={{ width: '68%' }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-charcoal-light">Like it</span>
            <span className="text-charcoal font-medium">24%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-mint-accent rounded-full" style={{ width: '24%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SuppliersMockup() {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 w-full max-w-[200px]">
      <div className="flex items-center gap-2 mb-3">
        <Building2 className="w-4 h-4 text-agile-teal" />
        <span className="text-xs font-medium text-charcoal">Top Matches</span>
      </div>
      <div className="space-y-2">
        {[
          { name: 'Stellar Textiles', match: '98%' },
          { name: 'EcoWeave Co.', match: '94%' },
        ].map((supplier) => (
          <div key={supplier.name} className="flex items-center justify-between p-2 bg-light-grey rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-agile-teal/20 flex items-center justify-center">
                <BadgeCheck className="w-3 h-3 text-agile-teal" />
              </div>
              <span className="text-xs text-charcoal">{supplier.name}</span>
            </div>
            <span className="text-xs text-agile-teal font-medium">{supplier.match}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const mockups: Record<string, React.ReactNode> = {
  upload: <UploadMockup />,
  analysis: <AnalysisMockup />,
  validation: <ValidationMockup />,
  suppliers: <SuppliersMockup />,
};

export function DesignerJourney() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            The Designer Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal leading-tight">
            Your Path to
            <span className="text-agile-teal"> Validated Designs</span>
          </h2>
        </div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block relative">
          {/* Connecting line */}
          <div className="absolute top-32 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-agile-teal/20 via-agile-teal to-agile-teal/20">
            {/* Animated progress dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-agile-teal shadow-lg shadow-agile-teal/30"
              style={{
                animation: 'moveAcross 6s ease-in-out infinite',
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
                  className="relative pt-4"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Number badge */}
                  <div className="absolute -top-2 left-0 text-6xl font-serif font-bold text-agile-teal/10">
                    {step.number}
                  </div>

                  {/* Timeline node */}
                  <div className="relative z-10 mb-8 flex justify-center">
                    <div className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center',
                      'bg-gradient-to-br from-agile-teal to-mint-accent',
                      'shadow-lg shadow-agile-teal/20',
                      'transform transition-transform duration-300 hover:scale-110'
                    )}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center mb-6">
                    {/* Time badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-light-grey text-xs font-medium text-charcoal-light mb-4">
                      <Clock className="w-3 h-3" />
                      {step.time}
                    </div>

                    <h3 className="text-lg font-semibold text-charcoal mb-2">
                      {step.title}
                    </h3>

                    <p className="text-sm text-charcoal-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Mockup */}
                  <div className="flex justify-center">
                    {mockups[step.mockup]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="lg:hidden relative">
          {/* Vertical connecting line */}
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
                  {/* Timeline node */}
                  <div className="absolute left-0 top-0">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      'bg-gradient-to-br from-agile-teal to-mint-accent',
                      'shadow-md shadow-agile-teal/20'
                    )}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    {/* Number and time */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-serif font-bold text-agile-teal/20">
                        {step.number}
                      </span>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-light-grey text-xs font-medium text-charcoal-light">
                        <Clock className="w-3 h-3" />
                        {step.time}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-charcoal mb-2">
                      {step.title}
                    </h3>

                    <p className="text-sm text-charcoal-light leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Mockup */}
                    <div className="pl-0">
                      {mockups[step.mockup]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes moveAcross {
          0%, 100% { left: 0; }
          50% { left: calc(100% - 12px); }
        }
      `}</style>
    </section>
  );
}
