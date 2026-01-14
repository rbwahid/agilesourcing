'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RefreshCcw, Loader2, AlertTriangle } from 'lucide-react';
import { useCreateRefund } from '@/lib/hooks/use-admin';

interface RefundDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  maxAmount: number; // In cents
}

function formatAmount(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function RefundDialog({ open, onOpenChange, invoiceId, maxAmount }: RefundDialogProps) {
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full');
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState('');

  const createRefundMutation = useCreateRefund();

  const handleSubmit = async () => {
    const refundAmount = refundType === 'partial' ? Math.round(parseFloat(amount) * 100) : undefined;

    await createRefundMutation.mutateAsync({
      invoiceId,
      data: {
        amount: refundAmount,
        reason,
      },
    });

    onOpenChange(false);
    setRefundType('full');
    setAmount('');
    setReason('');
  };

  const isValid = reason.trim().length > 0 && (
    refundType === 'full' ||
    (refundType === 'partial' && parseFloat(amount) > 0 && parseFloat(amount) * 100 <= maxAmount)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <RefreshCcw className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center">Issue Refund</DialogTitle>
          <DialogDescription className="text-center">
            This will refund the payment to the customer&apos;s original payment method.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Refund Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Refund Amount</Label>
            <RadioGroup
              value={refundType}
              onValueChange={(value) => setRefundType(value as 'full' | 'partial')}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3">
                <RadioGroupItem value="full" id="full" />
                <Label htmlFor="full" className="flex-1 cursor-pointer">
                  <div className="font-medium">Full Refund</div>
                  <div className="text-sm text-gray-500">{formatAmount(maxAmount)}</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3">
                <RadioGroupItem value="partial" id="partial" />
                <Label htmlFor="partial" className="flex-1 cursor-pointer">
                  <div className="font-medium">Partial Refund</div>
                  <div className="text-sm text-gray-500">Specify a custom amount</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Partial Amount Input */}
          {refundType === 'partial' && (
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount to Refund
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  max={maxAmount / 100}
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                />
              </div>
              <p className="text-xs text-gray-500">
                Maximum refund: {formatAmount(maxAmount)}
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for Refund <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Explain why this refund is being issued..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-amber-800">
              Refunds are processed through Stripe and may take 5-10 business days to appear on the
              customer&apos;s statement.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createRefundMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || createRefundMutation.isPending}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {createRefundMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Issue Refund'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
