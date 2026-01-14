'use client';

import {
  Users,
  CreditCard,
  ShieldCheck,
  Palette,
  TrendingUp,
  TrendingDown,
  UserPlus,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminStats } from '@/lib/hooks/use-admin';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  subValue?: string;
  trend?: number;
  trendLabel?: string;
  accentColor?: string;
  iconColor?: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  trendLabel,
  accentColor = 'bg-agile-teal/10',
  iconColor = 'text-agile-teal',
}: StatCardProps) {
  const hasTrend = trend !== undefined && trend !== 0;
  const isPositive = trend && trend > 0;

  return (
    <Card className="group relative overflow-hidden border-gray-100 bg-white p-5 transition-all duration-300 hover:border-gray-200 hover:shadow-md">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-agile-teal/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl', accentColor)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-0.5 font-serif text-3xl font-bold tracking-tight text-charcoal">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subValue && (
              <p className="mt-1 text-xs text-gray-400">{subValue}</p>
            )}
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
            <span>{Math.abs(trend)}</span>
            {trendLabel && <span className="text-gray-400">{trendLabel}</span>}
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
            <Skeleton className="mt-1 h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </Card>
  );
}

function formatMRR(cents: number): string {
  const dollars = cents / 100;
  if (dollars >= 1000) {
    return `$${(dollars / 1000).toFixed(1)}k`;
  }
  return `$${dollars.toFixed(0)}`;
}

export function AdminStatsGrid() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats?.users.total ?? 0,
      subValue: `${stats?.users.designers ?? 0} designers, ${stats?.users.suppliers ?? 0} suppliers`,
      trend: stats?.users.new_this_week ?? 0,
      trendLabel: 'this week',
      accentColor: 'bg-agile-teal/10',
      iconColor: 'text-agile-teal',
    },
    {
      icon: CreditCard,
      label: 'Active Subscriptions',
      value: stats?.subscriptions.active ?? 0,
      subValue: `MRR: ${formatMRR(stats?.subscriptions.mrr ?? 0)}`,
      trend: stats?.subscriptions.trialing ?? 0,
      trendLabel: 'trialing',
      accentColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      icon: ShieldCheck,
      label: 'Pending Verifications',
      value: stats?.verifications.pending ?? 0,
      subValue: `${stats?.verifications.approved_this_week ?? 0} approved this week`,
      accentColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      icon: Palette,
      label: 'Total Designs',
      value: stats?.designs.total ?? 0,
      subValue: `${stats?.designs.this_week ?? 0} new this week`,
      trend: stats?.designs.this_month ?? 0,
      trendLabel: 'this month',
      accentColor: 'bg-rose-100',
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

// Extended grid with more detailed stats
export function AdminStatsGridExtended() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats?.users.total ?? 0,
      subValue: `${stats?.users.active ?? 0} active`,
      accentColor: 'bg-agile-teal/10',
      iconColor: 'text-agile-teal',
    },
    {
      icon: UserPlus,
      label: 'New Today',
      value: stats?.users.new_today ?? 0,
      trend: stats?.users.new_this_week ?? 0,
      trendLabel: 'this week',
      accentColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      icon: CreditCard,
      label: 'Active Subs',
      value: stats?.subscriptions.active ?? 0,
      subValue: formatMRR(stats?.subscriptions.mrr ?? 0) + ' MRR',
      accentColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      icon: ShieldCheck,
      label: 'Pending Reviews',
      value: stats?.verifications.pending ?? 0,
      accentColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      icon: Palette,
      label: 'Designs',
      value: stats?.designs.total ?? 0,
      subValue: `+${stats?.designs.this_week ?? 0} this week`,
      accentColor: 'bg-rose-100',
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {statCards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
