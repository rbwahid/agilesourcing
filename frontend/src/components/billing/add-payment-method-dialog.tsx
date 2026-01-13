'use client';

import { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Loader2, Lock, ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateSetupIntent, useAddPaymentMethod } from '@/lib/hooks/use-billing';

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentMethodDialog({
  open,
  onOpenChange,
}: AddPaymentMethodDialogProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSetupIntentMutation = useCreateSetupIntent();
  const addPaymentMethodMutation = useAddPaymentMethod();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Get setup intent from backend
      const { client_secret } = await createSetupIntentMutation.mutateAsync();

      // Confirm card setup with Stripe
      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
        client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Failed to add payment method');
        return;
      }

      if (setupIntent?.payment_method) {
        // Save payment method to backend
        await addPaymentMethodMutation.mutateAsync({
          payment_method_id: setupIntent.payment_method as string,
        });

        // Reset and close
        setCardholderName('');
        cardElement.clear();
        onOpenChange(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setError(null);
      setCardholderName('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-serif text-xl">
            <CreditCard className="h-5 w-5 text-agile-teal" />
            Add Payment Method
          </DialogTitle>
          <DialogDescription>
            Add a new card to your account for billing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardholder-name" className="text-sm font-medium">
              Cardholder Name
            </Label>
            <Input
              id="cardholder-name"
              type="text"
              placeholder="Name on card"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              required
              disabled={isProcessing}
              className="h-11"
            />
          </div>

          {/* Stripe Card Element */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Card Details</Label>
            <div className="rounded-lg border border-gray-200 bg-white p-4 transition-colors focus-within:border-agile-teal focus-within:ring-1 focus-within:ring-agile-teal">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#222222',
                      fontFamily: 'system-ui, sans-serif',
                      '::placeholder': {
                        color: '#9CA3AF',
                      },
                    },
                    invalid: {
                      color: '#DC2626',
                    },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Security Note */}
          <div className="flex items-start gap-2 rounded-lg bg-gray-50 p-3">
            <ShieldCheck className="h-4 w-4 text-agile-teal mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              Your payment info is securely processed by Stripe. We never store your full card details.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing || !cardholderName.trim()}
              className="flex-1 bg-agile-teal hover:bg-agile-teal/90 gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Add Card
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
