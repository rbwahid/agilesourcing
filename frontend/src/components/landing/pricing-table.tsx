'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for exploring the platform',
    priceMonthly: 0,
    priceAnnual: 0,
    ctaText: 'Get Started',
    ctaLink: '/register?role=designer&plan=starter',
    features: [
      { name: 'Design uploads', value: '5/month' },
      { name: 'AI analyses', value: '3/month' },
      { name: 'Instagram validations', value: '1/month' },
      { name: 'Supplier directory', value: 'Browse only' },
      { name: 'Direct messaging', included: false },
      { name: 'Priority support', included: false },
      { name: 'Export reports', included: false },
    ],
    popular: false,
  },
  {
    name: 'Growth',
    description: 'For designers ready to scale',
    priceMonthly: 29,
    priceAnnual: 279,
    ctaText: 'Start Free Trial',
    ctaLink: '/register?role=designer&plan=growth',
    features: [
      { name: 'Design uploads', value: '25/month' },
      { name: 'AI analyses', value: '15/month' },
      { name: 'Instagram validations', value: '5/month' },
      { name: 'Supplier contacts', value: '10/month' },
      { name: 'Direct messaging', included: true },
      { name: 'Priority support', included: false },
      { name: 'Export reports', included: false },
    ],
    popular: true,
  },
  {
    name: 'Pro',
    description: 'For established brands',
    priceMonthly: 79,
    priceAnnual: 759,
    ctaText: 'Start Free Trial',
    ctaLink: '/register?role=designer&plan=pro',
    features: [
      { name: 'Design uploads', value: 'Unlimited' },
      { name: 'AI analyses', value: 'Unlimited' },
      { name: 'Instagram validations', value: 'Unlimited' },
      { name: 'Supplier contacts', value: 'Unlimited' },
      { name: 'Direct messaging', included: true },
      { name: 'Priority support', included: true },
      { name: 'Export reports', included: true },
    ],
    popular: false,
  },
];

export function PricingTable() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="relative py-24 lg:py-32 bg-light-grey/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--charcoal) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block text-sm font-medium text-agile-teal tracking-wider uppercase mb-4">
            Pricing
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold text-charcoal leading-tight mb-4">
            Simple, Transparent{' '}
            <span className="text-agile-teal">Pricing</span>
          </h2>
          <p className="text-lg text-charcoal-light">
            Start free, upgrade when you're ready
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span
            className={cn(
              'text-sm font-medium transition-colors duration-300',
              !isAnnual ? 'text-charcoal' : 'text-charcoal-light'
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={cn(
              'relative w-14 h-8 rounded-full transition-colors duration-300',
              isAnnual ? 'bg-agile-teal' : 'bg-gray-300'
            )}
            aria-label="Toggle annual billing"
          >
            <span
              className={cn(
                'absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300',
                isAnnual ? 'translate-x-7' : 'translate-x-1'
              )}
            />
          </button>
          <span
            className={cn(
              'text-sm font-medium transition-colors duration-300',
              isAnnual ? 'text-charcoal' : 'text-charcoal-light'
            )}
          >
            Annual
          </span>
          <span className="ml-2 px-2 py-1 bg-agile-teal/10 text-agile-teal text-xs font-medium rounded-full">
            Save 20%
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative bg-white rounded-2xl transition-all duration-500',
                plan.popular
                  ? 'border-2 border-agile-teal shadow-xl shadow-agile-teal/10 scale-[1.02] lg:scale-105'
                  : 'border border-gray-200 hover:border-agile-teal/30 hover:shadow-lg'
              )}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-agile-teal text-white text-sm font-medium rounded-full shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan name */}
                <h3 className="font-serif text-2xl font-semibold text-charcoal mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-charcoal-light mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-5xl font-semibold text-charcoal">
                      ${isAnnual ? plan.priceAnnual : plan.priceMonthly}
                    </span>
                    {plan.priceMonthly > 0 && (
                      <span className="text-charcoal-light">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>
                  {plan.priceMonthly > 0 && isAnnual && (
                    <p className="text-sm text-agile-teal mt-1">
                      ${Math.round(plan.priceAnnual / 12)}/month billed annually
                    </p>
                  )}
                  {plan.priceMonthly === 0 && (
                    <p className="text-sm text-charcoal-light mt-1">Free forever</p>
                  )}
                </div>

                {/* CTA */}
                <Button
                  asChild
                  className={cn(
                    'w-full py-6 rounded-xl transition-all duration-300',
                    plan.popular
                      ? 'bg-agile-teal hover:bg-agile-teal/90 text-white'
                      : 'bg-charcoal hover:bg-charcoal/90 text-white'
                  )}
                >
                  <Link href={plan.ctaLink}>{plan.ctaText}</Link>
                </Button>

                {/* Features */}
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-3">
                      {feature.included === false ? (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Check className="w-5 h-5 text-agile-teal flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={cn(
                          'text-sm',
                          feature.included === false
                            ? 'text-charcoal-light/50'
                            : 'text-charcoal-light'
                        )}
                      >
                        {feature.name}
                        {feature.value && (
                          <span className="font-medium text-charcoal">
                            : {feature.value}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-charcoal-light text-sm mt-12">
          All plans include 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
