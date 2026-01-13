'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Building2,
  Scissors,
  Factory,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type {
  SupplierSearchFilters,
  ServiceType,
  CertificationType,
} from '@/types/supplier';
import {
  SERVICE_TYPES,
  CERTIFICATION_TYPES,
  getCertificationColor,
} from '@/types/supplier';

interface SupplierFiltersProps {
  filters: SupplierSearchFilters;
  onChange: (filters: SupplierSearchFilters) => void;
  className?: string;
}

const serviceTypeIcons: Record<ServiceType, typeof Building2> = {
  fabric: Building2,
  cmt: Scissors,
  full_production: Factory,
};

const certificationBadgeStyles: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white',
  blue: 'bg-blue-100 text-blue-700 border-blue-200 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white',
  amber: 'bg-amber-100 text-amber-700 border-amber-200 data-[state=checked]:bg-amber-500 data-[state=checked]:text-white',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white',
  green: 'bg-green-100 text-green-700 border-green-200 data-[state=checked]:bg-green-500 data-[state=checked]:text-white',
  purple: 'bg-purple-100 text-purple-700 border-purple-200 data-[state=checked]:bg-purple-500 data-[state=checked]:text-white',
  rose: 'bg-rose-100 text-rose-700 border-rose-200 data-[state=checked]:bg-rose-500 data-[state=checked]:text-white',
  cyan: 'bg-cyan-100 text-cyan-700 border-cyan-200 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-white',
};

function FilterContent({
  filters,
  onChange,
  onClearAll,
  activeCount,
}: {
  filters: SupplierSearchFilters;
  onChange: (filters: SupplierSearchFilters) => void;
  onClearAll: () => void;
  activeCount: number;
}) {
  const [serviceTypeOpen, setServiceTypeOpen] = useState(true);
  const [certificationsOpen, setCertificationsOpen] = useState(true);
  const [moqOpen, setMoqOpen] = useState(false);

  const handleServiceTypeChange = (type: ServiceType) => {
    onChange({
      ...filters,
      service_type: filters.service_type === type ? undefined : type,
    });
  };

  const handleCertificationChange = (cert: CertificationType, checked: boolean) => {
    const currentCerts = filters.certifications || [];
    const newCerts = checked
      ? [...currentCerts, cert]
      : currentCerts.filter((c) => c !== cert);
    onChange({
      ...filters,
      certifications: newCerts.length > 0 ? newCerts : undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Clear */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-charcoal">Filters</span>
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-agile-teal/10 text-agile-teal hover:bg-agile-teal/20"
            >
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-auto p-0 text-xs text-gray-500 hover:text-charcoal"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search suppliers..."
          value={filters.query || ''}
          onChange={(e) => onChange({ ...filters, query: e.target.value || undefined })}
          className="h-10 border-gray-200 bg-gray-50/50 pl-10 text-sm placeholder:text-gray-400 focus:border-agile-teal focus:bg-white focus:ring-agile-teal/20"
        />
        {filters.query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
            onClick={() => onChange({ ...filters, query: undefined })}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Service Type */}
      <Collapsible open={serviceTypeOpen} onOpenChange={setServiceTypeOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="text-sm font-medium text-charcoal">Service Type</span>
          {serviceTypeOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="space-y-2">
            {SERVICE_TYPES.map(({ value, label, description }) => {
              const Icon = serviceTypeIcons[value];
              const isSelected = filters.service_type === value;
              return (
                <button
                  key={value}
                  onClick={() => handleServiceTypeChange(value)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all duration-200',
                    isSelected
                      ? 'border-agile-teal bg-agile-teal/5 ring-1 ring-agile-teal/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                      isSelected ? 'bg-agile-teal text-white' : 'bg-gray-100 text-gray-500'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isSelected ? 'text-agile-teal' : 'text-charcoal'
                      )}
                    >
                      {label}
                    </p>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Certifications */}
      <Collapsible open={certificationsOpen} onOpenChange={setCertificationsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="text-sm font-medium text-charcoal">Certifications</span>
          {certificationsOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {CERTIFICATION_TYPES.map(({ value, label }) => {
              const color = getCertificationColor(value);
              const isChecked = filters.certifications?.includes(value) || false;
              return (
                <button
                  key={value}
                  onClick={() => handleCertificationChange(value, !isChecked)}
                  data-state={isChecked ? 'checked' : 'unchecked'}
                  className={cn(
                    'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200',
                    certificationBadgeStyles[color],
                    !isChecked && 'hover:opacity-80'
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Location */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-charcoal">Location</Label>
        <Input
          placeholder="City or country..."
          value={filters.location || ''}
          onChange={(e) =>
            onChange({ ...filters, location: e.target.value || undefined })
          }
          className="h-10 border-gray-200 bg-gray-50/50 text-sm placeholder:text-gray-400 focus:border-agile-teal focus:bg-white focus:ring-agile-teal/20"
        />
      </div>

      {/* MOQ Range */}
      <Collapsible open={moqOpen} onOpenChange={setMoqOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
          <span className="text-sm font-medium text-charcoal">Order Quantity</span>
          {moqOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Min"
                value={filters.min_moq || ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    min_moq: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="h-9 border-gray-200 bg-gray-50/50 text-sm placeholder:text-gray-400"
              />
            </div>
            <span className="text-gray-400">—</span>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Max"
                value={filters.max_moq || ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    max_moq: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                className="h-9 border-gray-200 bg-gray-50/50 text-sm placeholder:text-gray-400"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Verified Only */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gradient-to-r from-amber-50/50 to-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-md shadow-amber-200/50">
            <BadgeCheck className="h-4 w-4" />
          </div>
          <div>
            <Label
              htmlFor="verified-toggle"
              className="text-sm font-medium text-charcoal"
            >
              Verified Only
            </Label>
            <p className="text-xs text-gray-500">Show verified suppliers</p>
          </div>
        </div>
        <Switch
          id="verified-toggle"
          checked={filters.is_verified === true}
          onCheckedChange={(checked) =>
            onChange({ ...filters, is_verified: checked ? true : undefined })
          }
          className="data-[state=checked]:bg-agile-teal"
        />
      </div>
    </div>
  );
}

export function SupplierFilters({ filters, onChange, className }: SupplierFiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Count active filters
  const activeCount = [
    filters.query,
    filters.service_type,
    filters.certifications?.length,
    filters.location,
    filters.min_moq,
    filters.max_moq,
    filters.is_verified,
  ].filter(Boolean).length;

  const handleClearAll = () => {
    onChange({});
  };

  return (
    <>
      {/* Desktop Filters */}
      <aside className={cn('hidden lg:block', className)}>
        <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <FilterContent
            filters={filters}
            onChange={onChange}
            onClearAll={handleClearAll}
            activeCount={activeCount}
          />
        </div>
      </aside>

      {/* Mobile Filters */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 gap-2 rounded-full border-gray-200 bg-white px-5 shadow-lg lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 bg-agile-teal text-white"
              >
                {activeCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
          <SheetHeader className="pb-4">
            <SheetTitle className="font-serif text-xl">Filter Suppliers</SheetTitle>
          </SheetHeader>
          <div className="h-full overflow-y-auto pb-20">
            <FilterContent
              filters={filters}
              onChange={onChange}
              onClearAll={handleClearAll}
              activeCount={activeCount}
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
            <Button
              className="w-full bg-agile-teal hover:bg-agile-teal/90"
              onClick={() => setIsMobileOpen(false)}
            >
              Show Results
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
