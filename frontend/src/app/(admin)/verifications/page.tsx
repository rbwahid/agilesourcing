'use client';

import { useState } from 'react';
import { ShieldCheck, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePendingVerifications, useVerificationTypes } from '@/lib/hooks/use-admin';
import { VerificationQueueTable } from '@/components/admin';
import type { VerificationFilters } from '@/types/admin';

function formatCertificationType(type: string): string {
  const labels: Record<string, string> = {
    gots: 'GOTS',
    oeko_tex: 'OEKO-TEX',
    grs: 'GRS',
    bci: 'BCI',
    fsc: 'FSC',
    iso_9001: 'ISO 9001',
    iso_14001: 'ISO 14001',
    wrap: 'WRAP',
    sa8000: 'SA8000',
    fair_trade: 'Fair Trade',
  };
  return labels[type.toLowerCase()] || type.replace(/_/g, ' ').toUpperCase();
}

export default function VerificationsPage() {
  const [filters, setFilters] = useState<VerificationFilters>({
    status: 'pending',
    page: 1,
    per_page: 20,
    sort: 'created_at',
    direction: 'desc',
  });

  const { data, isLoading } = usePendingVerifications(filters);
  const { data: certTypes } = useVerificationTypes();

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleTypeChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      certification_type: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value as 'pending' | 'all',
      page: 1,
    }));
  };

  const pendingCount = data?.meta?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-bold text-charcoal">Verifications</h1>
            {filters.status === 'pending' && pendingCount > 0 && (
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                {pendingCount} pending
              </Badge>
            )}
          </div>
          <p className="text-sm text-charcoal-light">
            Review and approve supplier certification requests.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-agile-teal/10">
          <ShieldCheck className="h-5 w-5 text-agile-teal" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Filter:</span>
        </div>

        {/* Status Filter */}
        <Select value={filters.status ?? 'pending'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending Only</SelectItem>
            <SelectItem value="all">All Verifications</SelectItem>
          </SelectContent>
        </Select>

        {/* Certification Type Filter */}
        <Select
          value={filters.certification_type ?? 'all'}
          onValueChange={handleTypeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Certification Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {certTypes?.map((type) => (
              <SelectItem key={type} value={type}>
                {formatCertificationType(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {(filters.certification_type || filters.status !== 'pending') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setFilters({
                status: 'pending',
                page: 1,
                per_page: 20,
                sort: 'created_at',
                direction: 'desc',
              })
            }
            className="text-gray-500 hover:text-gray-700"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Data Table */}
      <VerificationQueueTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
