'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for exploring and getting started.',
    price: { monthly: 0, annual: 0 },
    priceLabel: 'Free forever',
    features: [
      '3 design uploads/month',
      'Basic AI analysis',
      'Style recommendations',
      'Community support',
    ],
    cta: 'Get Started Free',
    ctaLink: '/register',
    highlighted: false,
  },
  {
    name: 'Pro',
    description: 'For designers ready to validate and grow.',
    price: { monthly: 29, annual: 279 },
    priceLabel: '/month',
    features: [
      '20 design uploads/month',
      'Advanced AI analysis',
      'Market fit scoring',
      '5 Instagram validations/month',
      'Supplier messaging (10/month)',
      'Email support',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/register?plan=pro',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Studio',
    description: 'For teams and professional studios.',
    price: { monthly: 79, annual: 759 },
    priceLabel: '/month',
    features: [
      'Unlimited uploads',
      'Priority AI analysis',
      'Unlimited validations',
      'Unlimited supplier messaging',
      'Team collaboration (up to 5)',
      'Priority support',
      'API access',
    ],
    cta: 'Start Free Trial',
    ctaLink: '/register?plan=studio',
    highlighted: false,
  },
];

export function DesignerPricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="designer-pricing" className="py-20 lg:py-28 bg-white scroll-mt-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold text-agile-teal tracking-wider uppercase mb-4">
            For Designers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-charcoal leading-tight mb-6">
            Choose Your
            <span className="text-agile-teal"> Plan</span>
          </h2>
          <p className="text-lg text-charcoal-light leading-relaxed">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span
            className={cn(
              'text-sm font-medium transition-colors duration-200',
              !isAnnual ? 'text-charcoal' : 'text-charcoal-light'
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={cn(
              'relative w-14 h-7 rounded-full transition-colors duration-300',
              isAnnual ? 'bg-agile-teal' : 'bg-charcoal/20'
            )}
          >
            <div
              className={cn(
                'absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300',
                isAnnual ? 'translate-x-8' : 'translate-x-1'
              )}
            />
          </button>
          <span
            className={cn(
              'text-sm font-medium transition-colors duration-200',
              isAnnual ? 'text-charcoal' : 'text-charcoal-light'
            )}
          >
            Annual
          </span>
          <span className="ml-2 px-3 py-1 text-xs font-semibold rounded-full bg-mint-accent/20 text-agile-teal">
            Save 20%
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={cn(
                'relative rounded-2xl p-8 transition-all duration-300',
                plan.highlighted
                  ? 'bg-charcoal text-white shadow-2xl shadow-charcoal/20 scale-[1.02] lg:scale-105 z-10 border-2 border-agile-teal'
                  : 'bg-white border border-gray-200 hover:shadow-lg hover:border-gray-300'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-agile-teal text-white text-sm font-semibold shadow-lg shadow-agile-teal/30">
                    <Sparkles className="w-4 h-4" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan name */}
              <h3 className={cn(
                'text-2xl font-semibold mb-2',
                plan.highlighted ? 'text-white' : 'text-charcoal'
              )}>
                {plan.name}
              </h3>

              {/* Description */}
              <p className={cn(
                'text-sm mb-6',
                plan.highlighted ? 'text-white/70' : 'text-charcoal-light'
              )}>
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                {plan.price.monthly === 0 ? (
                  <>
                    <span className={cn(
                      'text-5xl font-serif font-semibold',
                      plan.highlighted ? 'text-white' : 'text-charcoal'
                    )}>
                      $0
                    </span>
                    <div className={cn(
                      'text-sm mt-1',
                      plan.highlighted ? 'text-white/60' : 'text-charcoal-light'
                    )}>
                      {plan.priceLabel}
                    </div>
                  </>
                ) : (
                  <>
                    <span className={cn(
                      'text-5xl font-serif font-semibold',
                      plan.highlighted ? 'text-white' : 'text-charcoal'
                    )}>
                      ${isAnnual ? Math.round(plan.price.annual / 12) : plan.price.monthly}
                    </span>
                    <span className={cn(
                      'text-sm',
                      plan.highlighted ? 'text-white/60' : 'text-charcoal-light'
                    )}>
                      {plan.priceLabel}
                    </span>
                    {isAnnual && (
                      <div className={cn(
                        'text-xs mt-1',
                        plan.highlighted ? 'text-agile-teal' : 'text-agile-teal'
                      )}>
                        ${plan.price.annual}/year billed annually
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* CTA */}
              <Button
                asChild
                className={cn(
                  'w-full py-6 text-base font-semibold rounded-xl mb-8 transition-all duration-300 group',
                  plan.highlighted
                    ? 'bg-agile-teal hover:bg-agile-teal/90 text-white'
                    : 'bg-charcoal hover:bg-charcoal/90 text-white'
                )}
              >
                <Link href={plan.ctaLink}>
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={cn(
                      'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5',
                      plan.highlighted ? 'bg-agile-teal/20' : 'bg-agile-teal/10'
                    )}>
                      <Check className="w-3 h-3 text-agile-teal" />
                    </div>
                    <span className={cn(
                      'text-sm',
                      plan.highlighted ? 'text-white/80' : 'text-charcoal-light'
                    )}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
