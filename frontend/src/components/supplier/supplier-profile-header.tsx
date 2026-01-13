'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Building2,
  MapPin,
  BadgeCheck,
  Sparkles,
  Heart,
  Share2,
  ExternalLink,
  Package,
  Calendar,
  Clock,
  Star,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSaveSupplier, useUnsaveSupplier } from '@/lib/hooks/use-suppliers';
import { useCreateConversation } from '@/lib/hooks/use-messages';
import { NewConversationDialog } from '@/components/messages';
import type { Supplier } from '@/types/supplier';
import { formatMOQ, formatLeadTime } from '@/types/supplier';

interface SupplierProfileHeaderProps {
  supplier: Supplier;
  isSaved: boolean;
  onSaveChange?: (saved: boolean) => void;
}

const serviceTypeStyles: Record<string, { bg: string; text: string; border: string }> = {
  fabric: {
    bg: 'bg-agile-teal/10',
    text: 'text-agile-teal',
    border: 'border-agile-teal/30',
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

export function SupplierProfileHeader({
  supplier,
  isSaved,
  onSaveChange,
}: SupplierProfileHeaderProps) {
  const [localSaved, setLocalSaved] = useState(isSaved);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  const saveMutation = useSaveSupplier();
  const unsaveMutation = useUnsaveSupplier();
  const createConversationMutation = useCreateConversation();

  const serviceStyle = serviceTypeStyles[supplier.service_type] || serviceTypeStyles.fabric;

  const handleSaveClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);

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

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
    }
  };

  // Rating stars
  const renderStars = (rating: number | null | undefined) => {
    if (!rating) return <span className="text-gray-400">No ratings</span>;
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4',
              i < fullStars
                ? 'fill-amber-400 text-amber-400'
                : i === fullStars && hasHalf
                ? 'fill-amber-400/50 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
        <span className="ml-1.5 text-sm font-medium text-charcoal">
          {rating.toFixed(1)}
        </span>
        {(supplier.review_count ?? 0) > 0 && (
          <span className="text-sm text-gray-500">
            ({supplier.review_count})
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden">
      {/* Banner Section */}
      <div className="relative h-48 sm:h-64 lg:h-80">
        {/* Banner Image or Gradient */}
        {supplier.banner_url ? (
          <Image
            src={supplier.banner_url}
            alt=""
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-agile-teal via-agile-teal/80 to-mint-accent" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Decorative Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Badges - Top Right */}
        <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-6 sm:top-6">
          {supplier.is_featured && (
            <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-agile-teal to-mint-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-agile-teal/30">
              <Sparkles className="h-3.5 w-3.5" />
              Featured
            </div>
          )}
          {supplier.is_verified && (
            <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-amber-200/50">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Logo - Overlapping Banner */}
        <div className="relative -mt-16 sm:-mt-20">
          <div className="inline-block">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl sm:h-32 sm:w-32">
              {supplier.logo_url ? (
                <Image
                  src={supplier.logo_url}
                  alt={supplier.company_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                  <Building2 className="h-10 w-10 text-gray-400 sm:h-14 sm:w-14" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-4 pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Company Info */}
            <div className="space-y-4">
              {/* Company Name & Service Type */}
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-5xl">
                  {supplier.company_name}
                </h1>
                <span
                  className={cn(
                    'inline-flex items-center rounded-lg border px-3 py-1 text-sm font-medium',
                    serviceStyle.bg,
                    serviceStyle.text,
                    serviceStyle.border
                  )}
                >
                  {supplier.service_type_label}
                </span>
              </div>

              {/* Location */}
              {supplier.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{supplier.location}</span>
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-4">
                {renderStars(supplier.rating)}
              </div>

              {/* Website */}
              {supplier.website_url && (
                <a
                  href={supplier.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-agile-teal transition-colors hover:text-agile-teal/80"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Visit Website
                </a>
              )}
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="gap-2 bg-agile-teal px-6 hover:bg-agile-teal/90"
                size="lg"
                onClick={() => setShowContactDialog(true)}
              >
                <Mail className="h-4 w-4" />
                Contact Supplier
              </Button>

              <Button
                variant="outline"
                size="lg"
                className={cn(
                  'gap-2 border-gray-200 transition-all duration-300',
                  localSaved && 'border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100',
                  isAnimating && 'scale-110'
                )}
                onClick={handleSaveClick}
                disabled={saveMutation.isPending || unsaveMutation.isPending}
              >
                <Heart
                  className={cn(
                    'h-4 w-4 transition-all duration-300',
                    localSaved ? 'fill-rose-500 text-rose-500' : 'text-gray-500'
                  )}
                />
                {localSaved ? 'Saved' : 'Save'}
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 border-gray-200"
                onClick={handleShare}
              >
                {copied ? (
                  <span className="text-xs font-medium text-agile-teal">Copied!</span>
                ) : (
                  <Share2 className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50/50 to-white p-6 shadow-sm sm:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Package className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">MOQ</span>
              </div>
              <p className="mt-2 font-serif text-2xl font-semibold text-charcoal">
                {formatMOQ(supplier.minimum_order_quantity)}
              </p>
            </div>

            <div className="border-l border-gray-200 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Lead Time</span>
              </div>
              <p className="mt-2 font-serif text-2xl font-semibold text-charcoal">
                {formatLeadTime(supplier.lead_time_days)}
              </p>
            </div>

            <div className="border-l border-gray-200 text-center max-sm:border-l-0 max-sm:border-t max-sm:pt-4">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Response</span>
              </div>
              <p className="mt-2 font-serif text-2xl font-semibold text-charcoal">
                {supplier.response_time_hours
                  ? `${supplier.response_time_hours}h`
                  : '—'}
              </p>
            </div>

            <div className="border-l border-gray-200 text-center max-sm:border-t max-sm:pt-4">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <Star className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Rating</span>
              </div>
              <p className="mt-2 font-serif text-2xl font-semibold text-charcoal">
                {supplier.rating ? supplier.rating.toFixed(1) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <NewConversationDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        onSubmit={(data) => {
          createConversationMutation.mutate(data, {
            onSuccess: () => setShowContactDialog(false),
          });
        }}
        isSubmitting={createConversationMutation.isPending}
        preselectedSupplierId={supplier.id}
      />
    </div>
  );
}
