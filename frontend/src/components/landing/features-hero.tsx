'use client';

import { Sparkles, Instagram, Building2, Wand2, MessageSquare, Route } from 'lucide-react';

const featureLinks = [
  { name: 'AI Analysis', href: '#ai-analysis', icon: Sparkles },
  { name: 'Validation', href: '#validation', icon: Instagram },
  { name: 'Suppliers', href: '#suppliers', icon: Building2 },
  { name: 'Matching', href: '#matching', icon: Wand2 },
  { name: 'Communication', href: '#communication', icon: MessageSquare },
  { name: 'Tracking', href: '#tracking', icon: Route },
];

export function FeaturesHero() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 lg:py-28 bg-light-grey overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Diagonal lines pattern */}
        <svg
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.03]"
          viewBox="0 0 600 600"
        >
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1={i * 50}
              y1="0"
              x2={i * 50 + 400}
              y2="600"
              stroke="#00B391"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Floating shapes */}
        <div className="absolute top-20 left-[10%] w-4 h-4 bg-agile-teal/10 rounded-full" />
        <div className="absolute top-40 right-[15%] w-6 h-6 border-2 border-mint-accent/20 rounded-full" />
        <div className="absolute bottom-32 left-[20%] w-3 h-3 bg-mint-accent/15 rotate-45" />
        <div className="absolute bottom-20 right-[25%] w-8 h-8 border border-agile-teal/10 rotate-12" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Label */}
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            Platform Features
          </span>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight mb-6">
            Powerful Tools for{' '}
            <span className="relative inline-block">
              Modern Designers
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-mint-accent/40"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,8 Q50,2 100,8 T200,8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-charcoal-light leading-relaxed max-w-2xl mx-auto mb-12">
            From AI-powered analysis to verified supplier matching, everything you need to bring your vision to life.
          </p>

          {/* Feature Navigation */}
          <nav className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {featureLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="group flex items-center gap-2 px-4 py-2.5 bg-white rounded-full border border-gray-200 text-charcoal-light hover:border-agile-teal hover:text-agile-teal transition-all duration-300 hover:shadow-md hover:shadow-agile-teal/10"
                >
                  <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm font-medium">{link.name}</span>
                </a>
              );
            })}
          </nav>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <div className="flex flex-col items-center gap-2 text-charcoal-light/50">
            <span className="text-xs uppercase tracking-wider">Explore</span>
            <div className="w-px h-8 bg-gradient-to-b from-charcoal-light/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
