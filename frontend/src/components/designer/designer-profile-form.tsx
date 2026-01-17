'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import {
  User,
  Upload,
  Trash2,
  Loader2,
  Camera,
  MapPin,
  Globe,
  Palette,
  Users,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import {
  useUpdateProfile,
  useUploadProfileImage,
  useDeleteProfileImage,
} from '@/lib/hooks/use-profile';
import {
  STYLE_FOCUS_OPTIONS,
  TARGET_AGE_GROUPS,
  TARGET_GENDERS,
  TARGET_PRICE_POINTS,
} from '@/types/profile';
import type { Profile } from '@/types/profile';
import { toast } from 'sonner';

const profileSchema = z.object({
  business_name: z.string().min(2, 'Brand name must be at least 2 characters'),
  location: z.string().optional(),
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
  website_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  style_focus: z.array(z.string()),
  target_demographics: z.array(z.string()),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface DesignerProfileFormProps {
  initialData?: Profile;
}

export function DesignerProfileForm({ initialData }: DesignerProfileFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.profile_image_url || null
  );

  const updateProfileMutation = useUpdateProfile();
  const uploadImageMutation = useUploadProfileImage();
  const deleteImageMutation = useDeleteProfileImage();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      business_name: initialData?.business_name || '',
      location: initialData?.location || '',
      bio: initialData?.bio || '',
      website_url: initialData?.website_url || '',
      style_focus: initialData?.style_focus || [],
      target_demographics: initialData?.target_demographics || [],
    },
  });

  const bioLength = form.watch('bio')?.length || 0;
  const styleFocus = form.watch('style_focus');
  const targetDemographics = form.watch('target_demographics');

  const onDropImage = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image too large', {
            description: 'Please choose an image under 5MB.',
          });
          return;
        }
        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
        uploadImageMutation.mutate(file);
      }
    },
    [uploadImageMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropImage,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleDeleteImage = () => {
    setImagePreview(null);
    deleteImageMutation.mutate();
  };

  const toggleStyleFocus = (value: string) => {
    const current = form.getValues('style_focus');
    if (current.includes(value)) {
      form.setValue(
        'style_focus',
        current.filter((v) => v !== value)
      );
    } else {
      form.setValue('style_focus', [...current, value]);
    }
  };

  const toggleDemographic = (value: string) => {
    const current = form.getValues('target_demographics');
    if (current.includes(value)) {
      form.setValue(
        'target_demographics',
        current.filter((v) => v !== value)
      );
    } else {
      form.setValue('target_demographics', [...current, value]);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(
      {
        business_name: data.business_name,
        location: data.location || null,
        bio: data.bio || null,
        website_url: data.website_url || null,
        style_focus: data.style_focus,
        target_demographics: data.target_demographics,
      },
      {
        onSuccess: () => {
          toast.success('Profile updated', {
            description: 'Your changes have been saved.',
          });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-8 sm:space-y-0">
          <div className="relative">
            <div
              {...getRootProps()}
              className={cn(
                'group relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border-2 border-dashed transition-all duration-300',
                isDragActive
                  ? 'scale-105 border-agile-teal bg-agile-teal/5 shadow-lg shadow-agile-teal/20'
                  : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-agile-teal/50 hover:shadow-md'
              )}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Profile"
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-charcoal/60 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                    <Camera className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  {isDragActive ? (
                    <Sparkles className="h-8 w-8 animate-pulse text-agile-teal" />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400 transition-colors group-hover:text-agile-teal" />
                  )}
                  <span className="mt-2 text-xs font-medium text-gray-500 group-hover:text-agile-teal">
                    {isDragActive ? 'Drop here' : 'Upload'}
                  </span>
                </div>
              )}
              {uploadImageMutation.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
                  <Loader2 className="h-8 w-8 animate-spin text-agile-teal" />
                </div>
              )}
            </div>

            {/* Delete button */}
            {imagePreview && !uploadImageMutation.isPending && (
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={deleteImageMutation.isPending}
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-red-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-red-600 disabled:opacity-50"
              >
                {deleteImageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          <div className="text-center sm:text-left">
            <h3 className="font-serif text-lg font-semibold text-charcoal">
              Profile Photo
            </h3>
            <p className="mt-1 max-w-xs text-sm text-gray-500">
              Add a photo to personalize your profile. PNG, JPG or WebP up to 5MB.
            </p>
          </div>
        </div>

        {/* Business Information Card */}
        <Card className="overflow-hidden border-gray-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <div className="border-b border-gray-100 bg-gradient-to-r from-violet-50 via-violet-50/50 to-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 shadow-sm">
                <User className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  Business Information
                </h3>
                <p className="text-sm text-gray-500">
                  Tell us about your brand
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <FormField
              control={form.control}
              name="business_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-charcoal">
                    Brand / Business Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your brand or business name"
                      className="h-11 border-gray-200 transition-all focus:border-agile-teal focus:ring-agile-teal/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-charcoal">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="City, Country"
                      className="h-11 border-gray-200 transition-all focus:border-agile-teal focus:ring-agile-teal/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-charcoal">About</FormLabel>
                    <span
                      className={cn(
                        'text-xs tabular-nums transition-colors',
                        bioLength > 900
                          ? 'font-medium text-amber-600'
                          : 'text-gray-400'
                      )}
                    >
                      {bioLength}/1000
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your story, design philosophy, and what makes your brand unique..."
                      className="min-h-[140px] resize-none border-gray-200 transition-all focus:border-agile-teal focus:ring-agile-teal/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-charcoal">
                    <Globe className="h-4 w-4 text-gray-400" />
                    Website
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://yourbrand.com"
                      className="h-11 border-gray-200 transition-all focus:border-agile-teal focus:ring-agile-teal/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Style Preferences Card */}
        <Card className="overflow-hidden border-gray-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <div className="border-b border-gray-100 bg-gradient-to-r from-rose-50 via-rose-50/50 to-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 shadow-sm">
                <Palette className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  Style Preferences
                </h3>
                <p className="text-sm text-gray-500">
                  Select the styles that define your brand
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {STYLE_FOCUS_OPTIONS.map(({ value, label }) => {
                const isSelected = styleFocus.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleStyleFocus(value)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                      isSelected
                        ? 'border-agile-teal bg-agile-teal text-white shadow-md shadow-agile-teal/25 hover:bg-agile-teal/90'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-agile-teal/50 hover:bg-agile-teal/5 hover:text-agile-teal'
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {styleFocus.length === 0 && (
              <p className="mt-4 text-sm text-gray-400">
                Select at least one style to help suppliers understand your aesthetic
              </p>
            )}
          </div>
        </Card>

        {/* Target Demographics Card */}
        <Card className="overflow-hidden border-gray-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <div className="border-b border-gray-100 bg-gradient-to-r from-amber-50 via-amber-50/50 to-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 shadow-sm">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  Target Demographics
                </h3>
                <p className="text-sm text-gray-500">
                  Define your ideal customer profile
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            {/* Age Groups */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-charcoal">
                Age Groups
              </label>
              <div className="flex flex-wrap gap-2">
                {TARGET_AGE_GROUPS.map(({ value, label }) => {
                  const isSelected = targetDemographics.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleDemographic(value)}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                        isSelected
                          ? 'border-agile-teal bg-agile-teal text-white shadow-md shadow-agile-teal/25 hover:bg-agile-teal/90'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-agile-teal/50 hover:bg-agile-teal/5 hover:text-agile-teal'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-charcoal">
                Gender
              </label>
              <div className="flex flex-wrap gap-2">
                {TARGET_GENDERS.map(({ value, label }) => {
                  const isSelected = targetDemographics.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleDemographic(value)}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                        isSelected
                          ? 'border-agile-teal bg-agile-teal text-white shadow-md shadow-agile-teal/25 hover:bg-agile-teal/90'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-agile-teal/50 hover:bg-agile-teal/5 hover:text-agile-teal'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Points */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-charcoal">
                Price Points
              </label>
              <div className="flex flex-wrap gap-2">
                {TARGET_PRICE_POINTS.map(({ value, label }) => {
                  const isSelected = targetDemographics.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => toggleDemographic(value)}
                      className={cn(
                        'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
                        isSelected
                          ? 'border-agile-teal bg-agile-teal text-white shadow-md shadow-agile-teal/25 hover:bg-agile-teal/90'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-agile-teal/50 hover:bg-agile-teal/5 hover:text-agile-teal'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            size="lg"
            className="gap-2 bg-agile-teal px-10 shadow-lg shadow-agile-teal/25 transition-all hover:bg-agile-teal/90 hover:shadow-xl hover:shadow-agile-teal/30"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
