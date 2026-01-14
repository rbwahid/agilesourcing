'use client';

import Link from 'next/link';
import {
  Eye,
  MessageSquare,
  Heart,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  UserCircle,
  Award,
  Package,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useSupplierStats } from '@/lib/hooks/use-suppliers';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconBg: string;
  iconColor: string;
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:border-gray-200 hover:shadow-lg">
      {/* Background Pattern */}
      <div
        className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 opacity-5 transition-transform duration-500 group-hover:scale-150"
        style={{
          background: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '8px 8px',
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110',
              iconBg
            )}
          >
            <Icon className={cn('h-6 w-6', iconColor)} />
          </div>

          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                trend.isPositive
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-700'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 font-serif text-3xl font-bold text-charcoal">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SupplierStatsOverview() {
  const { data: stats, isLoading, error } = useSupplierStats();

  if (isLoading) {
    return <SupplierStatsOverviewSkeleton />;
  }

  if (error || !stats) {
    return (
      <Card className="border-gray-100 p-8 text-center">
        <p className="text-gray-500">Unable to load stats</p>
      </Card>
    );
  }

  const profileCompletion = stats.profile_completion || 0;

  // Helper to convert change number to trend object
  const getTrend = (change: number | undefined) => {
    if (change === undefined || change === 0) return undefined;
    return { value: Math.abs(change), isPositive: change > 0 };
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Profile Views"
          value={stats.profile_views?.toLocaleString() || '0'}
          icon={Eye}
          trend={getTrend(stats.profile_views_change)}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Inquiries"
          value={stats.inquiries_received?.toLocaleString() || '0'}
          icon={MessageSquare}
          trend={getTrend(stats.inquiries_change)}
          iconBg="bg-agile-teal/10"
          iconColor="text-agile-teal"
        />
        <StatCard
          title="Saved by Designers"
          value={stats.saved_by_designers?.toLocaleString() || '0'}
          icon={Heart}
          trend={getTrend(stats.saved_change)}
          iconBg="bg-rose-100"
          iconColor="text-rose-500"
        />
        <StatCard
          title="Profile Score"
          value={`${profileCompletion}%`}
          icon={Package}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
        />
      </div>

      {/* Profile Completion & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Completion */}
        <Card className="border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                Profile Completion
              </h3>
              <p className="text-sm text-gray-500">
                Complete your profile to attract more designers
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-agile-teal/20">
              <span className="font-serif text-xl font-bold text-agile-teal">
                {profileCompletion}%
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Progress
              value={profileCompletion}
              className="h-2 bg-gray-100"
            />
          </div>

          {profileCompletion < 100 && (
            <div className="mt-4">
              <Button asChild size="sm" className="gap-2 bg-agile-teal hover:bg-agile-teal/90">
                <Link href="/supplier-profile">
                  Complete Profile
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          )}

          {profileCompletion === 100 && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              Your profile is complete! Great job.
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-100 p-6">
          <h3 className="font-serif text-lg font-semibold text-charcoal">
            Quick Actions
          </h3>
          <p className="text-sm text-gray-500">
            Manage your supplier profile
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link
              href="/supplier-profile"
              className="group flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center transition-all hover:border-agile-teal/30 hover:bg-agile-teal/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">
                <UserCircle className="h-5 w-5 text-agile-teal" />
              </div>
              <span className="mt-2 text-sm font-medium text-charcoal">
                Edit Profile
              </span>
            </Link>

            <Link
              href="/supplier-certifications"
              className="group flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center transition-all hover:border-agile-teal/30 hover:bg-agile-teal/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">
                <Award className="h-5 w-5 text-amber-500" />
              </div>
              <span className="mt-2 text-sm font-medium text-charcoal">
                Certifications
              </span>
            </Link>

            <Link
              href="/supplier-catalog"
              className="group flex flex-col items-center rounded-xl border border-gray-100 bg-gray-50/50 p-4 text-center transition-all hover:border-agile-teal/30 hover:bg-agile-teal/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">
                <Package className="h-5 w-5 text-violet-600" />
              </div>
              <span className="mt-2 text-sm font-medium text-charcoal">
                Catalog
              </span>
            </Link>
          </div>

          <Button
            asChild
            variant="outline"
            className="mt-4 w-full gap-2 border-gray-200"
          >
            <Link href="/suppliers/me">
              Preview Public Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}

function SupplierStatsOverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-6 w-12 animate-pulse rounded-full bg-gray-100" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
              <div className="h-8 w-16 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-100 p-6">
          <div className="space-y-4">
            <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-64 animate-pulse rounded bg-gray-100" />
            <div className="h-2 w-full animate-pulse rounded bg-gray-100" />
          </div>
        </Card>

        <Card className="border-gray-100 p-6">
          <div className="space-y-4">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-100" />
            <div className="grid gap-3 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
