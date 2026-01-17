'use client';

import { ArrowDown } from 'lucide-react';

export function HowItWorksHero() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-grey/50 to-white" />

      {/* Animated flow lines - suggesting process/journey */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Horizontal flowing lines */}
        <svg
          className="absolute top-1/4 left-0 w-full h-32 opacity-[0.07]"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 Q300,20 600,50 T1200,50"
            fill="none"
            stroke="#00B391"
            strokeWidth="2"
            className="animate-flow-line"
          />
          <path
            d="M0,30 Q300,60 600,30 T1200,30"
            fill="none"
            stroke="#2BD5A3"
            strokeWidth="1.5"
            className="animate-flow-line-delayed"
          />
        </svg>

        {/* Decorative dots pattern */}
        <div
          className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #00B391 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Step indicator */}
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((num) => (
                <div
                  key={num}
                  className="w-8 h-1 rounded-full bg-agile-teal/20 relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-agile-teal rounded-full animate-pulse"
                    style={{
                      animationDelay: `${num * 200}ms`,
                      animationDuration: '2s',
                    }}
                  />
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-charcoal-light tracking-wide">
              4 Simple Steps
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight mb-6">
            From Sketch to Production
            <span className="block text-agile-teal">in Four Simple Steps</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-charcoal-light max-w-2xl mx-auto leading-relaxed mb-12">
            See how AgileSourcing helps designers validate ideas, find trends, and connect with trusted manufacturers.
          </p>

          {/* Scroll indicator */}
          <div className="inline-flex flex-col items-center gap-2 text-charcoal-light">
            <span className="text-sm font-medium">Scroll to explore</span>
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>
        </div>
      </div>

      {/* CSS for flow animation */}
      <style jsx>{`
        @keyframes flowLine {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-flow-line {
          stroke-dasharray: 1000;
          animation: flowLine 3s ease-in-out infinite;
        }
        .animate-flow-line-delayed {
          stroke-dasharray: 1000;
          animation: flowLine 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
}
