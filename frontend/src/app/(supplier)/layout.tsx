'use client';

import { DashboardShell } from '@/components/layout';

export default function SupplierDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell role="supplier">{children}</DashboardShell>;
}
