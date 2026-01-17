'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Shield, Zap, HeartHandshake } from 'lucide-react';
import { PricingCard, PricingToggle } from '@/components/billing';
import { Skeleton } from '@/components/ui/skeleton';
import { usePlans, useSubscription } from '@/lib/hooks/use-billing';
import { useUser } from '@/lib/hooks/use-auth';
import type { BillingPeriod } from '@/types/billing';

const FAQ_ITEMS = [
  {
    question: 'What happens after my trial ends?',
    answer:
      "You'll need to add a payment method to continue using AgileSourcing. We'll send you reminders before your trial expires.",
  },
  {
    question: 'Can I change plans later?',
    answer:
      'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we prorate billing automatically.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards including Visa, Mastercard, American Express, and Discover.',
  },
  {
    question: 'Is there a contract or commitment?',
    answer:
      'No long-term contracts. You can cancel anytime. Monthly plans renew each month, and annual plans renew yearly.',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  const { data: user } = useUser();
  const userType = user?.role === 'designer' || user?.role === 'supplier' ? user.role : undefined;
  const { data: plans, isLoading: plansLoading } = usePlans(userType);
  const { data: subscription, isLoading: subscriptionLoading } = useSubscription();

  const isLoading = plansLoading || subscriptionLoading;

  const currentPlanSlug = subscription?.plan?.slug;

  // Calculate savings percentage
  const savingsPercentage = useMemo(() => {
    if (!plans || plans.length === 0) return 17;
    const plan = plans[0];
    const monthlyTotal = plan.price_monthly * 12;
    const annualTotal = plan.price_annual;
    return Math.round(((monthlyTotal - annualTotal) / monthlyTotal) * 100);
  }, [plans]);

  const handlePlanSelect = (planSlug: string) => {
    router.push(`/billing/checkout?plan=${planSlug}&period=${billingPeriod}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-agile-teal/10 px-4 py-1.5 text-sm font-medium text-agile-teal mb-4">
              <Sparkles className="h-4 w-4" />
              14-day free trial on all plans
            </div>
            <h1 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Start free, upgrade when you&apos;re ready. No hidden fees.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center">
            <PricingToggle
              value={billingPeriod}
              onChange={setBillingPeriod}
              savingsPercentage={savingsPercentage}
            />
          </div>

          {/* Pricing Cards */}
          {isLoading ? (
            <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-[480px] rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
              {plans?.map((plan, index) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  billingPeriod={billingPeriod}
                  isCurrentPlan={currentPlanSlug === plan.slug}
                  isRecommended={index === 1} // Premium is recommended
                  onSelect={() => handlePlanSelect(plan.slug)}
                />
              ))}
            </div>
          )}

          {/* Features Comparison */}
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-charcoal text-center mb-8">
              Everything you need to succeed
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <FeatureHighlight
                icon={Zap}
                title="Fast & Reliable"
                description="Built for speed with 99.9% uptime guarantee"
              />
              <FeatureHighlight
                icon={Shield}
                title="Secure by Default"
                description="Enterprise-grade security for your designs"
              />
              <FeatureHighlight
                icon={HeartHandshake}
                title="Priority Support"
                description="Get help when you need it from our team"
              />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl font-bold text-charcoal text-center mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-100 bg-white p-5"
                >
                  <h3 className="font-medium text-charcoal">{item.question}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureHighlightProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureHighlight({ icon: Icon, title, description }: FeatureHighlightProps) {
  return (
    <div className="text-center p-4">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-agile-teal/10 mb-4">
        <Icon className="h-6 w-6 text-agile-teal" />
      </div>
      <h3 className="font-medium text-charcoal">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
