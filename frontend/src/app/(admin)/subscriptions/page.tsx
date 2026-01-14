'use client';

import { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAdminSubscriptions, useAdminStats } from '@/lib/hooks/use-admin';
import {
  SubscriptionsDataTable,
  SubscriptionFilters,
} from '@/components/admin';
import type { SubscriptionFilters as Filters } from '@/types/admin';

function formatMRR(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function SubscriptionsPage() {
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    per_page: 20,
    sort: 'created_at',
    direction: 'desc',
  });

  const { data, isLoading } = useAdminSubscriptions(filters);
  const { data: stats } = useAdminStats();

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      per_page: 20,
      sort: 'created_at',
      direction: 'desc',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Subscription Management</h1>
          <p className="text-sm text-charcoal-light">
            View and manage all platform subscriptions.
            {data?.meta && (
              <span className="ml-1 text-gray-400">({data.meta.total} total)</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="border-gray-100">
            <CardContent className="flex items-center gap-3 py-3 px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Monthly Recurring</p>
                <p className="text-lg font-bold text-charcoal">
                  {stats?.subscriptions.mrr ? formatMRR(stats.subscriptions.mrr) : '$0'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <SubscriptionFilters
            filters={filters}
            onChange={handleFiltersChange}
            onClear={handleClearFilters}
          />
        </div>

        {/* Data Table */}
        <div>
          <SubscriptionsDataTable
            data={data}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
