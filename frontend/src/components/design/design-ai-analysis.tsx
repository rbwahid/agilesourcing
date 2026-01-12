'use client';

import { Sparkles, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DesignTrendScore } from './design-trend-score';
import { DesignAnalysisDetails } from './design-analysis-details';
import type { AIAnalysisStatus, AIAnalysisResult } from '@/types/design';
import { cn } from '@/lib/utils';

interface DesignAIAnalysisProps {
  status: AIAnalysisStatus;
  result?: AIAnalysisResult | null;
  trendScore?: number | null;
  onRetryAnalysis?: () => void;
  isRetrying?: boolean;
}

export function DesignAIAnalysis({
  status,
  result,
  trendScore,
  onRetryAnalysis,
  isRetrying = false,
}: DesignAIAnalysisProps) {
  const isPending = status === 'pending';
  const isProcessing = status === 'processing';
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';

  return (
    <Card
      className={cn(
        'overflow-hidden border-0 shadow-lg shadow-gray-200/50 transition-all duration-300',
        isPending && 'ring-1 ring-gray-200',
        isProcessing && 'ring-2 ring-agile-teal/30',
        isCompleted && 'ring-1 ring-emerald-200',
        isFailed && 'ring-1 ring-red-200'
      )}
    >
      <CardHeader className="border-b bg-gradient-to-r from-violet-50/80 to-purple-50/80 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-serif">AI Analysis</span>

          {isPending && (
            <span className="ml-auto rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              Pending
            </span>
          )}
          {isProcessing && (
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-agile-teal/10 px-2.5 py-0.5 text-xs font-medium text-agile-teal">
              <Loader2 className="h-3 w-3 animate-spin" />
              Analyzing
            </span>
          )}
          {isCompleted && (
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="h-3 w-3" />
              Complete
            </span>
          )}
          {isFailed && (
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
              <AlertCircle className="h-3 w-3" />
              Failed
            </span>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Pending State */}
        {isPending && (
          <div className="text-center">
            <div className="relative mx-auto mb-4 h-20 w-20">
              <div
                className="absolute inset-0 animate-ping rounded-full bg-violet-200 opacity-75"
                style={{ animationDuration: '3s' }}
              />
              <div className="absolute inset-2 animate-pulse rounded-full bg-violet-100" style={{ animationDelay: '0.5s' }} />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100">
                <Sparkles className="h-8 w-8 text-violet-600" />
              </div>
            </div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">
              Analysis Queued
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
              Your design will be analyzed shortly. AI-powered trend detection
              and style recommendations are on the way.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: '0ms' }} />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: '150ms' }} />
              <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="text-center">
            <div className="relative mx-auto mb-4 h-20 w-20">
              <div className="absolute inset-0 animate-pulse rounded-full bg-agile-teal/20" />
              {/* Rotating ring */}
              <svg className="absolute inset-0 h-20 w-20 animate-spin" style={{ animationDuration: '3s' }}>
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="80 160"
                  className="text-agile-teal"
                />
              </svg>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-agile-teal/10 to-mint-accent/10">
                <Loader2 className="h-8 w-8 animate-spin text-agile-teal" />
              </div>
            </div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">
              Analyzing Design
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
              Our AI is examining style patterns, color palettes, and market
              trends to provide actionable insights.
            </p>
            <div className="mx-auto mt-4 max-w-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Processing...</span>
                <span className="font-medium text-agile-teal">In Progress</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-agile-teal to-mint-accent" />
              </div>
            </div>
          </div>
        )}

        {/* Completed State */}
        {isCompleted && result && (
          <div className="space-y-6">
            {/* Trend Score + Quick Stats */}
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {/* Trend Score Circle */}
              <div className="flex flex-col items-center">
                <DesignTrendScore
                  score={trendScore ?? result.trend_score ?? 0}
                  size="lg"
                  showLabel
                  animated
                />
              </div>

              {/* Quick stats */}
              <div className="flex-1 space-y-4">
                {/* Keywords */}
                {result.keywords && result.keywords.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                      Keywords
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywords.slice(0, 6).map((keyword, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
                        >
                          {keyword}
                        </span>
                      ))}
                      {result.keywords.length > 6 && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                          +{result.keywords.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Style Tags */}
                {result.style_tags && result.style_tags.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                      Style Tags
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.style_tags.map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-agile-teal/10 px-2.5 py-1 text-xs font-medium text-agile-teal"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Preview */}
                {result.color_palette && result.color_palette.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                      Color Palette
                    </p>
                    <div className="flex gap-1.5">
                      {result.color_palette.slice(0, 6).map((color, i) => (
                        <div
                          key={i}
                          className="h-7 w-7 rounded-lg shadow-inner ring-1 ring-inset ring-black/10 transition-transform hover:scale-110"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Analysis */}
            <DesignAnalysisDetails result={result} />
          </div>
        )}

        {/* Completed but no result */}
        {isCompleted && !result && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-500" />
            <h3 className="font-serif text-lg font-semibold text-charcoal">
              Analysis Complete
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
              No additional insights were generated for this design.
            </p>
          </div>
        )}

        {/* Failed State */}
        {isFailed && (
          <div className="text-center">
            <div className="relative mx-auto mb-4 h-16 w-16">
              <div className="absolute inset-0 rounded-full bg-red-100" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">
              Analysis Failed
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
              We couldn&apos;t analyze this design. This might be due to image
              quality or a temporary issue.
            </p>
            {onRetryAnalysis && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-2"
                onClick={onRetryAnalysis}
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isRetrying ? 'Retrying...' : 'Retry Analysis'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
