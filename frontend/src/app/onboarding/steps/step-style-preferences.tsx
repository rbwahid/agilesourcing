'use client';

import { UseFormReturn } from 'react-hook-form';
import { Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardStepContent } from '@/components/forms';
import type { OnboardingFormData } from '@/types/profile';
import { STYLE_FOCUS_OPTIONS } from '@/types/profile';

interface StepStylePreferencesProps {
  form: UseFormReturn<OnboardingFormData>;
}

export function StepStylePreferences({ form }: StepStylePreferencesProps) {
  const selectedStyles = form.watch('style_focus') || [];

  const toggleStyle = (value: string) => {
    const current = form.getValues('style_focus') || [];
    if (current.includes(value)) {
      form.setValue(
        'style_focus',
        current.filter((v) => v !== value),
        { shouldValidate: true }
      );
    } else {
      form.setValue('style_focus', [...current, value], { shouldValidate: true });
    }
  };

  return (
    <WizardStepContent
      title="Your design style"
      description="Select the styles that best represent your work. This helps connect you with the right suppliers."
    >
      {/* Decorative Icon */}
      <div className="mb-8 flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-4 animate-pulse rounded-full bg-gradient-to-r from-agile-teal/15 to-mint-accent/15 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-agile-teal to-mint-accent shadow-lg shadow-agile-teal/20">
            <Palette className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>

      {/* Selection Counter */}
      <div className="mb-6 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-light-grey/50 px-4 py-2">
          <span className="text-sm text-charcoal-light">
            Selected:
          </span>
          <span
            className={cn(
              'font-semibold transition-colors',
              selectedStyles.length > 0 ? 'text-agile-teal' : 'text-charcoal-light'
            )}
          >
            {selectedStyles.length}
          </span>
          <span className="text-sm text-charcoal-light">
            {selectedStyles.length === 1 ? 'style' : 'styles'}
          </span>
        </div>
      </div>

      {/* Style Tags Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {STYLE_FOCUS_OPTIONS.map((style) => {
          const isSelected = selectedStyles.includes(style.value);
          return (
            <button
              key={style.value}
              type="button"
              onClick={() => toggleStyle(style.value)}
              className={cn(
                'group relative flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-agile-teal focus-visible:ring-offset-2',
                isSelected
                  ? 'border-agile-teal bg-agile-teal text-white shadow-md shadow-agile-teal/25'
                  : 'border-light-grey bg-white text-charcoal hover:border-agile-teal/50 hover:bg-agile-teal/5'
              )}
            >
              {/* Checkmark for selected */}
              <span
                className={cn(
                  'absolute left-2 flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300',
                  isSelected
                    ? 'scale-100 bg-white/20'
                    : 'scale-0'
                )}
              >
                <Check className="h-3 w-3" />
              </span>

              {/* Label */}
              <span className={cn(isSelected && 'ml-3')}>
                {style.label}
              </span>

              {/* Hover glow effect */}
              <span
                className={cn(
                  'absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-agile-teal to-mint-accent opacity-0 blur-lg transition-opacity duration-300',
                  'group-hover:opacity-20',
                  isSelected && 'opacity-30'
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Validation hint */}
      {selectedStyles.length === 0 && (
        <p className="mt-6 text-center text-sm text-charcoal-light">
          Select at least <span className="font-medium text-agile-teal">1 style</span> to continue
        </p>
      )}

      {/* Tip Card */}
      <div className="mt-8 rounded-xl border border-mint-accent/30 bg-gradient-to-br from-mint-accent/5 to-agile-teal/5 p-4">
        <p className="text-sm text-charcoal-light">
          <span className="font-medium text-agile-teal">Tip:</span> Choosing multiple styles can help you connect with a wider range of suppliers, but being specific shows your expertise.
        </p>
      </div>
    </WizardStepContent>
  );
}
