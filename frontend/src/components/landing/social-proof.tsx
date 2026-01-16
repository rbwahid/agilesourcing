'use client';

import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  { value: '10,000+', label: 'Visions Analyzed' },
  { value: '500+', label: 'Verified Partners' },
  { value: '50+', label: 'Countries Connected' },
  { value: '4.8', label: 'Designer Love', isStar: true },
];

const testimonials = [
  {
    quote: "AgileSourcing's AI analysis helped me identify a trend I would have missed. My last collection sold out in 2 weeks.",
    name: 'Sarah Chen',
    role: 'Independent Designer',
    company: 'Chen Studios',
    initials: 'SC',
    color: 'bg-agile-teal',
  },
  {
    quote: 'Finding reliable suppliers used to take months. Now I can connect with verified manufacturers in days.',
    name: 'Marcus Williams',
    role: 'Creative Director',
    company: 'Urban Thread Co.',
    initials: 'MW',
    color: 'bg-mint-accent',
  },
  {
    quote: 'The quality of leads we get through AgileSourcing is exceptional. Designers come prepared with clear requirements.',
    name: 'Priya Patel',
    role: 'Business Development',
    company: 'Textile Solutions Ltd.',
    initials: 'PP',
    color: 'bg-charcoal',
  },
];

export function SocialProof() {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.03]">
        <svg viewBox="0 0 200 400" className="w-full h-full" preserveAspectRatio="xMaxYMid slice">
          <path
            d="M200 0C150 50 180 100 150 150C120 200 180 250 150 300C120 350 180 400 200 400V0Z"
            fill="var(--agile-teal)"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-sm font-medium text-agile-teal tracking-wider uppercase mb-4">
            Trusted by Creators
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight">
            Designers Like You,
            <br />
            <span className="text-agile-teal">Already Creating</span>
          </h2>
        </div>

        {/* Stats row */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  'text-center p-6 rounded-2xl transition-all duration-300 hover:bg-light-grey/50',
                  index < 2 ? 'lg:border-r border-gray-100' : ''
                )}
              >
                <div className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal mb-2 flex items-center justify-center gap-2">
                  {stat.value}
                  {stat.isStar && (
                    <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
                  )}
                </div>
                <div className="text-charcoal-light text-sm tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={cn(
                'group relative bg-light-grey/30 rounded-2xl p-8 transition-all duration-500',
                'hover:bg-white hover:shadow-2xl hover:shadow-charcoal/5 hover:-translate-y-1'
              )}
              style={{
                animationDelay: `${0.2 + index * 0.15}s`,
              }}
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-agile-teal/20 mb-4 transition-colors duration-300 group-hover:text-agile-teal/40" />

              {/* Quote text */}
              <blockquote className="text-charcoal leading-relaxed mb-6 font-medium">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm',
                    testimonial.color
                  )}
                >
                  {testimonial.initials}
                </div>

                {/* Info */}
                <div>
                  <div className="font-semibold text-charcoal">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-charcoal-light">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-agile-teal">
                    {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute bottom-0 right-0 w-24 h-24 overflow-hidden rounded-br-2xl">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-agile-teal/5 rounded-full transform translate-x-1/2 translate-y-1/2 transition-transform duration-500 group-hover:scale-150" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
