'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DesignDropzone } from './design-dropzone';
import { useCreateDesign } from '@/lib/hooks/use-designs';
import {
  DESIGN_CATEGORIES,
  DESIGN_SEASONS,
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
} from '@/types/design';
import type { DesignCategory, DesignSeason } from '@/types/design';

const MAX_DESCRIPTION_LENGTH = 2000;

const designUploadSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .max(MAX_DESCRIPTION_LENGTH, `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`)
    .optional(),
  category: z
    .enum(DESIGN_CATEGORIES.map((c) => c.value) as [string, ...string[]])
    .describe('Please select a category'),
  season: z
    .enum(DESIGN_SEASONS.map((s) => s.value) as [string, ...string[]])
    .optional(),
  target_demographic: z.string().max(255).optional(),
  design_file: z
    .instanceof(File, { message: 'Please upload a design file' })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'File size must be less than 10MB'
    )
    .refine(
      (file) => Object.keys(ACCEPTED_FILE_TYPES).includes(file.type),
      'File must be JPG, PNG, or PDF'
    ),
});

type DesignUploadFormData = z.infer<typeof designUploadSchema>;

export function DesignUploadForm() {
  const [submitType, setSubmitType] = useState<'draft' | 'active'>('draft');
  const createDesign = useCreateDesign();

  const form = useForm<DesignUploadFormData>({
    resolver: zodResolver(designUploadSchema),
    defaultValues: {
      title: '',
      description: '',
      category: undefined,
      season: undefined,
      target_demographic: '',
    },
  });

  const descriptionLength = form.watch('description')?.length || 0;

  const onSubmit = (data: DesignUploadFormData) => {
    createDesign.mutate({
      ...data,
      category: data.category as DesignCategory,
      season: data.season as DesignSeason | undefined,
      status: submitType,
    });
  };

  const handleDraftSubmit = () => {
    setSubmitType('draft');
    form.handleSubmit(onSubmit)();
  };

  const handlePublishSubmit = () => {
    setSubmitType('active');
    form.handleSubmit(onSubmit)();
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        {/* Upload Section */}
        <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-agile-teal/5 to-mint-accent/5 pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-agile-teal/10">
                <Sparkles className="h-5 w-5 text-agile-teal" />
              </div>
              Upload Design File
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <FormField
              control={form.control}
              name="design_file"
              render={({ field: { onChange, value }, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <DesignDropzone
                      value={value as File | undefined}
                      onChange={onChange}
                      error={fieldState.error?.message}
                      disabled={createDesign.isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Details Section */}
        <Card className="overflow-hidden border-0 shadow-lg shadow-gray-200/50">
          <CardHeader className="border-b bg-gradient-to-r from-agile-teal/5 to-mint-accent/5 pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-agile-teal/10">
                <svg
                  className="h-5 w-5 text-agile-teal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              Design Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-charcoal">
                      Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Summer Floral Maxi Dress"
                        className="h-12 border-gray-200 bg-white text-base transition-all duration-200 focus:border-agile-teal focus:ring-agile-teal/20"
                        disabled={createDesign.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-charcoal">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your design, inspiration, materials, or any special details..."
                        className="min-h-[120px] resize-none border-gray-200 bg-white text-base transition-all duration-200 focus:border-agile-teal focus:ring-agile-teal/20"
                        disabled={createDesign.isPending}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <FormMessage />
                      <span
                        className={`text-xs ${
                          descriptionLength > MAX_DESCRIPTION_LENGTH
                            ? 'text-red-500'
                            : 'text-gray-400'
                        }`}
                      >
                        {descriptionLength} / {MAX_DESCRIPTION_LENGTH}
                      </span>
                    </div>
                  </FormItem>
                )}
              />

              {/* Category & Season Row */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-charcoal">
                        Category <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={createDesign.isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 bg-white text-base transition-all duration-200 focus:border-agile-teal focus:ring-agile-teal/20">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DESIGN_CATEGORIES.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                              className="text-base"
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Season */}
                <FormField
                  control={form.control}
                  name="season"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-charcoal">
                        Season
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={createDesign.isPending}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-200 bg-white text-base transition-all duration-200 focus:border-agile-teal focus:ring-agile-teal/20">
                            <SelectValue placeholder="Select season (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DESIGN_SEASONS.map((season) => (
                            <SelectItem
                              key={season.value}
                              value={season.value}
                              className="text-base"
                            >
                              {season.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-xs">
                        Optional - helps with trend analysis
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Target Demographic */}
              <FormField
                control={form.control}
                name="target_demographic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-charcoal">
                      Target Demographic
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Women 25-35, Urban professionals"
                        className="h-12 border-gray-200 bg-white text-base transition-all duration-200 focus:border-agile-teal focus:ring-agile-teal/20"
                        disabled={createDesign.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Optional - describe your intended audience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleDraftSubmit}
            disabled={createDesign.isPending}
            className="h-12 gap-2 border-gray-200 px-6 text-base font-medium transition-all duration-200 hover:border-agile-teal hover:bg-agile-teal/5"
          >
            {createDesign.isPending && submitType === 'draft' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save as Draft
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={handlePublishSubmit}
            disabled={createDesign.isPending}
            className="h-12 gap-2 bg-agile-teal px-8 text-base font-semibold text-white shadow-lg shadow-agile-teal/25 transition-all duration-200 hover:bg-agile-teal/90 hover:shadow-xl hover:shadow-agile-teal/30"
          >
            {createDesign.isPending && submitType === 'active' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Publish Design
          </Button>
        </div>
      </form>
    </Form>
  );
}
