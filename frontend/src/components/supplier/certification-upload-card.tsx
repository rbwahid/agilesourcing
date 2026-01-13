'use client';

import { useState } from 'react';
import {
  Award,
  BadgeCheck,
  Clock,
  Download,
  Trash2,
  AlertTriangle,
  Calendar,
  FileText,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import {
  useDeleteCertification,
  useRequestCertificationVerification,
} from '@/lib/hooks/use-suppliers';
import type { SupplierCertification, CertificationType } from '@/types/supplier';
import { getCertificationLabel, getCertificationColor } from '@/types/supplier';

interface CertificationUploadCardProps {
  certification: SupplierCertification;
  onRequestVerification?: () => void;
}

const colorStyles: Record<string, { bg: string; text: string; icon: string; border: string }> = {
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: 'text-emerald-500',
    border: 'border-emerald-200',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: 'text-blue-500',
    border: 'border-blue-200',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: 'text-amber-500',
    border: 'border-amber-200',
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    icon: 'text-indigo-500',
    border: 'border-indigo-200',
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: 'text-green-500',
    border: 'border-green-200',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: 'text-purple-500',
    border: 'border-purple-200',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    icon: 'text-rose-500',
    border: 'border-rose-200',
  },
  cyan: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    icon: 'text-cyan-500',
    border: 'border-cyan-200',
  },
  gray: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    icon: 'text-gray-500',
    border: 'border-gray-200',
  },
};

export function CertificationUploadCard({
  certification,
}: CertificationUploadCardProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const deleteMutation = useDeleteCertification();
  const verifyMutation = useRequestCertificationVerification();

  const color = getCertificationColor(certification.certification_type as CertificationType);
  const label = getCertificationLabel(certification.certification_type as CertificationType);
  const styles = colorStyles[color] || colorStyles.gray;

  // Calculate expiry status
  const expiryDate = certification.expiry_date ? new Date(certification.expiry_date) : null;
  const today = new Date();
  const daysUntilExpiry = expiryDate
    ? Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(certification.id, {
      onSuccess: () => setIsDeleteOpen(false),
    });
  };

  const handleRequestVerification = () => {
    verifyMutation.mutate(certification.id);
  };

  return (
    <Card
      className={cn(
        'group overflow-hidden border transition-all duration-300 hover:shadow-lg',
        isExpired
          ? 'border-red-200 bg-red-50/30'
          : isExpiringSoon
          ? 'border-orange-200 bg-orange-50/30'
          : 'border-gray-100 hover:border-gray-200'
      )}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
                styles.bg
              )}
            >
              <Award className={cn('h-7 w-7', styles.icon)} />
            </div>

            {/* Title & Type */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-semibold text-charcoal">
                  {certification.certification_type.replace('_', '-')}
                </h3>
                {certification.is_verified && (
                  <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>

          {/* Verification Status */}
          {!certification.is_verified && (
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-700 hover:bg-amber-100"
            >
              <Clock className="mr-1 h-3 w-3" />
              Pending
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="mt-5 grid gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-4 sm:grid-cols-3">
          {/* Certificate Number */}
          {certification.certificate_number && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Certificate #
              </p>
              <p className="mt-0.5 text-sm font-medium text-charcoal">
                {certification.certificate_number}
              </p>
            </div>
          )}

          {/* Issued Date */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Issued
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-charcoal">
              <Calendar className="h-3.5 w-3.5 text-gray-400" />
              {formatDate(certification.issued_date)}
            </p>
          </div>

          {/* Expiry Date */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Expires
            </p>
            <p
              className={cn(
                'mt-0.5 flex items-center gap-1 text-sm',
                isExpired
                  ? 'font-medium text-red-600'
                  : isExpiringSoon
                  ? 'font-medium text-orange-600'
                  : 'text-charcoal'
              )}
            >
              {(isExpired || isExpiringSoon) && (
                <AlertTriangle className="h-3.5 w-3.5" />
              )}
              {!isExpired && !isExpiringSoon && (
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
              )}
              {formatDate(certification.expiry_date)}
            </p>
            {isExpiringSoon && !isExpired && (
              <p className="text-xs text-orange-600">
                Expires in {daysUntilExpiry} days
              </p>
            )}
            {isExpired && <p className="text-xs text-red-600">Expired</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {/* Download */}
          {certification.certificate_url && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-gray-200"
              asChild
            >
              <a
                href={certification.certificate_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </Button>
          )}

          {/* Request Verification */}
          {!certification.is_verified && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-agile-teal/30 text-agile-teal hover:bg-agile-teal/5"
              onClick={handleRequestVerification}
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              Request Verification
            </Button>
          )}

          {/* Delete */}
          <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto gap-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Certification?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the{' '}
                  <strong>{certification.certification_type.replace('_', '-')}</strong>{' '}
                  certification? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Verified Badge Banner */}
      {certification.is_verified && certification.verified_at && (
        <div className="border-t border-emerald-100 bg-gradient-to-r from-emerald-50 to-transparent px-5 py-2">
          <p className="flex items-center gap-2 text-xs text-emerald-700">
            <BadgeCheck className="h-4 w-4" />
            Verified on {formatDate(certification.verified_at)}
          </p>
        </div>
      )}
    </Card>
  );
}

export function CertificationUploadCardSkeleton() {
  return (
    <Card className="overflow-hidden border-gray-100">
      <div className="p-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 animate-pulse rounded-xl bg-gray-100" />
          <div className="space-y-2">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-48 animate-pulse rounded bg-gray-100" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 rounded-lg bg-gray-50 p-4 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          <div className="h-9 w-24 animate-pulse rounded-md bg-gray-100" />
          <div className="h-9 w-36 animate-pulse rounded-md bg-gray-100" />
        </div>
      </div>
    </Card>
  );
}
