'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { WizardContainer, WizardNavigation } from '@/components/forms';
import type { WizardStep } from '@/components/forms';
import { useUpdateProfile, useCompleteOnboarding } from '@/lib/hooks/use-profile';

// Step components
import { StepBusinessInfo } from './steps/step-business-info';
import { StepAboutYou } from './steps/step-about-you';
import { StepStylePreferences } from './steps/step-style-preferences';
import { StepTargetAudience } from './steps/step-target-audience';
import { StepComplete } from './steps/step-complete';

// Validation schema
const onboardingSchema = z.object({
  // Step 1 - Required
  business_name: z.string().min(1, 'Business name is required').max(255),
  location: z.string().min(1, 'Location is required').max(255),

  // Step 2 - Optional (but always present as strings)
  bio: z.string().max(500),
  website_url: z
    .string()
    .refine(
      (val) => val === '' || /^https?:\/\/.+/.test(val),
      'Please enter a valid URL'
    ),

  // Step 3 - At least one required
  style_focus: z.array(z.string()).min(1, 'Select at least one style'),

  // Step 4 - Optional (but always present as array)
  target_demographics: z.array(z.string()),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

const WIZARD_STEPS: WizardStep[] = [
  { label: 'Business Info', description: 'Your brand details' },
  { label: 'About You', description: 'Tell your story' },
  { label: 'Style', description: 'Your design focus' },
  { label: 'Audience', description: 'Who you design for' },
  { label: 'Complete', description: 'All done!' },
];

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutateAsync: completeOnboarding, isPending: isCompleting } = useCompleteOnboarding();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      business_name: '',
      location: '',
      bio: '',
      website_url: '',
      style_focus: [],
      target_demographics: [],
    },
    mode: 'onChange',
  });

  const isLoading = isUpdating || isCompleting;

  // Validation for each step
  const validateStep = useCallback(async (step: number): Promise<boolean> => {
    switch (step) {
      case 1:
        return form.trigger(['business_name', 'location']);
      case 2:
        // Optional step - always valid, but validate format if filled
        return form.trigger(['bio', 'website_url']);
      case 3:
        return form.trigger(['style_focus']);
      case 4:
        // Optional step - always valid
        return true;
      default:
        return true;
    }
  }, [form]);

  // Save progress at each step
  const saveProgress = useCallback(async () => {
    const values = form.getValues();
    try {
      await updateProfile({
        business_name: values.business_name,
        location: values.location || null,
        bio: values.bio || null,
        website_url: values.website_url || null,
        style_focus: values.style_focus,
        target_demographics: values.target_demographics,
      });
      return true;
    } catch {
      return false;
    }
  }, [form, updateProfile]);

  // Handle next step
  const handleNext = useCallback(async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    // Save progress when moving forward (except on last content step)
    if (currentStep < TOTAL_STEPS - 1) {
      const saved = await saveProgress();
      if (!saved) return;
    }

    // Complete onboarding on step 4 -> 5 transition
    if (currentStep === TOTAL_STEPS - 1) {
      const saved = await saveProgress();
      if (!saved) return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, validateStep, saveProgress]);

  // Handle previous step
  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Handle skip (for optional steps)
  const handleSkip = useCallback(async () => {
    if (currentStep < TOTAL_STEPS) {
      // Still save progress even when skipping
      await saveProgress();
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, saveProgress]);

  // Handle final completion
  const handleComplete = useCallback(async () => {
    try {
      await completeOnboarding();
      // The hook handles redirect to dashboard
    } catch {
      // Error is handled by the hook
    }
  }, [completeOnboarding]);

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepBusinessInfo form={form} />;
      case 2:
        return <StepAboutYou form={form} />;
      case 3:
        return <StepStylePreferences form={form} />;
      case 4:
        return <StepTargetAudience form={form} />;
      case 5:
        return (
          <StepComplete
            businessName={form.getValues('business_name')}
            isLoading={isCompleting}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  // Determine if current step can be skipped
  const canSkip = currentStep === 2 || currentStep === 4;

  // Check if we can proceed (for validation feedback)
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          form.watch('business_name')?.length > 0 &&
          form.watch('location')?.length > 0
        );
      case 3:
        return (form.watch('style_focus')?.length ?? 0) > 0;
      default:
        return true;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <WizardContainer
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          steps={WIZARD_STEPS}
          title={currentStep === 1 ? 'Welcome to AgileSourcing' : undefined}
          subtitle={
            currentStep === 1
              ? "Let's set up your designer profile in just a few steps"
              : undefined
          }
          showProgress={currentStep < TOTAL_STEPS}
        >
          {renderStepContent()}

          {/* Navigation - Hide on completion step */}
          {currentStep < TOTAL_STEPS && (
            <div className="mt-8 pt-6 border-t border-light-grey/50">
              <WizardNavigation
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSkip={canSkip ? handleSkip : undefined}
                canGoBack={currentStep > 1}
                canSkip={canSkip}
                isLastStep={currentStep === TOTAL_STEPS - 1}
                isLoading={isLoading}
                nextLabel={
                  currentStep === TOTAL_STEPS - 1 ? 'Complete Setup' : undefined
                }
              />
            </div>
          )}
        </WizardContainer>
      </form>
    </Form>
  );
}
