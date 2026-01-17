'use client';

export function ContactHero() {
  return (
    <section className="relative py-20 lg:py-28 bg-light-grey overflow-hidden">
      {/* Decorative diagonal lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.03]">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {[...Array(8)].map((_, i) => (
              <line
                key={i}
                x1={50 + i * 40}
                y1="0"
                x2={50 + i * 40 + 300}
                y2="400"
                stroke="#00B391"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 opacity-[0.02]">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {[...Array(6)].map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={50 + i * 40}
                x2="300"
                y2={50 + i * 40 - 200}
                stroke="#222222"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Floating geometric accent */}
      <div className="absolute top-16 left-[15%] w-3 h-3 bg-agile-teal/20 rounded-full" />
      <div className="absolute bottom-20 right-[20%] w-2 h-2 bg-mint-accent/30 rounded-full" />
      <div className="absolute top-1/2 right-[10%] w-4 h-4 border border-agile-teal/10 rotate-45" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Small label */}
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            Get in Touch
          </span>

          {/* Main headline */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight mb-6">
            Let&apos;s{' '}
            <span className="relative">
              Talk
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-agile-teal/30"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,8 Q25,0 50,8 T100,8"
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
            Have questions? We&apos;d love to hear from you. Send us a message
            and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </div>
    </section>
  );
}
