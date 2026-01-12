'use client';

import { Layers, CheckCircle, FileText, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { DesignStats } from '@/types/design';
import { cn } from '@/lib/utils';

interface DesignStatsCardsProps {
  stats?: DesignStats;
  isLoading?: boolean;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'teal' | 'green' | 'amber' | 'purple';
}

const colorClasses = {
  teal: {
    bg: 'bg-agile-teal/10',
    text: 'text-agile-teal',
    glow: 'shadow-agile-teal/10',
  },
  green: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    glow: 'shadow-emerald-500/10',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    glow: 'shadow-amber-500/10',
  },
  purple: {
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    glow: 'shadow-violet-500/10',
  },
};

function StatCard({ label, value, icon, color }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <Card
      className={cn(
        'border-0 bg-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl',
        colors.glow
      )}
    >
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl',
            colors.bg
          )}
        >
          <div className={colors.text}>{icon}</div>
        </div>
        <div>
          <p className="text-2xl font-bold text-charcoal">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="border-0 bg-white shadow-lg">
      <CardContent className="flex items-center gap-4 p-5">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DesignStatsCards({ stats, isLoading }: DesignStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Designs"
        value={stats.total_designs}
        icon={<Layers className="h-6 w-6" />}
        color="teal"
      />
      <StatCard
        label="Active"
        value={stats.active_designs}
        icon={<CheckCircle className="h-6 w-6" />}
        color="green"
      />
      <StatCard
        label="Drafts"
        value={stats.draft_designs}
        icon={<FileText className="h-6 w-6" />}
        color="amber"
      />
      <StatCard
        label="Pending Analysis"
        value={stats.pending_analysis}
        icon={<Sparkles className="h-6 w-6" />}
        color="purple"
      />
    </div>
  );
}
