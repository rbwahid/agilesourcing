'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FeaturesCTA() {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-agile-teal to-mint-accent overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full border border-white/5" />

        {/* Diagonal lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {[...Array(10)].map((_, i) => (
            <line
              key={i}
              x1={i * 15}
              y1="0"
              x2={i * 15 + 50}
              y2="100"
              stroke="white"
              strokeWidth="0.2"
            />
          ))}
        </svg>

        {/* Floating shapes */}
        <div className="absolute top-20 left-[15%] w-4 h-4 bg-white/10 rounded-full" />
        <div className="absolute bottom-32 right-[20%] w-6 h-6 border border-white/20 rotate-45" />
        <div className="absolute top-1/2 right-[10%] w-3 h-3 bg-white/15 rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6">
            Ready to Transform Your{' '}
            <span className="relative inline-block">
              Design Process?
              <svg
                className="absolute -bottom-1 left-0 w-full h-2 text-white/30"
                viewBox="0 0 200 8"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,4 Q50,0 100,4 T200,4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
            Join thousands of designers who are validating ideas and finding suppliers faster.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-agile-teal hover:bg-white/90 px-8 py-7 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-black/10 group"
              >
                Start Free
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white px-8 py-7 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Trust indicator */}
          <p className="mt-8 text-sm text-white/60">
            No credit card required &middot; Free 14-day trial
          </p>
        </div>
      </div>
    </section>
  );
}
