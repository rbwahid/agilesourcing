'use client';

import Link from 'next/link';
import { ChevronLeft, UserCircle, Loader2 } from 'lucide-react';
import { SupplierProfileForm } from '@/components/supplier';
import { useSupplierProfile } from '@/lib/hooks/use-suppliers';

export default function SupplierProfilePage() {
  const { data: profile, isLoading } = useSupplierProfile();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/supplier-dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-charcoal"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-agile-teal/10">
            <UserCircle className="h-6 w-6 text-agile-teal" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal sm:text-3xl">
              Edit Profile
            </h1>
            <p className="text-gray-600">
              Update your company information and capabilities
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-agile-teal" />
        </div>
      ) : (
        <SupplierProfileForm initialData={profile} />
      )}
    </div>
  );
}
