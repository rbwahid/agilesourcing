'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inbox, Eye, MessageSquare, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SupplierDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Supplier Dashboard</h1>
          <p className="text-sm text-charcoal-light">
            Manage inquiries and connect with fashion designers.
          </p>
        </div>
        <Button className="bg-agile-teal hover:bg-agile-teal/90" asChild>
          <Link href="/inquiries">
            <Inbox className="mr-2 h-4 w-4" />
            View All Inquiries
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-light-grey">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-light">
              New Inquiries
            </CardTitle>
            <Inbox className="h-4 w-4 text-agile-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">0</div>
            <p className="text-xs text-charcoal-light">Awaiting your response</p>
          </CardContent>
        </Card>

        <Card className="border-light-grey">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-light">
              Profile Views
            </CardTitle>
            <Eye className="h-4 w-4 text-agile-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">0</div>
            <p className="text-xs text-charcoal-light">Designers viewing your profile</p>
          </CardContent>
        </Card>

        <Card className="border-light-grey">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-light">
              Active Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-agile-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">0</div>
            <p className="text-xs text-charcoal-light">Ongoing designer discussions</p>
          </CardContent>
        </Card>

        <Card className="border-light-grey">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-light">
              Response Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-agile-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">--</div>
            <p className="text-xs text-charcoal-light">Your average response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Inquiries */}
        <Card className="border-light-grey lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-charcoal">Recent Inquiries</CardTitle>
            <CardDescription>Latest design inquiries from designers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-agile-teal/10">
                <Inbox className="h-8 w-8 text-agile-teal" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-charcoal">No inquiries yet</h3>
              <p className="mb-6 max-w-sm text-sm text-charcoal-light">
                Once designers discover your capabilities, their inquiries will appear here. Make sure your profile is complete!
              </p>
              <Button className="bg-agile-teal hover:bg-agile-teal/90" asChild>
                <Link href="/settings">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Your Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-light-grey">
          <CardHeader>
            <CardTitle className="text-charcoal">Quick Actions</CardTitle>
            <CardDescription>Manage your supplier presence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/inquiries">
                View all inquiries
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/settings">
                Update capabilities
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/settings">
                Manage certifications
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/settings">
                Edit profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
