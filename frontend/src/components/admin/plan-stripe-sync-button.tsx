'use client';

import { useState } from 'react';
import { RefreshCw, Check, AlertCircle, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSyncPlanStripe } from '@/lib/hooks/use-admin';
import { cn } from '@/lib/utils';

interface PlanStripeSyncButtonProps {
  planId: number;
  hasStripeIds: boolean;
  className?: string;
}

export function PlanStripeSyncButton({
  planId,
  hasStripeIds,
  className,
}: PlanStripeSyncButtonProps) {
  const [justSynced, setJustSynced] = useState(false);
  const { mutate: syncStripe, isPending } = useSyncPlanStripe();

  const handleSync = () => {
    syncStripe(planId, {
      onSuccess: () => {
        setJustSynced(true);
        setTimeout(() => setJustSynced(false), 3000);
      },
    });
  };

  const buttonContent = () => {
    if (isPending) {
      return (
        <>
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Syncing...</span>
        </>
      );
    }

    if (justSynced) {
      return (
        <>
          <Check className="h-4 w-4 text-green-600" />
          <span>Synced</span>
        </>
      );
    }

    if (hasStripeIds) {
      return (
        <>
          <RefreshCw className="h-4 w-4" />
          <span>Sync Prices</span>
        </>
      );
    }

    return (
      <>
        <CloudOff className="h-4 w-4" />
        <span>Setup Stripe</span>
      </>
    );
  };

  const tooltipContent = () => {
    if (hasStripeIds) {
      return 'Update Stripe product and create new prices. Use after changing plan pricing.';
    }
    return 'Create Stripe product and prices for this plan. Required before users can subscribe.';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={hasStripeIds ? 'outline' : 'default'}
            size="sm"
            onClick={handleSync}
            disabled={isPending}
            className={cn(
              'gap-2 transition-all',
              !hasStripeIds && 'bg-amber-500 hover:bg-amber-600 text-white',
              justSynced && 'border-green-500',
              className
            )}
          >
            {buttonContent()}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p>{tooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface StripeSyncStatusProps {
  hasStripeIds: boolean;
  className?: string;
}

export function StripeSyncStatus({ hasStripeIds, className }: StripeSyncStatusProps) {
  if (hasStripeIds) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex items-center gap-1.5 text-xs text-green-600',
                className
              )}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Stripe Active</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>This plan has Stripe product and prices configured.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-1.5 text-xs text-amber-600',
              className
            )}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Not on Stripe</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>This plan needs to be synced with Stripe before users can subscribe.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
