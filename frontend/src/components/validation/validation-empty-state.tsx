'use client';

import Link from 'next/link';
import { BarChart3, Sparkles, TrendingUp, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ValidationEmptyStateProps {
  hasInstagramConnection: boolean;
}

export function ValidationEmptyState({ hasInstagramConnection }: ValidationEmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 text-center">
      {/* Animated icon container */}
      <div className="relative mb-6">
        <div className="absolute -inset-4 rounded-full bg-agile-teal/5 animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-agile-teal to-mint-accent shadow-lg shadow-agile-teal/20">
          <BarChart3 className="h-10 w-10 text-white" />
        </div>
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
          <Sparkles className="h-4 w-4 text-amber-500" />
        </div>
      </div>

      <h2 className="font-serif text-2xl font-bold text-charcoal">
        No Validations Yet
      </h2>

      <p className="mt-3 max-w-md text-gray-500">
        {hasInstagramConnection
          ? 'Start validating your designs by posting them to Instagram and tracking real audience engagement.'
          : 'Connect your Instagram account to start validating your designs with real audience feedback.'}
      </p>

      {/* Feature highlights */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {[
          { icon: TrendingUp, label: 'Track Engagement' },
          { icon: Target, label: 'Score Designs' },
          { icon: BarChart3, label: 'Compare Results' },
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600"
          >
            <Icon className="h-4 w-4 text-agile-teal" />
            {label}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8">
        {hasInstagramConnection ? (
          <Link href="/validations/new">
            <Button className="gap-2 bg-agile-teal hover:bg-agile-teal/90">
              <Sparkles className="h-4 w-4" />
              Start First Validation
            </Button>
          </Link>
        ) : (
          <Link href="/settings">
            <Button className="gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90">
              Connect Instagram
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
