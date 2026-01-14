'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building2,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { PendingVerification } from '@/types/admin';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface VerificationDetailCardProps {
  verification?: PendingVerification;
  isLoading: boolean;
}

function getCertificationColor(type: string): string {
  const colors: Record<string, string> = {
    gots: 'bg-emerald-100 text-emerald-700',
    oeko_tex: 'bg-blue-100 text-blue-700',
    grs: 'bg-teal-100 text-teal-700',
    bci: 'bg-amber-100 text-amber-700',
    fsc: 'bg-green-100 text-green-700',
    iso_9001: 'bg-indigo-100 text-indigo-700',
    iso_14001: 'bg-purple-100 text-purple-700',
    wrap: 'bg-rose-100 text-rose-700',
    sa8000: 'bg-orange-100 text-orange-700',
    fair_trade: 'bg-cyan-100 text-cyan-700',
  };
  return colors[type.toLowerCase()] || 'bg-gray-100 text-gray-700';
}

function formatCertificationType(type: string): string {
  const labels: Record<string, string> = {
    gots: 'GOTS',
    oeko_tex: 'OEKO-TEX',
    grs: 'GRS',
    bci: 'BCI',
    fsc: 'FSC',
    iso_9001: 'ISO 9001',
    iso_14001: 'ISO 14001',
    wrap: 'WRAP',
    sa8000: 'SA8000',
    fair_trade: 'Fair Trade',
  };
  return labels[type.toLowerCase()] || type.replace(/_/g, ' ').toUpperCase();
}

function DetailRow({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
        <Icon className="h-4 w-4 text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className={cn('text-sm font-medium text-charcoal', valueClassName)}>{value}</p>
      </div>
    </div>
  );
}

export function VerificationDetailCard({ verification, isLoading }: VerificationDetailCardProps) {
  if (isLoading) {
    return (
      <Card className="border-gray-100">
        <CardHeader>
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!verification) {
    return (
      <Card className="border-gray-100">
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-gray-500">Verification not found</p>
        </CardContent>
      </Card>
    );
  }

  const supplier = verification.supplier;
  const profile = supplier?.profile;
  const user = profile?.user;

  return (
    <Card className="border-gray-100">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100">
            <Building2 className="h-7 w-7 text-gray-500" />
          </div>
          <div className="flex-1">
            <h2 className="font-serif text-xl font-bold text-charcoal">
              {profile?.company_name || 'Unknown Company'}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge className={cn('hover:bg-transparent', getCertificationColor(verification.certification_type))}>
                {formatCertificationType(verification.certification_type)}
              </Badge>
              {verification.is_verified ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Approved
                </Badge>
              ) : (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                  <Clock className="mr-1 h-3 w-3" />
                  Pending Review
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Info */}
        {user && (
          <>
            <DetailRow icon={User} label="Contact Name" value={user.name} />
            <DetailRow icon={Mail} label="Email" value={user.email} />
          </>
        )}

        {profile?.location && (
          <DetailRow icon={MapPin} label="Location" value={profile.location} />
        )}

        {/* Submission Details */}
        <DetailRow
          icon={Calendar}
          label="Submitted"
          value={`${format(new Date(verification.created_at), 'MMMM d, yyyy')} (${formatDistanceToNow(new Date(verification.created_at), { addSuffix: true })})`}
        />

        {verification.expiry_date && (
          <DetailRow
            icon={AlertTriangle}
            label="Certificate Expiry"
            value={format(new Date(verification.expiry_date), 'MMMM d, yyyy')}
            valueClassName={verification.is_expiring_soon ? 'text-amber-600' : undefined}
          />
        )}

        {/* Document Link */}
        {verification.certificate_url && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium text-charcoal">Certificate Document</p>
                  <p className="text-sm text-gray-500">View the uploaded certification</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={verification.certificate_url} target="_blank" rel="noopener noreferrer">
                  View
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        )}

        {/* Verifier Info */}
        {verification.verifier && verification.verified_at && (
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="font-medium text-emerald-900">
                  Approved by {verification.verifier.name}
                </p>
                <p className="text-sm text-emerald-700">
                  {format(new Date(verification.verified_at), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
