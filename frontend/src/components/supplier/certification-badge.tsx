'use client';

import { BadgeCheck, AlertTriangle, Award } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { SupplierCertification, CertificationType } from '@/types/supplier';
import { getCertificationLabel, getCertificationColor } from '@/types/supplier';

interface CertificationBadgeProps {
  certification: SupplierCertification;
  variant?: 'compact' | 'detailed';
  className?: string;
}

const colorStyles: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: 'text-emerald-500',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: 'text-blue-500',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: 'text-amber-500',
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    icon: 'text-indigo-500',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: 'text-green-500',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: 'text-purple-500',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    icon: 'text-rose-500',
  },
  cyan: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    icon: 'text-cyan-500',
  },
  gray: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: 'text-gray-500',
  },
};

const expiryWarningStyles = {
  bg: 'bg-orange-50',
  text: 'text-orange-700',
  border: 'border-orange-300',
  icon: 'text-orange-500',
};

export function CertificationBadge({
  certification,
  variant = 'compact',
  className,
}: CertificationBadgeProps) {
  const color = getCertificationColor(certification.certification_type as CertificationType);
  const label = getCertificationLabel(certification.certification_type as CertificationType);
  const styles = colorStyles[color] || colorStyles.gray;

  // Check if expiring within 30 days
  const expiryDate = certification.expiry_date ? new Date(certification.expiry_date) : null;
  const today = new Date();
  const daysUntilExpiry = expiryDate
    ? Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;

  // Override styles if expiring soon
  const activeStyles = isExpiringSoon ? expiryWarningStyles : styles;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const tooltipContent = (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Award className={cn('h-4 w-4', styles.icon)} />
        <span className="font-medium">{label}</span>
      </div>
      {certification.certificate_number && (
        <p className="text-gray-500">
          Certificate: {certification.certificate_number}
        </p>
      )}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>Issued: {formatDate(certification.issued_date)}</span>
        <span>
          Expires:{' '}
          <span
            className={cn(
              isExpired && 'text-red-600',
              isExpiringSoon && 'text-orange-600'
            )}
          >
            {formatDate(certification.expiry_date)}
          </span>
        </span>
      </div>
      {certification.is_verified && (
        <div className="flex items-center gap-1.5 pt-1 text-xs text-emerald-600">
          <BadgeCheck className="h-3.5 w-3.5" />
          Verified by AgileSourcing
        </div>
      )}
      {isExpiringSoon && (
        <div className="flex items-center gap-1.5 pt-1 text-xs text-orange-600">
          <AlertTriangle className="h-3.5 w-3.5" />
          Expiring in {daysUntilExpiry} days
        </div>
      )}
      {isExpired && (
        <div className="flex items-center gap-1.5 pt-1 text-xs text-red-600">
          <AlertTriangle className="h-3.5 w-3.5" />
          Certificate has expired
        </div>
      )}
    </div>
  );

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              className={cn(
                'inline-flex cursor-default items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm',
                activeStyles.bg,
                activeStyles.text,
                activeStyles.border,
                isExpired && 'opacity-60',
                className
              )}
            >
              {isExpiringSoon || isExpired ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <Award className={cn('h-3 w-3', activeStyles.icon)} />
              )}
              {certification.certification_type.replace('_', '-')}
              {certification.is_verified && (
                <BadgeCheck className="h-3 w-3 text-emerald-500" />
              )}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Detailed variant
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'inline-flex cursor-default items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 hover:shadow-md',
              activeStyles.bg,
              activeStyles.border,
              isExpired && 'opacity-60',
              className
            )}
          >
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-lg',
                isExpiringSoon || isExpired
                  ? 'bg-orange-100'
                  : styles.bg.replace('50', '100')
              )}
            >
              {isExpiringSoon || isExpired ? (
                <AlertTriangle className={cn('h-5 w-5', expiryWarningStyles.icon)} />
              ) : (
                <Award className={cn('h-5 w-5', styles.icon)} />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={cn('text-sm font-semibold', activeStyles.text)}>
                  {certification.certification_type.replace('_', '-')}
                </span>
                {certification.is_verified && (
                  <BadgeCheck className="h-4 w-4 text-emerald-500" />
                )}
              </div>
              <p className="text-xs text-gray-500">
                {isExpired ? (
                  <span className="text-red-600">Expired</span>
                ) : isExpiringSoon ? (
                  <span className="text-orange-600">
                    Expires in {daysUntilExpiry} days
                  </span>
                ) : (
                  <>Expires: {formatDate(certification.expiry_date)}</>
                )}
              </p>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Skeleton for loading state
export function CertificationBadgeSkeleton({
  variant = 'compact',
}: {
  variant?: 'compact' | 'detailed';
}) {
  if (variant === 'compact') {
    return (
      <div className="inline-flex h-6 w-20 animate-pulse rounded-full bg-gray-100" />
    );
  }

  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
      <div className="space-y-1.5">
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
