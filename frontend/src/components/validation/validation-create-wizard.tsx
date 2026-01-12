'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Image as ImageIcon,
  Wand2,
  Clock,
  Send,
  Sparkles,
  ImageOff,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useDesigns } from '@/lib/hooks/use-designs';
import { useMockups, useCreateMockup, useMockupsPolling } from '@/lib/hooks/use-mockups';
import { useCreateValidation } from '@/lib/hooks/use-validations';
import { useInstagramStatus } from '@/lib/hooks/use-instagram';
import { VALIDATION_DURATIONS, type ValidationDuration } from '@/types/validation';
import {
  MOCKUP_MODEL_TYPES,
  MOCKUP_POSES,
  MOCKUP_BACKGROUNDS,
  type MockupOptions,
} from '@/types/instagram';
import type { Design } from '@/types/design';
import type { Mockup } from '@/types/instagram';

interface ValidationCreateWizardProps {
  preselectedDesignId?: number;
}

const STEPS = [
  { id: 'design', title: 'Select Design', icon: ImageIcon },
  { id: 'mockup', title: 'Choose Mockup', icon: Wand2 },
  { id: 'caption', title: 'Write Caption', icon: Send },
  { id: 'duration', title: 'Set Duration', icon: Clock },
  { id: 'review', title: 'Review', icon: Check },
];

const MAX_CAPTION_LENGTH = 2200;

export function ValidationCreateWizard({ preselectedDesignId }: ValidationCreateWizardProps) {
  const router = useRouter();

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [selectedMockup, setSelectedMockup] = useState<Mockup | null>(null);
  const [caption, setCaption] = useState('');
  const [duration, setDuration] = useState<ValidationDuration>(48);
  const [mockupOptions, setMockupOptions] = useState<MockupOptions>({
    model_type: 'female',
    pose: 'front',
    background: 'studio',
  });
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false);

  // Data hooks
  const { data: designsData, isLoading: isLoadingDesigns } = useDesigns();
  const { data: instagramStatus } = useInstagramStatus();
  const {
    data: mockupsData,
    isLoading: isLoadingMockups,
    refetch: refetchMockups,
  } = useMockups(selectedDesign?.id || 0);
  const { mutateAsync: createMockup } = useCreateMockup(selectedDesign?.id || 0);
  const { mutateAsync: createValidation, isPending: isCreating } = useCreateValidation();

  // Poll for mockup completion
  useMockupsPolling(selectedDesign?.id || 0, isGeneratingMockup);

  const designs = designsData?.data ?? [];
  const mockups = mockupsData ?? [];

  // Preselect design if provided
  useEffect(() => {
    if (preselectedDesignId && designs.length > 0) {
      const design = designs.find((d) => d.id === preselectedDesignId);
      if (design) {
        setSelectedDesign(design);
        setCurrentStep(1);
      }
    }
  }, [preselectedDesignId, designs]);

  // Check if mockup generation completed
  useEffect(() => {
    if (isGeneratingMockup && mockups.length > 0) {
      const latestMockup = mockups[0];
      if (latestMockup.status === 'completed') {
        setSelectedMockup(latestMockup);
        setIsGeneratingMockup(false);
      } else if (latestMockup.status === 'failed') {
        setIsGeneratingMockup(false);
      }
    }
  }, [mockups, isGeneratingMockup]);

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedDesign !== null;
      case 1:
        return selectedMockup !== null;
      case 2:
        return caption.trim().length > 0 && caption.length <= MAX_CAPTION_LENGTH;
      case 3:
        return duration > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateMockup = async () => {
    if (!selectedDesign) return;

    setIsGeneratingMockup(true);
    try {
      await createMockup(mockupOptions);
      // Poll will pick up the new mockup
    } catch (error) {
      setIsGeneratingMockup(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMockup) return;

    try {
      const response = await createValidation({
        mockup_id: selectedMockup.id,
        caption,
        validation_duration_hours: duration,
      });
      router.push(`/validations/${response.data.id}`);
    } catch (error) {
      console.error('Failed to create validation:', error);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Choose a design to validate on Instagram. The design will be shown on a virtual model
              mockup.
            </p>
            {isLoadingDesigns ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-agile-teal" />
              </div>
            ) : designs.length === 0 ? (
              <div className="rounded-xl bg-gray-50 p-8 text-center">
                <ImageOff className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-4 text-gray-500">No designs found. Upload a design first.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => router.push('/designs/new')}
                >
                  Upload Design
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {designs.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedDesign(design)}
                    className={cn(
                      'group relative overflow-hidden rounded-xl border-2 transition-all duration-200',
                      selectedDesign?.id === design.id
                        ? 'border-agile-teal ring-2 ring-agile-teal/20'
                        : 'border-transparent hover:border-gray-200'
                    )}
                  >
                    <div className="aspect-square overflow-hidden bg-gray-100 relative">
                      {design.file_url ? (
                        <Image
                          src={design.file_url}
                          alt={design.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageOff className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="bg-white p-3">
                      <h3 className="font-medium text-charcoal truncate">{design.title}</h3>
                      <p className="text-xs text-gray-500 capitalize">{design.category}</p>
                    </div>
                    {selectedDesign?.id === design.id && (
                      <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-agile-teal text-white">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Select an existing mockup or generate a new one with AI.
            </p>

            {/* Mockup options */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <h3 className="font-medium text-charcoal mb-4">Generate New Mockup</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label className="text-xs text-gray-500">Model Type</Label>
                    <RadioGroup
                      value={mockupOptions.model_type}
                      onValueChange={(v) =>
                        setMockupOptions({ ...mockupOptions, model_type: v as any })
                      }
                      className="mt-2 space-y-1"
                    >
                      {MOCKUP_MODEL_TYPES.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`model-${option.value}`} />
                          <Label htmlFor={`model-${option.value}`} className="text-sm">
                            {option.icon} {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Pose</Label>
                    <RadioGroup
                      value={mockupOptions.pose}
                      onValueChange={(v) => setMockupOptions({ ...mockupOptions, pose: v as any })}
                      className="mt-2 space-y-1"
                    >
                      {MOCKUP_POSES.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`pose-${option.value}`} />
                          <Label htmlFor={`pose-${option.value}`} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Background</Label>
                    <RadioGroup
                      value={mockupOptions.background}
                      onValueChange={(v) =>
                        setMockupOptions({ ...mockupOptions, background: v as any })
                      }
                      className="mt-2 space-y-1"
                    >
                      {MOCKUP_BACKGROUNDS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`bg-${option.value}`} />
                          <Label htmlFor={`bg-${option.value}`} className="text-sm">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
                <Button
                  onClick={handleGenerateMockup}
                  disabled={isGeneratingMockup}
                  className="mt-4 gap-2 bg-agile-teal hover:bg-agile-teal/90"
                >
                  {isGeneratingMockup ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Generate Mockup
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Existing mockups */}
            {isLoadingMockups ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-agile-teal" />
              </div>
            ) : mockups.length > 0 ? (
              <div>
                <h3 className="font-medium text-charcoal mb-3">Available Mockups</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mockups
                    .filter((m) => m.status === 'completed' && m.file_url)
                    .map((mockup) => (
                      <button
                        key={mockup.id}
                        onClick={() => setSelectedMockup(mockup)}
                        className={cn(
                          'group relative overflow-hidden rounded-xl border-2 transition-all duration-200',
                          selectedMockup?.id === mockup.id
                            ? 'border-agile-teal ring-2 ring-agile-teal/20'
                            : 'border-transparent hover:border-gray-200'
                        )}
                      >
                        <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative">
                          <Image
                            src={mockup.file_url!}
                            alt="Mockup"
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="bg-white p-2 text-xs text-gray-500 capitalize">
                          {mockup.model_type} • {mockup.pose} • {mockup.background}
                        </div>
                        {selectedMockup?.id === mockup.id && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-agile-teal text-white">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            ) : null}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Write a compelling caption for your Instagram post. Include relevant hashtags to
              increase visibility.
            </p>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption here... #fashion #design"
                className="mt-2 min-h-[200px] resize-none"
                maxLength={MAX_CAPTION_LENGTH}
              />
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-gray-400">Include hashtags for better reach</span>
                <span
                  className={cn(
                    caption.length > MAX_CAPTION_LENGTH * 0.9
                      ? 'text-amber-500'
                      : 'text-gray-400'
                  )}
                >
                  {caption.length} / {MAX_CAPTION_LENGTH}
                </span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Choose how long to track engagement metrics for this validation.
            </p>
            <RadioGroup
              value={duration.toString()}
              onValueChange={(v) => setDuration(parseInt(v) as ValidationDuration)}
              className="space-y-3"
            >
              {VALIDATION_DURATIONS.map((d) => (
                <label
                  key={d.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all',
                    duration === d.value
                      ? 'border-agile-teal bg-agile-teal/5'
                      : 'border-gray-100 hover:border-gray-200'
                  )}
                >
                  <RadioGroupItem value={d.value.toString()} id={`duration-${d.value}`} />
                  <div className="flex-1">
                    <span className="font-medium text-charcoal">{d.label}</span>
                    <p className="text-sm text-gray-500">{d.description}</p>
                  </div>
                  {d.value === 48 && (
                    <span className="rounded-full bg-agile-teal/10 px-2 py-0.5 text-xs font-medium text-agile-teal">
                      Recommended
                    </span>
                  )}
                </label>
              ))}
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Review your validation settings before posting to Instagram.
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Preview */}
              <div className="space-y-4">
                <h3 className="font-medium text-charcoal">Preview</h3>
                {selectedMockup && selectedMockup.file_url && (
                  <div className="overflow-hidden rounded-xl shadow-lg">
                    <div className="aspect-[4/5] relative bg-gray-100">
                      <Image
                        src={selectedMockup.file_url}
                        alt="Mockup preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="bg-white p-4">
                      <p className="text-sm text-charcoal line-clamp-3">{caption}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-charcoal">Details</h3>
                <div className="rounded-xl bg-gray-50 p-4 space-y-4">
                  <div>
                    <span className="text-xs text-gray-500">Design</span>
                    <p className="font-medium text-charcoal">{selectedDesign?.title}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Instagram Account</span>
                    <p className="font-medium text-charcoal">
                      @{instagramStatus?.data?.instagram_username || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Validation Duration</span>
                    <p className="font-medium text-charcoal">
                      {VALIDATION_DURATIONS.find((d) => d.value === duration)?.label}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Caption Length</span>
                    <p className="font-medium text-charcoal">{caption.length} characters</p>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                  <strong>Note:</strong> Once posted, the image cannot be modified. Make sure
                  everything looks correct before proceeding.
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-agile-teal transition-all duration-300"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <button
                key={step.id}
                onClick={() => index < currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
                className={cn(
                  'flex flex-col items-center gap-2',
                  index > currentStep ? 'cursor-not-allowed' : 'cursor-pointer'
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                    isCompleted
                      ? 'border-agile-teal bg-agile-teal text-white'
                      : isCurrent
                      ? 'border-agile-teal bg-white text-agile-teal'
                      : 'border-gray-200 bg-white text-gray-400'
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium hidden sm:block',
                    isCurrent ? 'text-agile-teal' : 'text-gray-500'
                  )}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardContent className="p-6">{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {currentStep < STEPS.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 bg-agile-teal hover:bg-agile-teal/90"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isCreating || !canProceed()}
            className="gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Post to Instagram
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
