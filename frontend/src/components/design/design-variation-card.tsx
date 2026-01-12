'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  Palette,
  Shirt,
  Wand2,
  Target,
  TrendingUp,
  ImageOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DesignVariation } from '@/types/design';

interface DesignVariationCardProps {
  variation: DesignVariation;
  isOriginal?: boolean;
  originalImageUrl?: string;
}

export function DesignVariationCard({
  variation,
  isOriginal = false,
  originalImageUrl,
}: DesignVariationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = isOriginal ? originalImageUrl : variation.file_url;
  const suggestions = variation.ai_suggestions;

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300',
        'hover:shadow-lg hover:shadow-gray-200/80',
        isOriginal ? 'border-agile-teal/30 ring-2 ring-agile-teal/10' : 'border-gray-100'
      )}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={isOriginal ? 'Original Design' : `Variation ${variation.variation_number}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-50 to-gray-100 p-4 text-center">
            <div className="rounded-full bg-white p-3 shadow-inner">
              {isOriginal ? (
                <ImageOff className="h-6 w-6 text-gray-400" />
              ) : (
                <Wand2 className="h-6 w-6 text-violet-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                {isOriginal ? 'Original Design' : 'AI Variation'}
              </p>
              <p className="mt-0.5 text-xs text-gray-400">
                {isOriginal ? 'Preview not available' : 'Text-based suggestion'}
              </p>
            </div>
          </div>
        )}

        {/* Badge */}
        <div
          className={cn(
            'absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm',
            isOriginal
              ? 'bg-agile-teal/90 text-white'
              : 'bg-white/90 text-violet-700'
          )}
        >
          {isOriginal ? 'Original' : `V${variation.variation_number}`}
        </div>

        {/* Hover overlay for variations */}
        {!isOriginal && suggestions && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
            <div className="w-full p-4">
              <p className="line-clamp-2 text-sm text-white">
                {variation.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {isOriginal ? (
          <div>
            <h4 className="font-semibold text-charcoal">Original Design</h4>
            <p className="mt-1 text-sm text-gray-500">
              The base design for comparison
            </p>
          </div>
        ) : (
          <>
            <h4 className="font-semibold text-charcoal">
              Variation {variation.variation_number}
            </h4>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {variation.description}
            </p>

            {/* Expandable AI Suggestions */}
            {suggestions && (
              <div className="mt-3">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
                >
                  <span>AI Suggestions</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      expanded && 'rotate-180'
                    )}
                  />
                </button>

                <div
                  className={cn(
                    'grid transition-all duration-300',
                    expanded ? 'mt-3 grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-3 text-xs">
                      {/* Color Changes */}
                      {suggestions.color_changes && suggestions.color_changes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 text-violet-600">
                            <Palette className="h-3 w-3" />
                            <span className="font-medium">Color Changes</span>
                          </div>
                          <ul className="ml-4 mt-1 list-disc space-y-0.5 text-gray-500">
                            {suggestions.color_changes.map((change, i) => (
                              <li key={i}>{change}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Material Changes */}
                      {suggestions.material_changes && suggestions.material_changes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 text-agile-teal">
                            <Shirt className="h-3 w-3" />
                            <span className="font-medium">Material Changes</span>
                          </div>
                          <ul className="ml-4 mt-1 list-disc space-y-0.5 text-gray-500">
                            {suggestions.material_changes.map((change, i) => (
                              <li key={i}>{change}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Style Modifications */}
                      {suggestions.style_modifications && suggestions.style_modifications.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 text-amber-600">
                            <Wand2 className="h-3 w-3" />
                            <span className="font-medium">Style Modifications</span>
                          </div>
                          <ul className="ml-4 mt-1 list-disc space-y-0.5 text-gray-500">
                            {suggestions.style_modifications.map((mod, i) => (
                              <li key={i}>{mod}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Target Market Shift */}
                      {suggestions.target_market_shift && (
                        <div>
                          <div className="flex items-center gap-1.5 text-blue-600">
                            <Target className="h-3 w-3" />
                            <span className="font-medium">Market Shift</span>
                          </div>
                          <p className="ml-4 mt-1 text-gray-500">
                            {suggestions.target_market_shift}
                          </p>
                        </div>
                      )}

                      {/* Appeal Increase */}
                      {suggestions.estimated_appeal_increase > 0 && (
                        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2">
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium text-emerald-700">
                            +{suggestions.estimated_appeal_increase}% estimated appeal
                          </span>
                        </div>
                      )}

                      {/* Rationale */}
                      {suggestions.rationale && (
                        <div className="rounded-lg bg-violet-50 p-2">
                          <p className="font-medium text-violet-700">Why this works:</p>
                          <p className="mt-1 text-gray-600">{suggestions.rationale}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
