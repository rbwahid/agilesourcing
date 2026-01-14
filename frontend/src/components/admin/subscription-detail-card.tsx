'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CreditCard,
  Mail,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import type { AdminSubscriptionDetail, StripeSubscriptionStatus } from '@/types/admin';
import { cn } from '@/lib/utils';

interface SubscriptionDetailCardProps {
  subscription?: AdminSubscriptionDetail;
  isLoading: boolean;
}

function getStatusBadge(status: StripeSubscriptionStatus) {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>;
    case 'trialing':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Trial</Badge>;
    case 'past_due':
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Past Due</Badge>;
    case 'canceled':
      return <Badge variant="outline" className="text-gray-500">Cancelled</Badge>;
    case 'incomplete':
    case 'incomplete_expired':
      return <Badge variant="outline" className="border-red-300 text-red-600">Incomplete</Badge>;
    case 'unpaid':
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Unpaid</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatAmount(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function DetailRow({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
        <Icon className="h-4 w-4 text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className={cn('text-sm font-medium text-charcoal', valueClassName)}>{value}</p>
      </div>
    </div>
  );
}

export function SubscriptionDetailCard({ subscription, isLoading }: SubscriptionDetailCardProps) {
  if (isLoading) {
    return (
      <Card className="border-gray-100">
        <CardHeader>
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="border-gray-100">
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-gray-500">Subscription not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-100">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100">
            <CreditCard className="h-7 w-7 text-gray-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl font-bold text-charcoal">
              {subscription.plan?.name || 'Unknown Plan'}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              {getStatusBadge(subscription.stripe_status)}
              <Badge variant="outline" className="capitalize">
                {subscription.billing_period}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <DetailRow
          icon={User}
          label="Subscriber"
          value={
            <Link
              href={`/users/${subscription.user.id}`}
              className="text-agile-teal hover:underline"
            >
              {subscription.user.name}
            </Link>
          }
        />
        <DetailRow icon={Mail} label="Email" value={subscription.user.email} />

        {/* Billing Info */}
        <DetailRow
          icon={CreditCard}
          label="Monthly Amount"
          value={`${formatAmount(subscription.amount)}/mo`}
        />

        {/* Dates */}
        <DetailRow
          icon={Calendar}
          label="Subscribed Since"
          value={`${format(new Date(subscription.created_at), 'MMMM d, yyyy')} (${formatDistanceToNow(new Date(subscription.created_at), { addSuffix: true })})`}
        />

        {/* Trial Info */}
        {subscription.on_trial && subscription.trial_ends_at && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Trial Period Active</p>
                <p className="text-sm text-blue-700">
                  Ends {formatDistanceToNow(new Date(subscription.trial_ends_at), { addSuffix: true })}
                  {' '}({format(new Date(subscription.trial_ends_at), 'MMM d, yyyy')})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grace Period */}
        {subscription.on_grace_period && subscription.ends_at && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">Subscription Cancelled</p>
                <p className="text-sm text-amber-700">
                  Access until {format(new Date(subscription.ends_at), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Past Due Warning */}
        {subscription.stripe_status === 'past_due' && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Payment Past Due</p>
                <p className="text-sm text-red-700">
                  The subscription payment has failed. Use retry payment to attempt collection again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active Subscription */}
        {subscription.stripe_status === 'active' && !subscription.cancelled && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-900">Subscription Active</p>
                <p className="text-sm text-emerald-700">
                  Next billing cycle begins automatically
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
