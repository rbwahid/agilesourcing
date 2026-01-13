'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/lib/hooks/use-sidebar';
import { useAuth } from '@/lib/hooks/use-auth';
import { useUnreadCount } from '@/lib/hooks/use-messages';
import { getNavigationForRole, getDashboardPathForRole } from '@/config/navigation';
import { Sidebar } from './sidebar';
import { MobileSidebar } from './mobile-sidebar';
import { Header } from './header';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserRole } from '@/types';

interface DashboardShellProps {
  children: React.ReactNode;
  role: 'designer' | 'supplier' | 'admin';
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const {
    isCollapsed,
    isMobileOpen,
    isLoaded,
    toggleCollapsed,
    toggleMobile,
    closeMobile,
  } = useSidebar();

  // Fetch unread messages count for badge
  const { data: unreadData } = useUnreadCount(!!user);
  const unreadCount = unreadData?.unread_count ?? 0;

  // Get navigation items based on role, with unread count badge for messages
  const navigationItems = useMemo(() => {
    const baseItems = getNavigationForRole(role as UserRole);
    return baseItems.map((item) => {
      if (item.href === '/messages' && unreadCount > 0) {
        return { ...item, badge: unreadCount };
      }
      return item;
    });
  }, [role, unreadCount]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Redirect if user role doesn't match expected role
  useEffect(() => {
    if (user && !isLoading) {
      const userRole = user.role;
      const expectedRoles: UserRole[] =
        role === 'admin' ? ['admin', 'super_admin'] : [role as UserRole];

      if (!expectedRoles.includes(userRole)) {
        // Redirect to the correct dashboard
        router.push(getDashboardPathForRole(userRole));
      }
    }
  }, [user, isLoading, role, router]);

  // Redirect designers to onboarding if not completed
  useEffect(() => {
    if (user && !isLoading && user.role === 'designer') {
      // Check if onboarding is not completed
      if (!user.profile?.has_completed_onboarding) {
        router.push('/onboarding');
      }
    }
  }, [user, isLoading, router]);

  // Show loading skeleton while checking auth
  if (isLoading || !isLoaded) {
    return <DashboardSkeleton />;
  }

  // Don't render if not authenticated
  if (!user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-light-grey">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          items={navigationItems}
          isCollapsed={isCollapsed}
          onToggle={toggleCollapsed}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        items={navigationItems}
        isOpen={isMobileOpen}
        onClose={closeMobile}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={user} onMenuClick={toggleMobile} />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-light-grey">
      {/* Sidebar skeleton */}
      <div className="hidden w-[260px] border-r border-light-grey bg-white lg:block">
        <div className="flex h-16 items-center border-b border-light-grey px-4">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-2 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex flex-1 flex-col">
        {/* Header skeleton */}
        <div className="flex h-16 items-center justify-between border-b border-light-grey bg-white px-4">
          <Skeleton className="h-8 w-8 lg:hidden" />
          <div className="hidden lg:block" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
