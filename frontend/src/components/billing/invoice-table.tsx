'use client';

import { useState } from 'react';
import {
  Receipt,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useInvoices } from '@/lib/hooks/use-billing';
import { downloadInvoice } from '@/lib/api/billing';
import { formatCurrency, INVOICE_STATUS_CONFIG, type Invoice } from '@/types/billing';

export function InvoiceTable() {
  const { data: invoices, isLoading } = useInvoices();

  if (isLoading) {
    return <InvoiceTableSkeleton />;
  }

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <Receipt className="h-5 w-5 text-agile-teal" />
          Billing History
        </CardTitle>
      </CardHeader>

      <CardContent>
        {invoices && invoices.length > 0 ? (
          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-medium text-charcoal">Date</TableHead>
                  <TableHead className="font-medium text-charcoal">Invoice</TableHead>
                  <TableHead className="font-medium text-charcoal">Amount</TableHead>
                  <TableHead className="font-medium text-charcoal">Status</TableHead>
                  <TableHead className="font-medium text-charcoal text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <InvoiceRow key={invoice.id} invoice={invoice} />
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-8 text-center">
            <FileText className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No invoices yet</p>
            <p className="mt-1 text-xs text-gray-400">
              Your billing history will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface InvoiceRowProps {
  invoice: Invoice;
}

function InvoiceRow({ invoice }: InvoiceRowProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const statusConfig = INVOICE_STATUS_CONFIG[invoice.status] || INVOICE_STATUS_CONFIG.open;

  const handleDownload = async () => {
    if (!invoice.invoice_pdf) return;

    setIsDownloading(true);
    try {
      const blob = await downloadInvoice(invoice.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.number || invoice.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download invoice:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const formattedDate = new Date(invoice.created).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <TableRow className="hover:bg-gray-50/50">
      <TableCell>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-charcoal">{formattedDate}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm font-medium text-charcoal">
          {invoice.number || `INV-${invoice.id.slice(-8).toUpperCase()}`}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-sm font-medium text-charcoal">
          {formatCurrency(invoice.amount_paid / 100, invoice.currency)}
        </span>
      </TableCell>
      <TableCell>
        <Badge
          className={cn(
            'font-medium text-xs',
            statusConfig.bgColor,
            statusConfig.color,
            statusConfig.borderColor,
            'border'
          )}
        >
          {statusConfig.label}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {invoice.invoice_pdf && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
                className="h-8 px-2 text-gray-500 hover:text-charcoal"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 px-2 text-gray-500 hover:text-charcoal"
              >
                <a href={invoice.invoice_pdf} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

function InvoiceTableSkeleton() {
  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20 ml-auto" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-8 w-16 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
