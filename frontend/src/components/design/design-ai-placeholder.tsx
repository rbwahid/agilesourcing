'use client';

import { Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AIAnalysisStatus, AIAnalysisResult } from '@/types/design';
import { cn } from '@/lib/utils';

interface DesignAIPlaceholderProps {
  status: AIAnalysisStatus;
  result?: AIAnalysisResult | null;
}

export function DesignAIPlaceholder({
  status,
  result,
}: DesignAIPlaceholderProps) {
  const isPending = status === 'pending';
  const isProcessing = status === 'processing';
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';

  return (
    <Card
      className={cn(
        'border-0 shadow-lg shadow-gray-200/50 transition-all duration-300',
        isPending && 'ring-1 ring-gray-200',
        isProcessing && 'ring-2 ring-agile-teal/30',
        isCompleted && 'ring-1 ring-emerald-200',
        isFailed && 'ring-1 ring-red-200'
      )}
    >
      <CardHeader className="border-b bg-gradient-to-r from-violet-50/80 to-purple-50/80 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-violet-600" />
          AI Analysis
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
        {isPending && (
          <div className="text-center">
            <div className="relative mx-auto mb-4 h-16 w-16">
              {/* Animated rings */}
              <div className="absolute inset-0 animate-ping rounded-full bg-violet-200 opacity-75" style={{ animationDuration: '3s' }} />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100">
                <Sparkles className="h-7 w-7 text-violet-600" />
              </div>
            </div>
            <h3 className="font-semibold text-charcoal">Analysis Queued</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your design will be analyzed shortly. AI-powered trend detection
              and style recommendations are coming soon.
            </p>
          </div>
        )}

        {isProcessing && (
          <div className="text-center">
            <div className="relative mx-auto mb-4 h-16 w-16">
              <div className="absolute inset-0 animate-pulse rounded-full bg-agile-teal/20" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-agile-teal/10 to-mint-accent/10">
                <Loader2 className="h-7 w-7 animate-spin text-agile-teal" />
              </div>
            </div>
            <h3 className="font-semibold text-charcoal">Analyzing Design</h3>
            <p className="mt-1 text-sm text-gray-500">
              Our AI is examining your design for style patterns, color palettes,
              and market trends.
            </p>
          </div>
        )}

        {isCompleted && result && (
          <div className="space-y-4">
            {result.keywords && result.keywords.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.style_tags && result.style_tags.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Style Tags
                </p>
                <div className="flex flex-wrap gap-2">
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

            {result.color_palette && result.color_palette.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Color Palette
                </p>
                <div className="flex gap-1.5">
                  {result.color_palette.map((color, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-lg shadow-inner ring-1 ring-inset ring-black/10"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {isCompleted && !result && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-emerald-500" />
            <h3 className="font-semibold text-charcoal">Analysis Complete</h3>
            <p className="mt-1 text-sm text-gray-500">
              No additional insights were generated for this design.
            </p>
          </div>
        )}

        {isFailed && (
          <div className="text-center">
            <AlertCircle className="mx-auto mb-2 h-10 w-10 text-red-500" />
            <h3 className="font-semibold text-charcoal">Analysis Failed</h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn&apos;t analyze this design. Please try uploading a
              clearer image or contact support.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
