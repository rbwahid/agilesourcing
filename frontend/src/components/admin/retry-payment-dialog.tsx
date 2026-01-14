'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RefreshCcw, Loader2 } from 'lucide-react';
import { useRetryPayment } from '@/lib/hooks/use-admin';

interface RetryPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptionId: number;
  onSuccess?: () => void;
}

export function RetryPaymentDialog({
  open,
  onOpenChange,
  subscriptionId,
  onSuccess,
}: RetryPaymentDialogProps) {
  const retryMutation = useRetryPayment();

  const handleRetry = async () => {
    await retryMutation.mutateAsync(subscriptionId);
    onOpenChange(false);
    onSuccess?.();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <RefreshCcw className="h-6 w-6 text-blue-600" />
          </div>
          <AlertDialogTitle className="text-center">Retry Payment</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This will attempt to charge the customer&apos;s default payment method for the outstanding
            balance. The customer will be notified if the payment fails.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel disabled={retryMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRetry}
            disabled={retryMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {retryMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Retry Payment'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
