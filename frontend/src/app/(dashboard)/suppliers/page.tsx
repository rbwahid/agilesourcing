'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import {
  SupplierGrid,
  SupplierFilters,
  SupplierCard,
  SupplierCardSkeleton,
} from '@/components/supplier';
import {
  useSuppliers,
  useFeaturedSuppliers,
  useSavedSuppliers,
} from '@/lib/hooks/use-suppliers';
import type { SupplierSearchFilters } from '@/types/supplier';

export default function SuppliersPage() {
  const [filters, setFilters] = useState<SupplierSearchFilters>({});

  const { data, isLoading } = useSuppliers(filters);
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedSuppliers(4);
  const { data: savedData } = useSavedSuppliers();

  const savedSupplierIds = savedData?.map((s) => s.id) || [];
  const showFeatured = !filters.query && !filters.service_type && !filters.certifications?.length;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
            Find Suppliers
          </h1>
          <p className="mt-2 text-gray-600">
            Discover verified manufacturers and fabric suppliers for your fashion brand
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Featured Suppliers */}
        {showFeatured && (
          <div className="mb-10">
            <div className="mb-5 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-agile-teal" />
              <h2 className="font-serif text-xl font-semibold text-charcoal">
                Featured Suppliers
              </h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredLoading
                ? [...Array(4)].map((_, i) => <SupplierCardSkeleton key={i} />)
                : featuredData?.map((supplier) => (
                    <SupplierCard
                      key={supplier.id}
                      supplier={supplier}
                      isSaved={savedSupplierIds.includes(supplier.id)}
                    />
                  ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <SupplierFilters
            filters={filters}
            onChange={setFilters}
            className="w-full lg:w-72"
          />

          {/* Results Grid */}
          <div className="flex-1">
            <SupplierGrid
              data={data}
              isLoading={isLoading}
              filters={filters}
              onFiltersChange={setFilters}
              savedSupplierIds={savedSupplierIds}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
