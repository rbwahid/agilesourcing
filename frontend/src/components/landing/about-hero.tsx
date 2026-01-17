'use client';

export function AboutHero() {
  return (
    <section className="relative py-20 lg:py-28 bg-light-grey overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #222222 1px, transparent 1px), linear-gradient(to bottom, #222222 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Floating accent shapes */}
        <div className="absolute top-16 right-[15%] w-3 h-3 bg-agile-teal/15 rounded-full" />
        <div className="absolute top-32 left-[10%] w-2 h-2 bg-mint-accent/20 rounded-full" />
        <div className="absolute bottom-24 right-[25%] w-4 h-4 border border-agile-teal/10 rotate-45" />
        <div className="absolute bottom-16 left-[20%] w-6 h-6 border border-charcoal/5 rounded-full" />

        {/* Diagonal line accent */}
        <svg
          className="absolute bottom-0 left-0 w-64 h-64 opacity-[0.03]"
          viewBox="0 0 300 300"
        >
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1={i * 50}
              y1="300"
              x2={i * 50 + 150}
              y2="0"
              stroke="#00B391"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Label */}
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            About Us
          </span>

          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight mb-6">
            Bridging Creativity{' '}
            <span className="relative inline-block">
              and Manufacturing
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-mint-accent/40"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,8 Q75,2 150,8 T300,8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-charcoal-light leading-relaxed max-w-2xl mx-auto">
            We&apos;re on a mission to make fashion production accessible, transparent, and sustainable for independent designers.
          </p>
        </div>
      </div>
    </section>
  );
}
