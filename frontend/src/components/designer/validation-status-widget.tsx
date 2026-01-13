'use client';

import Link from 'next/link';
import { Activity, ArrowRight, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useValidations } from '@/lib/hooks/use-validations';
import { cn } from '@/lib/utils';
import type { Validation, ValidationStatus } from '@/types/validation';

const STATUS_CONFIG: Record<ValidationStatus, { bg: string; text: string; icon: React.ElementType }> = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
  active: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Loader2 },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
  failed: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', icon: XCircle },
};

interface ValidationItemProps {
  validation: Validation;
}

function ValidationItem({ validation }: ValidationItemProps) {
  const config = STATUS_CONFIG[validation.status];
  const StatusIcon = config.icon;

  return (
    <Link
      href={`/validations/${validation.id}`}
      className="group flex items-center justify-between rounded-lg p-3 transition-colors duration-200 hover:bg-gray-50"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-charcoal transition-colors duration-200 group-hover:text-agile-teal">
          {validation.design?.title ?? `Validation #${validation.id}`}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn('h-5 gap-1 px-2 text-[10px] font-medium uppercase tracking-wide', config.bg, config.text)}
          >
            <StatusIcon className={cn('h-3 w-3', validation.status === 'active' && 'animate-spin')} />
            {validation.status}
          </Badge>
          {validation.time_remaining && validation.status === 'active' && (
            <span className="text-xs text-gray-400">{validation.time_remaining} remaining</span>
          )}
        </div>
      </div>

      {/* Score badge for completed validations */}
      {validation.status === 'completed' && validation.validation_score !== null && (
        <div
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-serif text-sm font-bold',
            validation.validation_score >= 70
              ? 'bg-emerald-100 text-emerald-700'
              : validation.validation_score >= 40
              ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700'
          )}
        >
          {validation.validation_score}
        </div>
      )}
    </Link>
  );
}

function ValidationItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-5 w-20" />
      </div>
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: number;
  color: 'amber' | 'blue' | 'emerald';
}

function StatPill({ label, value, color }: StatPillProps) {
  const colorStyles = {
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className={cn('flex items-center gap-2 rounded-lg border px-3 py-2', colorStyles[color])}>
      <span className="font-serif text-xl font-bold">{value}</span>
      <span className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
        <Activity className="h-8 w-8 text-gray-400" />
      </div>
      <p className="font-medium text-charcoal">No validations yet</p>
      <p className="mt-1 text-sm text-gray-500">Validate your designs with real audience feedback</p>
      <Button asChild className="mt-4 bg-agile-teal hover:bg-agile-teal/90">
        <Link href="/validations/new">Start Validation</Link>
      </Button>
    </div>
  );
}

export function ValidationStatusWidget() {
  const { data, isLoading } = useValidations({ per_page: 10 });
  const validations = data?.data ?? [];
  const recentValidations = validations.slice(0, 3);

  // Calculate counts
  const pendingCount = validations.filter((v) => v.status === 'pending').length;
  const activeCount = validations.filter((v) => v.status === 'active').length;
  const completedCount = validations.filter((v) => v.status === 'completed').length;

  return (
    <Card className="border-gray-100 bg-white">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
            <Activity className="h-4 w-4 text-indigo-600" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-charcoal">Validations</h3>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-1.5 text-sm text-gray-500 hover:text-agile-teal"
        >
          <Link href="/validations">
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-4">
        {isLoading ? (
          <>
            <div className="mb-4 flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 flex-1 rounded-lg" />
              ))}
            </div>
            <div className="space-y-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <ValidationItemSkeleton key={i} />
              ))}
            </div>
          </>
        ) : validations.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Stats row */}
            <div className="mb-4 flex gap-3">
              <StatPill label="Pending" value={pendingCount} color="amber" />
              <StatPill label="Active" value={activeCount} color="blue" />
              <StatPill label="Done" value={completedCount} color="emerald" />
            </div>

            {/* Recent validations */}
            <div className="space-y-1">
              {recentValidations.map((validation) => (
                <ValidationItem key={validation.id} validation={validation} />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
