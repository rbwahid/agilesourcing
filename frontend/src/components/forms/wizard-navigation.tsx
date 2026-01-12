'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2, SkipForward } from 'lucide-react';

interface WizardNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  canGoBack?: boolean;
  canSkip?: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
  nextLabel?: string;
  skipLabel?: string;
  className?: string;
}

export function WizardNavigation({
  onPrevious,
  onNext,
  onSkip,
  canGoBack = true,
  canSkip = false,
  isLastStep = false,
  isLoading = false,
  nextLabel,
  skipLabel = 'Skip for now',
  className,
}: WizardNavigationProps) {
  const defaultNextLabel = isLastStep ? 'Complete' : 'Continue';

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Left Side - Back Button */}
        <div className="flex-shrink-0">
          {canGoBack && onPrevious ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onPrevious}
              disabled={isLoading}
              className="group gap-2 text-charcoal-light hover:text-charcoal hover:bg-light-grey/50"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back
            </Button>
          ) : (
            <div className="w-20" /> // Spacer for alignment
          )}
        </div>

        {/* Right Side - Skip & Next */}
        <div className="flex items-center gap-3">
          {canSkip && onSkip && (
            <Button
              type="button"
              variant="ghost"
              onClick={onSkip}
              disabled={isLoading}
              className="gap-2 text-charcoal-light hover:text-charcoal hover:bg-transparent"
            >
              {skipLabel}
              <SkipForward className="h-4 w-4" />
            </Button>
          )}

          <Button
            type="button"
            onClick={onNext}
            disabled={isLoading}
            className={cn(
              'group relative min-w-[140px] gap-2 overflow-hidden',
              'bg-agile-teal text-white',
              'hover:bg-agile-teal/90',
              'focus-visible:ring-2 focus-visible:ring-agile-teal focus-visible:ring-offset-2',
              'transition-all duration-300',
              isLastStep && 'bg-gradient-to-r from-agile-teal to-mint-accent hover:opacity-90'
            )}
          >
            {/* Shine Effect */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{nextLabel || defaultNextLabel}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Layout - Stacked */}
      <div className="flex flex-col gap-3 sm:hidden">
        {/* Primary Action */}
        <Button
          type="button"
          onClick={onNext}
          disabled={isLoading}
          className={cn(
            'group relative w-full gap-2 overflow-hidden py-6',
            'bg-agile-teal text-white',
            'hover:bg-agile-teal/90',
            'focus-visible:ring-2 focus-visible:ring-agile-teal focus-visible:ring-offset-2',
            'transition-all duration-300',
            isLastStep && 'bg-gradient-to-r from-agile-teal to-mint-accent hover:opacity-90'
          )}
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span className="font-medium">{nextLabel || defaultNextLabel}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>

        {/* Secondary Actions */}
        <div className="flex items-center justify-center gap-4">
          {canGoBack && onPrevious && (
            <Button
              type="button"
              variant="ghost"
              onClick={onPrevious}
              disabled={isLoading}
              className="gap-2 text-charcoal-light hover:text-charcoal"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}

          {canGoBack && onPrevious && canSkip && onSkip && (
            <span className="text-light-grey">|</span>
          )}

          {canSkip && onSkip && (
            <Button
              type="button"
              variant="ghost"
              onClick={onSkip}
              disabled={isLoading}
              className="gap-2 text-charcoal-light hover:text-charcoal"
            >
              {skipLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
