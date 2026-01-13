'use client';

import Link from 'next/link';
import { Heart, ChevronLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupplierCard, SupplierCardSkeleton } from '@/components/supplier';
import { useSavedSuppliers } from '@/lib/hooks/use-suppliers';

export default function SavedSuppliersPage() {
  const { data, isLoading } = useSavedSuppliers();

  const savedSuppliers = data || [];
  const savedSupplierIds = savedSuppliers.map((s) => s.id);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/suppliers"
            className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-charcoal"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Suppliers
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100">
              <Heart className="h-6 w-6 fill-rose-500 text-rose-500" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal">
                Saved Suppliers
              </h1>
              <p className="text-gray-600">
                Your collection of favorite suppliers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SupplierCardSkeleton key={i} />
            ))}
          </div>
        ) : savedSuppliers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-rose-100/50" />
              <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-rose-50" />

              {/* Icon */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 shadow-inner">
                <Heart className="h-10 w-10 text-rose-300" />
              </div>
            </div>

            <h3 className="mt-6 font-serif text-xl font-semibold text-charcoal">
              No saved suppliers yet
            </h3>
            <p className="mt-2 max-w-sm text-center text-sm text-gray-500">
              When you find suppliers you like, click the heart icon to save them
              here for easy access.
            </p>

            <Button asChild className="mt-6 gap-2 bg-agile-teal hover:bg-agile-teal/90">
              <Link href="/suppliers">
                <Search className="h-4 w-4" />
                Browse Suppliers
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-bold text-charcoal">
                {savedSuppliers.length}
              </span>
              <span className="text-sm text-gray-500">
                {savedSuppliers.length === 1 ? 'supplier' : 'suppliers'} saved
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {savedSuppliers.map((supplier, index) => (
                <div
                  key={supplier.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards',
                  }}
                >
                  <SupplierCard
                    supplier={supplier}
                    isSaved={savedSupplierIds.includes(supplier.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
