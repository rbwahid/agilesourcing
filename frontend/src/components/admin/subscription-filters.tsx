'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import type { SubscriptionFilters as Filters, StripeSubscriptionStatus, BillingPeriod } from '@/types/admin';

interface SubscriptionFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClear: () => void;
}

const STATUS_OPTIONS: { value: StripeSubscriptionStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'trialing', label: 'Trial' },
  { value: 'past_due', label: 'Past Due' },
  { value: 'canceled', label: 'Cancelled' },
  { value: 'unpaid', label: 'Unpaid' },
];

const BILLING_PERIOD_OPTIONS: { value: BillingPeriod; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual' },
];

const PLAN_OPTIONS = [
  { value: 'designer-basic', label: 'Designer Basic' },
  { value: 'designer-pro', label: 'Designer Pro' },
  { value: 'supplier-basic', label: 'Supplier Basic' },
  { value: 'supplier-premium', label: 'Supplier Premium' },
];

export function SubscriptionFilters({ filters, onChange, onClear }: SubscriptionFiltersProps) {
  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value !== undefined && value !== '' && key !== 'page' && key !== 'per_page'
  ).length;

  return (
    <Card className="border-gray-100">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-500">Filters</CardTitle>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-auto px-2 py-1 text-xs text-gray-500 hover:text-charcoal"
            >
              <X className="mr-1 h-3 w-3" />
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm text-gray-600">
            Search
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              placeholder="Search by name or email..."
              value={filters.search || ''}
              onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
              className="pl-9"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Status</Label>
          <Select
            value={filters.status || ''}
            onValueChange={(value) =>
              onChange({
                ...filters,
                status: value as StripeSubscriptionStatus || undefined,
                page: 1,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Plan */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Plan</Label>
          <Select
            value={filters.plan || ''}
            onValueChange={(value) =>
              onChange({ ...filters, plan: value || undefined, page: 1 })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All plans" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All plans</SelectItem>
              {PLAN_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Billing Period */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Billing Period</Label>
          <Select
            value={filters.billing_period || ''}
            onValueChange={(value) =>
              onChange({
                ...filters,
                billing_period: value as BillingPeriod || undefined,
                page: 1,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All periods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All periods</SelectItem>
              {BILLING_PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
