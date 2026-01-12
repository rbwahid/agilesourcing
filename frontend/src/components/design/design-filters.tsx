'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DESIGN_CATEGORIES, DESIGN_STATUSES } from '@/types/design';
import type { DesignStatus, DesignCategory } from '@/types/design';

interface DesignFiltersProps {
  status?: DesignStatus;
  category?: DesignCategory;
  search?: string;
  onStatusChange: (status: DesignStatus | undefined) => void;
  onCategoryChange: (category: DesignCategory | undefined) => void;
  onSearchChange: (search: string) => void;
}

export function DesignFilters({
  status,
  category,
  search,
  onStatusChange,
  onCategoryChange,
  onSearchChange,
}: DesignFiltersProps) {
  const hasFilters = status || category || search;

  const clearFilters = () => {
    onStatusChange(undefined);
    onCategoryChange(undefined);
    onSearchChange('');
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search designs..."
          value={search || ''}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 border-gray-200 bg-white pl-10 text-sm transition-all duration-200 focus:border-agile-teal focus:ring-agile-teal/20"
        />
      </div>

      {/* Status Filter */}
      <Select
        value={status || 'all'}
        onValueChange={(val) =>
          onStatusChange(val === 'all' ? undefined : (val as DesignStatus))
        }
      >
        <SelectTrigger className="h-10 w-full border-gray-200 bg-white text-sm sm:w-[140px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {DESIGN_STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category Filter */}
      <Select
        value={category || 'all'}
        onValueChange={(val) =>
          onCategoryChange(val === 'all' ? undefined : (val as DesignCategory))
        }
      >
        <SelectTrigger className="h-10 w-full border-gray-200 bg-white text-sm sm:w-[160px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {DESIGN_CATEGORIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-10 gap-2 text-gray-500 hover:text-charcoal"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
