'use client';

import { Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const problems = [
  {
    question: 'Will this resonate?',
    answer: 'Let AI reveal what the market craves before you commit',
    icon: Sparkles,
    accent: 'from-agile-teal/20 to-mint-accent/10',
    iconBg: 'bg-agile-teal/10',
    iconColor: 'text-agile-teal',
  },
  {
    question: 'Can I trust this supplier?',
    answer: 'Connect with verified partners who share your values',
    icon: ShieldCheck,
    accent: 'from-mint-accent/20 to-agile-teal/10',
    iconBg: 'bg-mint-accent/10',
    iconColor: 'text-mint-accent',
  },
  {
    question: 'Is the world ready for this?',
    answer: 'Test with real audiences, not just intuition',
    icon: TrendingUp,
    accent: 'from-charcoal/5 to-agile-teal/10',
    iconBg: 'bg-charcoal/5',
    iconColor: 'text-charcoal',
  },
];

export function ProblemSolution() {
  return (
    <section className="relative py-24 lg:py-32 bg-light-grey/50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-30">
        <svg viewBox="0 0 200 200" className="w-full h-full text-agile-teal/10">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <span className="inline-block text-sm font-medium text-agile-teal tracking-wider uppercase mb-4">
            We understand
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight mb-6">
            The Questions That Keep
            <br />
            <span className="text-agile-teal">You Up at Night</span>
          </h2>
          <p className="text-lg text-charcoal-light max-w-xl mx-auto">
            Every designer faces these moments of uncertainty. We built AgileSourcing to turn doubt into confidence.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={problem.question}
                className={cn(
                  'group relative bg-white rounded-2xl p-8 lg:p-10 transition-all duration-500',
                  'hover:shadow-2xl hover:shadow-charcoal/5 hover:-translate-y-1',
                  'animate-slide-up'
                )}
                style={{
                  animationDelay: `${0.2 + index * 0.15}s`,
                  animationFillMode: 'backwards',
                }}
              >
                {/* Gradient accent on hover */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                    'bg-gradient-to-br',
                    problem.accent
                  )}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={cn(
                      'inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 transition-transform duration-300 group-hover:scale-110',
                      problem.iconBg
                    )}
                  >
                    <Icon className={cn('w-7 h-7', problem.iconColor)} />
                  </div>

                  {/* Question */}
                  <h3 className="font-serif text-2xl lg:text-3xl font-semibold text-charcoal mb-4 leading-tight">
                    "{problem.question}"
                  </h3>

                  {/* Divider */}
                  <div className="w-12 h-0.5 bg-agile-teal/30 mb-4 transition-all duration-300 group-hover:w-20 group-hover:bg-agile-teal" />

                  {/* Answer */}
                  <p className="text-charcoal-light leading-relaxed">
                    {problem.answer}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-agile-teal/10 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
