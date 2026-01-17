'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AboutCTA() {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-agile-teal to-mint-accent overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full border border-white/5" />

        {/* Diagonal pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1={i * 12 - 20}
              y1="0"
              x2={i * 12 + 30}
              y2="100"
              stroke="white"
              strokeWidth="0.15"
            />
          ))}
        </svg>

        {/* Floating shapes */}
        <div className="absolute top-16 right-[20%] w-4 h-4 bg-white/10 rounded-full" />
        <div className="absolute bottom-24 left-[15%] w-6 h-6 border border-white/15 rotate-45" />
        <div className="absolute top-1/2 left-[10%] w-3 h-3 bg-white/10 rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6">
            Join the{' '}
            <span className="relative inline-block">
              Community
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
            Whether you&apos;re a designer bringing your vision to life or a supplier looking to connect with creative talent, we&apos;d love to have you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/for-designers">
              <Button
                size="lg"
                className="bg-white text-agile-teal hover:bg-white/90 px-8 py-7 text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-black/10 group"
              >
                For Designers
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/for-suppliers">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white px-8 py-7 text-lg font-semibold rounded-xl transition-all duration-300"
              >
                For Suppliers
              </Button>
            </Link>
          </div>

          {/* Trust badge */}
          <div className="mt-12 flex items-center justify-center gap-8 text-white/60">
            <div className="text-center">
              <div className="text-2xl font-serif font-semibold text-white">500+</div>
              <div className="text-sm">Verified Suppliers</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-serif font-semibold text-white">10k+</div>
              <div className="text-sm">Designers</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-serif font-semibold text-white">50+</div>
              <div className="text-sm">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
