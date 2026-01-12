'use client';

import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DesignEmptyStateProps {
  title?: string;
  description?: string;
  showCTA?: boolean;
}

export function DesignEmptyState({
  title = 'No designs yet',
  description = 'Start building your portfolio by uploading your first design. Our AI will help you analyze trends and optimize for the market.',
  showCTA = true,
}: DesignEmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-b from-white to-gray-50/50 px-8 py-16 text-center">
      {/* Animated illustration */}
      <div className="relative mb-8">
        {/* Glow effect */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-agile-teal/20 blur-2xl" />

        {/* Main icon container */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-agile-teal to-mint-accent shadow-lg shadow-agile-teal/25">
          {/* Upload icon with floating animation */}
          <svg
            className="h-12 w-12 animate-bounce text-white"
            style={{ animationDuration: '3s' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          {/* Sparkle decorations */}
          <Sparkles className="absolute -right-2 -top-2 h-5 w-5 animate-pulse text-agile-teal" />
          <Sparkles
            className="absolute -bottom-1 -left-2 h-4 w-4 animate-pulse text-mint-accent"
            style={{ animationDelay: '0.5s' }}
          />
        </div>

        {/* Decorative rings */}
        <div className="absolute inset-0 -z-10 animate-ping rounded-2xl border border-agile-teal/20 opacity-75" style={{ animationDuration: '3s' }} />
        <div className="absolute -inset-4 -z-10 animate-ping rounded-3xl border border-agile-teal/10 opacity-50" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
      </div>

      {/* Text content */}
      <h3 className="mb-3 text-xl font-semibold text-charcoal">{title}</h3>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-gray-500">
        {description}
      </p>

      {/* CTA Button */}
      {showCTA && (
        <Link href="/designs/new">
          <Button
            size="lg"
            className="group h-12 gap-2 bg-agile-teal px-6 text-base font-semibold text-white shadow-lg shadow-agile-teal/25 transition-all duration-300 hover:bg-agile-teal/90 hover:shadow-xl hover:shadow-agile-teal/30"
          >
            <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
            Upload Your First Design
          </Button>
        </Link>
      )}

      {/* Bottom decoration */}
      <div className="mt-10 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-gray-200" />
        <span>Supported: JPG, PNG, PDF up to 10MB</span>
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-gray-200" />
      </div>
    </div>
  );
}
