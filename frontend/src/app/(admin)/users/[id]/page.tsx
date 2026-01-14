'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MoreHorizontal, UserX, UserCheck, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdminUser, useSuspendUser, useReactivateUser, useUserCommunications } from '@/lib/hooks/use-admin';
import {
  UserDetailCard,
  UserStatsCard,
  UserSubscriptionCard,
  UserActivityCard,
  SuspendUserDialog,
  ReactivateUserDialog,
  CommunicationLogCard,
} from '@/components/admin';
import Link from 'next/link';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);

  const { data: user, isLoading } = useAdminUser(userId);
  const { data: communications, isLoading: communicationsLoading } = useUserCommunications(userId);
  const suspendMutation = useSuspendUser();
  const reactivateMutation = useReactivateUser();

  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false);

  const handleSuspendConfirm = async () => {
    await suspendMutation.mutateAsync(userId);
  };

  const handleReactivateConfirm = async () => {
    await reactivateMutation.mutateAsync(userId);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/users">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to users</span>
            </Link>
          </Button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal">
              {isLoading ? 'Loading...' : user?.name ?? 'User Details'}
            </h1>
            <p className="text-sm text-charcoal-light">
              Manage user account and view activity.
            </p>
          </div>
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.is_active ? (
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => setSuspendDialogOpen(true)}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  Suspend user
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-emerald-600 focus:text-emerald-600"
                  onClick={() => setReactivateDialogOpen(true)}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Reactivate user
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - User Info */}
        <div className="space-y-6 lg:col-span-2">
          <UserDetailCard user={user} isLoading={isLoading} />
          <UserActivityCard user={user} isLoading={isLoading} />
        </div>

        {/* Right Column - Stats & Subscription */}
        <div className="space-y-6">
          <UserStatsCard user={user} isLoading={isLoading} />
          <UserSubscriptionCard user={user} isLoading={isLoading} />
          <CommunicationLogCard
            logs={communications?.data ?? []}
            isLoading={communicationsLoading}
          />
        </div>
      </div>

      {/* Dialogs */}
      <SuspendUserDialog
        open={suspendDialogOpen}
        onOpenChange={setSuspendDialogOpen}
        userName={user?.name ?? ''}
        onConfirm={handleSuspendConfirm}
      />

      <ReactivateUserDialog
        open={reactivateDialogOpen}
        onOpenChange={setReactivateDialogOpen}
        userName={user?.name ?? ''}
        onConfirm={handleReactivateConfirm}
      />
    </div>
  );
}
