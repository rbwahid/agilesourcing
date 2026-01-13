'use client';

import { useState, useMemo } from 'react';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SortAsc,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SupplierCard, SupplierCardSkeleton } from './supplier-card';
import type { Supplier, SupplierSearchFilters } from '@/types/supplier';
import { SORT_OPTIONS } from '@/types/supplier';
import type { PaginatedResponse } from '@/types';

interface SupplierGridProps {
  data?: PaginatedResponse<Supplier>;
  isLoading?: boolean;
  filters: SupplierSearchFilters;
  onFiltersChange: (filters: SupplierSearchFilters) => void;
  savedSupplierIds?: number[];
  onSaveChange?: (supplierId: number, saved: boolean) => void;
}

export function SupplierGrid({
  data,
  isLoading,
  filters,
  onFiltersChange,
  savedSupplierIds = [],
  onSaveChange,
}: SupplierGridProps) {
  const suppliers = data?.data || [];
  const meta = data?.meta;

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sort_by: value as SupplierSearchFilters['sort_by'],
    });
  };

  const handlePageChange = (page: number) => {
    onFiltersChange({ ...filters, page });
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    if (!meta) return [];
    const current = meta.current_page;
    const last = meta.last_page;
    const pages: (number | 'ellipsis')[] = [];

    if (last <= 7) {
      return Array.from({ length: last }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (current > 3) {
      pages.push('ellipsis');
    }

    // Show pages around current
    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
      pages.push(i);
    }

    if (current < last - 2) {
      pages.push('ellipsis');
    }

    // Always show last page
    if (last > 1) {
      pages.push(last);
    }

    return pages;
  }, [meta]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
          <div className="h-10 w-40 animate-pulse rounded-lg bg-gray-100" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <SupplierCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!suppliers.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          {/* Decorative circles */}
          <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-agile-teal/5" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-mint-accent/10" />

          {/* Icon */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
            <Building2 className="h-10 w-10 text-gray-300" />
          </div>
        </div>

        <h3 className="mt-6 font-serif text-xl font-semibold text-charcoal">
          No suppliers found
        </h3>
        <p className="mt-2 max-w-sm text-center text-sm text-gray-500">
          Try adjusting your filters or search terms to discover suppliers that match
          your needs.
        </p>

        <Button
          variant="outline"
          className="mt-6 gap-2"
          onClick={() => onFiltersChange({})}
        >
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Results count */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-serif font-bold text-charcoal">
            {meta?.total || suppliers.length}
          </span>
          <span className="text-sm text-gray-500">
            {meta?.total === 1 ? 'supplier' : 'suppliers'} found
          </span>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-gray-400" />
          <Select
            value={filters.sort_by || 'relevance'}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="h-10 w-44 border-gray-200 bg-white text-sm">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value} className="text-sm">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((supplier, index) => (
          <div
            key={supplier.id}
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
          >
            <SupplierCard
              supplier={supplier}
              isSaved={savedSupplierIds.includes(supplier.id)}
              onSaveChange={(saved) => onSaveChange?.(supplier.id, saved)}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex flex-col items-center gap-4 pt-8">
          {/* Page info */}
          <p className="text-sm text-gray-500">
            Showing{' '}
            <span className="font-medium text-charcoal">{meta.from}</span> to{' '}
            <span className="font-medium text-charcoal">{meta.to}</span> of{' '}
            <span className="font-medium text-charcoal">{meta.total}</span> suppliers
          </p>

          {/* Pagination controls */}
          <div className="flex items-center gap-1">
            {/* First page */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-500 hover:text-charcoal disabled:opacity-30"
              disabled={meta.current_page === 1}
              onClick={() => handlePageChange(1)}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            {/* Previous page */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-500 hover:text-charcoal disabled:opacity-30"
              disabled={meta.current_page === 1}
              onClick={() => handlePageChange(meta.current_page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1 px-2">
              {pageNumbers.map((page, index) =>
                page === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-9 w-9 text-sm font-medium',
                      page === meta.current_page
                        ? 'bg-agile-teal text-white hover:bg-agile-teal/90'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-charcoal'
                    )}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            {/* Next page */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-500 hover:text-charcoal disabled:opacity-30"
              disabled={meta.current_page === meta.last_page}
              onClick={() => handlePageChange(meta.current_page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Last page */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-500 hover:text-charcoal disabled:opacity-30"
              disabled={meta.current_page === meta.last_page}
              onClick={() => handlePageChange(meta.last_page)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
