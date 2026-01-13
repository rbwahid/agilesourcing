'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, ShoppingCart } from 'lucide-react';
import { CheckoutWizard } from '@/components/billing';
import { StripeProvider } from '@/components/providers/stripe-provider';
import { Button } from '@/components/ui/button';
import type { BillingPeriod } from '@/types/billing';

function CheckoutContent() {
  const searchParams = useSearchParams();

  const planSlug = searchParams.get('plan') || undefined;
  const period = (searchParams.get('period') as BillingPeriod) || 'monthly';
  const isChanging = searchParams.get('change') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2 mb-4">
            <Link href="/pricing">
              <ArrowLeft className="h-4 w-4" />
              Back to Pricing
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-agile-teal/10">
              <ShoppingCart className="h-5 w-5 text-agile-teal" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal">
                {isChanging ? 'Change Plan' : 'Subscribe'}
              </h1>
              <p className="mt-1 text-gray-500">
                {isChanging
                  ? 'Update your subscription plan'
                  : 'Start your 14-day free trial'}
              </p>
            </div>
          </div>
        </div>

        <CheckoutWizard
          preselectedPlanSlug={planSlug}
          preselectedPeriod={period}
          isChangingPlan={isChanging}
        />
      </div>
    </div>
  );
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-agile-teal" />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <StripeProvider>
      <Suspense fallback={<CheckoutLoading />}>
        <CheckoutContent />
      </Suspense>
    </StripeProvider>
  );
}
