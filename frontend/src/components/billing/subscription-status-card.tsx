'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useSubscription, useCancelSubscription, useResumeSubscription } from '@/lib/hooks/use-billing';
import {
  SUBSCRIPTION_STATUS_CONFIG,
  formatCurrency,
  formatBillingPeriod,
} from '@/types/billing';

export function SubscriptionStatusCard() {
  const { data: subscription, isLoading } = useSubscription();
  const cancelMutation = useCancelSubscription();
  const resumeMutation = useResumeSubscription();

  const statusConfig = useMemo(
    () => SUBSCRIPTION_STATUS_CONFIG[subscription?.status || 'inactive'],
    [subscription?.status]
  );

  const daysUntilTrialEnds = useMemo(() => {
    if (!subscription?.trial_ends_at) return null;
    const trialEnd = new Date(subscription.trial_ends_at);
    const now = new Date();
    const diff = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [subscription?.trial_ends_at]);

  const nextBillingDate = useMemo(() => {
    if (!subscription?.current_period_end) return null;
    return new Date(subscription.current_period_end).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [subscription?.current_period_end]);

  if (isLoading) {
    return <SubscriptionStatusCardSkeleton />;
  }

  const isTrialing = subscription?.status === 'trialing' || subscription?.on_trial;
  const isCanceled = subscription?.cancel_at_period_end;
  const isPastDue = subscription?.status === 'past_due';

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-serif text-lg">
            <CreditCard className="h-5 w-5 text-agile-teal" />
            Subscription
          </CardTitle>
          <Badge
            className={cn(
              'font-medium',
              statusConfig.bgColor,
              statusConfig.color,
              statusConfig.borderColor,
              'border'
            )}
          >
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Plan */}
        {subscription?.plan ? (
          <div className="rounded-xl bg-gradient-to-br from-gray-50 to-white p-4 border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Plan</p>
                <p className="font-serif text-xl font-semibold text-charcoal">
                  {subscription.plan.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {formatBillingPeriod(subscription.billing_period)}
                </p>
                <p className="font-serif text-xl font-semibold text-charcoal">
                  {formatCurrency(
                    subscription.billing_period === 'annual'
                      ? subscription.plan.price_annual
                      : subscription.plan.price_monthly
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-gray-50 p-4 text-center">
            <p className="text-gray-500">No active subscription</p>
            <Button asChild variant="link" className="mt-2 text-agile-teal">
              <Link href="/pricing">View Plans</Link>
            </Button>
          </div>
        )}

        {/* Trial Warning */}
        {isTrialing && daysUntilTrialEnds !== null && (
          <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 border border-blue-100">
            <Clock className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Trial ends in {daysUntilTrialEnds} day{daysUntilTrialEnds !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-blue-700">
                Add a payment method to continue after your trial
              </p>
            </div>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/billing">Add Payment</Link>
            </Button>
          </div>
        )}

        {/* Cancellation Warning */}
        {isCanceled && !isPastDue && (
          <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-4 border border-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                Subscription ending
              </p>
              <p className="text-xs text-amber-700">
                Your subscription will end on {nextBillingDate}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-amber-200 text-amber-700 hover:bg-amber-100"
              onClick={() => resumeMutation.mutate()}
              disabled={resumeMutation.isPending}
            >
              {resumeMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                'Resume'
              )}
            </Button>
          </div>
        )}

        {/* Past Due Warning */}
        {isPastDue && (
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4 border border-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">Payment Failed</p>
              <p className="text-xs text-red-700">
                Please update your payment method to continue using AgileSourcing
              </p>
            </div>
            <Button asChild size="sm" variant="destructive">
              <Link href="/billing">Update Payment</Link>
            </Button>
          </div>
        )}

        {/* Next Billing */}
        {nextBillingDate && !isCanceled && !isPastDue && subscription?.status === 'active' && (
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Next billing date: {nextBillingDate}</span>
          </div>
        )}

        {/* Actions */}
        {subscription?.plan && (
          <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
            <Button asChild variant="outline" size="sm">
              <Link href="/pricing" className="flex items-center gap-1">
                Change Plan
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>

            {!isCanceled && subscription.status === 'active' && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-600"
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Subscription'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SubscriptionStatusCardSkeleton() {
  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-4 w-48" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-36" />
        </div>
      </CardContent>
    </Card>
  );
}
