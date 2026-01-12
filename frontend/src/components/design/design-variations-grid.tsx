'use client';

import { Loader2, Wand2, RefreshCw, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DesignVariationCard } from './design-variation-card';
import type { Design, DesignVariation } from '@/types/design';
import { cn } from '@/lib/utils';

interface DesignVariationsGridProps {
  design: Design;
  variations: DesignVariation[];
  onGenerateVariations?: () => void;
  onRegenerateVariations?: () => void;
  isGenerating?: boolean;
  canGenerate?: boolean;
}

export function DesignVariationsGrid({
  design,
  variations,
  onGenerateVariations,
  onRegenerateVariations,
  isGenerating = false,
  canGenerate = false,
}: DesignVariationsGridProps) {
  const hasVariations = variations.length > 0;

  return (
    <Card className="border-0 shadow-lg shadow-gray-200/50">
      <CardHeader className="border-b bg-gradient-to-r from-mint-accent/10 to-agile-teal/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-agile-teal to-mint-accent">
              <Wand2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-serif">Design Variations</span>
            {hasVariations && (
              <span className="ml-2 rounded-full bg-agile-teal/10 px-2 py-0.5 text-xs font-medium text-agile-teal">
                {variations.length} generated
              </span>
            )}
          </CardTitle>

          {/* Action buttons */}
          <div className="flex gap-2">
            {hasVariations && onRegenerateVariations && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerateVariations}
                disabled={isGenerating}
                className="gap-1.5"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Regenerate
              </Button>
            )}
            {!hasVariations && canGenerate && onGenerateVariations && (
              <Button
                size="sm"
                onClick={onGenerateVariations}
                disabled={isGenerating}
                className="gap-1.5 bg-agile-teal hover:bg-agile-teal/90"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate Variations
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Loading state */}
        {isGenerating && !hasVariations && (
          <div className="py-12 text-center">
            <div className="relative mx-auto mb-4 h-16 w-16">
              <div className="absolute inset-0 animate-pulse rounded-full bg-agile-teal/20" />
              <svg className="absolute inset-0 h-16 w-16 animate-spin" style={{ animationDuration: '3s' }}>
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="60 120"
                  className="text-agile-teal"
                />
              </svg>
              <div className="relative flex h-16 w-16 items-center justify-center">
                <Wand2 className="h-6 w-6 text-agile-teal" />
              </div>
            </div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">
              Generating Variations
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
              Our AI is creating design variations based on the analysis.
              This may take a moment.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isGenerating && !hasVariations && (
          <div className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50">
              <Wand2 className="h-7 w-7 text-gray-400" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">
              No Variations Yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
              {canGenerate
                ? 'Generate AI-powered variations to explore different color palettes, materials, and style directions.'
                : 'Complete the AI analysis first to unlock variation generation.'}
            </p>
            {canGenerate && onGenerateVariations && (
              <Button
                onClick={onGenerateVariations}
                disabled={isGenerating}
                className="mt-4 gap-2 bg-agile-teal hover:bg-agile-teal/90"
              >
                <Sparkles className="h-4 w-4" />
                Generate Variations
              </Button>
            )}
          </div>
        )}

        {/* Variations grid */}
        {hasVariations && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Original design card */}
            <DesignVariationCard
              variation={{
                id: 0,
                design_id: design.id,
                variation_number: 0,
                description: 'Original design',
                file_path: design.file_path,
                file_url: design.file_url,
                ai_suggestions: null,
                created_at: design.created_at,
                updated_at: design.updated_at,
              }}
              isOriginal
              originalImageUrl={design.file_url}
            />

            {/* Generated variations */}
            {variations.map((variation) => (
              <DesignVariationCard key={variation.id} variation={variation} />
            ))}
          </div>
        )}

        {/* Loading overlay for regeneration */}
        {isGenerating && hasVariations && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-agile-teal/5 p-3 text-sm text-agile-teal">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Regenerating variations...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
