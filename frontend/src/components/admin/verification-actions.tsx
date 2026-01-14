'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useApproveVerification, useRejectVerification } from '@/lib/hooks/use-admin';
import { useRouter } from 'next/navigation';
import type { PendingVerification } from '@/types/admin';
import { cn } from '@/lib/utils';

interface VerificationActionsProps {
  verification?: PendingVerification;
  isLoading: boolean;
}

export function VerificationActions({ verification, isLoading }: VerificationActionsProps) {
  const router = useRouter();
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const approveMutation = useApproveVerification();
  const rejectMutation = useRejectVerification();

  const handleApprove = async () => {
    if (!verification) return;
    await approveMutation.mutateAsync(verification.id);
    setApproveDialogOpen(false);
    router.push('/verifications');
  };

  const handleReject = async () => {
    if (!verification || !rejectionFeedback.trim()) return;
    await rejectMutation.mutateAsync({ id: verification.id, feedback: rejectionFeedback });
    setRejectDialogOpen(false);
    router.push('/verifications');
  };

  if (isLoading) {
    return (
      <Card className="border-gray-100">
        <CardContent className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (!verification) return null;

  // If already verified, show status instead of actions
  if (verification.is_verified) {
    return (
      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="flex items-center gap-3 py-6">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
          <div>
            <p className="font-semibold text-emerald-900">Certification Approved</p>
            <p className="text-sm text-emerald-700">
              This certification has already been verified.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-gray-100">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-500">Review Actions</CardTitle>
          <CardDescription>
            Approve or reject this certification request
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Approve Button */}
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setApproveDialogOpen(true)}
            disabled={approveMutation.isPending || rejectMutation.isPending}
          >
            {approveMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Approve Certification
          </Button>

          {/* Rejection Section */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">or reject with feedback</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-sm text-gray-600">
                Rejection Reason
              </Label>
              <Textarea
                id="feedback"
                placeholder="Provide a reason for rejection. This will be sent to the supplier..."
                value={rejectionFeedback}
                onChange={(e) => setRejectionFeedback(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setRejectDialogOpen(true)}
              disabled={!rejectionFeedback.trim() || approveMutation.isPending || rejectMutation.isPending}
            >
              {rejectMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Reject Certification
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <AlertDialogTitle className="text-center">Approve Certification</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to approve this certification? This will mark the supplier as
              verified for this certification type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel disabled={approveMutation.isPending}>Cancel</AlertDialogCancel>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleApprove}
              disabled={approveMutation.isPending}
            >
              {approveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center">Reject Certification</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Are you sure you want to reject this certification? The supplier will be notified
              with your feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogCancel disabled={rejectMutation.isPending}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
