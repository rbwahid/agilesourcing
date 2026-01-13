'use client';

import Link from 'next/link';
import { ImagePlus, Instagram, TrendingUp, Infinity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useSubscriptionUsage } from '@/lib/hooks/use-billing';
import { getUsagePercentage, isNearLimit, isAtLimit, formatUsage } from '@/types/billing';

export function UsageProgressCard() {
  const { data: usage, isLoading } = useSubscriptionUsage();

  if (isLoading) {
    return <UsageProgressCardSkeleton />;
  }

  if (!usage) {
    return null;
  }

  const designsPercentage = getUsagePercentage(usage.design_uploads);
  const validationsPercentage = getUsagePercentage(usage.validations);
  const isDesignsNearLimit = isNearLimit(usage.design_uploads);
  const isValidationsNearLimit = isNearLimit(usage.validations);
  const isDesignsAtLimit = isAtLimit(usage.design_uploads);
  const isValidationsAtLimit = isAtLimit(usage.validations);

  const showUpgradePrompt = isDesignsAtLimit || isValidationsAtLimit;

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <TrendingUp className="h-5 w-5 text-agile-teal" />
          Usage This Period
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Design Uploads */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  isDesignsNearLimit ? 'bg-amber-50' : 'bg-gray-50'
                )}
              >
                <ImagePlus
                  className={cn(
                    'h-4 w-4',
                    isDesignsNearLimit ? 'text-amber-600' : 'text-gray-500'
                  )}
                />
              </div>
              <span className="text-sm font-medium text-charcoal">
                Design Uploads
              </span>
            </div>
            <div className="flex items-center gap-2">
              {usage.design_uploads.limit === null ? (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Infinity className="h-4 w-4" />
                  Unlimited
                </span>
              ) : (
                <span
                  className={cn(
                    'text-sm',
                    isDesignsAtLimit
                      ? 'font-medium text-red-600'
                      : isDesignsNearLimit
                      ? 'text-amber-600'
                      : 'text-gray-500'
                  )}
                >
                  {usage.design_uploads.used} / {usage.design_uploads.limit}
                </span>
              )}
            </div>
          </div>

          {usage.design_uploads.limit !== null && (
            <Progress
              value={designsPercentage}
              className={cn(
                'h-2',
                isDesignsAtLimit
                  ? '[&>div]:bg-red-500'
                  : isDesignsNearLimit
                  ? '[&>div]:bg-amber-500'
                  : '[&>div]:bg-agile-teal'
              )}
            />
          )}
        </div>

        {/* Instagram Validations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  isValidationsNearLimit ? 'bg-amber-50' : 'bg-gray-50'
                )}
              >
                <Instagram
                  className={cn(
                    'h-4 w-4',
                    isValidationsNearLimit ? 'text-amber-600' : 'text-gray-500'
                  )}
                />
              </div>
              <span className="text-sm font-medium text-charcoal">
                Instagram Validations
              </span>
            </div>
            <div className="flex items-center gap-2">
              {usage.validations.limit === null ? (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Infinity className="h-4 w-4" />
                  Unlimited
                </span>
              ) : (
                <span
                  className={cn(
                    'text-sm',
                    isValidationsAtLimit
                      ? 'font-medium text-red-600'
                      : isValidationsNearLimit
                      ? 'text-amber-600'
                      : 'text-gray-500'
                  )}
                >
                  {usage.validations.used} / {usage.validations.limit}
                </span>
              )}
            </div>
          </div>

          {usage.validations.limit !== null && (
            <Progress
              value={validationsPercentage}
              className={cn(
                'h-2',
                isValidationsAtLimit
                  ? '[&>div]:bg-red-500'
                  : isValidationsNearLimit
                  ? '[&>div]:bg-amber-500'
                  : '[&>div]:bg-agile-teal'
              )}
            />
          )}
        </div>

        {/* Upgrade Prompt */}
        {showUpgradePrompt && (
          <div className="rounded-lg bg-gradient-to-r from-agile-teal/10 to-mint-accent/10 p-4 border border-agile-teal/20">
            <p className="text-sm font-medium text-charcoal">
              You&apos;ve reached your limit
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Upgrade to Premium for unlimited access
            </p>
            <Button asChild size="sm" className="mt-3 bg-agile-teal hover:bg-agile-teal/90">
              <Link href="/pricing">Upgrade Now</Link>
            </Button>
          </div>
        )}

        {/* Billing Period Info */}
        {usage.billing_period_start && usage.billing_period_end && (
          <p className="text-xs text-gray-400">
            Period: {new Date(usage.billing_period_start).toLocaleDateString()} -{' '}
            {new Date(usage.billing_period_end).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function UsageProgressCardSkeleton() {
  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
