'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  Loader2,
  Sparkles,
  Briefcase,
  MapPin,
  Award,
  Eye,
  Camera,
  Package,
  Calendar,
  Factory,
  Mail,
  Phone,
  Globe,
  Plus,
  X,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import {
  useUpdateSupplierProfile,
  useUploadSupplierLogo,
} from '@/lib/hooks/use-suppliers';
import { SERVICE_TYPES, CERTIFICATION_TYPES } from '@/types/supplier';

const STEPS = [
  { id: 1, title: 'Welcome', icon: Sparkles },
  { id: 2, title: 'Service', icon: Briefcase },
  { id: 3, title: 'Location', icon: MapPin },
  { id: 4, title: 'Certifications', icon: Award },
  { id: 5, title: 'Review', icon: Eye },
];

const wizardSchema = z.object({
  business_name: z.string().min(2, 'Company name is required'),
  bio: z.string().max(2000).optional(),
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
  certifications: z.array(z.string()).optional(),
});

type WizardFormValues = z.infer<typeof wizardSchema>;

interface SupplierOnboardingWizardProps {
  onComplete: () => void;
}

export function SupplierOnboardingWizard({
  onComplete,
}: SupplierOnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  const updateProfileMutation = useUpdateSupplierProfile();
  const uploadLogoMutation = useUploadSupplierLogo();

  const form = useForm<WizardFormValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      business_name: '',
      bio: '',
      service_type: 'fabric',
      specialties: [],
      minimum_order_quantity: '',
      lead_time_days: '',
      production_capacity: '',
      location_country: '',
      location_city: '',
      contact_email: '',
      contact_phone: '',
      website_url: '',
      certifications: [],
    },
  });

  const specialties = form.watch('specialties') || [];
  const certifications = form.watch('certifications') || [];

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
  });

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      form.setValue('specialties', [...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    form.setValue('specialties', specialties.filter((s) => s !== specialty));
  };

  const toggleCertification = (cert: string) => {
    if (certifications.includes(cert)) {
      form.setValue('certifications', certifications.filter((c) => c !== cert));
    } else {
      form.setValue('certifications', [...certifications, cert]);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return form.watch('business_name')?.length >= 2;
      case 2:
        return !!form.watch('service_type');
      case 3:
        return (
          form.watch('location_country')?.length > 0 &&
          form.watch('contact_email')?.includes('@')
        );
      case 4:
        return true; // Optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (currentStep < 5) {
      setDirection('forward');
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setDirection('back');
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = (data: WizardFormValues) => {
    // Map wizard form data to SupplierProfileFormData
    const location = data.location_city
      ? `${data.location_city}, ${data.location_country}`
      : data.location_country;

    updateProfileMutation.mutate(
      {
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
      },
      {
        onSuccess: () => onComplete(),
      }
    );
  };

  const getServiceLabel = (value: string) => {
    return SERVICE_TYPES.find((s) => s.value === value)?.label || value;
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500',
                    isCompleted
                      ? 'border-agile-teal bg-agile-teal text-white'
                      : isCurrent
                      ? 'border-agile-teal bg-white text-agile-teal'
                      : 'border-gray-200 bg-white text-gray-400'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-0.5 w-12 transition-colors duration-500 sm:w-20',
                      isCompleted ? 'bg-agile-teal' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex justify-between px-1">
          {STEPS.map((step) => (
            <span
              key={step.id}
              className={cn(
                'text-xs font-medium transition-colors',
                currentStep >= step.id ? 'text-charcoal' : 'text-gray-400'
              )}
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Step Content */}
          <div className="relative overflow-hidden">
            <div
              className={cn(
                'transition-all duration-500 ease-out',
                direction === 'forward'
                  ? 'animate-in slide-in-from-right-8 fade-in'
                  : 'animate-in slide-in-from-left-8 fade-in'
              )}
              key={currentStep}
            >
              {/* Step 1: Welcome & Basics */}
              {currentStep === 1 && (
                <Card className="border-gray-100 p-8">
                  <div className="text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-agile-teal to-mint-accent">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-charcoal">
                      Welcome to AgileSourcing
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Let&apos;s set up your supplier profile to start connecting with
                      fashion designers worldwide.
                    </p>
                  </div>

                  <div className="mt-8 space-y-6">
                    {/* Logo Upload */}
                    <div className="flex justify-center">
                      <div
                        {...getRootProps()}
                        className={cn(
                          'relative h-32 w-32 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300',
                          isDragActive
                            ? 'border-agile-teal bg-agile-teal/5 scale-105'
                            : 'border-gray-200 bg-gray-50 hover:border-agile-teal/50'
                        )}
                      >
                        <input {...getInputProps()} />
                        {logoPreview ? (
                          <>
                            <Image
                              src={logoPreview}
                              alt="Logo"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                              <Camera className="h-8 w-8 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center">
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="mt-2 text-xs text-gray-500">
                              Upload logo
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="business_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter your company name"
                              className="h-12 text-center text-lg"
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
                          <FormLabel>Brief Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Tell us about your company in a few sentences..."
                              className="min-h-[100px] resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              )}

              {/* Step 2: Service Type */}
              {currentStep === 2 && (
                <Card className="border-gray-100 p-8">
                  <div className="mb-8 text-center">
                    <h2 className="font-serif text-2xl font-bold text-charcoal">
                      What services do you offer?
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Select your primary service type
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="service_type"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid gap-4 sm:grid-cols-3">
                          {SERVICE_TYPES.map(({ value, label, description }) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => field.onChange(value)}
                              className={cn(
                                'flex flex-col items-center rounded-xl border-2 p-6 text-center transition-all duration-300',
                                field.value === value
                                  ? 'border-agile-teal bg-agile-teal/5 shadow-lg shadow-agile-teal/10'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              )}
                            >
                              <div
                                className={cn(
                                  'mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors',
                                  field.value === value
                                    ? 'bg-agile-teal text-white'
                                    : 'bg-gray-100 text-gray-500'
                                )}
                              >
                                <Briefcase className="h-7 w-7" />
                              </div>
                              <h3 className="font-semibold text-charcoal">
                                {label}
                              </h3>
                              <p className="mt-1 text-xs text-gray-500">
                                {description}
                              </p>
                            </button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional Details */}
                  <div className="mt-8 space-y-4">
                    <Label>Specialties (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        placeholder="e.g., Sustainable fabrics..."
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
                        className="h-11 w-11"
                        onClick={addSpecialty}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {specialties.map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="gap-1 pr-1"
                          >
                            {s}
                            <button
                              type="button"
                              onClick={() => removeSpecialty(s)}
                              className="ml-1 rounded-full p-0.5 hover:bg-gray-300"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="grid gap-4 pt-4 sm:grid-cols-3">
                      <FormField
                        control={form.control}
                        name="minimum_order_quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm">
                              <Package className="h-4 w-4 text-gray-400" />
                              Min. Order Qty
                            </FormLabel>
                            <FormControl>
                              <Input {...field} type="number" placeholder="100" className="h-11" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lead_time_days"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              Lead Time (days)
                            </FormLabel>
                            <FormControl>
                              <Input {...field} type="number" placeholder="14" className="h-11" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="production_capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm">
                              <Factory className="h-4 w-4 text-gray-400" />
                              Capacity
                            </FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="10,000/mo" className="h-11" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 3: Location & Contact */}
              {currentStep === 3 && (
                <Card className="border-gray-100 p-8">
                  <div className="mb-8 text-center">
                    <h2 className="font-serif text-2xl font-bold text-charcoal">
                      Where are you located?
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Help designers find and contact you
                    </p>
                  </div>

                  <div className="space-y-6">
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
                                className="h-12"
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
                                className="h-12"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                      <h3 className="mb-4 font-medium text-charcoal">
                        Contact Information
                      </h3>

                      <div className="grid gap-4 sm:grid-cols-2">
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
                                  className="h-12"
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
                                  className="h-12"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="website_url"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-400" />
                              Website
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="url"
                                placeholder="https://yourwebsite.com"
                                className="h-12"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* Step 4: Certifications */}
              {currentStep === 4 && (
                <Card className="border-gray-100 p-8">
                  <div className="mb-8 text-center">
                    <h2 className="font-serif text-2xl font-bold text-charcoal">
                      Do you have any certifications?
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Select certifications you hold (you can add documents later)
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {CERTIFICATION_TYPES.map(({ value, label, description }) => {
                      const isSelected = certifications.includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleCertification(value)}
                          className={cn(
                            'flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-300',
                            isSelected
                              ? 'border-agile-teal bg-agile-teal/5'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                              isSelected
                                ? 'bg-agile-teal text-white'
                                : 'bg-gray-100 text-gray-500'
                            )}
                          >
                            {isSelected ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <Award className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-charcoal">{label}</h4>
                            <p className="text-xs text-gray-500">{description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {certifications.length === 0 && (
                    <p className="mt-6 text-center text-sm text-gray-500">
                      No certifications? No problem! You can skip this step and add
                      them later.
                    </p>
                  )}
                </Card>
              )}

              {/* Step 5: Review */}
              {currentStep === 5 && (
                <Card className="border-gray-100 p-8">
                  <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-charcoal">
                      Review Your Profile
                    </h2>
                    <p className="mt-2 text-gray-600">
                      Make sure everything looks good before submitting
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Company Info */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                      <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                        Company
                      </h4>
                      <div className="flex items-center gap-4">
                        {logoPreview ? (
                          <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                            <Image
                              src={logoPreview}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-200">
                            <Building2 className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-serif text-xl font-semibold text-charcoal">
                            {form.watch('business_name')}
                          </h3>
                          <Badge variant="secondary" className="mt-1">
                            {getServiceLabel(form.watch('service_type'))}
                          </Badge>
                        </div>
                      </div>
                      {form.watch('bio') && (
                        <p className="mt-3 text-sm text-gray-600">
                          {form.watch('bio')}
                        </p>
                      )}
                    </div>

                    {/* Location & Contact */}
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                      <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                        Location & Contact
                      </h4>
                      <div className="grid gap-2 text-sm sm:grid-cols-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>
                            {form.watch('location_city')
                              ? `${form.watch('location_city')}, `
                              : ''}
                            {form.watch('location_country')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span>{form.watch('contact_email')}</span>
                        </div>
                        {form.watch('contact_phone') && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{form.watch('contact_phone')}</span>
                          </div>
                        )}
                        {form.watch('website_url') && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <span>{form.watch('website_url')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Certifications */}
                    {certifications.length > 0 && (
                      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <h4 className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
                          Certifications
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {certifications.map((cert) => (
                            <Badge key={cert} variant="secondary">
                              {cert.replace('_', '-')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={goBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              {currentStep === 4 && (
                <Button type="button" variant="ghost" onClick={goNext}>
                  Skip for now
                </Button>
              )}

              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceed()}
                  className="gap-2 bg-agile-teal px-6 hover:bg-agile-teal/90"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="gap-2 bg-agile-teal px-8 hover:bg-agile-teal/90"
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Complete Setup
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
