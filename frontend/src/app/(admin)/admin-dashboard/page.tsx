'use client';

import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import {
  AdminStatsGrid,
  AdminRecentActivity,
  AdminQuickActionsCompact,
  SignupTrendChart,
} from '@/components/admin';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Admin Dashboard</h1>
          <p className="text-sm text-charcoal-light">
            Platform overview and management tools.
          </p>
        </div>
        <Button className="bg-agile-teal hover:bg-agile-teal/90" asChild>
          <Link href="/verifications">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Review Verifications
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <AdminStatsGrid />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <AdminRecentActivity className="lg:col-span-2" />

        {/* Quick Actions */}
        <AdminQuickActionsCompact />
      </div>

      {/* Signup Trends */}
      <SignupTrendChart days={14} />
    </div>
  );
}
