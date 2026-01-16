'use client';

import { UserPlus, ShieldCheck, CreditCard, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentActivity } from '@/lib/hooks/use-admin';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import type { AdminActivity } from '@/types/admin';
import { cn } from '@/lib/utils';

interface ActivityItemProps {
  activity: AdminActivity;
}

function getActivityIcon(type: AdminActivity['type']) {
  switch (type) {
    case 'user_registered':
      return { icon: UserPlus, color: 'bg-emerald-100 text-emerald-600' };
    case 'verification_submitted':
      return { icon: ShieldCheck, color: 'bg-amber-100 text-amber-600' };
    case 'subscription_changed':
      return { icon: CreditCard, color: 'bg-indigo-100 text-indigo-600' };
    default:
      return { icon: Clock, color: 'bg-gray-100 text-gray-600' };
  }
}

function ActivityItem({ activity }: ActivityItemProps) {
  const { icon: Icon, color } = getActivityIcon(activity.type);

  return (
    <div className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50">
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-charcoal">{activity.description}</p>
        <p className="mt-0.5 text-xs text-gray-400">
          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

function ActivityItemSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-agile-teal/10">
        <Clock className="h-8 w-8 text-agile-teal" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-charcoal">No recent activity</h3>
      <p className="mb-6 max-w-sm text-sm text-charcoal-light">
        Platform activity will appear here as users register, submit designs, and interact with the platform.
      </p>
      <Button className="bg-agile-teal hover:bg-agile-teal/90" asChild>
        <Link href="/users">
          <UserPlus className="mr-2 h-4 w-4" />
          View All Users
        </Link>
      </Button>
    </div>
  );
}

interface AdminRecentActivityProps {
  limit?: number;
  className?: string;
}

export function AdminRecentActivity({ limit = 10, className }: AdminRecentActivityProps) {
  const { data: activities, isLoading } = useRecentActivity(limit);

  return (
    <Card className={cn('border-light-grey', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-serif text-lg text-charcoal">Recent Activity</CardTitle>
          <CardDescription>Latest platform events and actions</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="text-agile-teal hover:text-agile-teal/80">
          <Link href="/users">View Users</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <ActivityItemSkeleton key={i} />
            ))}
          </div>
        ) : !activities || activities.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="-mx-3 space-y-1">
            {activities.map((activity) => (
              <ActivityItem key={`${activity.type}-${activity.user_id}-${activity.created_at}`} activity={activity} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
