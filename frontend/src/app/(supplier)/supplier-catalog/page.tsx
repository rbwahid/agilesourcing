'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronLeft,
  Package,
  Plus,
  Upload,
  Loader2,
  X,
  ImageIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  CatalogItemCard,
  CatalogItemCardSkeleton,
} from '@/components/supplier';
import {
  useOwnCatalog,
  useAddCatalogItem,
  useDeleteCatalogItem,
} from '@/lib/hooks/use-suppliers';

const catalogItemSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().max(1000).optional(),
  category: z.string().min(1, 'Category is required'),
  price_range_min: z.string().optional(),
  price_range_max: z.string().optional(),
});

type CatalogItemFormValues = z.infer<typeof catalogItemSchema>;

export default function SupplierCatalogPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const { data, isLoading } = useOwnCatalog();
  const addMutation = useAddCatalogItem();
  const deleteMutation = useDeleteCatalogItem();

  const form = useForm<CatalogItemFormValues>({
    resolver: zodResolver(catalogItemSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price_range_min: '',
      price_range_max: '',
    },
  });

  const onDropImages = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...selectedImages, ...acceptedFiles].slice(0, 5);
    setSelectedImages(newFiles);

    // Generate previews
    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  }, [selectedImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropImages,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = (index: number) => {
    const newFiles = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newFiles);
    setImagePreviews(newPreviews);
  };

  const onSubmit = (data: CatalogItemFormValues) => {
    addMutation.mutate(
      {
        ...data,
        images: selectedImages,
        price_range_min: data.price_range_min ? Number(data.price_range_min) : undefined,
        price_range_max: data.price_range_max ? Number(data.price_range_max) : undefined,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
          setSelectedImages([]);
          setImagePreviews([]);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const catalogItems = data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/supplier-dashboard"
            className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-charcoal"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
              <Package className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-charcoal sm:text-3xl">
                Product Catalog
              </h1>
              <p className="text-gray-600">
                Showcase your products and capabilities
              </p>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-agile-teal hover:bg-agile-teal/90">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                Add Catalog Item
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Image Upload */}
                <div>
                  <FormLabel>Product Images</FormLabel>
                  <div className="mt-2 space-y-3">
                    {imagePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="relative h-20 w-20 overflow-hidden rounded-lg"
                          >
                            <Image
                              src={preview}
                              alt=""
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedImages.length < 5 && (
                      <div
                        {...getRootProps()}
                        className={cn(
                          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-all',
                          isDragActive
                            ? 'border-agile-teal bg-agile-teal/5'
                            : 'border-gray-200 bg-gray-50 hover:border-agile-teal/50'
                        )}
                      >
                        <input {...getInputProps()} />
                        <Upload className="h-6 w-6 text-gray-400" />
                        <p className="mt-1 text-xs text-gray-500">
                          Drop images or click (max 5)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Organic Cotton Jersey"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Fabrics, Trims, Finished Goods"
                          className="h-11"
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your product..."
                          className="min-h-[80px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price Range */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="price_range_min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="0.00"
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price_range_max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="0.00"
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-agile-teal hover:bg-agile-teal/90"
                    disabled={addMutation.isPending}
                  >
                    {addMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Product
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Catalog Grid */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <CatalogItemCardSkeleton key={i} />
          ))}
        </div>
      ) : catalogItems.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-gray-100 p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
            <ImageIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="mt-4 font-serif text-xl font-semibold text-charcoal">
            No products yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add products to your catalog to showcase your capabilities to designers.
          </p>
          <Button
            className="mt-6 gap-2 bg-agile-teal hover:bg-agile-teal/90"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Your First Product
          </Button>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {catalogItems.map((item) => (
            <CatalogItemCard
              key={item.id}
              item={item}
              isOwner
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
