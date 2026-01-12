'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DesignUploadForm } from '@/components/design/design-upload-form';

export default function NewDesignPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/designs">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 gap-2 text-gray-600 hover:text-charcoal"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Designs
            </Button>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-agile-teal to-mint-accent shadow-lg shadow-agile-teal/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
                Upload New Design
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Add a new design to your portfolio for trend analysis
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <DesignUploadForm />
      </div>
    </div>
  );
}
