'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { AdminUserDetail, AdminUserActivity } from '@/types/admin';
import { cn } from '@/lib/utils';

interface UserActivityCardProps {
  user?: AdminUserDetail;
  isLoading: boolean;
}

function ActivityItem({ activity }: { activity: AdminUserActivity }) {
  return (
    <div className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
        <Clock className="h-4 w-4 text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-charcoal">{activity.description}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
          <span>{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</span>
          {activity.causer && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {activity.causer.name}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ActivityItemSkeleton() {
  return (
    <div className="flex items-start gap-3 p-3">
      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function UserActivityCard({ user, isLoading }: UserActivityCardProps) {
  if (isLoading) {
    return (
      <Card className="border-gray-100">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <ActivityItemSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  const activities = user.recent_activity || [];

  return (
    <Card className="border-gray-100">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-500">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Clock className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="-mx-3 space-y-1">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
