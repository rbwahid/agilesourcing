'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UpgradePromptProps {
  feature: 'design_uploads' | 'validations';
  variant?: 'inline' | 'card' | 'banner';
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const FEATURE_CONFIG = {
  design_uploads: {
    title: "You've reached your design upload limit",
    description: 'Upgrade to Premium for unlimited design uploads',
    icon: AlertTriangle,
  },
  validations: {
    title: "You've reached your validation limit",
    description: 'Upgrade to Premium for unlimited Instagram validations',
    icon: AlertTriangle,
  },
};

export function UpgradePrompt({
  feature,
  variant = 'inline',
  className,
  dismissible = true,
  onDismiss,
}: UpgradePromptProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const config = FEATURE_CONFIG[feature];

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) {
    return null;
  }

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 p-3',
          className
        )}
      >
        <config.icon className="h-5 w-5 text-amber-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-900 truncate">
            {config.title}
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 flex-shrink-0"
        >
          <Link href="/pricing">Upgrade</Link>
        </Button>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="p-1 text-amber-600 hover:text-amber-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'relative rounded-xl bg-gradient-to-br from-agile-teal/10 to-mint-accent/10 border border-agile-teal/20 p-6',
          className
        )}
      >
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-agile-teal/10">
            <Sparkles className="h-6 w-6 text-agile-teal" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-lg font-semibold text-charcoal">
              {config.title}
            </h3>
            <p className="mt-1 text-sm text-gray-600">{config.description}</p>
            <Button
              asChild
              className="mt-4 bg-agile-teal hover:bg-agile-teal/90 gap-2"
            >
              <Link href="/pricing">
                View Plans
                <ArrowRight className="h-4 w-4" />
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
        'relative bg-gradient-to-r from-amber-500 to-amber-600 text-white',
        className
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4">
          <config.icon className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            {config.title}.{' '}
            <Link
              href="/pricing"
              className="underline underline-offset-2 hover:no-underline"
            >
              Upgrade to Premium
            </Link>
          </p>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
