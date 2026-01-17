'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Users, Globe, Zap } from 'lucide-react';

const stats = [
  { value: '10,000+', label: 'Active Designers', icon: Users },
  { value: '50+', label: 'Countries', icon: Globe },
  { value: '92%', label: 'Response Rate', icon: Zap },
];

export function SupplierHero() {
  const scrollToProcess = () => {
    document.getElementById('supplier-process')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Industrial geometric background */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal to-charcoal/95" />

      {/* Grid pattern overlay - manufacturing precision aesthetic */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Diagonal accent lines */}
      <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden">
        <div
          className="absolute -top-1/4 -right-1/4 w-full h-[150%] opacity-10"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              #00B391 40px,
              #00B391 41px
            )`,
          }}
        />
      </div>

      {/* Animated gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{
          background: 'radial-gradient(circle, #00B391 0%, transparent 70%)',
          animationDuration: '8s',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full opacity-15 blur-3xl animate-pulse"
        style={{
          background: 'radial-gradient(circle, #2BD5A3 0%, transparent 70%)',
          animationDuration: '6s',
          animationDelay: '2s',
        }}
      />

      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-32 h-32">
        <div className="absolute top-8 left-0 w-24 h-px bg-gradient-to-r from-agile-teal to-transparent" />
        <div className="absolute top-0 left-8 w-px h-24 bg-gradient-to-b from-agile-teal to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-agile-teal animate-pulse" />
            <span className="text-sm text-white/70 font-medium tracking-wide">
              For Manufacturing Partners
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] mb-6">
            Where Craft Meets
            <span className="block text-agile-teal">Opportunity</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-white/70 max-w-2xl leading-relaxed mb-10">
            Connect with designers who value quality manufacturing. Get discovered by brands actively seeking your capabilities.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              asChild
              size="lg"
              className="bg-agile-teal hover:bg-agile-teal/90 text-white px-8 py-7 text-lg font-semibold rounded-xl group transition-all duration-300"
            >
              <Link href="/register?role=supplier">
                Join Our Network
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToProcess}
              className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-charcoal hover:border-white px-8 py-7 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              See How It Works
              <ChevronDown className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-8 lg:gap-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-agile-teal/20 flex items-center justify-center group-hover:bg-agile-teal/30 transition-colors duration-300">
                      <Icon className="w-5 h-5 text-agile-teal" />
                    </div>
                    <span className="text-3xl lg:text-4xl font-serif font-semibold text-white">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-sm text-white/50 font-medium tracking-wide uppercase">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
