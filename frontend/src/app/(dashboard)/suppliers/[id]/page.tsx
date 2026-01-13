'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Package, Award, FileText, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import {
  SupplierProfileHeader,
  CertificationBadge,
  CatalogItemCard,
  CatalogItemCardSkeleton,
} from '@/components/supplier';
import {
  useSupplier,
  useSupplierCatalog,
  useSupplierSavedCheck,
} from '@/lib/hooks/use-suppliers';

export default function SupplierProfilePage() {
  const params = useParams();
  const supplierId = Number(params.id);

  const { data: supplier, isLoading, error } = useSupplier(supplierId);
  const { data: catalog, isLoading: catalogLoading } = useSupplierCatalog(supplierId);
  const { data: savedCheck } = useSupplierSavedCheck(supplierId);

  const [isSaved, setIsSaved] = useState(savedCheck?.is_saved || false);

  if (isLoading) {
    return <SupplierProfileSkeleton />;
  }

  if (error || !supplier) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="font-serif text-2xl font-bold text-charcoal">
          Supplier Not Found
        </h2>
        <p className="mt-2 text-gray-500">
          The supplier you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild className="mt-6">
          <Link href="/suppliers">Browse Suppliers</Link>
        </Button>
      </div>
    );
  }

  const certifications = supplier.certification_types || [];
  const catalogItems = catalog || [];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Back Button */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/suppliers"
            className="inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-charcoal"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Suppliers
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <SupplierProfileHeader
        supplier={supplier}
        isSaved={isSaved}
        onSaveChange={setIsSaved}
      />

      {/* Tabs Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="border-b border-gray-200 bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 data-[state=active]:border-agile-teal data-[state=active]:bg-transparent data-[state=active]:text-agile-teal"
            >
              <FileText className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="catalog"
              className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 data-[state=active]:border-agile-teal data-[state=active]:bg-transparent data-[state=active]:text-agile-teal"
            >
              <Package className="mr-2 h-4 w-4" />
              Catalog ({catalogItems.length})
            </TabsTrigger>
            <TabsTrigger
              value="certifications"
              className="rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 data-[state=active]:border-agile-teal data-[state=active]:bg-transparent data-[state=active]:text-agile-teal"
            >
              <Award className="mr-2 h-4 w-4" />
              Certifications ({certifications.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Description */}
            {supplier.description && (
              <Card className="border-gray-100 p-6">
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  About {supplier.company_name}
                </h3>
                <p className="mt-3 whitespace-pre-wrap leading-relaxed text-gray-600">
                  {supplier.description}
                </p>
              </Card>
            )}

            {/* Specialties */}
            {supplier.specialties && supplier.specialties.length > 0 && (
              <Card className="border-gray-100 p-6">
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  Specialties
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {supplier.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Production Details */}
            <Card className="border-gray-100 p-6">
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                Production Details
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {supplier.production_capacity && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Production Capacity
                    </p>
                    <p className="mt-1 text-charcoal">{supplier.production_capacity}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Minimum Order Quantity
                  </p>
                  <p className="mt-1 text-charcoal">
                    {supplier.minimum_order_quantity
                      ? `${supplier.minimum_order_quantity.toLocaleString()} units`
                      : 'Contact for details'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Lead Time
                  </p>
                  <p className="mt-1 text-charcoal">
                    {supplier.lead_time_days
                      ? `${supplier.lead_time_days} days`
                      : 'Contact for details'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Certifications Preview */}
            {certifications.length > 0 && (
              <Card className="border-gray-100 p-6">
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  Certifications
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {certifications.map((cert: string) => (
                    <span
                      key={cert}
                      className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
                    >
                      <Award className="mr-1.5 h-3.5 w-3.5" />
                      {cert.replace('_', '-')}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Catalog Tab */}
          <TabsContent value="catalog">
            {catalogLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <CatalogItemCardSkeleton key={i} />
                ))}
              </div>
            ) : catalogItems.length === 0 ? (
              <Card className="flex flex-col items-center justify-center border-gray-100 p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal">
                  No Catalog Items
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This supplier hasn't added any products to their catalog yet.
                </p>
              </Card>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {catalogItems.map((item) => (
                  <CatalogItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications">
            {certifications.length === 0 ? (
              <Card className="flex flex-col items-center justify-center border-gray-100 p-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <Award className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal">
                  No Certifications
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This supplier hasn't added any certifications yet.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {supplier.certifications?.map((cert) => (
                  <Card key={cert.id} className="border-gray-100 p-5">
                    <CertificationBadge certification={cert} variant="detailed" />
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SupplierProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header Skeleton */}
      <div className="h-80 animate-pulse bg-gray-200" />

      {/* Content Skeleton */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-12 w-64 animate-pulse rounded bg-gray-100" />
        <div className="mt-6 space-y-4">
          <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-48 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
