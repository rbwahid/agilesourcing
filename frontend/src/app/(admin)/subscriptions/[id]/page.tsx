'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAdminSubscription } from '@/lib/hooks/use-admin';
import {
  SubscriptionDetailCard,
  SubscriptionInvoicesCard,
  RetryPaymentDialog,
} from '@/components/admin';

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subscriptionId = Number(params.id);

  const [retryDialogOpen, setRetryDialogOpen] = useState(false);

  const { data: subscription, isLoading } = useAdminSubscription(subscriptionId);

  const showRetryButton = subscription?.stripe_status === 'past_due';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/subscriptions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal">Subscription Details</h1>
            <p className="text-sm text-charcoal-light">
              View subscription information and manage billing.
            </p>
          </div>
        </div>
        {showRetryButton && (
          <Button
            onClick={() => setRetryDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry Payment
          </Button>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Main Column */}
        <div className="space-y-6">
          <SubscriptionDetailCard subscription={subscription} isLoading={isLoading} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <SubscriptionInvoicesCard
            invoices={subscription?.invoices ?? []}
            isLoading={isLoading}
          />

          {/* Quick Actions */}
          <Card className="border-gray-100">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {subscription?.user && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/users/${subscription.user.id}`}>
                    View User Profile
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/subscriptions">
                  Back to All Subscriptions
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Retry Payment Dialog */}
      <RetryPaymentDialog
        open={retryDialogOpen}
        onOpenChange={setRetryDialogOpen}
        subscriptionId={subscriptionId}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
