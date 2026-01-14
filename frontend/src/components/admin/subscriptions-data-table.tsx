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
  CreditCard,
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { AdminSubscription, StripeSubscriptionStatus, PaginatedResponse } from '@/types/admin';

interface SubscriptionsDataTableProps {
  data?: PaginatedResponse<AdminSubscription>;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

function getStatusBadge(status: StripeSubscriptionStatus) {
  switch (status) {
    case 'active':
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Active</Badge>;
    case 'trialing':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Trial</Badge>;
    case 'past_due':
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Past Due</Badge>;
    case 'canceled':
      return <Badge variant="outline" className="text-gray-500">Cancelled</Badge>;
    case 'incomplete':
    case 'incomplete_expired':
      return <Badge variant="outline" className="border-red-300 text-red-600">Incomplete</Badge>;
    case 'unpaid':
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Unpaid</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatAmount(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
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
      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-8 w-16" /></TableCell>
    </TableRow>
  );
}

export function SubscriptionsDataTable({
  data,
  isLoading,
  onPageChange,
}: SubscriptionsDataTableProps) {
  const router = useRouter();
  const subscriptions = data?.data ?? [];
  const meta = data?.meta;

  const handleRowClick = (subscriptionId: number) => {
    router.push(`/subscriptions/${subscriptionId}`);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-100 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px]">User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => <TableRowSkeleton key={i} />)
            ) : subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                  No subscriptions found
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((subscription) => (
                <TableRow
                  key={subscription.id}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => handleRowClick(subscription.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-charcoal">{subscription.user.name}</p>
                        <p className="text-sm text-gray-500">{subscription.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-medium text-charcoal">
                        {subscription.plan?.name || 'Unknown Plan'}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {subscription.billing_period}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-charcoal">
                      {formatAmount(subscription.amount)}
                    </span>
                    <span className="text-sm text-gray-500">/mo</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(subscription.stripe_status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {format(new Date(subscription.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(subscription.id);
                      }}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
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
            {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} subscriptions
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
