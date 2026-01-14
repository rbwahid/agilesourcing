'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  HeadphonesIcon,
  Users,
  CreditCard,
  Shield,
  ArrowRight,
  Mail,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { UserLookupWidget } from '@/components/admin';
import { useAdminStats } from '@/lib/hooks/use-admin';

interface QuickLinkProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  iconBgColor: string;
  iconColor: string;
}

function QuickLink({ icon: Icon, title, description, href, iconBgColor, iconColor }: QuickLinkProps) {
  return (
    <Link href={href}>
      <Card className="border-gray-100 transition-all hover:border-gray-200 hover:shadow-sm">
        <CardContent className="flex items-center gap-4 p-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconBgColor}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-charcoal">{title}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </CardContent>
      </Card>
    </Link>
  );
}

export default function SupportPage() {
  const { data: stats } = useAdminStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Customer Support</h1>
          <p className="text-sm text-charcoal-light">
            Tools for supporting users and managing communications.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-agile-teal/10">
          <HeadphonesIcon className="h-5 w-5 text-agile-teal" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* User Lookup - Primary Feature */}
          <UserLookupWidget />

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-charcoal">
                      {stats?.users.total ?? 0}
                    </p>
                    <p className="text-sm text-gray-500">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-charcoal">
                      {stats?.subscriptions.active ?? 0}
                    </p>
                    <p className="text-sm text-gray-500">Active Subs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                    <Shield className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-charcoal">
                      {stats?.verifications.pending ?? 0}
                    </p>
                    <p className="text-sm text-gray-500">Pending Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Quick Links */}
        <div className="space-y-6">
          <Card className="border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickLink
                icon={Users}
                title="User Management"
                description="View and manage all users"
                href="/users"
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
              />
              <QuickLink
                icon={CreditCard}
                title="Subscriptions"
                description="Manage billing and payments"
                href="/subscriptions"
                iconBgColor="bg-emerald-100"
                iconColor="text-emerald-600"
              />
              <QuickLink
                icon={Shield}
                title="Verifications"
                description="Review certification requests"
                href="/verifications"
                iconBgColor="bg-amber-100"
                iconColor="text-amber-600"
              />
            </CardContent>
          </Card>

          {/* Communication Types Info */}
          <Card className="border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500">Communication Tracking</CardTitle>
              <CardDescription>
                All user communications are automatically logged.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">Emails</p>
                  <p className="text-sm text-blue-700">System emails, notifications</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-3">
                <Bell className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-900">Notifications</p>
                  <p className="text-sm text-purple-700">In-app notifications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
