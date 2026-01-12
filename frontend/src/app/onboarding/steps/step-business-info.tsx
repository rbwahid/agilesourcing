'use client';

import { UseFormReturn } from 'react-hook-form';
import { Building2, MapPin, Sparkles } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { WizardStepContent } from '@/components/forms';
import type { OnboardingFormData } from '@/types/profile';

interface StepBusinessInfoProps {
  form: UseFormReturn<OnboardingFormData>;
}

export function StepBusinessInfo({ form }: StepBusinessInfoProps) {
  return (
    <WizardStepContent
      title="Let's get started"
      description="Tell us about your brand so we can personalize your experience."
    >
      {/* Decorative Welcome Element */}
      <div className="mb-8 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-agile-teal/20 to-mint-accent/20 blur-xl" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-agile-teal to-mint-accent shadow-lg shadow-agile-teal/25">
            <Sparkles className="h-9 w-9 text-white" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Business Name */}
        <FormField
          control={form.control}
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium text-charcoal">
                <Building2 className="h-4 w-4 text-agile-teal" />
                Brand / Business Name
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Aurora Designs, The Studio NYC"
                  className="h-12 border-light-grey bg-white px-4 text-charcoal placeholder:text-charcoal-light/60 focus:border-agile-teal focus:ring-agile-teal/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium text-charcoal">
                <MapPin className="h-4 w-4 text-agile-teal" />
                Location
                <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., New York, NY or London, UK"
                  className="h-12 border-light-grey bg-white px-4 text-charcoal placeholder:text-charcoal-light/60 focus:border-agile-teal focus:ring-agile-teal/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Tip Card */}
      <div className="mt-8 rounded-xl border border-mint-accent/30 bg-gradient-to-br from-mint-accent/5 to-agile-teal/5 p-4">
        <p className="text-sm text-charcoal-light">
          <span className="font-medium text-agile-teal">Pro tip:</span> Your business name helps suppliers find you. Use the name your customers know you by.
        </p>
      </div>
    </WizardStepContent>
  );
}
