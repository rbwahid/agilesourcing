'use client';

import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { UserFilters, UserRole } from '@/types/admin';

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

const ROLE_OPTIONS: { value: UserRole | 'all'; label: string }[] = [
  { value: 'all', label: 'All Roles' },
  { value: 'designer', label: 'Designer' },
  { value: 'supplier', label: 'Supplier' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
];

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Joined' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'last_login_at', label: 'Last Login' },
];

export function UserFiltersComponent({ filters, onFiltersChange }: UserFiltersProps) {
  const activeFilterCount = [
    filters.search,
    filters.role,
    filters.is_active !== undefined,
  ].filter(Boolean).length;

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value || undefined, page: 1 });
  };

  const handleRoleChange = (value: string) => {
    onFiltersChange({
      ...filters,
      role: value === 'all' ? undefined : (value as UserRole),
      page: 1,
    });
  };

  const handleStatusChange = (value: string) => {
    let isActive: boolean | undefined;
    if (value === 'active') isActive = true;
    else if (value === 'suspended') isActive = false;
    else isActive = undefined;

    onFiltersChange({ ...filters, is_active: isActive, page: 1 });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sort: value as UserFilters['sort'],
    });
  };

  const handleDirectionToggle = () => {
    onFiltersChange({
      ...filters,
      direction: filters.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      page: 1,
      per_page: filters.per_page,
      sort: 'created_at',
      direction: 'desc',
    });
  };

  const getStatusValue = () => {
    if (filters.is_active === true) return 'active';
    if (filters.is_active === false) return 'suspended';
    return 'all';
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={filters.search ?? ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Role Filter */}
        <Select value={filters.role ?? 'all'} onValueChange={handleRoleChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={getStatusValue()} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <Select value={filters.sort ?? 'created_at'} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDirectionToggle}
            className="shrink-0"
          >
            {filters.direction === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-500">Active filters:</span>

          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <button
                onClick={() => handleSearchChange('')}
                className="ml-1 rounded-full p-0.5 hover:bg-gray-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.role && (
            <Badge variant="secondary" className="gap-1">
              Role: {ROLE_OPTIONS.find((r) => r.value === filters.role)?.label}
              <button
                onClick={() => handleRoleChange('all')}
                className="ml-1 rounded-full p-0.5 hover:bg-gray-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.is_active !== undefined && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.is_active ? 'Active' : 'Suspended'}
              <button
                onClick={() => handleStatusChange('all')}
                className="ml-1 rounded-full p-0.5 hover:bg-gray-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
