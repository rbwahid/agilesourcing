'use client';

import { useUser } from '@/lib/hooks/use-auth';
import { useVerificationHandler } from '@/lib/hooks/use-verification-handler';
import {
  DesignerStatsGrid,
  DesignQuickActions,
  RecentDesignsWidget,
  ValidationStatusWidget,
} from '@/components/designer';
import { Skeleton } from '@/components/ui/skeleton';

function WelcomeHeader({ name }: { name?: string }) {
  const greeting = getGreeting();
  const firstName = name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-1">
      <h1 className="font-serif text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
        {greeting}, {firstName}
      </h1>
      <p className="text-gray-500">
        Here&apos;s what&apos;s happening with your designs today.
      </p>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-12 w-full max-w-xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}

export default function DesignerDashboardPage() {
  const { data: user, isLoading } = useUser();

  // Handle email verification redirect notifications
  useVerificationHandler();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <WelcomeHeader name={user?.name} />

      {/* Stats Grid */}
      <DesignerStatsGrid />

      {/* Quick Actions */}
      <DesignQuickActions />

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Designs */}
        <RecentDesignsWidget />

        {/* Validation Status */}
        <ValidationStatusWidget />
      </div>
    </div>
  );
}
