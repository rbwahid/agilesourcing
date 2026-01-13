'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  MapPin,
  Clock,
  Package,
  Calendar,
  Heart,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSaveSupplier, useUnsaveSupplier } from '@/lib/hooks/use-suppliers';
import type { Supplier, CertificationType } from '@/types/supplier';
import {
  formatMOQ,
  formatLeadTime,
  getCertificationColor,
} from '@/types/supplier';

interface SupplierCardProps {
  supplier: Supplier;
  isSaved?: boolean;
  onSaveChange?: (saved: boolean) => void;
}

const serviceTypeStyles: Record<string, { bg: string; text: string; border: string }> = {
  fabric: {
    bg: 'bg-agile-teal/10',
    text: 'text-agile-teal',
    border: 'border-agile-teal/20',
  },
  cmt: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
  },
  full_production: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
};

const certificationStyles: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  gray: 'bg-gray-50 text-gray-700 border-gray-200',
};

export function SupplierCard({ supplier, isSaved = false, onSaveChange }: SupplierCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [localSaved, setLocalSaved] = useState(isSaved);
  const [isAnimating, setIsAnimating] = useState(false);

  const saveMutation = useSaveSupplier();
  const unsaveMutation = useUnsaveSupplier();

  const serviceStyle = serviceTypeStyles[supplier.service_type] || serviceTypeStyles.fabric;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (localSaved) {
      unsaveMutation.mutate(supplier.id, {
        onSuccess: () => {
          setLocalSaved(false);
          onSaveChange?.(false);
        },
      });
    } else {
      saveMutation.mutate(supplier.id, {
        onSuccess: () => {
          setLocalSaved(true);
          onSaveChange?.(true);
        },
      });
    }
  };

  const displayedCertifications = supplier.certification_types?.slice(0, 3) || [];
  const remainingCerts = (supplier.certification_types?.length || 0) - 3;

  return (
    <Link href={`/suppliers/${supplier.id}`}>
      <Card
        className={cn(
          'group relative overflow-hidden border border-gray-100 bg-white',
          'transition-all duration-300 ease-out',
          'hover:border-gray-200 hover:shadow-xl hover:shadow-gray-200/40',
          'hover:-translate-y-1',
          'cursor-pointer'
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Verified Badge - Top Right Corner */}
        {supplier.is_verified && (
          <div className="absolute right-3 top-3 z-10">
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg shadow-amber-200/50">
              <BadgeCheck className="h-3 w-3" />
              Verified
            </div>
          </div>
        )}

        {/* Featured Badge */}
        {supplier.is_featured && (
          <div className="absolute left-3 top-3 z-10">
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-agile-teal to-mint-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg shadow-agile-teal/30">
              <Sparkles className="h-3 w-3" />
              Featured
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'absolute right-3 z-20 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm',
            'opacity-0 transition-all duration-200 group-hover:opacity-100',
            'hover:bg-white hover:scale-110',
            supplier.is_verified ? 'top-12' : 'top-3',
            isAnimating && 'scale-125'
          )}
          onClick={handleSaveClick}
          disabled={saveMutation.isPending || unsaveMutation.isPending}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-all duration-200',
              localSaved
                ? 'fill-rose-500 text-rose-500'
                : 'text-gray-400 group-hover:text-rose-400'
            )}
          />
        </Button>

        <div className="p-5">
          {/* Header: Logo + Company Info */}
          <div className="flex gap-4">
            {/* Logo */}
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
              {supplier.logo_url ? (
                <Image
                  src={supplier.logo_url}
                  alt={supplier.company_name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <Building2 className="h-7 w-7 text-gray-400" />
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-serif text-lg font-semibold text-charcoal transition-colors group-hover:text-agile-teal">
                {supplier.company_name}
              </h3>

              {/* Location */}
              {supplier.location && (
                <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{supplier.location}</span>
                </div>
              )}

              {/* Service Type Badge */}
              <div className="mt-2">
                <span
                  className={cn(
                    'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                    serviceStyle.bg,
                    serviceStyle.text,
                    serviceStyle.border
                  )}
                >
                  {supplier.service_type_label}
                </span>
              </div>
            </div>
          </div>

          {/* Description Preview */}
          {supplier.description && (
            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
              {supplier.description}
            </p>
          )}

          {/* Stats Row */}
          <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-gray-50/70 p-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400">
                <Package className="h-3.5 w-3.5" />
              </div>
              <p className="mt-1 text-xs font-medium text-charcoal">
                {formatMOQ(supplier.minimum_order_quantity)}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-gray-400">MOQ</p>
            </div>

            <div className="border-x border-gray-200 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <p className="mt-1 text-xs font-medium text-charcoal">
                {formatLeadTime(supplier.lead_time_days)}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-gray-400">Lead Time</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <p className="mt-1 text-xs font-medium text-charcoal">
                {supplier.response_time_hours
                  ? `${supplier.response_time_hours}h`
                  : '—'}
              </p>
              <p className="text-[10px] uppercase tracking-wide text-gray-400">Response</p>
            </div>
          </div>

          {/* Certifications */}
          {displayedCertifications.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {displayedCertifications.map((certType) => {
                const color = getCertificationColor(certType as CertificationType);
                return (
                  <span
                    key={certType}
                    className={cn(
                      'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium',
                      certificationStyles[color] || certificationStyles.gray
                    )}
                  >
                    {certType.replace('_', '-')}
                  </span>
                );
              })}
              {remainingCerts > 0 && (
                <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                  +{remainingCerts} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Accent Line */}
        <div
          className={cn(
            'absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-agile-teal to-mint-accent',
            'w-0 transition-all duration-300 group-hover:w-full'
          )}
        />
      </Card>
    </Link>
  );
}

export function SupplierCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-100 bg-white">
      <div className="p-5">
        <div className="flex gap-4">
          <div className="h-16 w-16 animate-pulse rounded-xl bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-24 animate-pulse rounded bg-gray-100" />
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg bg-gray-50 p-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-3.5 w-3.5 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
              <div className="h-2 w-8 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-5 w-16 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
      </div>
    </Card>
  );
}
