'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ShieldCheck, CreditCard, AlertCircle, ArrowRight, UserPlus, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Admin Dashboard</h1>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-light-grey">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-light">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-agile-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">0</div>
            <p className="text-xs text-charcoal-light">Registered on platform</p>
          </CardContent>
        </Card>

        <Card className="border-light-grey">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-light">
              Pending Verifications
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">0</div>
            <p className="text-xs text-charcoal-light">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-light-grey">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-light">
              Active Subscriptions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-agile-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">0</div>
            <p className="text-xs text-charcoal-light">Paying customers</p>
          </CardContent>
        </Card>

        <Card className="border-light-grey">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-light">
              Support Tickets
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-agile-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">0</div>
            <p className="text-xs text-charcoal-light">Open tickets</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="border-light-grey lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-charcoal">Recent Activity</CardTitle>
            <CardDescription>Latest platform events and actions</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-light-grey">
          <CardHeader>
            <CardTitle className="text-charcoal">Management</CardTitle>
            <CardDescription>Platform administration tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/users">
                Manage users
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/verifications">
                Review verifications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/subscriptions">
                View subscriptions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/support">
                Support tickets
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
