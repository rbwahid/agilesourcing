'use client';

import Link from 'next/link';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const supplierPlans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Get started with a basic presence',
    features: ['Basic company profile', '10 catalog items', 'Standard listing', 'Direct messaging'],
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '$49/mo',
    description: 'Scale your designer network',
    features: ['Unlimited catalog items', 'Featured in search', 'Analytics dashboard', 'Verified badge'],
    highlighted: true,
    badge: 'Recommended',
  },
  {
    name: 'Partner',
    price: 'Custom',
    description: 'Enterprise-grade features',
    features: ['Multiple locations', 'API access', 'Dedicated manager', 'Custom integrations'],
    highlighted: false,
  },
];

export function SupplierPricingSection() {
  return (
    <section id="supplier-pricing" className="py-20 lg:py-28 bg-charcoal scroll-mt-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            For Suppliers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6">
            Grow Your
            <span className="text-agile-teal"> Designer Network</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed">
            Connect with fashion designers actively seeking manufacturing partners.
          </p>
        </div>

        {/* Compact Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {supplierPlans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative p-6 rounded-xl transition-all duration-300',
                plan.highlighted
                  ? 'bg-white/10 border-2 border-agile-teal'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-4">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-agile-teal text-white text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <span className="text-2xl font-serif font-semibold text-white">{plan.price}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-white/60 mb-4">{plan.description}</p>

              {/* Features */}
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-white/80">
                    <Check className="w-4 h-4 text-agile-teal flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Link */}
        <div className="text-center">
          <Link
            href="/for-suppliers"
            className="inline-flex items-center gap-2 text-agile-teal font-semibold hover:underline group"
          >
            Learn more about supplier plans
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
