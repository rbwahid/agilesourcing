'use client';

import { DashboardShell } from '@/components/layout';

export default function DesignerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="designer">{children}</DashboardShell>;
}
