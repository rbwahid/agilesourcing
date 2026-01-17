'use client';

import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const featuredTestimonial = {
  quote:
    "AgileSourcing changed how I approach every collection. The AI insights alone saved me from two designs that would have flopped. Now I validate everything before investing in production.",
  name: 'Emily Rodriguez',
  role: 'Founder',
  company: 'Verde Fashion',
  initials: 'ER',
};

const supportingTestimonials = [
  {
    quote:
      "The supplier discovery feature is incredible. Found three ethical manufacturers in my first week that I'd been searching for months to find.",
    name: 'James Chen',
    role: 'Creative Director',
    company: 'Atelier Moderne',
    initials: 'JC',
  },
  {
    quote:
      "Instagram validation gave me the confidence to go bigger on my spring line. The data was spot-on—our pre-orders exceeded expectations.",
    name: 'Sofia Andersson',
    role: 'Independent Designer',
    company: 'Sofia Studio',
    initials: 'SA',
  },
];

const logoPlaceholders = [
  'Vogue Business',
  'WWD',
  'BoF',
  'Fashion United',
  'Drapers',
];

export function DesignerTestimonials() {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03]">
        <svg viewBox="0 0 400 600" className="w-full h-full" preserveAspectRatio="xMaxYMid slice">
          <path
            d="M400 0C350 80 380 160 350 240C320 320 380 400 350 480C320 560 380 600 400 600V0Z"
            fill="var(--agile-teal)"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-sm font-medium text-agile-teal tracking-wider uppercase mb-4">
            Designer Stories
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight">
            Trusted by Designers
            <br />
            <span className="text-agile-teal">Worldwide</span>
          </h2>
        </div>

        {/* Featured testimonial */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative bg-gradient-to-br from-light-grey/50 to-white rounded-3xl p-8 lg:p-12 border border-gray-100">
            {/* Large quote mark */}
            <div className="absolute -top-6 left-8 lg:left-12">
              <div className="w-12 h-12 rounded-full bg-agile-teal flex items-center justify-center">
                <Quote className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Quote */}
            <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal leading-relaxed mb-8 pt-4">
              "{featuredTestimonial.quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-agile-teal to-mint-accent flex items-center justify-center text-white font-semibold text-lg">
                {featuredTestimonial.initials}
              </div>
              <div>
                <div className="font-semibold text-lg text-charcoal">
                  {featuredTestimonial.name}
                </div>
                <div className="text-charcoal-light">
                  {featuredTestimonial.role}, {featuredTestimonial.company}
                </div>
              </div>
            </div>

            {/* Decorative corner */}
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-agile-teal/10 rounded-br-2xl" />
          </div>
        </div>

        {/* Supporting testimonials */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto mb-16">
          {supportingTestimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className={cn(
                'group bg-white rounded-2xl p-6 lg:p-8 transition-all duration-300',
                'border border-gray-100 hover:border-agile-teal/20',
                'hover:shadow-lg hover:shadow-agile-teal/5'
              )}
            >
              {/* Quote */}
              <Quote className="w-8 h-8 text-agile-teal/20 mb-4" />
              <blockquote className="text-charcoal leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-charcoal flex items-center justify-center text-white font-medium text-sm">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-semibold text-charcoal text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-charcoal-light text-xs">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured in logos */}
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-charcoal-light/60 uppercase tracking-wider mb-6">
            As featured in
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {logoPlaceholders.map((name) => (
              <div
                key={name}
                className="text-charcoal-light/40 font-serif text-lg lg:text-xl font-semibold tracking-wide hover:text-charcoal-light/60 transition-colors duration-300"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
