'use client';

import { useState, useMemo } from 'react';
import { Eye, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useSupplierViewsTimeline } from '@/lib/hooks/use-suppliers';

type TimePeriod = 7 | 30 | 90;

interface BarProps {
  date: string;
  views: number;
  maxViews: number;
  isToday: boolean;
}

function Bar({ date, views, maxViews, isToday }: BarProps) {
  const height = maxViews > 0 ? (views / maxViews) * 100 : 0;
  const dayLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
  const dateLabel = new Date(date).getDate();

  return (
    <div className="group flex flex-1 flex-col items-center gap-1">
      {/* Tooltip */}
      <div className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 scale-0 whitespace-nowrap rounded-lg bg-charcoal px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-all group-hover:scale-100 group-hover:opacity-100">
        <span className="font-semibold">{views}</span> views
        <br />
        <span className="text-gray-300">
          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Bar container */}
      <div className="relative flex h-24 w-full items-end justify-center">
        <div
          className={cn(
            'w-full max-w-[20px] rounded-t transition-all duration-300',
            isToday
              ? 'bg-agile-teal'
              : 'bg-agile-teal/30 group-hover:bg-agile-teal/60'
          )}
          style={{ height: `${Math.max(height, 4)}%` }}
        />
      </div>

      {/* Date label */}
      <span className={cn(
        'text-[10px]',
        isToday ? 'font-semibold text-agile-teal' : 'text-gray-400'
      )}>
        {dateLabel}
      </span>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="flex h-32 items-end gap-1">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <Skeleton className="h-16 w-3 rounded-t" style={{ height: `${Math.random() * 60 + 20}%` }} />
            <Skeleton className="h-3 w-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ViewsChartWidget() {
  const [days, setDays] = useState<TimePeriod>(30);
  const { data: timeline, isLoading } = useSupplierViewsTimeline(days);

  // Get last 14 data points for display
  const displayData = useMemo(() => {
    if (!timeline) return [];
    const sliceCount = days === 7 ? 7 : 14;
    return timeline.slice(-sliceCount);
  }, [timeline, days]);

  const maxViews = useMemo(() => {
    if (!displayData.length) return 0;
    return Math.max(...displayData.map((d) => d.views));
  }, [displayData]);

  const totalViews = useMemo(() => {
    if (!timeline) return 0;
    return timeline.reduce((sum, d) => sum + d.views, 0);
  }, [timeline]);

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card className="border-gray-100 bg-white">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
            <Eye className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">Profile Views</h3>
            <p className="text-sm text-gray-500">
              <span className="font-medium text-charcoal">{totalViews.toLocaleString()}</span> total views
            </p>
          </div>
        </div>

        {/* Period selector */}
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          {([7, 30, 90] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                days === d
                  ? 'bg-white text-charcoal shadow-sm'
                  : 'text-gray-500 hover:text-charcoal'
              )}
            >
              {d}d
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {isLoading ? (
          <ChartSkeleton />
        ) : displayData.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-gray-500">
            No view data available yet
          </div>
        ) : (
          <div className="relative flex h-32 items-end gap-0.5 sm:gap-1">
            {displayData.map((item) => (
              <Bar
                key={item.date}
                date={item.date}
                views={item.views}
                maxViews={maxViews}
                isToday={item.date === today}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
