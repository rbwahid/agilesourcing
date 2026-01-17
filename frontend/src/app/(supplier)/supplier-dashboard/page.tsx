'use client';

import Link from 'next/link';
import { ArrowRight, Inbox, AlertCircle, Settings, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  SupplierAnalyticsGrid,
  ViewsChartWidget,
  ProfileCompletionWidget,
  CertificationShowcaseWidget,
} from '@/components/supplier';
import { useSupplierProfile, useSupplierStats } from '@/lib/hooks/use-suppliers';
import { useUser } from '@/lib/hooks/use-auth';
import { useVerificationHandler } from '@/lib/hooks/use-verification-handler';

function WelcomeHeader({ companyName }: { companyName?: string }) {
  const greeting = getGreeting();
  const displayName = companyName || 'there';

  return (
    <div className="space-y-1">
      <h1 className="font-serif text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
        {greeting}, {displayName}
      </h1>
      <p className="text-gray-500">
        Here&apos;s how your profile is performing today.
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

function QuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild className="gap-2 bg-agile-teal hover:bg-agile-teal/90">
        <Link href="/inquiries">
          <MessageSquare className="h-4 w-4" />
          View Inquiries
        </Link>
      </Button>
      <Button asChild variant="outline" className="gap-2">
        <Link href="/supplier-profile">
          <Settings className="h-4 w-4" />
          Edit Profile
        </Link>
      </Button>
    </div>
  );
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
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}

export default function SupplierDashboardPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: profile, isLoading: profileLoading } = useSupplierProfile();
  const { data: stats, isLoading: statsLoading } = useSupplierStats();

  // Handle email verification redirect notifications
  useVerificationHandler();

  const isLoading = userLoading || profileLoading || statsLoading;

  // Check if profile needs completion
  const needsOnboarding = !profileLoading && profile && !profile.company_name;
  const profileCompletion = stats?.profile_completion ?? 0;
  const showCompletionWidget = profileCompletion < 100;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <WelcomeHeader companyName={profile?.company_name} />
        <QuickActions />
      </div>

      {/* Onboarding Banner */}
      {needsOnboarding && (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-white">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">
                  Complete your profile to get started
                </h3>
                <p className="text-sm text-gray-600">
                  Set up your supplier profile to start receiving inquiries from designers.
                </p>
              </div>
            </div>
            <Button asChild className="gap-2 bg-amber-500 hover:bg-amber-600">
              <Link href="/supplier-onboarding">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analytics Grid */}
      <SupplierAnalyticsGrid showPeriodSelector />

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Views Chart */}
          <ViewsChartWidget />

          {/* Profile Completion (if not complete) */}
          {showCompletionWidget && <ProfileCompletionWidget />}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Certifications */}
          <CertificationShowcaseWidget />

          {/* Recent Inquiries Placeholder */}
          <Card className="border-gray-100 bg-white">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                  <Inbox className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="font-serif text-lg">Recent Inquiries</CardTitle>
                  <CardDescription className="text-sm">
                    Latest requests from designers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                  <MessageSquare className="h-7 w-7 text-gray-300" />
                </div>
                <p className="mt-3 font-medium text-charcoal">No inquiries yet</p>
                <p className="mt-1 max-w-[200px] text-sm text-gray-500">
                  Designers will reach out once they discover your profile
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4 gap-2">
                  <Link href="/supplier-profile">
                    Boost Visibility
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
