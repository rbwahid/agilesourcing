'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ValidationCreateWizard } from '@/components/validation';

export default function NewValidationPage() {
  const searchParams = useSearchParams();
  const designId = searchParams.get('design');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/validations">
            <Button variant="ghost" size="sm" className="mb-4 gap-2 text-gray-500 hover:text-charcoal">
              <ArrowLeft className="h-4 w-4" />
              Back to Validations
            </Button>
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal">
            New Validation
          </h1>
          <p className="mt-1 text-gray-500">
            Post your design to Instagram and track real audience engagement
          </p>
        </div>

        {/* Wizard */}
        <ValidationCreateWizard preselectedDesignId={designId ? parseInt(designId) : undefined} />
      </div>
    </div>
  );
}
