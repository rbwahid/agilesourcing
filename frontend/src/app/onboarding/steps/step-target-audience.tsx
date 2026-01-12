'use client';

import { UseFormReturn } from 'react-hook-form';
import { Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardStepContent } from '@/components/forms';
import type { OnboardingFormData } from '@/types/profile';
import {
  TARGET_AGE_GROUPS,
  TARGET_GENDERS,
  TARGET_PRICE_POINTS,
} from '@/types/profile';

interface StepTargetAudienceProps {
  form: UseFormReturn<OnboardingFormData>;
}

type DemographicOption = {
  value: string;
  label: string;
};

export function StepTargetAudience({ form }: StepTargetAudienceProps) {
  const selectedDemographics = form.watch('target_demographics') || [];

  const toggleDemographic = (value: string) => {
    const current = form.getValues('target_demographics') || [];
    if (current.includes(value)) {
      form.setValue(
        'target_demographics',
        current.filter((v) => v !== value),
        { shouldValidate: true }
      );
    } else {
      form.setValue('target_demographics', [...current, value], {
        shouldValidate: true,
      });
    }
  };

  const renderPillGroup = (
    title: string,
    options: readonly DemographicOption[]
  ) => (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-charcoal">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedDemographics.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleDemographic(option.value)}
              className={cn(
                'group relative flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-agile-teal focus-visible:ring-offset-2',
                isSelected
                  ? 'border-agile-teal bg-agile-teal text-white shadow-sm'
                  : 'border-light-grey bg-white text-charcoal hover:border-agile-teal/50 hover:bg-agile-teal/5'
              )}
            >
              {/* Mini checkmark */}
              <span
                className={cn(
                  'flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200',
                  isSelected
                    ? 'scale-100 bg-white/20'
                    : 'scale-0'
                )}
              >
                <Check className="h-2.5 w-2.5" />
              </span>

              <span className={cn('transition-all', isSelected && 'ml-0')}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <WizardStepContent
      title="Target audience"
      description="Who are you designing for? This helps suppliers understand your market."
    >
      {/* Decorative Icon */}
      <div className="mb-8 flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-agile-teal/10 to-mint-accent/10 blur-lg" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-agile-teal/20 bg-white shadow-sm">
            <Users className="h-7 w-7 text-agile-teal" />
          </div>
        </div>
      </div>

      {/* Demographic Categories */}
      <div className="space-y-8">
        {/* Age Groups */}
        {renderPillGroup('Age Groups', TARGET_AGE_GROUPS)}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-light-grey/50" />
          </div>
        </div>

        {/* Gender */}
        {renderPillGroup('Gender', TARGET_GENDERS)}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-light-grey/50" />
          </div>
        </div>

        {/* Price Points */}
        {renderPillGroup('Price Points', TARGET_PRICE_POINTS)}
      </div>

      {/* Selection Summary */}
      {selectedDemographics.length > 0 && (
        <div className="mt-8 rounded-xl bg-gradient-to-br from-agile-teal/5 to-mint-accent/5 p-4">
          <p className="text-sm text-charcoal">
            <span className="font-medium text-agile-teal">
              {selectedDemographics.length}
            </span>{' '}
            {selectedDemographics.length === 1 ? 'selection' : 'selections'} made
          </p>
        </div>
      )}

      {/* Optional Badge */}
      <div className="mt-6 flex items-center justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-light-grey/50 px-3 py-1 text-xs text-charcoal-light">
          <span className="h-1.5 w-1.5 rounded-full bg-mint-accent" />
          This step is optional — you can refine this later
        </span>
      </div>
    </WizardStepContent>
  );
}
