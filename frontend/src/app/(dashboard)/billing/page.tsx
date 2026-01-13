'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, X, CreditCard } from 'lucide-react';
import {
  SubscriptionStatusCard,
  UsageProgressCard,
  PaymentMethodCard,
  InvoiceTable,
} from '@/components/billing';
import { StripeProvider } from '@/components/providers/stripe-provider';
import { cn } from '@/lib/utils';

export default function BillingPage() {
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Check for success/error query params
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      setNotification({
        type: 'success',
        message: 'Your subscription has been updated successfully!',
      });
    } else if (canceled === 'true') {
      setNotification({
        type: 'success',
        message: 'Your subscription has been canceled.',
      });
    } else if (error) {
      setNotification({
        type: 'error',
        message: error === 'payment_failed'
          ? 'Payment failed. Please update your payment method.'
          : 'Something went wrong. Please try again.',
      });
    }

    // Clear notification after 5 seconds
    if (success || error || canceled) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <StripeProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-agile-teal/10">
                <CreditCard className="h-5 w-5 text-agile-teal" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal">
                  Billing & Subscription
                </h1>
                <p className="mt-1 text-gray-500">
                  Manage your subscription, payment methods, and billing history
                </p>
              </div>
            </div>
          </div>

          {/* Success/Error Notification */}
          {notification && (
            <div
              className={cn(
                'mb-6 flex items-center gap-3 rounded-lg border p-4 transition-all',
                notification.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                )}
              >
                {notification.type === 'success' ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
              </div>
              <p className="flex-1 text-sm font-medium">{notification.message}</p>
              <button
                onClick={() => setNotification(null)}
                className="p-1 hover:opacity-70 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <SubscriptionStatusCard />
              <UsageProgressCard />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <PaymentMethodCard />
            </div>
          </div>

          {/* Full Width Invoice Table */}
          <div className="mt-6">
            <InvoiceTable />
          </div>
        </div>
      </div>
    </StripeProvider>
  );
}
