'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface WizardStep {
  label: string;
  description?: string;
}

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: WizardStep[];
  className?: string;
}

export function WizardProgress({
  currentStep,
  totalSteps,
  steps,
  className,
}: WizardProgressProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Desktop Progress */}
      <div className="hidden md:block">
        <div className="relative flex items-start justify-between">
          {/* Connecting Line Background */}
          <div className="absolute top-5 left-0 right-0 h-[2px] bg-light-grey" />

          {/* Animated Progress Line */}
          <div
            className="absolute top-5 left-0 h-[2px] bg-gradient-to-r from-agile-teal to-mint-accent transition-all duration-700 ease-out"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          />

          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            const isPending = stepNumber > currentStep;

            return (
              <div
                key={index}
                className="relative z-10 flex flex-col items-center"
                style={{ width: `${100 / totalSteps}%` }}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500',
                    isCompleted && 'border-agile-teal bg-agile-teal text-white scale-100',
                    isActive && 'border-agile-teal bg-white text-agile-teal scale-110 shadow-lg shadow-agile-teal/20',
                    isPending && 'border-light-grey bg-white text-charcoal-light'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 animate-in zoom-in-50 duration-300" />
                  ) : (
                    <span
                      className={cn(
                        'text-sm font-semibold transition-colors duration-300',
                        isActive && 'text-agile-teal'
                      )}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium transition-colors duration-300',
                      isActive && 'text-charcoal',
                      isCompleted && 'text-agile-teal',
                      isPending && 'text-charcoal-light'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p
                      className={cn(
                        'mt-0.5 text-xs transition-colors duration-300',
                        isActive ? 'text-charcoal-light' : 'text-charcoal-light/60'
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden">
        {/* Progress Bar */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-light-grey">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-agile-teal to-mint-accent transition-all duration-700 ease-out"
            style={{
              width: `${(currentStep / totalSteps) * 100}%`,
            }}
          />
        </div>

        {/* Current Step Info */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-charcoal">
              {steps[currentStep - 1]?.label}
            </p>
            {steps[currentStep - 1]?.description && (
              <p className="text-xs text-charcoal-light">
                {steps[currentStep - 1].description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-agile-teal">{currentStep}</span>
            <span className="text-sm text-charcoal-light">/</span>
            <span className="text-sm text-charcoal-light">{totalSteps}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
