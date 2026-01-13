'use client';

import Link from 'next/link';
import { ArrowRight, Inbox, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SupplierStatsOverview } from '@/components/supplier';
import { useSupplierProfile } from '@/lib/hooks/use-suppliers';

export default function SupplierDashboardPage() {
  const { data: profile, isLoading } = useSupplierProfile();

  // Check if profile needs completion
  const needsOnboarding = !isLoading && profile && !profile.company_name;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal sm:text-3xl">
            Supplier Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your profile and connect with fashion designers
          </p>
        </div>
        <Button className="gap-2 bg-agile-teal hover:bg-agile-teal/90" asChild>
          <Link href="/inquiries">
            <Inbox className="h-4 w-4" />
            View Inquiries
          </Link>
        </Button>
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

      {/* Stats Overview */}
      <SupplierStatsOverview />

      {/* Recent Inquiries */}
      <Card className="border-gray-100">
        <CardHeader>
          <CardTitle className="font-serif">Recent Inquiries</CardTitle>
          <CardDescription>
            Latest design inquiries from fashion designers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
              <Inbox className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal">
              No inquiries yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Once designers discover your profile, their inquiries will appear here.
              Make sure your profile is complete!
            </p>
            <Button asChild variant="outline" className="mt-6 gap-2">
              <Link href="/supplier-profile">
                Complete Your Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
