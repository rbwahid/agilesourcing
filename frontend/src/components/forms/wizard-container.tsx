'use client';

import { cn } from '@/lib/utils';
import { WizardProgress, type WizardStep } from './wizard-progress';

interface WizardContainerProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  steps: WizardStep[];
  title?: string;
  subtitle?: string;
  className?: string;
  showProgress?: boolean;
}

export function WizardContainer({
  children,
  currentStep,
  totalSteps,
  steps,
  title,
  subtitle,
  className,
  showProgress = true,
}: WizardContainerProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Header Section */}
      {(title || subtitle) && (
        <div className="mb-8 text-center">
          {title && (
            <h1 className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-2 text-charcoal-light">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Progress Indicator */}
      {showProgress && (
        <div className="mb-10">
          <WizardProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={steps}
          />
        </div>
      )}

      {/* Content Card */}
      <div className="relative">
        {/* Decorative Background Elements */}
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-agile-teal/5 via-transparent to-mint-accent/5 blur-2xl" />

        {/* Main Card */}
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl border border-light-grey/50 bg-white',
            'shadow-xl shadow-charcoal/5',
            'transition-all duration-500'
          )}
        >
          {/* Subtle Top Accent Line */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-agile-teal via-mint-accent to-agile-teal" />

          {/* Step Content with Animation */}
          <div className="p-6 sm:p-8 lg:p-10">
            <div
              key={currentStep}
              className="animate-in fade-in slide-in-from-right-4 duration-500"
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Individual step wrapper for consistent spacing
 */
interface WizardStepContentProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function WizardStepContent({
  children,
  title,
  description,
  className,
}: WizardStepContentProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-xl font-semibold text-charcoal sm:text-2xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-charcoal-light">
              {description}
            </p>
          )}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
