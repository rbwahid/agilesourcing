'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { useAdminUsers, useSuspendUser, useReactivateUser } from '@/lib/hooks/use-admin';
import {
  UsersDataTable,
  UserFiltersComponent,
  SuspendUserDialog,
  ReactivateUserDialog,
} from '@/components/admin';
import type { UserFilters, AdminUser } from '@/types/admin';

export default function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    per_page: 20,
    sort: 'created_at',
    direction: 'desc',
  });

  const [suspendDialog, setSuspendDialog] = useState<{ open: boolean; user: AdminUser | null }>({
    open: false,
    user: null,
  });
  const [reactivateDialog, setReactivateDialog] = useState<{ open: boolean; user: AdminUser | null }>({
    open: false,
    user: null,
  });

  const { data, isLoading } = useAdminUsers(filters);
  const suspendMutation = useSuspendUser();
  const reactivateMutation = useReactivateUser();

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSuspendClick = (userId: number) => {
    const user = data?.data.find((u) => u.id === userId);
    if (user) {
      setSuspendDialog({ open: true, user });
    }
  };

  const handleReactivateClick = (userId: number) => {
    const user = data?.data.find((u) => u.id === userId);
    if (user) {
      setReactivateDialog({ open: true, user });
    }
  };

  const handleSuspendConfirm = async () => {
    if (suspendDialog.user) {
      await suspendMutation.mutateAsync(suspendDialog.user.id);
    }
  };

  const handleReactivateConfirm = async () => {
    if (reactivateDialog.user) {
      await reactivateMutation.mutateAsync(reactivateDialog.user.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">User Management</h1>
          <p className="text-sm text-charcoal-light">
            View and manage all platform users.
            {data?.meta && (
              <span className="ml-1 text-gray-400">({data.meta.total} total)</span>
            )}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-agile-teal/10">
          <Users className="h-5 w-5 text-agile-teal" />
        </div>
      </div>

      {/* Filters */}
      <UserFiltersComponent filters={filters} onFiltersChange={setFilters} />

      {/* Data Table */}
      <UsersDataTable
        data={data}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onSuspendUser={handleSuspendClick}
        onReactivateUser={handleReactivateClick}
      />

      {/* Dialogs */}
      <SuspendUserDialog
        open={suspendDialog.open}
        onOpenChange={(open) => setSuspendDialog({ open, user: open ? suspendDialog.user : null })}
        userName={suspendDialog.user?.name ?? ''}
        onConfirm={handleSuspendConfirm}
      />

      <ReactivateUserDialog
        open={reactivateDialog.open}
        onOpenChange={(open) => setReactivateDialog({ open, user: open ? reactivateDialog.user : null })}
        userName={reactivateDialog.user?.name ?? ''}
        onConfirm={handleReactivateConfirm}
      />
    </div>
  );
}
