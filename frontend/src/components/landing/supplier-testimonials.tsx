'use client';

import { Quote, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const featuredTestimonial = {
  quote: "AgileSourcing transformed how we connect with designers. Before, we relied on trade shows and cold outreach. Now, qualified leads come to us. We've seen a 40% increase in inquiries, and the quality of partnerships has improved dramatically.",
  author: 'Rahman Khan',
  role: 'Managing Director',
  company: 'Stellar Textiles Ltd.',
  location: 'Dhaka, Bangladesh',
  initials: 'RK',
  stats: [
    { value: '40%', label: 'More inquiries', icon: TrendingUp },
    { value: '15', label: 'New partnerships', icon: Users },
  ],
};

const supportingTestimonials = [
  {
    quote: "The verification badge has been a game-changer. Designers trust us immediately because they can see our certifications upfront. Response rates doubled within the first month.",
    author: 'Maria Santos',
    role: 'Sales Director',
    company: 'EcoWeave Portugal',
    location: 'Porto, Portugal',
    initials: 'MS',
    metric: '2x response rate',
  },
  {
    quote: "Finally, a platform that understands manufacturing. The MOQ filtering means we only hear from designers who can actually place viable orders. No more wasted conversations.",
    author: 'Chen Wei',
    role: 'Operations Manager',
    company: 'PrecisionApparel Co.',
    location: 'Guangzhou, China',
    initials: 'CW',
    metric: '70% less unqualified leads',
  },
];

export function SupplierTestimonials() {
  return (
    <section className="py-24 lg:py-32 bg-charcoal overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            Success Stories
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-white leading-tight mb-6">
            Trusted by
            <span className="text-agile-teal"> Manufacturing Leaders</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Hear from suppliers who have grown their business through our platform.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="relative max-w-4xl mx-auto mb-16">
          {/* Background decoration */}
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-agile-teal/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-mint-accent/10 rounded-full blur-3xl" />

          <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-white/10">
            {/* Quote icon */}
            <div className="absolute top-8 right-8 lg:top-12 lg:right-12">
              <Quote className="w-12 h-12 text-agile-teal/30" />
            </div>

            {/* Quote text */}
            <blockquote className="text-xl lg:text-2xl text-white/90 leading-relaxed mb-8 font-light italic">
              &ldquo;{featuredTestimonial.quote}&rdquo;
            </blockquote>

            {/* Author and stats */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-agile-teal to-mint-accent flex items-center justify-center text-white font-bold text-lg">
                  {featuredTestimonial.initials}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {featuredTestimonial.author}
                  </div>
                  <div className="text-sm text-white/60">
                    {featuredTestimonial.role}, {featuredTestimonial.company}
                  </div>
                  <div className="text-xs text-white/40">
                    {featuredTestimonial.location}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8">
                {featuredTestimonial.stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-agile-teal/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-agile-teal" />
                      </div>
                      <div>
                        <div className="text-2xl font-serif font-semibold text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-white/50">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Testimonials */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {supportingTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className={cn(
                'bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10',
                'hover:bg-white/10 transition-colors duration-300'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Metric badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agile-teal/20 text-agile-teal text-sm font-medium mb-4">
                <TrendingUp className="w-4 h-4" />
                {testimonial.metric}
              </div>

              {/* Quote */}
              <blockquote className="text-white/80 leading-relaxed mb-6 text-sm">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-charcoal-light to-charcoal flex items-center justify-center text-white font-semibold text-sm border border-white/10">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-xs text-white/50">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
