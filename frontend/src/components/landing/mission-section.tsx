'use client';

export function MissionSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Decorative geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large teal circle - top right */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-agile-teal/10" />
        <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full border border-mint-accent/5" />

        {/* Small accent shapes */}
        <div className="absolute top-1/4 left-[8%] w-16 h-16 border border-agile-teal/10 rotate-12" />
        <div className="absolute bottom-1/4 right-[12%] w-12 h-12 bg-mint-accent/5 rounded-full" />

        {/* Diagonal lines - bottom left */}
        <svg
          className="absolute bottom-0 left-0 w-96 h-96 opacity-[0.03]"
          viewBox="0 0 400 400"
        >
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1={0}
              y1={i * 50 + 50}
              x2={i * 50 + 50}
              y2={0}
              stroke="#00B391"
              strokeWidth="1"
            />
          ))}
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Large decorative quote */}
          <div className="relative">
            {/* Opening quote mark */}
            <span className="absolute -top-8 -left-4 sm:-left-8 text-[120px] sm:text-[160px] font-serif text-agile-teal/10 leading-none select-none">
              &ldquo;
            </span>

            {/* Mission statement */}
            <blockquote className="relative z-10 text-center">
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal leading-snug mb-8">
                We believe every designer deserves access to{' '}
                <span className="text-agile-teal">quality manufacturing partners.</span>
              </p>
            </blockquote>

            {/* Closing quote mark */}
            <span className="absolute -bottom-16 -right-4 sm:-right-8 text-[120px] sm:text-[160px] font-serif text-agile-teal/10 leading-none select-none rotate-180">
              &ldquo;
            </span>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-4 my-12">
            <div className="w-12 h-px bg-agile-teal/30" />
            <div className="w-2 h-2 bg-agile-teal/40 rounded-full" />
            <div className="w-12 h-px bg-agile-teal/30" />
          </div>

          {/* Supporting paragraph */}
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg text-charcoal-light leading-relaxed">
              The fashion industry has long been dominated by those with connections and capital.
              We&apos;re changing that by creating a platform where talent and vision matter more than
              your network. Through AI-powered tools and a curated supplier network, we&apos;re
              democratizing access to professional manufacturing for independent designers worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
