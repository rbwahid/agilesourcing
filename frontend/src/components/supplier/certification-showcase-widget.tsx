'use client';

import Link from 'next/link';
import { Award, Plus, ArrowRight, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useSupplierCertifications } from '@/lib/hooks/use-suppliers';
import { getCertificationColor, getCertificationLabel } from '@/types/supplier';
import type { SupplierCertification } from '@/types/supplier';

const CERT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
};

interface CertBadgeProps {
  certification: SupplierCertification;
}

function CertBadge({ certification }: CertBadgeProps) {
  const colorName = getCertificationColor(certification.certification_type);
  const colors = CERT_COLORS[colorName] || CERT_COLORS.gray;
  const label = getCertificationLabel(certification.certification_type);

  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all duration-200 hover:shadow-sm',
        colors.bg,
        colors.border
      )}
    >
      <Award className={cn('h-4 w-4', colors.text)} />
      <span className={cn('text-sm font-medium', colors.text)}>{label}</span>

      {/* Verification status indicator */}
      {certification.is_verified ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Clock className="h-3.5 w-3.5 text-amber-500" />
      )}

      {/* Hover tooltip */}
      <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 scale-0 whitespace-nowrap rounded-lg bg-charcoal px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
        {certification.is_verified ? 'Verified' : 'Pending verification'}
      </div>
    </div>
  );
}

function CertificationSkeleton() {
  return (
    <Card className="border-gray-100 bg-white">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-8 w-20" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-xl" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
        <ShieldCheck className="h-7 w-7 text-amber-500" />
      </div>
      <p className="font-medium text-charcoal">No certifications yet</p>
      <p className="mt-1 max-w-[200px] text-sm text-gray-500">
        Add certifications to build trust with designers
      </p>
      <Button
        asChild
        size="sm"
        className="mt-4 gap-2 bg-agile-teal hover:bg-agile-teal/90"
      >
        <Link href="/supplier-certifications">
          <Plus className="h-4 w-4" />
          Add Certification
        </Link>
      </Button>
    </div>
  );
}

export function CertificationShowcaseWidget() {
  const { data: certifications, isLoading } = useSupplierCertifications();

  if (isLoading) {
    return <CertificationSkeleton />;
  }

  const verifiedCount = certifications?.filter((c) => c.is_verified).length ?? 0;
  const pendingCount = (certifications?.length ?? 0) - verifiedCount;

  return (
    <Card className="border-gray-100 bg-white">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
            <Award className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">
              Certifications
            </h3>
            {certifications && certifications.length > 0 && (
              <p className="text-sm text-gray-500">
                <span className="text-emerald-600">{verifiedCount} verified</span>
                {pendingCount > 0 && (
                  <span className="text-amber-600"> · {pendingCount} pending</span>
                )}
              </p>
            )}
          </div>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-sm text-gray-500 hover:text-agile-teal"
        >
          <Link href="/supplier-certifications">
            Manage
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-4">
        {!certifications || certifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <CertBadge key={cert.id} certification={cert} />
            ))}

            {/* Add more button */}
            <Link
              href="/supplier-certifications"
              className="flex items-center gap-1.5 rounded-xl border border-dashed border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:border-agile-teal hover:bg-agile-teal/5 hover:text-agile-teal"
            >
              <Plus className="h-4 w-4" />
              Add
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
