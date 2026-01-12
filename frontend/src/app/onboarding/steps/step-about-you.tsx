'use client';

import { UseFormReturn } from 'react-hook-form';
import { FileText, Globe, User } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { WizardStepContent } from '@/components/forms';
import type { OnboardingFormData } from '@/types/profile';

interface StepAboutYouProps {
  form: UseFormReturn<OnboardingFormData>;
}

const MAX_BIO_LENGTH = 500;

export function StepAboutYou({ form }: StepAboutYouProps) {
  const bioValue = form.watch('bio') || '';
  const bioLength = bioValue.length;

  return (
    <WizardStepContent
      title="Tell us about yourself"
      description="Help others understand your design vision and background."
    >
      {/* Decorative Icon */}
      <div className="mb-8 flex items-center justify-center">
        <div className="relative">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-agile-teal/10 to-mint-accent/10 blur-lg" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-agile-teal/20 bg-white shadow-sm">
            <User className="h-7 w-7 text-agile-teal" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-2 text-sm font-medium text-charcoal">
                  <FileText className="h-4 w-4 text-agile-teal" />
                  Bio
                </FormLabel>
                <span
                  className={`text-xs transition-colors ${
                    bioLength > MAX_BIO_LENGTH * 0.9
                      ? 'text-amber-500'
                      : 'text-charcoal-light'
                  }`}
                >
                  {bioLength}/{MAX_BIO_LENGTH}
                </span>
              </div>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Share your design journey, inspirations, and what makes your work unique..."
                  rows={5}
                  maxLength={MAX_BIO_LENGTH}
                  className="resize-none border-light-grey bg-white text-charcoal placeholder:text-charcoal-light/60 focus:border-agile-teal focus:ring-agile-teal/20"
                />
              </FormControl>
              <FormDescription className="text-xs text-charcoal-light">
                A compelling bio helps you stand out to potential collaborators.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Website */}
        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-medium text-charcoal">
                <Globe className="h-4 w-4 text-agile-teal" />
                Website or Portfolio
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="url"
                    placeholder="https://yourwebsite.com"
                    className="h-12 border-light-grey bg-white pl-4 pr-4 text-charcoal placeholder:text-charcoal-light/60 focus:border-agile-teal focus:ring-agile-teal/20"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Optional Badge */}
      <div className="mt-6 flex items-center justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-light-grey/50 px-3 py-1 text-xs text-charcoal-light">
          <span className="h-1.5 w-1.5 rounded-full bg-mint-accent" />
          This step is optional — you can always add these later
        </span>
      </div>
    </WizardStepContent>
  );
}
