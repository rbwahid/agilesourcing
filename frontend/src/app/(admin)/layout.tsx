'use client';

import { DashboardShell } from '@/components/layout';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="admin">{children}</DashboardShell>;
}
