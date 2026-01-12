'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Users, MessageSquare, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DesignerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
          <p className="text-sm text-charcoal-light">
            Welcome back! Here&apos;s an overview of your design journey.
          </p>
        </div>
        <Button className="bg-agile-teal hover:bg-agile-teal/90" asChild>
          <Link href="/designs/new">
            <Plus className="mr-2 h-4 w-4" />
            Upload Design
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-light-grey">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-light">
              Total Designs
            </CardTitle>
            <Palette className="h-4 w-4 text-agile-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">0</div>
            <p className="text-xs text-charcoal-light">Start by uploading your first design</p>
          </CardContent>
        </Card>

        <Card className="border-light-grey">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-light">
              Active Inquiries
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-agile-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">0</div>
            <p className="text-xs text-charcoal-light">Supplier responses to your designs</p>
          </CardContent>
        </Card>

        <Card className="border-light-grey">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-charcoal-light">
              Supplier Matches
            </CardTitle>
            <Users className="h-4 w-4 text-agile-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-charcoal">0</div>
            <p className="text-xs text-charcoal-light">Suppliers interested in your work</p>
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
            <p className="text-xs text-charcoal-light">Average supplier response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Designs */}
        <Card className="border-light-grey lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-charcoal">Recent Designs</CardTitle>
            <CardDescription>Your latest uploaded designs and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-agile-teal/10">
                <Palette className="h-8 w-8 text-agile-teal" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-charcoal">No designs yet</h3>
              <p className="mb-6 max-w-sm text-sm text-charcoal-light">
                Upload your first design to start connecting with suppliers who can bring your vision to life.
              </p>
              <Button className="bg-agile-teal hover:bg-agile-teal/90" asChild>
                <Link href="/designs/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Your First Design
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-light-grey">
          <CardHeader>
            <CardTitle className="text-charcoal">Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/designs/new">
                Upload a design
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/suppliers">
                Browse suppliers
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/messages">
                View messages
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/settings">
                Update profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
