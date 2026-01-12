'use client';

import { useState } from 'react';
import {
  ChevronDown,
  Palette,
  Shirt,
  Users,
  TrendingUp,
  Calendar,
  Factory,
  DollarSign,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { AIAnalysisResult } from '@/types/design';

interface DesignAnalysisDetailsProps {
  result: AIAnalysisResult;
  defaultExpanded?: boolean;
}

export function DesignAnalysisDetails({
  result,
  defaultExpanded = false,
}: DesignAnalysisDetailsProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyColor = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const complexityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700',
  };

  const pricePointColors = {
    budget: 'bg-blue-100 text-blue-700',
    'mid-range': 'bg-violet-100 text-violet-700',
    premium: 'bg-amber-100 text-amber-700',
    luxury: 'bg-rose-100 text-rose-700',
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      {/* Header - Always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-purple-100">
            <TrendingUp className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h4 className="font-semibold text-charcoal">Detailed Analysis</h4>
            <p className="text-sm text-gray-500">
              View complete AI insights
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-gray-400 transition-transform duration-300',
            expanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expandable content */}
      <div
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-6 border-t border-gray-100 p-4">
            {/* Color Palette Section */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Palette className="h-4 w-4 text-violet-500" />
                <h5 className="text-sm font-semibold text-charcoal">Color Palette</h5>
              </div>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {result.color_palette.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => copyColor(color)}
                      className="group relative flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5 transition-all hover:border-gray-300 hover:shadow-sm"
                    >
                      <div
                        className="h-6 w-6 rounded-md shadow-inner ring-1 ring-inset ring-black/10"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-mono text-xs text-gray-600">
                        {color}
                      </span>
                      {copiedColor === color ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                    </button>
                  ))}
                </div>
                {result.dominant_color && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Dominant:</span>
                    <div
                      className="h-4 w-4 rounded ring-1 ring-inset ring-black/10"
                      style={{ backgroundColor: result.dominant_color }}
                    />
                    <span className="font-mono text-xs">{result.dominant_color}</span>
                    <span className="mx-1">-</span>
                    <span className="italic">{result.color_mood}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Materials Section */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Shirt className="h-4 w-4 text-agile-teal" />
                <h5 className="text-sm font-semibold text-charcoal">Suggested Materials</h5>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.suggested_materials.map((material, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-agile-teal/20 bg-agile-teal/5 px-3 py-1 text-sm font-medium text-agile-teal"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </section>

            {/* Market Analysis Section */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <h5 className="text-sm font-semibold text-charcoal">Market Analysis</h5>
              </div>
              <div className="space-y-3 rounded-lg bg-gray-50 p-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Target Audience
                  </p>
                  <p className="mt-1 text-sm text-charcoal">{result.target_audience}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Market Fit Score
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-agile-teal to-mint-accent transition-all duration-500"
                        style={{ width: `${result.market_fit_score}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-agile-teal">
                      {result.market_fit_score}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {result.market_fit_explanation}
                  </p>
                </div>
              </div>
            </section>

            {/* Trend Alignment Section */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <h5 className="text-sm font-semibold text-charcoal">Trend Alignment</h5>
              </div>
              <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                {result.trend_alignment}
              </p>
            </section>

            {/* Seasonal Relevance */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                <h5 className="text-sm font-semibold text-charcoal">Seasonal Relevance</h5>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.seasonal_relevance.map((season, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium capitalize text-orange-700"
                  >
                    {season}
                  </span>
                ))}
              </div>
            </section>

            {/* Production Info */}
            <section className="flex gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Factory className="h-4 w-4 text-gray-500" />
                  <h5 className="text-sm font-semibold text-charcoal">Complexity</h5>
                </div>
                <span
                  className={cn(
                    'inline-block rounded-full px-3 py-1 text-sm font-medium capitalize',
                    complexityColors[result.production_complexity]
                  )}
                >
                  {result.production_complexity}
                </span>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <h5 className="text-sm font-semibold text-charcoal">Price Point</h5>
                </div>
                <span
                  className={cn(
                    'inline-block rounded-full px-3 py-1 text-sm font-medium capitalize',
                    pricePointColors[result.estimated_price_point]
                  )}
                >
                  {result.estimated_price_point}
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
