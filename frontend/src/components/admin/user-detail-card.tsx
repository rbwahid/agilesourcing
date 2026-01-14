'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Mail,
  MapPin,
  Globe,
  Calendar,
  Clock,
  Building2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { AdminUserDetail, UserRole } from '@/types/admin';
import { cn } from '@/lib/utils';

interface UserDetailCardProps {
  user?: AdminUserDetail;
  isLoading: boolean;
}

function getRoleLabel(role: UserRole): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'designer':
      return 'Designer';
    case 'supplier':
      return 'Supplier';
  }
}

function getRoleBadgeClass(role: UserRole): string {
  switch (role) {
    case 'super_admin':
      return 'bg-purple-100 text-purple-700';
    case 'admin':
      return 'bg-indigo-100 text-indigo-700';
    case 'designer':
      return 'bg-agile-teal/10 text-agile-teal';
    case 'supplier':
      return 'bg-amber-100 text-amber-700';
  }
}

function DetailRow({
  icon: Icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50">
        <Icon className="h-4 w-4 text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className={cn('text-sm font-medium text-charcoal', valueClassName)}>{value}</p>
      </div>
    </div>
  );
}

export function UserDetailCard({ user, isLoading }: UserDetailCardProps) {
  if (isLoading) {
    return (
      <Card className="border-gray-100">
        <CardHeader>
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="border-gray-100">
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-gray-500">User not found</p>
        </CardContent>
      </Card>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="border-gray-100">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-gray-100">
            <AvatarImage src={user.profile?.avatar_url || undefined} alt={user.name} />
            <AvatarFallback className="bg-agile-teal/10 text-lg font-semibold text-agile-teal">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-charcoal">{user.name}</h2>
              {user.email_verified_at ? (
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              ) : (
                <XCircle className="h-4 w-4 text-gray-300" />
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge className={cn('hover:bg-transparent', getRoleBadgeClass(user.role))}>
                {getRoleLabel(user.role)}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  user.is_active
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-red-300 bg-red-50 text-red-700'
                )}
              >
                {user.is_active ? 'Active' : 'Suspended'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <DetailRow icon={Mail} label="Email" value={user.email} />

        {user.profile?.company_name && (
          <DetailRow icon={Building2} label="Company" value={user.profile.company_name} />
        )}

        {user.profile?.location && (
          <DetailRow icon={MapPin} label="Location" value={user.profile.location} />
        )}

        {user.profile?.website && (
          <DetailRow
            icon={Globe}
            label="Website"
            value={
              <a
                href={user.profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-agile-teal hover:underline"
              >
                {user.profile.website}
              </a>
            }
          />
        )}

        <DetailRow
          icon={Calendar}
          label="Joined"
          value={format(new Date(user.created_at), 'MMMM d, yyyy')}
        />

        <DetailRow
          icon={Clock}
          label="Last Login"
          value={
            user.last_login_at
              ? formatDistanceToNow(new Date(user.last_login_at), { addSuffix: true })
              : 'Never'
          }
          valueClassName={!user.last_login_at ? 'text-gray-400' : undefined}
        />
      </CardContent>
    </Card>
  );
}

// Stats summary card for user detail page
export function UserStatsCard({ user, isLoading }: UserDetailCardProps) {
  if (isLoading) {
    return (
      <Card className="border-gray-100">
        <CardHeader>
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  const stats = user.stats || {};

  return (
    <Card className="border-gray-100">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-500">Activity Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {user.role === 'designer' && (
            <>
              <div>
                <p className="font-serif text-2xl font-bold text-charcoal">
                  {stats.designs_count ?? 0}
                </p>
                <p className="text-xs text-gray-500">Designs</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-charcoal">
                  {stats.saved_suppliers_count ?? 0}
                </p>
                <p className="text-xs text-gray-500">Saved Suppliers</p>
              </div>
            </>
          )}
          {user.role === 'supplier' && (
            <>
              <div>
                <p className="font-serif text-2xl font-bold text-charcoal">
                  {stats.certifications_count ?? 0}
                </p>
                <p className="text-xs text-gray-500">Certifications</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-charcoal">
                  {stats.verified_certifications ?? 0}
                </p>
                <p className="text-xs text-gray-500">Verified</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
