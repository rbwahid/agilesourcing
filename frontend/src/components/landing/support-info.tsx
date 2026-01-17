'use client';

import { Clock, Calendar, MessageCircle } from 'lucide-react';

const supportCards = [
  {
    icon: Clock,
    title: 'Within 24 hours',
    label: 'Response Time',
    description: 'We typically respond to all inquiries within one business day.',
    accent: 'bg-agile-teal',
  },
  {
    icon: Calendar,
    title: 'Mon-Fri, 9am-6pm EST',
    label: 'Support Hours',
    description: 'Our team is available during standard business hours. Closed on major holidays.',
    accent: 'bg-mint-accent',
  },
  {
    icon: MessageCircle,
    title: 'Coming Soon',
    label: 'Live Chat',
    description: 'Real-time support launching Q2 2025. Get instant answers to your questions.',
    accent: 'bg-charcoal',
  },
];

export function SupportInfo() {
  return (
    <section className="py-16 lg:py-24 bg-light-grey">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            Support
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-charcoal leading-tight">
            We&apos;re Here to Help
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {supportCards.map((card, index) => (
            <div
              key={card.label}
              className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Accent line at top */}
              <div className={`absolute top-0 left-8 right-8 h-1 ${card.accent} rounded-b-full opacity-80`} />

              {/* Icon */}
              <div className="mb-6 relative">
                <div className="w-14 h-14 rounded-xl bg-light-grey flex items-center justify-center group-hover:bg-agile-teal/10 transition-colors duration-300">
                  <card.icon className="w-6 h-6 text-agile-teal" />
                </div>
              </div>

              {/* Label */}
              <p className="text-sm text-charcoal-light font-medium uppercase tracking-wide mb-2">
                {card.label}
              </p>

              {/* Title */}
              <h3 className="font-serif text-xl font-semibold text-charcoal mb-3">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-charcoal-light leading-relaxed text-sm">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
