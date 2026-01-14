'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Download,
  ExternalLink,
  RefreshCcw,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import type { AdminSubscriptionInvoice } from '@/types/admin';
import { cn } from '@/lib/utils';
import { RefundDialog } from './refund-dialog';

interface SubscriptionInvoicesCardProps {
  invoices: AdminSubscriptionInvoice[];
  isLoading: boolean;
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'paid':
      return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Paid</Badge>;
    case 'open':
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Open</Badge>;
    case 'void':
      return <Badge variant="outline" className="text-gray-500">Void</Badge>;
    case 'uncollectible':
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Uncollectible</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatAmount(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

function InvoiceSkeleton() {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export function SubscriptionInvoicesCard({ invoices, isLoading }: SubscriptionInvoicesCardProps) {
  const [refundInvoiceId, setRefundInvoiceId] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);

  const handleRefundClick = (invoice: AdminSubscriptionInvoice) => {
    setRefundInvoiceId(invoice.id);
    setRefundAmount(invoice.amount_paid);
  };

  if (isLoading) {
    return (
      <Card className="border-gray-100">
        <CardHeader>
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          {Array.from({ length: 3 }).map((_, i) => (
            <InvoiceSkeleton key={i} />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-gray-100">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <p className="font-medium text-charcoal">No Invoices Yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Invoices will appear here after the first payment.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50">
                      <FileText className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-charcoal">
                        {invoice.number || 'Invoice'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(invoice.created), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium text-charcoal">
                        {formatAmount(invoice.amount_paid)}
                      </p>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <div className="flex items-center gap-1">
                      {invoice.invoice_pdf && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download PDF</span>
                          </a>
                        </Button>
                      )}
                      {invoice.hosted_invoice_url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          asChild
                        >
                          <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View in Stripe</span>
                          </a>
                        </Button>
                      )}
                      {invoice.status === 'paid' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-600 hover:text-amber-700"
                          onClick={() => handleRefundClick(invoice)}
                        >
                          <RefreshCcw className="h-4 w-4" />
                          <span className="sr-only">Refund</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RefundDialog
        open={!!refundInvoiceId}
        onOpenChange={(open) => !open && setRefundInvoiceId(null)}
        invoiceId={refundInvoiceId || ''}
        maxAmount={refundAmount}
      />
    </>
  );
}
