'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Factory } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary flowing gradient */}
        <div
          className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, var(--agile-teal) 0%, transparent 70%)',
            animationDuration: '8s',
          }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background: 'radial-gradient(circle, var(--mint-accent) 0%, transparent 70%)',
            animationDuration: '10s',
            animationDelay: '2s',
          }}
        />

        {/* Flowing fabric-inspired SVG shapes */}
        <svg
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.07]"
          viewBox="0 0 400 800"
          fill="none"
          preserveAspectRatio="xMaxYMid slice"
        >
          <path
            d="M400 0C300 100 350 200 300 300C250 400 350 500 300 600C250 700 350 800 400 800V0Z"
            fill="var(--agile-teal)"
            className="animate-pulse"
            style={{ animationDuration: '12s' }}
          />
          <path
            d="M400 50C320 150 370 250 320 350C270 450 370 550 320 650C270 750 370 800 400 800V50Z"
            fill="var(--mint-accent)"
            className="animate-pulse"
            style={{ animationDuration: '14s', animationDelay: '1s' }}
          />
        </svg>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--charcoal) 1px, transparent 1px),
              linear-gradient(90deg, var(--charcoal) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-agile-teal/10 border border-agile-teal/20 mb-8 animate-fade-in"
            style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agile-teal opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-agile-teal" />
            </span>
            <span className="text-sm font-medium text-agile-teal tracking-wide">
              AI-Powered Fashion Platform
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-charcoal leading-[0.95] tracking-tight mb-6 animate-slide-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}
          >
            Where Vision
            <br />
            <span className="relative">
              Meets{' '}
              <span className="relative inline-block">
                Validation
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-agile-teal/40"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M1 9C20 3 60 1 100 5C140 9 180 7 199 3"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="animate-pulse"
                    style={{ animationDuration: '3s' }}
                  />
                </svg>
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg sm:text-xl md:text-2xl text-charcoal-light max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up"
            style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}
          >
            Your designs deserve more than guesswork. Validate with AI, source with confidence, and bring collections to life—
            <span className="text-agile-teal font-medium">sustainably</span>.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}
          >
            <Button
              asChild
              size="lg"
              className="bg-agile-teal hover:bg-agile-teal/90 text-white px-8 py-6 text-lg rounded-full group transition-all duration-300 hover:shadow-xl hover:shadow-agile-teal/20"
            >
              <Link href="/register?role=designer">
                Begin Your Journey
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-white px-8 py-6 text-lg rounded-full transition-all duration-300"
            >
              <Link href="/register?role=supplier">
                <Factory className="mr-2 h-5 w-5" />
                I'm a Supplier
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-charcoal-light/60 animate-fade-in"
            style={{ animationDelay: '0.8s', animationFillMode: 'backwards' }}
          >
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-agile-teal" />
              <span className="text-sm">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-agile-teal" />
              <span className="text-sm">Free plan available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-agile-teal" />
              <span className="text-sm">Setup in minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
