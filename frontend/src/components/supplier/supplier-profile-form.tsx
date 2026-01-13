'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import {
  Building2,
  Upload,
  X,
  Plus,
  Loader2,
  Camera,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  Globe,
  Package,
  Calendar,
  Factory,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  useUpdateSupplierProfile,
  useUploadSupplierLogo,
} from '@/lib/hooks/use-suppliers';
import type { Supplier } from '@/types/supplier';
import { SERVICE_TYPES } from '@/types/supplier';

const profileSchema = z.object({
  business_name: z.string().min(2, 'Company name must be at least 2 characters'),
  bio: z.string().max(2000, 'Bio must be less than 2000 characters').optional(),
  service_type: z.enum(['fabric', 'cmt', 'full_production']),
  specialties: z.array(z.string()).optional(),
  minimum_order_quantity: z.string().optional(),
  lead_time_days: z.string().optional(),
  production_capacity: z.string().optional(),
  location_country: z.string().min(1, 'Country is required'),
  location_city: z.string().optional(),
  contact_email: z.string().email('Please enter a valid email'),
  contact_phone: z.string().optional(),
  website_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface SupplierProfileFormProps {
  initialData?: Supplier;
}

export function SupplierProfileForm({ initialData }: SupplierProfileFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(
    initialData?.logo_url || null
  );
  const [newSpecialty, setNewSpecialty] = useState('');

  const updateProfileMutation = useUpdateSupplierProfile();
  const uploadLogoMutation = useUploadSupplierLogo();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      business_name: initialData?.company_name || '',
      bio: initialData?.description || '',
      service_type: initialData?.service_type || 'fabric',
      specialties: initialData?.specialties || [],
      minimum_order_quantity: initialData?.minimum_order_quantity?.toString() || '',
      lead_time_days: initialData?.lead_time_days?.toString() || '',
      production_capacity: initialData?.production_capacity?.toString() || '',
      location_country: initialData?.location?.split(', ').pop() || '',
      location_city: initialData?.location?.split(', ').slice(0, -1).join(', ') || '',
      contact_email: initialData?.phone ? '' : '',
      contact_phone: initialData?.phone || '',
      website_url: initialData?.website_url || '',
    },
  });

  const bioLength = form.watch('bio')?.length || 0;
  const specialties = form.watch('specialties') || [];

  const onDropLogo = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setLogoPreview(preview);
        uploadLogoMutation.mutate(file);
      }
    },
    [uploadLogoMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropLogo,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      form.setValue('specialties', [...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    form.setValue(
      'specialties',
      specialties.filter((s) => s !== specialty)
    );
  };

  const onSubmit = (data: ProfileFormValues) => {
    // Map form data to SupplierProfileFormData
    const location = data.location_city
      ? `${data.location_city}, ${data.location_country}`
      : data.location_country;

    updateProfileMutation.mutate({
      business_name: data.business_name,
      bio: data.bio,
      service_type: data.service_type,
      specialties: data.specialties,
      location,
      website_url: data.website_url || undefined,
      phone: data.contact_phone || undefined,
      minimum_order_quantity: data.minimum_order_quantity
        ? parseInt(data.minimum_order_quantity, 10)
        : undefined,
      lead_time_days: data.lead_time_days
        ? parseInt(data.lead_time_days, 10)
        : undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Info Section */}
        <Card className="overflow-hidden border-gray-100">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-agile-teal/10">
                <Building2 className="h-5 w-5 text-agile-teal" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  Company Information
                </h3>
                <p className="text-sm text-gray-500">
                  Basic details about your company
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Logo Upload */}
            <div className="flex items-start gap-6">
              <div
                {...getRootProps()}
                className={cn(
                  'relative h-28 w-28 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300',
                  isDragActive
                    ? 'border-agile-teal bg-agile-teal/5 scale-105'
                    : 'border-gray-200 bg-gray-50 hover:border-agile-teal/50 hover:bg-gray-100'
                )}
              >
                <input {...getInputProps()} />
                {logoPreview ? (
                  <>
                    <Image
                      src={logoPreview}
                      alt="Company logo"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center">
                    <Upload
                      className={cn(
                        'h-6 w-6 transition-colors',
                        isDragActive ? 'text-agile-teal' : 'text-gray-400'
                      )}
                    />
                    <span className="mt-1 text-[10px] text-gray-500">
                      Upload logo
                    </span>
                  </div>
                )}
                {uploadLogoMutation.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <Loader2 className="h-6 w-6 animate-spin text-agile-teal" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Your company name"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Business Bio</FormLabel>
                    <span
                      className={cn(
                        'text-xs',
                        bioLength > 1800 ? 'text-amber-600' : 'text-gray-400'
                      )}
                    >
                      {bioLength}/2000
                    </span>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell designers about your company, capabilities, and what makes you unique..."
                      className="min-h-[120px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Service Details Section */}
        <Card className="overflow-hidden border-gray-100">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                <Briefcase className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  Service Details
                </h3>
                <p className="text-sm text-gray-500">
                  What services you offer and your capabilities
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Service Type */}
            <FormField
              control={form.control}
              name="service_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your primary service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_TYPES.map(({ value, label, description }) => (
                        <SelectItem key={value} value={value}>
                          <div>
                            <p className="font-medium">{label}</p>
                            <p className="text-xs text-gray-500">{description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Specialties */}
            <div className="space-y-2">
              <Label>Specialties</Label>
              <div className="flex gap-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="e.g., Sustainable fabrics, Denim..."
                  className="h-11"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSpecialty();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 flex-shrink-0"
                  onClick={addSpecialty}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="secondary"
                      className="gap-1 bg-gray-100 pr-1 text-gray-700 hover:bg-gray-100"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(specialty)}
                        className="ml-1 rounded-full p-0.5 hover:bg-gray-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* MOQ, Lead Time, Capacity */}
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="minimum_order_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      Min. Order Qty
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="e.g., 100"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lead_time_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      Lead Time (days)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="e.g., 14"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="production_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Factory className="h-4 w-4 text-gray-400" />
                      Capacity
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., 10,000/month"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Card>

        {/* Location & Contact Section */}
        <Card className="overflow-hidden border-gray-100">
          <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  Location & Contact
                </h3>
                <p className="text-sm text-gray-500">
                  How designers can reach you
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Location */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="location_country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Bangladesh"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Dhaka"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact */}
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="contact_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      Email *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="contact@company.com"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      Phone
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="+880 1234 567890"
                        className="h-11"
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
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      Website
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://yourwebsite.com"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="gap-2 bg-agile-teal px-8 hover:bg-agile-teal/90"
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
