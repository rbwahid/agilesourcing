'use client';

import { User, Instagram, Bell, Shield, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InstagramConnectCard } from '@/components/instagram';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-charcoal">
            Settings
          </h1>
          <p className="mt-1 text-gray-500">
            Manage your account and connected services
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Instagram Integration - Primary */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737]">
                <Instagram className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-charcoal">Instagram Integration</h2>
            </div>
            <InstagramConnectCard />
          </section>

          {/* Account Settings */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-agile-teal/10">
                <User className="h-4 w-4 text-agile-teal" />
              </div>
              <h2 className="text-lg font-semibold text-charcoal">Account</h2>
            </div>
            <Card className="border-0 shadow-lg shadow-gray-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Profile Settings</CardTitle>
                <CardDescription>
                  Update your profile information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Profile settings coming soon...
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Notifications */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                <Bell className="h-4 w-4 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-charcoal">Notifications</h2>
            </div>
            <Card className="border-0 shadow-lg shadow-gray-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified about updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Notification settings coming soon...
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Privacy & Security */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                <Shield className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-charcoal">Privacy & Security</h2>
            </div>
            <Card className="border-0 shadow-lg shadow-gray-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Security settings coming soon...
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Billing */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                <CreditCard className="h-4 w-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-charcoal">Billing</h2>
            </div>
            <Card className="border-0 shadow-lg shadow-gray-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Subscription & Billing</CardTitle>
                <CardDescription>
                  Manage your subscription and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Billing settings coming soon...
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
