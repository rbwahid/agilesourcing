'use client';

import { Check, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Plan, BillingPeriod } from '@/types/billing';

interface PricingCardProps {
  plan: Plan;
  billingPeriod: BillingPeriod;
  isCurrentPlan?: boolean;
  isRecommended?: boolean;
  isDisabled?: boolean;
  onSelect: () => void;
}

export function PricingCard({
  plan,
  billingPeriod,
  isCurrentPlan = false,
  isRecommended = false,
  isDisabled = false,
  onSelect,
}: PricingCardProps) {
  const price = billingPeriod === 'annual' ? plan.price_annual : plan.price_monthly;
  const monthlyEquivalent = billingPeriod === 'annual' ? plan.price_annual / 12 : plan.price_monthly;

  const isPremium = plan.slug.includes('premium');

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border-2 bg-white p-6 transition-all duration-300',
        isRecommended
          ? 'border-agile-teal shadow-xl shadow-agile-teal/10 scale-[1.02]'
          : 'border-gray-100 shadow-md hover:shadow-lg hover:border-gray-200',
        isDisabled && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-agile-teal to-mint-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-agile-teal/30">
            <Sparkles className="h-3.5 w-3.5" />
            Most Popular
          </div>
        </div>
      )}

      {/* Premium Icon */}
      {isPremium && !isRecommended && (
        <div className="absolute -top-3 right-4">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-200/50">
            <Crown className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 pt-2">
        <h3 className="font-serif text-xl font-bold text-charcoal">{plan.name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isPremium ? 'For power users' : 'Get started'}
        </p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="font-serif text-4xl font-bold tracking-tight text-charcoal">
            ${monthlyEquivalent.toFixed(0)}
          </span>
          <span className="text-gray-500">/month</span>
        </div>
        {billingPeriod === 'annual' && (
          <p className="mt-1 text-sm text-gray-500">
            Billed ${price.toFixed(0)} yearly
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="mb-8 flex-1 space-y-3">
        {plan.features?.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div
              className={cn(
                'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
                isRecommended || isPremium
                  ? 'bg-agile-teal/10'
                  : 'bg-gray-100'
              )}
            >
              <Check
                className={cn(
                  'h-3 w-3',
                  isRecommended || isPremium ? 'text-agile-teal' : 'text-gray-600'
                )}
              />
            </div>
            <span className="text-sm text-gray-600">{feature}</span>
          </li>
        ))}

        {/* Limits info */}
        {plan.design_uploads_limit && (
          <li className="flex items-start gap-3">
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-50">
              <Check className="h-3 w-3 text-amber-600" />
            </div>
            <span className="text-sm text-gray-600">
              {plan.design_uploads_limit} design uploads
            </span>
          </li>
        )}
        {plan.has_unlimited_uploads && (
          <li className="flex items-start gap-3">
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-50">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">
              Unlimited design uploads
            </span>
          </li>
        )}
        {plan.validations_limit && (
          <li className="flex items-start gap-3">
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-50">
              <Check className="h-3 w-3 text-amber-600" />
            </div>
            <span className="text-sm text-gray-600">
              {plan.validations_limit} Instagram validations
            </span>
          </li>
        )}
        {plan.has_unlimited_validations && (
          <li className="flex items-start gap-3">
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-50">
              <Check className="h-3 w-3 text-green-600" />
            </div>
            <span className="text-sm text-gray-600 font-medium">
              Unlimited Instagram validations
            </span>
          </li>
        )}
      </ul>

      {/* CTA Button */}
      <Button
        onClick={onSelect}
        disabled={isCurrentPlan || isDisabled}
        className={cn(
          'w-full',
          isCurrentPlan
            ? 'bg-gray-100 text-gray-500 hover:bg-gray-100'
            : isRecommended
            ? 'bg-agile-teal hover:bg-agile-teal/90'
            : 'bg-charcoal hover:bg-charcoal/90'
        )}
        size="lg"
      >
        {isCurrentPlan
          ? 'Current Plan'
          : isDisabled
          ? 'Not Available'
          : 'Start Free Trial'}
      </Button>

      {/* Small print */}
      {!isCurrentPlan && !isDisabled && (
        <p className="mt-3 text-center text-xs text-gray-400">
          14-day free trial • No credit card required
        </p>
      )}
    </div>
  );
}
