'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, BarChart3, Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ValidationCard, ValidationEmptyState } from '@/components/validation';
import { useValidations } from '@/lib/hooks/use-validations';
import { useInstagramStatus } from '@/lib/hooks/use-instagram';
import type { ValidationStatus } from '@/types/validation';

const STATUS_OPTIONS: { value: ValidationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Validations' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function ValidationsPage() {
  const [statusFilter, setStatusFilter] = useState<ValidationStatus | 'all'>('all');

  const { data: instagramStatus } = useInstagramStatus();
  const { data, isLoading, isError } = useValidations(
    statusFilter === 'all' ? undefined : { status: statusFilter }
  );

  const validations = data?.data ?? [];
  const hasInstagramConnection = instagramStatus?.connected ?? false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal">
              Validations
            </h1>
            <p className="mt-1 text-gray-500">
              Track your design performance on Instagram
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {STATUS_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={statusFilter === option.value ? 'bg-gray-100' : ''}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* New validation button */}
            {hasInstagramConnection && (
              <Link href="/validations/new">
                <Button className="gap-2 bg-agile-teal hover:bg-agile-teal/90">
                  <Plus className="h-4 w-4" />
                  New Validation
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Failed to load validations</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </div>
        ) : validations.length === 0 ? (
          <ValidationEmptyState hasInstagramConnection={hasInstagramConnection} />
        ) : (
          <>
            {/* Stats bar */}
            <div className="mb-6 flex items-center gap-6 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-agile-teal" />
                <span className="text-sm text-gray-600">
                  <strong className="text-charcoal">{data?.meta?.total ?? 0}</strong> total validations
                </span>
              </div>
              {statusFilter !== 'all' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className="text-gray-500 hover:text-charcoal"
                >
                  Clear filter
                </Button>
              )}
            </div>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {validations.map((validation) => (
                <ValidationCard key={validation.id} validation={validation} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
