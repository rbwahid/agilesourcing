'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Clock, X, CreditCard, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSubscription } from '@/lib/hooks/use-billing';

interface TrialBannerProps {
  className?: string;
  variant?: 'banner' | 'card';
}

export function TrialBanner({ className, variant = 'banner' }: TrialBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const { data: subscription } = useSubscription();

  const daysRemaining = useMemo(() => {
    if (!subscription?.trial_ends_at) return null;
    const trialEnd = new Date(subscription.trial_ends_at);
    const now = new Date();
    const diff = Math.ceil(
      (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  }, [subscription?.trial_ends_at]);

  // Only show if user is on trial
  const isTrialing =
    subscription?.status === 'trialing' || subscription?.on_trial;

  if (!isTrialing || daysRemaining === null || isDismissed) {
    return null;
  }

  const isUrgent = daysRemaining <= 3;

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'relative rounded-xl border p-5 transition-all',
          isUrgent
            ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200'
            : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200',
          className
        )}
      >
        <button
          onClick={() => setIsDismissed(true)}
          className={cn(
            'absolute top-3 right-3 p-1 rounded transition-colors',
            isUrgent
              ? 'text-amber-600 hover:bg-amber-200'
              : 'text-blue-600 hover:bg-blue-200'
          )}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              isUrgent ? 'bg-amber-100' : 'bg-blue-100'
            )}
          >
            {isUrgent ? (
              <Clock className={cn('h-6 w-6', isUrgent ? 'text-amber-600' : 'text-blue-600')} />
            ) : (
              <Sparkles className="h-6 w-6 text-blue-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                'font-serif text-lg font-semibold',
                isUrgent ? 'text-amber-900' : 'text-blue-900'
              )}
            >
              {isUrgent
                ? `Your trial ends in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`
                : `${daysRemaining} days left in your trial`}
            </h3>
            <p
              className={cn(
                'mt-1 text-sm',
                isUrgent ? 'text-amber-700' : 'text-blue-700'
              )}
            >
              {isUrgent
                ? 'Add a payment method to continue using all features'
                : 'Enjoying AgileSourcing? Add a payment method to continue after your trial'}
            </p>

            <Button
              asChild
              size="sm"
              className={cn(
                'mt-4 gap-2',
                isUrgent
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              )}
            >
              <Link href="/billing">
                <CreditCard className="h-4 w-4" />
                Add Payment Method
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Banner variant
  return (
    <div
      className={cn(
        'relative',
        isUrgent
          ? 'bg-gradient-to-r from-amber-500 to-amber-600'
          : 'bg-gradient-to-r from-blue-500 to-blue-600',
        'text-white',
        className
      )}
    >
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex items-center justify-center gap-3 text-sm">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <p className="font-medium">
            {isUrgent ? (
              <>
                Trial ending soon!{' '}
                <span className="font-normal opacity-90">
                  {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining.
                </span>
              </>
            ) : (
              <>
                {daysRemaining} days left in your free trial.{' '}
                <span className="font-normal opacity-90">
                  Enjoying it so far?
                </span>
              </>
            )}
          </p>
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="h-7 px-3 text-xs bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <Link href="/billing">Add Payment</Link>
          </Button>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
