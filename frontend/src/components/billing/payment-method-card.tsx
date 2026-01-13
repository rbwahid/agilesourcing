'use client';

import { useState } from 'react';
import {
  CreditCard,
  MoreVertical,
  Star,
  Trash2,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { cn } from '@/lib/utils';
import {
  usePaymentMethods,
  useSetDefaultPaymentMethod,
  useRemovePaymentMethod,
} from '@/lib/hooks/use-billing';
import { AddPaymentMethodDialog } from './add-payment-method-dialog';
import type { PaymentMethod } from '@/types/billing';

// Card brand logos/colors
const CARD_BRAND_CONFIG: Record<
  string,
  { bg: string; text: string; name: string }
> = {
  visa: { bg: 'bg-blue-600', text: 'VISA', name: 'Visa' },
  mastercard: { bg: 'bg-red-500', text: 'MC', name: 'Mastercard' },
  amex: { bg: 'bg-blue-400', text: 'AMEX', name: 'American Express' },
  discover: { bg: 'bg-orange-500', text: 'DISC', name: 'Discover' },
  diners: { bg: 'bg-gray-600', text: 'DC', name: 'Diners Club' },
  jcb: { bg: 'bg-green-600', text: 'JCB', name: 'JCB' },
  unionpay: { bg: 'bg-red-600', text: 'UP', name: 'UnionPay' },
  unknown: { bg: 'bg-gray-500', text: '••', name: 'Card' },
};

export function PaymentMethodCard() {
  const { data: paymentMethods, isLoading } = usePaymentMethods();
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (isLoading) {
    return <PaymentMethodCardSkeleton />;
  }

  return (
    <>
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-serif text-lg">
              <CreditCard className="h-5 w-5 text-agile-teal" />
              Payment Methods
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddDialog(true)}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Card
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {paymentMethods && paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((pm) => (
                <PaymentMethodItem key={pm.id} paymentMethod={pm} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-6 text-center">
              <CreditCard className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">No payment methods added</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddDialog(true)}
                className="mt-3"
              >
                Add Payment Method
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddPaymentMethodDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </>
  );
}

interface PaymentMethodItemProps {
  paymentMethod: PaymentMethod;
}

function PaymentMethodItem({ paymentMethod }: PaymentMethodItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const setDefaultMutation = useSetDefaultPaymentMethod();
  const removeMutation = useRemovePaymentMethod();

  const brandConfig = CARD_BRAND_CONFIG[paymentMethod.brand] || CARD_BRAND_CONFIG.unknown;

  const handleSetDefault = () => {
    setDefaultMutation.mutate(paymentMethod.id);
  };

  const handleRemove = () => {
    removeMutation.mutate(paymentMethod.id, {
      onSuccess: () => setShowDeleteDialog(false),
    });
  };

  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between rounded-lg border p-4 transition-colors',
          paymentMethod.is_default
            ? 'border-agile-teal/30 bg-agile-teal/5'
            : 'border-gray-100 bg-white hover:bg-gray-50'
        )}
      >
        <div className="flex items-center gap-4">
          {/* Card Brand Icon */}
          <div
            className={cn(
              'flex h-10 w-14 items-center justify-center rounded text-xs font-bold text-white',
              brandConfig.bg
            )}
          >
            {brandConfig.text}
          </div>

          {/* Card Details */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-charcoal">
                {brandConfig.name} •••• {paymentMethod.last4}
              </span>
              {paymentMethod.is_default && (
                <Badge
                  variant="secondary"
                  className="bg-agile-teal/10 text-agile-teal text-xs"
                >
                  Default
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Expires {paymentMethod.exp_month.toString().padStart(2, '0')}/
              {paymentMethod.exp_year}
            </p>
          </div>
        </div>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!paymentMethod.is_default && (
              <DropdownMenuItem
                onClick={handleSetDefault}
                disabled={setDefaultMutation.isPending}
              >
                <Star className="mr-2 h-4 w-4" />
                Set as Default
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Payment Method</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this card ending in {paymentMethod.last4}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={removeMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {removeMutation.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function PaymentMethodCardSkeleton() {
  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </CardContent>
    </Card>
  );
}
