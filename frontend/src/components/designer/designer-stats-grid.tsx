'use client';

import { Palette, Eye, CheckCircle, Heart, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDesignStats } from '@/lib/hooks/use-designs';
import { useSavedSuppliers } from '@/lib/hooks/use-suppliers';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  trend?: number;
  accentColor?: string;
}

function StatCard({ icon: Icon, label, value, trend, accentColor = 'bg-agile-teal/10' }: StatCardProps) {
  const hasTrend = trend !== undefined && trend !== 0;
  const isPositive = trend && trend > 0;

  return (
    <Card className="group relative overflow-hidden border-gray-100 bg-white p-5 transition-all duration-300 hover:border-gray-200 hover:shadow-md">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-agile-teal/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl', accentColor)}>
            <Icon className="h-5 w-5 text-agile-teal" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="mt-0.5 font-serif text-3xl font-bold tracking-tight text-charcoal">
              {value.toLocaleString()}
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

export function DesignerStatsGrid() {
  const { data: designStats, isLoading: designsLoading } = useDesignStats();
  const { data: savedSuppliers, isLoading: suppliersLoading } = useSavedSuppliers();

  const isLoading = designsLoading || suppliersLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const stats = [
    {
      icon: Palette,
      label: 'Total Designs',
      value: designStats?.total_designs ?? 0,
      trend: 12,
      accentColor: 'bg-agile-teal/10',
    },
    {
      icon: Eye,
      label: 'Published',
      value: designStats?.active_designs ?? 0,
      trend: 8,
      accentColor: 'bg-mint-accent/15',
    },
    {
      icon: CheckCircle,
      label: 'Validations',
      value: designStats?.pending_analysis ?? 0,
      trend: -3,
      accentColor: 'bg-indigo-100',
    },
    {
      icon: Heart,
      label: 'Saved Suppliers',
      value: savedSuppliers?.length ?? 0,
      accentColor: 'bg-rose-100',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
