'use client';

export function FounderStory() {
  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
              Our Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal leading-tight">
              Why We{' '}
              <span className="text-agile-teal">Built This</span>
            </h2>
          </div>

          {/* Story Content - Editorial Layout */}
          <div className="relative">
            {/* Decorative vertical line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-agile-teal/30 via-mint-accent/20 to-transparent hidden lg:block" />

            {/* Story sections */}
            <div className="space-y-12 lg:pl-12">
              {/* The Problem */}
              <div className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-12 top-2 w-3 h-3 rounded-full bg-agile-teal hidden lg:block" />

                <div className="prose prose-lg max-w-none">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-4">
                    The Challenge
                  </h3>
                  <p className="text-charcoal-light leading-relaxed mb-6">
                    We&apos;ve seen it too many times: talented designers with incredible visions,
                    stuck in an endless cycle of searching for reliable manufacturing partners.
                    Cold emails go unanswered. Trade shows eat through budgets. And when a supplier
                    finally responds? The MOQs are impossible, the communication is frustrating,
                    and the quality is a gamble.
                  </p>
                  <p className="text-charcoal-light leading-relaxed">
                    The traditional fashion supply chain was built for established brands with
                    deep pockets and industry connections. Independent designers were left to
                    navigate a fragmented, opaque system that seemed designed to keep them out.
                  </p>
                </div>
              </div>

              {/* Decorative divider */}
              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-agile-teal/20 to-transparent" />
              </div>

              {/* The Solution */}
              <div className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-12 top-2 w-3 h-3 rounded-full bg-mint-accent hidden lg:block" />

                <div className="prose prose-lg max-w-none">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-4">
                    Our Solution
                  </h3>
                  <p className="text-charcoal-light leading-relaxed mb-6">
                    We built AgileSourcing to level the playing field. A platform where designers
                    can validate their ideas with real audience feedback before investing in
                    production. Where finding the right supplier is as simple as browsing a
                    curated marketplace. Where AI helps you understand trends and make smarter
                    decisions.
                  </p>
                  <p className="text-charcoal-light leading-relaxed">
                    Every supplier in our network is verified. Every interaction is streamlined.
                    Every designer—whether they&apos;re launching their first collection or their
                    fifteenth—has access to the same professional tools and manufacturing
                    partnerships that were once reserved for industry insiders.
                  </p>
                </div>
              </div>

              {/* Decorative divider */}
              <div className="flex items-center gap-4 py-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-agile-teal/20 to-transparent" />
              </div>

              {/* The Vision */}
              <div className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-12 top-2 w-3 h-3 rounded-full bg-agile-teal hidden lg:block" />

                <div className="prose prose-lg max-w-none">
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-4">
                    Looking Forward
                  </h3>
                  <p className="text-charcoal-light leading-relaxed">
                    We&apos;re just getting started. Our vision is a world where geography, network,
                    and capital don&apos;t determine who gets to bring their creative vision to life.
                    Where sustainable, ethical manufacturing is the norm, not the exception.
                    Where every designer has the power to create, validate, and produce with
                    confidence.
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -right-20 top-1/4 w-40 h-40 border border-agile-teal/10 rounded-full hidden xl:block" />
            <div className="absolute -right-10 top-1/3 w-20 h-20 border border-mint-accent/10 rounded-full hidden xl:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
