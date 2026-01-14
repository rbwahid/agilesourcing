'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { PendingVerification, PaginatedResponse } from '@/types/admin';

interface VerificationQueueTableProps {
  data?: PaginatedResponse<PendingVerification>;
  isLoading: boolean;
  onPageChange: (page: number) => void;
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

function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-8 w-16" /></TableCell>
    </TableRow>
  );
}

export function VerificationQueueTable({
  data,
  isLoading,
  onPageChange,
}: VerificationQueueTableProps) {
  const router = useRouter();
  const verifications = data?.data ?? [];
  const meta = data?.meta;

  const handleRowClick = (verificationId: number) => {
    router.push(`/verifications/${verificationId}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-100 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px]">Supplier</TableHead>
              <TableHead>Certification</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => <TableRowSkeleton key={i} />)
            ) : verifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                  No pending verifications
                </TableCell>
              </TableRow>
            ) : (
              verifications.map((verification) => (
                <TableRow
                  key={verification.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => handleRowClick(verification.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <Building2 className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-charcoal">
                          {verification.supplier.profile?.company_name || 'Unknown Company'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {verification.supplier.profile?.user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('hover:bg-transparent', getCertificationColor(verification.certification_type))}>
                      {formatCertificationType(verification.certification_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {verification.is_verified ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                        Approved
                      </Badge>
                    ) : verification.is_expired ? (
                      <Badge variant="outline" className="border-red-300 text-red-600">
                        Expired
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(verification.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(verification.id);
                      }}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(meta.current_page - 1) * meta.per_page + 1} to{' '}
            {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} verifications
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <span className="px-3 text-sm text-gray-600">
              Page {meta.current_page} of {meta.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(meta.current_page + 1)}
              disabled={meta.current_page === meta.last_page}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
