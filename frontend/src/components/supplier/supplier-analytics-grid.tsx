'use client';

import { useState } from 'react';
import {
  Eye,
  MessageSquare,
  Heart,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useSupplierStats } from '@/lib/hooks/use-suppliers';

type TimePeriod = '7d' | '30d' | '90d';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  trend?: number;
  iconBg: string;
  iconColor: string;
}

function StatCard({ icon: Icon, label, value, trend, iconBg, iconColor }: StatCardProps) {
  const hasTrend = trend !== undefined && trend !== 0;
  const isPositive = trend && trend > 0;

  return (
    <Card className="group relative overflow-hidden border-gray-100 bg-white p-5 transition-all duration-300 hover:border-gray-200 hover:shadow-md">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-agile-teal/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Background Pattern */}
      <div
        className="absolute right-0 top-0 h-20 w-20 -translate-y-6 translate-x-6 opacity-[0.03] transition-transform duration-500 group-hover:scale-150"
        style={{
          background: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '6px 6px',
        }}
      />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-0.5 font-serif text-3xl font-bold tracking-tight text-charcoal">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
        </div>

        {hasTrend && (
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
              isPositive
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-600'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="border-gray-100 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-2 h-9 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </Card>
  );
}

interface SupplierAnalyticsGridProps {
  showPeriodSelector?: boolean;
}

export function SupplierAnalyticsGrid({ showPeriodSelector = false }: SupplierAnalyticsGridProps) {
  const [period, setPeriod] = useState<TimePeriod>('30d');
  const { data: stats, isLoading } = useSupplierStats();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {showPeriodSelector && (
          <div className="flex justify-end">
            <Skeleton className="h-9 w-48" />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: Eye,
      label: 'Profile Views',
      value: stats?.profile_views ?? 0,
      trend: stats?.profile_views_change,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: MessageSquare,
      label: 'Inquiries',
      value: stats?.inquiries_received ?? 0,
      trend: stats?.inquiries_change,
      iconBg: 'bg-agile-teal/10',
      iconColor: 'text-agile-teal',
    },
    {
      icon: Heart,
      label: 'Saved by Designers',
      value: stats?.saved_by_designers ?? 0,
      trend: stats?.saved_change,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-500',
    },
    {
      icon: Clock,
      label: 'Response Rate',
      value: `${stats?.response_rate ?? 0}%`,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
  ];

  return (
    <div className="space-y-4">
      {showPeriodSelector && (
        <div className="flex justify-end">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            {(['7d', '30d', '90d'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  period === p
                    ? 'bg-agile-teal text-white'
                    : 'text-gray-600 hover:text-charcoal'
                )}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
}
