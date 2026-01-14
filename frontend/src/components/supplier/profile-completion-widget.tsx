'use client';

import Link from 'next/link';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  User,
  Building2,
  MapPin,
  Award,
  Package,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useSupplierStats, useSupplierProfile } from '@/lib/hooks/use-suppliers';

interface ChecklistItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  isComplete: boolean;
}

function ChecklistItemRow({ item }: { item: ChecklistItem }) {
  return (
    <Link
      href={item.href}
      className={cn(
        'group flex items-center gap-3 rounded-lg p-2 transition-colors',
        item.isComplete
          ? 'opacity-60'
          : 'hover:bg-gray-50'
      )}
    >
      <div className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
        item.isComplete
          ? 'bg-emerald-100'
          : 'bg-gray-100 group-hover:bg-agile-teal/10'
      )}>
        {item.isComplete ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <item.icon className="h-4 w-4 text-gray-400 group-hover:text-agile-teal" />
        )}
      </div>
      <span className={cn(
        'flex-1 text-sm font-medium',
        item.isComplete ? 'text-gray-400 line-through' : 'text-charcoal'
      )}>
        {item.label}
      </span>
      {!item.isComplete && (
        <ArrowRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-agile-teal" />
      )}
    </Link>
  );
}

function CompletionSkeleton() {
  return (
    <Card className="border-gray-100 bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>
        <Skeleton className="mt-2 h-2 w-full rounded-full" />
      </CardHeader>
      <CardContent className="space-y-1 pt-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ProfileCompletionWidget() {
  const { data: stats, isLoading: statsLoading } = useSupplierStats();
  const { data: profile, isLoading: profileLoading } = useSupplierProfile();

  const isLoading = statsLoading || profileLoading;

  if (isLoading) {
    return <CompletionSkeleton />;
  }

  const completion = stats?.profile_completion ?? 0;
  const isComplete = completion >= 100;

  // Build checklist based on profile data
  const checklistItems: ChecklistItem[] = [
    {
      id: 'name',
      label: 'Add company name',
      icon: Building2,
      href: '/supplier-profile',
      isComplete: !!profile?.company_name,
    },
    {
      id: 'logo',
      label: 'Upload company logo',
      icon: User,
      href: '/supplier-profile',
      isComplete: !!profile?.logo_url,
    },
    {
      id: 'location',
      label: 'Add location',
      icon: MapPin,
      href: '/supplier-profile',
      isComplete: !!profile?.location,
    },
    {
      id: 'certifications',
      label: 'Add certifications',
      icon: Award,
      href: '/supplier-certifications',
      isComplete: (profile?.certifications?.length ?? 0) > 0,
    },
    {
      id: 'catalog',
      label: 'Add catalog items',
      icon: Package,
      href: '/supplier-catalog',
      isComplete: (profile?.catalog_count ?? 0) > 0,
    },
  ];

  const incompleteItems = checklistItems.filter((item) => !item.isComplete);
  const completedCount = checklistItems.length - incompleteItems.length;

  return (
    <Card className="border-gray-100 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold text-charcoal">
              Profile Completion
            </h3>
            <p className="text-sm text-gray-500">
              {completedCount} of {checklistItems.length} completed
            </p>
          </div>

          {/* Circular progress indicator */}
          <div className="relative flex h-14 w-14 items-center justify-center">
            <svg className="h-14 w-14 -rotate-90 transform">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="4"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke={isComplete ? '#10b981' : '#00B391'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(completion / 100) * 150.8} 150.8`}
                className="transition-all duration-500"
              />
            </svg>
            <span className={cn(
              'absolute font-serif text-lg font-bold',
              isComplete ? 'text-emerald-600' : 'text-agile-teal'
            )}>
              {completion}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={completion} className="mt-3 h-1.5 bg-gray-100" />
      </CardHeader>

      <CardContent className="pt-0">
        {isComplete ? (
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-emerald-50 to-agile-teal/5 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Sparkles className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-emerald-700">Profile Complete!</p>
              <p className="text-sm text-emerald-600/80">
                Your profile is optimized for visibility
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
              Complete to improve visibility
            </p>
            {checklistItems.map((item) => (
              <ChecklistItemRow key={item.id} item={item} />
            ))}
          </div>
        )}

        {!isComplete && (
          <Button
            asChild
            className="mt-4 w-full gap-2 bg-agile-teal hover:bg-agile-teal/90"
          >
            <Link href="/supplier-profile">
              Complete Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
