'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { AdminUserDetail, AdminUserSubscription } from '@/types/admin';
import { cn } from '@/lib/utils';

interface UserSubscriptionCardProps {
  user?: AdminUserDetail;
  isLoading: boolean;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>;
    case 'trialing':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Trial</Badge>;
    case 'past_due':
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Past Due</Badge>;
    case 'canceled':
    case 'cancelled':
      return <Badge variant="outline" className="text-gray-500">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function UserSubscriptionCard({ user, isLoading }: UserSubscriptionCardProps) {
  if (isLoading) {
    return (
      <Card className="border-gray-100">
        <CardHeader>
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  const subscription = user.subscription;

  if (!subscription) {
    return (
      <Card className="border-gray-100">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <CreditCard className="h-6 w-6 text-gray-400" />
            </div>
            <p className="font-medium text-charcoal">No Active Subscription</p>
            <p className="mt-1 text-sm text-gray-500">
              This user hasn&apos;t subscribed to any plan yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isTrialing = subscription.trial_ends_at && new Date(subscription.trial_ends_at) > new Date();
  const isCancelled = subscription.ends_at !== null;

  return (
    <Card className="border-gray-100">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-500">Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plan Name & Status */}
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div>
            <p className="font-serif text-lg font-semibold text-charcoal">{subscription.name}</p>
            <p className="text-sm text-gray-500">Current Plan</p>
          </div>
          {getStatusBadge(subscription.stripe_status)}
        </div>

        {/* Trial Info */}
        {isTrialing && subscription.trial_ends_at && (
          <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900">Trial Period Active</p>
              <p className="text-xs text-blue-700">
                Ends {formatDistanceToNow(new Date(subscription.trial_ends_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        )}

        {/* Cancellation Info */}
        {isCancelled && subscription.ends_at && (
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-900">Subscription Cancelled</p>
              <p className="text-xs text-amber-700">
                Access ends {format(new Date(subscription.ends_at), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        )}

        {/* Subscription Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-500">Subscribed since:</span>
            <span className="text-charcoal">
              {format(new Date(subscription.created_at), 'MMMM d, yyyy')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
