'use client';

import { Eye, Award, Leaf, Lightbulb } from 'lucide-react';

const values = [
  {
    icon: Eye,
    title: 'Transparency',
    description:
      'Open communication, honest pricing, no hidden fees. We believe trust is built through clarity.',
    gradient: 'from-agile-teal to-mint-accent',
  },
  {
    icon: Award,
    title: 'Quality',
    description:
      'Verified suppliers, rigorous standards, trusted partners. We only work with manufacturers who meet our criteria.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description:
      'Ethical manufacturing, responsible sourcing. We prioritize partners who care about their environmental impact.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      "AI-powered tools, modern platform, continuous improvement. We're always pushing to make your workflow better.",
    gradient: 'from-blue-500 to-indigo-500',
  },
];

export function ValuesSection() {
  return (
    <section className="py-20 lg:py-28 bg-light-grey">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            What We Stand For
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal leading-tight">
            Our{' '}
            <span className="text-agile-teal">Values</span>
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Subtle gradient border on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-agile-teal/0 to-mint-accent/0 group-hover:from-agile-teal/5 group-hover:to-mint-accent/5 transition-all duration-500" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-2xl font-semibold text-charcoal mb-3">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-charcoal-light leading-relaxed">
                    {value.description}
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-agile-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
