'use client';

import { use, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import {
  ArrowLeft,
  Lock,
  Upload,
  ImageIcon,
  FileText,
  Loader2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useDesign, useUpdateDesign } from '@/lib/hooks/use-designs';
import {
  DESIGN_CATEGORIES,
  DESIGN_SEASONS,
  DESIGN_STATUSES,
  MAX_FILE_SIZE,
} from '@/types/design';
import type { DesignCategory, DesignSeason, DesignStatus } from '@/types/design';

// Validation schema
const editDesignSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be 255 characters or less'),
  category: z.string().min(1, 'Category is required'),
  season: z.string().optional(),
  target_demographic: z
    .string()
    .max(255, 'Must be 255 characters or less')
    .optional(),
  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or less')
    .optional(),
  status: z.enum(['draft', 'active', 'archived']),
});

type EditDesignFormData = z.infer<typeof editDesignSchema>;

interface DesignEditPageProps {
  params: Promise<{ id: string }>;
}

export default function DesignEditPage({ params }: DesignEditPageProps) {
  const { id } = use(params);
  const designId = parseInt(id, 10);
  const router = useRouter();

  const { data: design, isLoading, isError } = useDesign(designId);
  const { mutate: updateDesign, isPending: isUpdating } = useUpdateDesign(designId);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<EditDesignFormData>({
    resolver: zodResolver(editDesignSchema),
    values: design
      ? {
          title: design.title,
          category: design.category,
          season: design.season || undefined,
          target_demographic: design.target_demographic || undefined,
          description: design.description || undefined,
          status: design.status,
        }
      : undefined,
  });

  const descriptionValue = form.watch('description') || '';
  const statusValue = form.watch('status');

  // File drop handler
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (design?.image_locked) return;

      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    [design?.image_locked]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: design?.image_locked,
  });

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const onSubmit = (data: EditDesignFormData) => {
    updateDesign(
      {
        title: data.title,
        category: data.category as DesignCategory,
        season: (data.season as DesignSeason) || null,
        target_demographic: data.target_demographic || null,
        description: data.description || null,
        status: data.status as DesignStatus,
        design_file: selectedFile || undefined,
      },
      {
        onSuccess: () => {
          router.push(`/designs/${designId}`);
        },
      }
    );
  };

  if (isLoading) {
    return <EditDesignSkeleton />;
  }

  if (isError || !design) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md border-0 bg-white/80 p-8 text-center shadow-xl shadow-gray-200/50 backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="font-serif text-xl font-bold text-charcoal">
            Design Not Found
          </h2>
          <p className="mt-2 text-gray-500">
            The design you&apos;re looking for doesn&apos;t exist or you don&apos;t
            have access to it.
          </p>
          <Link href="/designs">
            <Button className="mt-6 bg-agile-teal hover:bg-agile-teal/90">
              Back to Designs
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const isPdf = design.file_type === 'application/pdf';
  const displayImageUrl = previewUrl || design.file_url;
  const showNewFilePreview = selectedFile && !selectedFile.type.includes('pdf');

  return (
    <div className="min-h-screen pb-12">
      {/* Subtle gradient background */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-agile-teal/5" />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/designs/${design.id}`}
            className="group mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-charcoal"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Design
          </Link>

          <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Edit Design
          </h1>
          <p className="mt-2 text-gray-500">
            Update your design details and metadata
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-8 lg:grid-cols-5">
              {/* Left Column - Image Preview & Upload */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden border-0 bg-white shadow-xl shadow-gray-200/50">
                  {/* Current Image Preview */}
                  <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50">
                    {isPdf && !showNewFilePreview ? (
                      <div className="flex h-full flex-col items-center justify-center p-6">
                        <div className="rounded-2xl bg-white p-6 shadow-lg">
                          <FileText className="h-16 w-16 text-gray-300" />
                        </div>
                        <span className="mt-4 text-sm font-medium text-gray-500">
                          PDF Document
                        </span>
                        <span className="mt-1 max-w-[200px] truncate text-xs text-gray-400">
                          {design.original_filename}
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={displayImageUrl}
                        alt={design.title}
                        fill
                        unoptimized
                        className="object-contain"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                    )}

                    {/* New file badge */}
                    {selectedFile && (
                      <div className="absolute right-3 top-3 flex items-center gap-2">
                        <span className="rounded-full bg-agile-teal px-3 py-1.5 text-xs font-medium text-white shadow-lg">
                          New Image
                        </span>
                        <button
                          type="button"
                          onClick={removeSelectedFile}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-lg backdrop-blur-sm transition-colors hover:bg-white hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Upload Zone or Locked Message */}
                  <div className="border-t border-gray-100 p-4">
                    {design.image_locked ? (
                      // Locked State - Elegant preservation notice
                      <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200/80">
                          <Lock className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Image Preserved
                          </p>
                          <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                            This design has been published. The image is now
                            locked to maintain consistency across the platform.
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Upload Zone
                      <div
                        {...getRootProps()}
                        className={cn(
                          'group relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300',
                          isDragActive
                            ? 'border-agile-teal bg-agile-teal/5'
                            : 'border-gray-200 hover:border-agile-teal/50 hover:bg-gray-50'
                        )}
                      >
                        <input {...getInputProps()} />
                        <div
                          className={cn(
                            'mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300',
                            isDragActive
                              ? 'bg-agile-teal text-white'
                              : 'bg-gray-100 text-gray-400 group-hover:bg-agile-teal/10 group-hover:text-agile-teal'
                          )}
                        >
                          {isDragActive ? (
                            <Upload className="h-6 w-6" />
                          ) : (
                            <ImageIcon className="h-6 w-6" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-charcoal">
                          {isDragActive ? 'Drop to replace' : 'Replace Image'}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Drag & drop or click to browse
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          PNG, JPG, WEBP or PDF up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Right Column - Form Fields */}
              <div className="space-y-6 lg:col-span-3">
                {/* Basic Information */}
                <Card className="border-0 bg-white p-6 shadow-xl shadow-gray-200/50">
                  <h2 className="mb-6 font-serif text-lg font-semibold text-charcoal">
                    Basic Information
                  </h2>

                  <div className="space-y-5">
                    {/* Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-charcoal">
                            Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter design title"
                              className="border-gray-200 transition-all duration-200 focus:border-agile-teal focus:ring-agile-teal/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category & Season Row */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-charcoal">
                              Category
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-gray-200 transition-all duration-200 focus:border-agile-teal focus:ring-agile-teal/20">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DESIGN_CATEGORIES.map((category) => (
                                  <SelectItem
                                    key={category.value}
                                    value={category.value}
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

                      <FormField
                        control={form.control}
                        name="season"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-charcoal">
                              Season
                              <span className="ml-1 text-xs font-normal text-gray-400">
                                (optional)
                              </span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ''}
                            >
                              <FormControl>
                                <SelectTrigger className="border-gray-200 transition-all duration-200 focus:border-agile-teal focus:ring-agile-teal/20">
                                  <SelectValue placeholder="Select season" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {DESIGN_SEASONS.map((season) => (
                                  <SelectItem
                                    key={season.value}
                                    value={season.value}
                                  >
                                    {season.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                          <FormLabel className="text-sm font-medium text-charcoal">
                            Target Demographic
                            <span className="ml-1 text-xs font-normal text-gray-400">
                              (optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ''}
                              placeholder="e.g., Women 25-35, Urban professionals"
                              className="border-gray-200 transition-all duration-200 focus:border-agile-teal focus:ring-agile-teal/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                {/* Description */}
                <Card className="border-0 bg-white p-6 shadow-xl shadow-gray-200/50">
                  <h2 className="mb-6 font-serif text-lg font-semibold text-charcoal">
                    Description
                  </h2>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value || ''}
                            placeholder="Describe your design, materials, inspiration..."
                            rows={6}
                            className="resize-none border-gray-200 transition-all duration-200 focus:border-agile-teal focus:ring-agile-teal/20"
                          />
                        </FormControl>
                        <div className="mt-2 flex justify-end">
                          <span
                            className={cn(
                              'text-xs tabular-nums transition-colors duration-200',
                              descriptionValue.length > 1800
                                ? descriptionValue.length > 2000
                                  ? 'text-red-500'
                                  : 'text-amber-500'
                                : 'text-gray-400'
                            )}
                          >
                            {descriptionValue.length} / 2000
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>

                {/* Status */}
                <Card className="border-0 bg-white p-6 shadow-xl shadow-gray-200/50">
                  <h2 className="mb-6 font-serif text-lg font-semibold text-charcoal">
                    Publication Status
                  </h2>

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-200 transition-all duration-200 focus:border-agile-teal focus:ring-agile-teal/20">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DESIGN_STATUSES.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!design.image_locked && statusValue === 'active' && (
                          <FormDescription className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-amber-700">
                            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                            <span className="text-xs">
                              Setting status to Active will permanently lock the
                              design image. You won&apos;t be able to change it
                              afterward.
                            </span>
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push(`/designs/${designId}`)}
                    disabled={isUpdating}
                    className="text-gray-600 hover:text-charcoal"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="min-w-[140px] bg-agile-teal hover:bg-agile-teal/90"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

function EditDesignSkeleton() {
  return (
    <div className="min-h-screen pb-12">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-agile-teal/5" />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="mb-4 h-5 w-32" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-2 h-5 w-64" />
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-0 bg-white shadow-xl shadow-gray-200/50">
              <Skeleton className="aspect-[3/4] w-full" />
              <div className="border-t border-gray-100 p-4">
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </Card>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-6 lg:col-span-3">
            <Card className="border-0 bg-white p-6 shadow-xl shadow-gray-200/50">
              <Skeleton className="mb-6 h-6 w-40" />
              <div className="space-y-5">
                <Skeleton className="h-10 w-full" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>

            <Card className="border-0 bg-white p-6 shadow-xl shadow-gray-200/50">
              <Skeleton className="mb-6 h-6 w-32" />
              <Skeleton className="h-32 w-full" />
            </Card>

            <Card className="border-0 bg-white p-6 shadow-xl shadow-gray-200/50">
              <Skeleton className="mb-6 h-6 w-44" />
              <Skeleton className="h-10 w-full" />
            </Card>

            <div className="flex justify-end gap-3 pt-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-36" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
