'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  X,
  ImagePlus,
  Instagram,
  Sparkles,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useCancelSubscription, useSubscription } from '@/lib/hooks/use-billing';

const CANCELLATION_REASONS = [
  { value: 'too_expensive', label: 'Too expensive' },
  { value: 'not_using', label: 'Not using it enough' },
  { value: 'missing_features', label: 'Missing features I need' },
  { value: 'found_alternative', label: 'Found a better alternative' },
  { value: 'temporary', label: 'Only needed temporarily' },
  { value: 'other', label: 'Other' },
];

interface CancelSubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelSubscriptionDialog({
  open,
  onOpenChange,
}: CancelSubscriptionDialogProps) {
  const [step, setStep] = useState<'confirm' | 'reason'>('confirm');
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');

  const { data: subscription } = useSubscription();
  const cancelMutation = useCancelSubscription();

  const periodEndDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync();
      onOpenChange(false);
      // Reset state for next open
      setStep('confirm');
      setReason('');
      setFeedback('');
    } catch {
      // Error handled by mutation
    }
  };

  const handleClose = () => {
    if (!cancelMutation.isPending) {
      onOpenChange(false);
      // Reset state
      setStep('confirm');
      setReason('');
      setFeedback('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'confirm' ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif text-xl text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Cancel Subscription?
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                We&apos;re sorry to see you go. Please review what you&apos;ll lose access to.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* What you'll lose */}
              <div className="rounded-lg bg-red-50 border border-red-100 p-4 space-y-3">
                <p className="text-sm font-medium text-red-900">
                  After cancellation, you&apos;ll lose:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-sm text-red-700">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                      <X className="h-3 w-3 text-red-600" />
                    </div>
                    <span>
                      {subscription?.plan?.has_unlimited_uploads
                        ? 'Unlimited design uploads'
                        : `${subscription?.plan?.design_uploads_limit || 0} design uploads/month`}
                    </span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-red-700">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                      <X className="h-3 w-3 text-red-600" />
                    </div>
                    <span>
                      {subscription?.plan?.has_unlimited_validations
                        ? 'Unlimited Instagram validations'
                        : `${subscription?.plan?.validations_limit || 0} validations/month`}
                    </span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-red-700">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
                      <X className="h-3 w-3 text-red-600" />
                    </div>
                    <span>Priority support and features</span>
                  </li>
                </ul>
              </div>

              {/* Access until */}
              {periodEndDate && (
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-4">
                  <p className="text-sm text-amber-800">
                    <span className="font-medium">Good news:</span> You&apos;ll still have
                    access until{' '}
                    <span className="font-semibold">{periodEndDate}</span>
                  </p>
                </div>
              )}

              {/* Retention offer */}
              <div className="rounded-lg bg-gradient-to-br from-agile-teal/10 to-mint-accent/10 border border-agile-teal/20 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-agile-teal mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      Not sure? Try pausing instead
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Contact support to discuss a temporary pause or plan adjustment.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                onClick={() => setStep('reason')}
                className="flex-1"
              >
                Continue Cancelling
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-xl text-charcoal">
                Before you go...
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Help us improve by sharing why you&apos;re leaving
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Why are you cancelling?
                </Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {CANCELLATION_REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Any additional feedback? (optional)
                </Label>
                <Textarea
                  placeholder="Tell us how we could improve..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('confirm')}
                disabled={cancelMutation.isPending}
              >
                Back
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelMutation.isPending || !reason}
                className="flex-1 gap-2"
              >
                {cancelMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Confirm Cancellation'
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
