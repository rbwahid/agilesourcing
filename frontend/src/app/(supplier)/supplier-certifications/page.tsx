'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronLeft,
  Award,
  Plus,
  Upload,
  Loader2,
  X,
  FileText,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  CertificationUploadCard,
  CertificationUploadCardSkeleton,
} from '@/components/supplier';
import {
  useSupplierCertifications,
  useAddCertification,
} from '@/lib/hooks/use-suppliers';
import { CERTIFICATION_TYPES, type CertificationType } from '@/types/supplier';

const certificationSchema = z.object({
  certification_type: z.string().min(1, 'Please select a certification type'),
  certificate_number: z.string().optional(),
  issued_date: z.string().min(1, 'Issued date is required'),
  expiry_date: z.string().min(1, 'Expiry date is required'),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

export default function SupplierCertificationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data, isLoading } = useSupplierCertifications();
  const addMutation = useAddCertification();

  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      certification_type: '',
      certificate_number: '',
      issued_date: '',
      expiry_date: '',
    },
  });

  const onDropFile = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFile,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const onSubmit = (data: CertificationFormValues) => {
    if (!selectedFile) return;

    addMutation.mutate(
      {
        certification_type: data.certification_type as CertificationType,
        certificate_file: selectedFile,
        issued_date: data.issued_date,
        expiry_date: data.expiry_date,
        certificate_number: data.certificate_number,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
          setSelectedFile(null);
        },
      }
    );
  };

  const certifications = data || [];

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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
              <Award className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-charcoal sm:text-3xl">
                Certifications
              </h1>
              <p className="text-gray-600">
                Manage your sustainability and quality certifications
              </p>
            </div>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-agile-teal hover:bg-agile-teal/90">
              <Plus className="h-4 w-4" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                Add Certification
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* File Upload */}
                <div>
                  <FormLabel>Certificate File *</FormLabel>
                  <div
                    {...getRootProps()}
                    className={cn(
                      'mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all',
                      isDragActive
                        ? 'border-agile-teal bg-agile-teal/5'
                        : 'border-gray-200 bg-gray-50 hover:border-agile-teal/50'
                    )}
                  >
                    <input {...getInputProps()} />
                    {selectedFile ? (
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-agile-teal" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-charcoal">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                          className="rounded-full p-1 hover:bg-gray-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Drop your certificate here or click to browse
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          PDF, PNG, or JPG (max 10MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Certification Type */}
                <FormField
                  control={form.control}
                  name="certification_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certification Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select certification" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CERTIFICATION_TYPES.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Certificate Number */}
                <FormField
                  control={form.control}
                  name="certificate_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., GOTS-123456"
                          className="h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dates */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="issued_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issued Date *</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiry_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date *</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" className="h-11" />
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
                    disabled={!selectedFile || addMutation.isPending}
                  >
                    {addMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Certification
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Certifications List */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <CertificationUploadCardSkeleton key={i} />
          ))}
        </div>
      ) : certifications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-gray-100 p-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
            <Award className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="mt-4 font-serif text-xl font-semibold text-charcoal">
            No certifications yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Add your sustainability and quality certifications to build trust with
            designers.
          </p>
          <Button
            className="mt-6 gap-2 bg-agile-teal hover:bg-agile-teal/90"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Your First Certification
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certifications.map((cert) => (
            <CertificationUploadCard key={cert.id} certification={cert} />
          ))}
        </div>
      )}
    </div>
  );
}
