'use client';

import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSignupTrends } from '@/lib/hooks/use-admin';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface SignupTrendChartProps {
  days?: number;
  className?: string;
}

export function SignupTrendChart({ days = 14, className }: SignupTrendChartProps) {
  const { data: trends, isLoading } = useSignupTrends(days);

  const maxCount = trends ? Math.max(...trends.map((t) => t.count), 1) : 1;

  return (
    <Card className={cn('border-light-grey', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="font-serif text-lg text-charcoal">Signup Trends</CardTitle>
          <CardDescription>New user registrations over the past {days} days</CardDescription>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex items-end gap-1 h-32">
              {Array.from({ length: days }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : !trends || trends.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-gray-400">
            No signup data available
          </div>
        ) : (
          <div className="space-y-3">
            {/* Chart Bars */}
            <div className="flex items-end gap-1 h-32">
              {trends.map((trend, index) => {
                const height = (trend.count / maxCount) * 100;
                const isToday = index === trends.length - 1;

                return (
                  <div
                    key={trend.date}
                    className="group relative flex-1"
                    style={{ height: '100%' }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-charcoal px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {trend.count} signups
                      <br />
                      {format(parseISO(trend.date), 'MMM d')}
                    </div>

                    {/* Bar */}
                    <div
                      className={cn(
                        'absolute bottom-0 w-full rounded-t transition-all duration-200',
                        isToday
                          ? 'bg-agile-teal'
                          : 'bg-agile-teal/30 group-hover:bg-agile-teal/50'
                      )}
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-gray-400">
              <span>{trends.length > 0 ? format(parseISO(trends[0].date), 'MMM d') : ''}</span>
              <span>
                {trends.length > 0 ? format(parseISO(trends[trends.length - 1].date), 'MMM d') : ''}
              </span>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
              <span className="text-sm text-gray-500">Total signups</span>
              <span className="font-semibold text-charcoal">
                {trends.reduce((sum, t) => sum + t.count, 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
