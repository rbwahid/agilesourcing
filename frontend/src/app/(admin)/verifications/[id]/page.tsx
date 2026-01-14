'use client';

import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVerification } from '@/lib/hooks/use-admin';
import { VerificationDetailCard, VerificationActions } from '@/components/admin';
import Link from 'next/link';

export default function VerificationDetailPage() {
  const params = useParams();
  const verificationId = Number(params.id);

  const { data: verification, isLoading } = useVerification(verificationId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/verifications">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to verifications</span>
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">
            {isLoading ? 'Loading...' : 'Verification Review'}
          </h1>
          <p className="text-sm text-charcoal-light">
            Review certification details and approve or reject.
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Verification Details */}
        <div className="lg:col-span-2">
          <VerificationDetailCard verification={verification} isLoading={isLoading} />
        </div>

        {/* Right Column - Actions */}
        <div>
          <VerificationActions verification={verification} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
